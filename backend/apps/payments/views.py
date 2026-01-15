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
        
        if not request_id:
             return Response({"error": "request_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            service_request = get_object_or_404(ServiceRequest, id=request_id)
            service_request.status = 'COMPLETED'
            service_request.save()

            # Create a mock transaction if one doesn't exist
            Transaction.objects.get_or_create(
                service_request=service_request,
                defaults={
                    'booker': service_request.booker,
                    'amount': Decimal('1499.00'),
                    'status': 'SUCCESS',
                    'payment_method': request.data.get('payment_method', 'RAZORPAY'),
                    'razorpay_order_id': f"mock_order_{request_id}",
                    'razorpay_payment_id': f"mock_pay_{request_id}",
                }
            )

        return Response({
            "message": "Payment confirmed successfully (Mock)",
            "status": "SUCCESS"
        }, status=status.HTTP_200_OK)
