"""
Payment API views for VehicAid
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from apps.payments.models import Payment
from apps.services.models import ServiceRequest
from apps.payments.utils.payment_utils import payment_service
from apps.services.utils.email_utils import send_email
from apps.services.utils.sms_utils import sms_service
import logging

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_order(request):
    """
    Create Razorpay order for service request payment
    
    POST /api/v1/payments/create-order/
    Body: {
        "service_request_id": 123,
        "amount": 500.00
    }
    """
    try:
        service_request_id = request.data.get('service_request_id')
        amount = request.data.get('amount')
        
        if not service_request_id or not amount:
            return Response(
                {'error': 'service_request_id and amount are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get service request
        service_request = get_object_or_404(
            ServiceRequest,
            id=service_request_id,
            customer=request.user
        )
        
        # Create Razorpay order
        result = payment_service.create_order(
            amount=amount,
            receipt=f'SR_{service_request_id}',
            notes={
                'service_request_id': service_request_id,
                'customer_id': request.user.id
            }
        )
        
        if not result['success']:
            return Response(
                {'error': result['error']},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Create payment record
        payment = Payment.objects.create(
            service_request=service_request,
            customer=request.user,
            amount=amount,
            razorpay_order_id=result['order_id'],
            status='PENDING'
        )
        
        return Response({
            'success': True,
            'order_id': result['order_id'],
            'amount': result['amount'],
            'currency': result['currency'],
            'key_id': result['key_id'],
            'payment_id': payment.id
        })
        
    except Exception as e:
        logger.error(f"Create order error: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    """
    Verify Razorpay payment
    
    POST /api/v1/payments/verify/
    Body: {
        "payment_id": 123,
        "razorpay_order_id": "order_xxx",
        "razorpay_payment_id": "pay_xxx",
        "razorpay_signature": "signature_xxx"
    }
    """
    try:
        payment_id = request.data.get('payment_id')
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_signature = request.data.get('razorpay_signature')
        
        if not all([payment_id, razorpay_order_id, razorpay_payment_id, razorpay_signature]):
            return Response(
                {'error': 'All payment details are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get payment record
        payment = get_object_or_404(Payment, id=payment_id, customer=request.user)
        
        # Verify signature
        is_valid = payment_service.verify_payment(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        )
        
        if is_valid:
            # Update payment
            payment.razorpay_payment_id = razorpay_payment_id
            payment.razorpay_signature = razorpay_signature
            payment.status = 'COMPLETED'
            payment.save()
            
            # Update service request
            service_request = payment.service_request
            service_request.payment_status = 'PAID'
            service_request.save()
            
            # Send notifications
            try:
                # Email
                send_email(
                    subject=f'Payment Successful - Request #{service_request.id}',
                    text_content=f'Your payment of ₹{payment.amount} has been received successfully.',
                    html_content=f'''
                    <html><body>
                    <h2>Payment Successful!</h2>
                    <p>Your payment of <strong>₹{payment.amount}</strong> has been received.</p>
                    <p>Request ID: {service_request.id}</p>
                    <p>Payment ID: {razorpay_payment_id}</p>
                    </body></html>
                    ''',
                    recipient_list=[request.user.email]
                )
                
                # SMS
                sms_service.send_sms(
                    request.user.phone_number,
                    f"VehicAid: Payment of ₹{payment.amount} received for request #{service_request.id}. Thank you!"
                )
            except Exception as e:
                logger.error(f"Notification error: {str(e)}")
            
            return Response({
                'success': True,
                'message': 'Payment verified successfully',
                'payment_id': payment.id,
                'amount': str(payment.amount)
            })
        else:
            payment.status = 'FAILED'
            payment.save()
            
            return Response(
                {'error': 'Invalid payment signature'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
    except Exception as e:
        logger.error(f"Verify payment error: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payment_history(request):
    """Get user's payment history"""
    try:
        payments = Payment.objects.filter(customer=request.user).order_by('-created_at')
        
        data = [{
            'id': p.id,
            'service_request_id': p.service_request.id,
            'amount': str(p.amount),
            'status': p.status,
            'razorpay_payment_id': p.razorpay_payment_id,
            'created_at': p.created_at.isoformat(),
        } for p in payments]
        
        return Response({'payments': data})
        
    except Exception as e:
        logger.error(f"Payment history error: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
