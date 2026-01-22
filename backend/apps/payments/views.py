import hashlib
import hmac
import json
from decimal import Decimal

import razorpay
from django.conf import settings
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes

from apps.services.models import ServiceRequest
from apps.users.models import ServiceBooker, ServiceProvider

from .models import Transaction
from .serializers import RazorpayWebhookSerializer

# Platform commission rate (25%) - Provider receives 75% of service charges
PLATFORM_COMMISSION_RATE = Decimal(
    getattr(settings, "PLATFORM_COMMISSION_RATE", "0.25")
)  # 25% commission (provider receives 75%)


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

            if not service_request.provider:
                return Response({'error': 'Provider must be assigned before payment.'}, status=status.HTTP_400_BAD_REQUEST)

            # Create Transaction Record
            Transaction.objects.create(
                service_request=service_request,
                booker=request.user.servicebooker,
                provider=service_request.provider.serviceprovider,
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
                    service_request.status = 'COMPLETED'
                    service_request.save()

                    # Add Reward Points
                    try:
                        from apps.services.models import RewardsProgram
                        rewards, _ = RewardsProgram.objects.get_or_create(user=service_request.booker.servicebooker)
                        rewards.reward_for_service(service_request)
                    except Exception as e:
                        print(f"Error adding rewards: {e}")

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

                # Add Reward Points
                try:
                    from apps.services.models import RewardsProgram
                    rewards, _ = RewardsProgram.objects.get_or_create(user=service_request.booker.servicebooker)
                    rewards.reward_for_service(service_request)
                except Exception as e:
                    print(f"Error adding rewards: {e}")

                # Ensure booker profile is used
                booker_profile = None
                if service_request.booker and hasattr(service_request.booker, 'servicebooker'):
                    booker_profile = service_request.booker.servicebooker

                # Ensure provider profile is used
                provider_profile = None
                if service_request.provider and hasattr(service_request.provider, 'serviceprovider'):
                    provider_profile = service_request.provider.serviceprovider

                # Create transaction
                Transaction.objects.get_or_create(
                    service_request=service_request,
                    defaults={
                        'booker': booker_profile,
                        'provider': provider_profile,
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
                    # Explicitly get profile
                    from apps.users.models import ServiceBooker
                    try:
                        booker_profile = ServiceBooker.objects.get(user=request.user)
                    except ServiceBooker.DoesNotExist:
                         return Response({"error": "User does not have a Booker profile."}, status=status.HTTP_400_BAD_REQUEST)

                    # Create/Update Subscription
                    try:
                        UserSubscription.objects.create(
                            user_id=booker_profile.pk,
                            plan=plan,
                            start_date=timezone.now().date(),
                            end_date=timezone.now().date() + timedelta(days=plan.duration_days),
                            is_active=True,
                            status='ACTIVE'
                        )
                    except Exception as e:
                        print(f"DEBUG ERROR creating subscription: {e}")
                        import traceback
                        traceback.print_exc()
                        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                    
                    # Log Transaction (Optional for now, but good for completeness)
                    # We'd need a Transaction model update to support non-service_request payments (nullable)
                    # For now just confirming success is enough for UI.

            return Response({"status": "Payment confirmed and processed."}, status=status.HTTP_200_OK)


class ProviderDashboardView(APIView):
    """
    Returns aggregated financial data for the Provider Dashboard.
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: OpenApiTypes.OBJECT})
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
                "service": tx.service_request.service_type if tx.service_request else "Wallet Withdrawal",
                "customer": (tx.booker.user.first_name or tx.booker.user.username) if tx.booker else "Platform",
                "amount": float(tx.provider_payout_amount),
                "date": tx.created_at.isoformat(),
                "status": tx.status,
                "type": "Withdrawal" if tx.provider_payout_amount < 0 else "Earnings",
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


class BookerBillingHistoryView(APIView):
    """
    Returns transaction history for the Booker (Billing Page).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if not hasattr(request.user, 'servicebooker'):
             return Response({"error": "Access denied. Booker account required."}, status=status.HTTP_403_FORBIDDEN)
        
        # Fetch transactions for this booker
        transactions = Transaction.objects.filter(
            booker=request.user.servicebooker
        ).order_by('-created_at')

        data = []
        for tx in transactions:
            description = "Top-up / Payment"
            # distinct check
            if tx.service_request:
                description = f"Service: {tx.service_request.get_service_type_display()}"
            elif hasattr(tx, 'subscription') and tx.subscription.exists():
                # related_name='subscription' on UserSubscription FK
                sub = tx.subscription.first()
                description = f"Subscription: {sub.plan.name}"
            
            data.append({
                "id": str(tx.id),
                "amount": float(tx.amount),
                "status": tx.status,
                "date": tx.created_at,
                "description": description,
                "invoice_id": f"INV-{1000 + tx.id}",
                "payment_method": tx.payment_method
            })
            
        return Response(data)

class PayoutInitiationView(APIView):
    """
    Endpoint for providers to request a payout/withdrawal.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        if not getattr(request.user, 'is_service_provider', False):
             return Response({"error": "Access denied. Provider account required."}, status=status.HTTP_403_FORBIDDEN)
        
        provider = request.user.serviceprovider
        from django.db.models import Sum

        # Calculate available balance
        balance_agg = Transaction.objects.filter(
            provider=provider, 
            status='SUCCESS', 
            settled=False
        ).aggregate(Sum('provider_payout_amount'))
        current_balance = balance_agg['provider_payout_amount__sum'] or Decimal('0.00')

        if current_balance <= 0:
            return Response({"error": "No funds available for withdrawal."}, status=status.HTTP_400_BAD_REQUEST)

        # Create Withdrawal Transaction (Negative Amount or specific type)
        # We'll create a new Transaction with type 'WITHDRAWAL' (if we had types, but here we can use status or custom handling)
        # For MVP, we mark existing transactions as settled or create a 'Debit' record.
        # Let's create a debit transaction
        
        with transaction.atomic():
            # Create a "Withdrawal" transaction record
            payout_tx = Transaction.objects.create(
                provider=provider,
                amount=current_balance, # Tracking the total withdrawal
                provider_payout_amount=-current_balance, # Negative to show debit
                status='SUCCESS',
                payment_method='BANK_TRANSFER',
                razorpay_order_id=f"PAYOUT-{timezone.now().timestamp()}",
                settled=True # Mark this withdrawal as settled itself
            )
            
            # Mark all pending credit transactions as settled
            Transaction.objects.filter(
                provider=provider, 
                status='SUCCESS', 
                settled=False
            ).exclude(id=payout_tx.id).update(settled=True)

        return Response({
            "message": "Payout initiated successfully.",
            "amount": float(current_balance),
            "reference": payout_tx.razorpay_order_id
        }, status=status.HTTP_200_OK)
