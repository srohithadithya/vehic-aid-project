import hashlib
import hmac
import json
from decimal import Decimal

import razorpay
from django.conf import settings
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.services.models import ServiceRequest
from apps.users.models import ServiceBooker, ServiceProvider

from .models import Transaction
from .serializers import RazorpayWebhookSerializer

# Assuming the commission rate is defined in settings
PLATFORM_COMMISSION_RATE = Decimal(
    getattr(settings, "PLATFORM_COMMISSION_RATE", 0.20)
)  # Default 20%


class PaymentInitiationView(APIView):
    """
    Endpoint to initiate a payment order with Razorpay.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        amount = request.data.get('amount')
        currency = request.data.get('currency', 'INR')
        service_request_id = request.data.get('service_request_id')

        if not amount:
            return Response({'error': 'Amount is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not service_request_id:
            return Response({'error': 'Service Request ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            service_request = ServiceRequest.objects.get(id=service_request_id)
        except ServiceRequest.DoesNotExist:
            return Response({'error': 'Service Request not found'}, status=status.HTTP_404_NOT_FOUND)

        # Initialize Razorpay Client
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        
        try:
            # Create Order
            amount_in_paise = int(float(amount) * 100)
            order_data = {
                'amount': amount_in_paise,
                'currency': currency,
                'payment_capture': 1, # Auto capture
                'notes': {
                    'service_request_id': service_request_id,
                    'user_id': request.user.id
                }
            }
            order = client.order.create(data=order_data)

            # Create Transaction Record
            Transaction.objects.create(
                service_request=service_request,
                booker=request.user.service_booker_profile,
                provider=service_request.provider, # Assuming provider is assigned
                amount=Decimal(amount),
                razorpay_order_id=order['id'],
                status='PENDING',
                payment_method='UPI' # Default, will be updated by webhook
            )

            return Response(order, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error creating Razorpay order: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RazorpayWebhookView(APIView):
    """
    Endpoint that receives asynchronous notifications from Razorpay when a payment is captured.
    This is the secure way to confirm payment success.
    """

    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        # 1. SECURITY: Verify the signature sent by Razorpay
        received_signature = request.headers.get("X-Razorpay-Signature")
        if not received_signature:
            return Response(
                {"error": "Missing signature"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Hash the request body to compare with the signature
        webhook_secret = settings.RAZORPAY_WEBHOOK_SECRET

        # Ensure raw body is used for hashing
        try:
            request_body = request.body.decode("utf-8")
        except:
            request_body = json.dumps(request.data)

        # Create the expected HMAC signature
        generated_signature = hmac.new(
            webhook_secret.encode("utf-8"), request_body.encode("utf-8"), hashlib.sha256
        ).hexdigest()

        # Compare generated signature with the received signature
        if generated_signature != received_signature:
            # Log the security failure
            print("SECURITY ALERT: Invalid Razorpay signature received.")
            return Response(
                {"error": "Invalid signature"}, status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Validation and Processing
        serializer = RazorpayWebhookSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        order_id = serializer.validated_data["extracted_order_id"]
        payment_id = serializer.validated_data["extracted_payment_id"]

        # Use atomic transaction to prevent data race conditions
        with transaction.atomic():
            try:
                # Find the pending transaction linked to this order ID
                transaction_obj = Transaction.objects.select_related(
                    "service_request", "provider"
                ).get(razorpay_order_id=order_id, status="PENDING")

                payment_amount = transaction_obj.amount

                # Calculate splits
                commission = payment_amount * PLATFORM_COMMISSION_RATE
                payout = payment_amount - commission

                # Update Transaction status and payout figures
                transaction_obj.status = "SUCCESS"
                transaction_obj.razorpay_payment_id = payment_id
                transaction_obj.platform_commission = commission
                transaction_obj.provider_payout_amount = payout
                transaction_obj.save()

                # Update Service Request Status
                service_request = transaction_obj.service_request
                if service_request:
                    service_request.status = ServiceRequest.STATUS_CHOICES.COMPLETED
                    service_request.save()

                # Note: The daily settlement task will pick this transaction up later.

                return Response(
                    {"message": "Payment confirmed and records updated."},
                    status=status.HTTP_200_OK,
                )

            except Transaction.DoesNotExist:
                return Response(
                    {
                        "error": f"Transaction with order ID {order_id} not found or already settled."
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )
            except Exception as e:
                # Catch unexpected errors during processing
                print(f"FATAL ERROR during payment processing: {e}")
                return Response(
                    {"error": "Internal processing error."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )


class MockPaymentConfirmView(APIView):
    """
    Mock endpoint for the mobile/web app to directly confirm payment.
    Useful for testing and demo flows.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        request_id = request.data.get('request_id')
        plan_id = request.data.get('plan_id')
        
        if not request_id and not plan_id:
             return Response({"error": "request_id or plan_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            if request_id:
                # Handle Service Request Payment
                service_request = get_object_or_404(ServiceRequest, id=request_id)
                service_request.status = 'COMPLETED'
                service_request.save()

                # Create transaction
                Transaction.objects.get_or_create(
                    service_request=service_request,
                    defaults={
                        'booker': service_request.booker,
                        'amount': Decimal(request.data.get('amount', '500.00')),
                        'status': 'SUCCESS',
                        'payment_method': request.data.get('payment_method', 'RAZORPAY'),
                        'razorpay_order_id': f"mock_order_{request_id}",
                    }
                )
            
            elif plan_id:
                # Handle Subscription Payment
                from apps.services.models import SubscriptionPlan, UserSubscription
                from django.utils import timezone
                from datetime import timedelta

                # Find the plan by name (using plan_id passed from frontend as name, e.g. 'Standard')
                # Or by ID if passed as ID. The frontend passes name currently.
                plan = SubscriptionPlan.objects.filter(name__iexact=plan_id).first()
                if not plan:
                    # Fallback if ID passed
                    plan = SubscriptionPlan.objects.filter(id=plan_id).first()
                
                if plan:
                    # Create/Update Subscription
                    UserSubscription.objects.create(
                        user=request.user.servicebooker,
                        plan=plan,
                        start_date=timezone.now().date(),
                        end_date=timezone.now().date() + timedelta(days=plan.duration_days),
                        is_active=True,
                        status='ACTIVE'
                    )
                    
                    # Log Transaction (Optional for now, but good for completeness)
                    # We'd need a Transaction model update to support non-service_request payments (nullable)
                    # For now just confirming success is enough for UI.


class ProviderDashboardView(APIView):
    """
    Returns aggregated financial data for the Provider Dashboard.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # 1. Ensure user is a Service Provider
        if not getattr(request.user, 'is_service_provider', False):
             return Response({"error": "Access denied. Provider account required."}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            provider = request.user.serviceprovider
        except ServiceProvider.DoesNotExist:
             return Response({"error": "Provider profile not found."}, status=status.HTTP_404_NOT_FOUND)

        from django.db.models import Sum
        from django.utils import timezone
        import datetime

        now = timezone.now()
        today = now.date()
        
        # --- Metrics ---
        
        # 1. Current Balance (Unsettled successful transactions)
        balance_agg = Transaction.objects.filter(
            provider=provider, 
            status='SUCCESS', 
            settled=False
        ).aggregate(Sum('provider_payout_amount'))
        current_balance = balance_agg['provider_payout_amount__sum'] or Decimal('0.00')

        # 2. Today's Earnings
        today_agg = Transaction.objects.filter(
            provider=provider,
            status='SUCCESS',
            created_at__date=today
        ).aggregate(Sum('provider_payout_amount'))
        todays_earnings = today_agg['provider_payout_amount__sum'] or Decimal('0.00')

        # 3. Pending Payouts (Same as balance for now, unless we distinguish "processing" vs "unsettled")
        # In this simplified model, Unsettled = Pending Payout
        pending_payouts = current_balance

        # --- Chart Data (Last 7 Days) ---
        weekly_chart = []
        days_labels = []
        
        for i in range(6, -1, -1):
            day = today - datetime.timedelta(days=i)
            day_agg = Transaction.objects.filter(
                provider=provider,
                status='SUCCESS',
                created_at__date=day
            ).aggregate(Sum('provider_payout_amount'))
            amount = day_agg['provider_payout_amount__sum'] or Decimal('0.00')
            weekly_chart.append(float(amount))
            days_labels.append(day.strftime("%a")) # Mon, Tue...

        # --- Recent Transactions ---
        recent_txs = Transaction.objects.filter(
            provider=provider
        ).order_by('-created_at')[:10]
        
        tx_data = []
        for tx in recent_txs:
            tx_data.append({
                "id": f"TRX-{tx.id}",
                "service": tx.service_request.service_type if tx.service_request else "General Credit",
                "customer": tx.booker.user.first_name or tx.booker.user.username,
                "amount": float(tx.provider_payout_amount),
                "date": tx.created_at.isoformat(),
                "status": tx.status, # SUCCESS, PENDING
                "type": "Service Payout", # Static for now as most are service payouts
                "method": tx.payment_method
            })

        return Response({
            "current_balance": float(current_balance),
            "todays_earnings": float(todays_earnings),
            "pending_payouts": float(pending_payouts),
            "jobs_completed": provider.jobs_completed,
            "rating": float(provider.average_rating),
            "weekly_chart": {
                "values": weekly_chart,
                "labels": days_labels
            },
            "recent_transactions": tx_data
        })
