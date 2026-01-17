"""
Payment utility for VehicAid platform using Razorpay
"""
import razorpay
from django.conf import settings
from decimal import Decimal
import logging

logger = logging.getLogger(__name__)


class RazorpayService:
    """Payment service using Razorpay"""
    
    def __init__(self):
        self.key_id = settings.RAZORPAY_KEY_ID
        self.key_secret = settings.RAZORPAY_KEY_SECRET
        
        if not all([self.key_id, self.key_secret]):
            logger.warning("Razorpay credentials not configured")
            self.client = None
        else:
            self.client = razorpay.Client(auth=(self.key_id, self.key_secret))
    
    def create_order(self, amount, currency='INR', receipt=None, notes=None):
        """
        Create Razorpay order
        
        Args:
            amount (Decimal): Amount in rupees (will be converted to paise)
            currency (str): Currency code (default: INR)
            receipt (str): Receipt ID
            notes (dict): Additional notes
        
        Returns:
            dict: Order details or error
        """
        if not self.client:
            return {'success': False, 'error': 'Payment gateway not configured'}
        
        try:
            # Convert to paise (multiply by 100)
            amount_paise = int(Decimal(amount) * 100)
            
            order_data = {
                'amount': amount_paise,
                'currency': currency,
                'receipt': receipt or f'order_{int(time.time())}',
                'notes': notes or {}
            }
            
            order = self.client.order.create(data=order_data)
            
            logger.info(f"Razorpay order created: {order['id']}")
            return {
                'success': True,
                'order_id': order['id'],
                'amount': amount,
                'currency': currency,
                'key_id': self.key_id
            }
            
        except Exception as e:
            logger.error(f"Failed to create order: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def verify_payment(self, razorpay_order_id, razorpay_payment_id, razorpay_signature):
        """
        Verify payment signature
        
        Args:
            razorpay_order_id (str): Order ID
            razorpay_payment_id (str): Payment ID
            razorpay_signature (str): Signature to verify
        
        Returns:
            bool: True if valid, False otherwise
        """
        if not self.client:
            return False
        
        try:
            params_dict = {
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            }
            
            self.client.utility.verify_payment_signature(params_dict)
            logger.info(f"Payment verified: {razorpay_payment_id}")
            return True
            
        except razorpay.errors.SignatureVerificationError:
            logger.error(f"Invalid payment signature: {razorpay_payment_id}")
            return False
        except Exception as e:
            logger.error(f"Payment verification error: {str(e)}")
            return False
    
    def get_payment_details(self, payment_id):
        """Get payment details"""
        if not self.client:
            return None
        
        try:
            payment = self.client.payment.fetch(payment_id)
            return payment
        except Exception as e:
            logger.error(f"Failed to fetch payment: {str(e)}")
            return None
    
    def create_refund(self, payment_id, amount=None):
        """
        Create refund
        
        Args:
            payment_id (str): Payment ID to refund
            amount (Decimal): Amount to refund (None for full refund)
        
        Returns:
            dict: Refund details or error
        """
        if not self.client:
            return {'success': False, 'error': 'Payment gateway not configured'}
        
        try:
            refund_data = {'payment_id': payment_id}
            if amount:
                refund_data['amount'] = int(Decimal(amount) * 100)
            
            refund = self.client.payment.refund(payment_id, refund_data)
            
            logger.info(f"Refund created: {refund['id']}")
            return {
                'success': True,
                'refund_id': refund['id'],
                'amount': Decimal(refund['amount']) / 100,
                'status': refund['status']
            }
            
        except Exception as e:
            logger.error(f"Failed to create refund: {str(e)}")
            return {'success': False, 'error': str(e)}


# Global instance
import time
payment_service = RazorpayService()
