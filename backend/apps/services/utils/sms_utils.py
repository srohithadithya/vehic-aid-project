"""
SMS utility for VehicAid platform using Fast2SMS (Free)
"""
import requests
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


class Fast2SMSService:
    """Free SMS service using Fast2SMS (50 SMS/day free)"""
    
    def __init__(self):
        self.api_key = settings.FAST2SMS_API_KEY
        self.base_url = "https://www.fast2sms.com/dev/bulkV2"
    
    def send_sms(self, phone_number, message):
        """
        Send SMS via Fast2SMS
        
        Args:
            phone_number (str): 10-digit Indian mobile number
            message (str): SMS content (max 160 characters)
        
        Returns:
            dict: Response with success status
        """
        if not self.api_key:
            if settings.DEBUG:
                logger.info(f"SIMULATION SMS to {phone_number}: {message}")
                return {'success': True, 'message': 'Simulated in DEBUG mode'}
            logger.error("Fast2SMS API key not configured")
            return {'success': False, 'error': 'SMS not configured'}
        
        try:
            # Clean phone number
            phone_number = str(phone_number).replace('+91', '').replace(' ', '').replace('-', '')
            
            # Validate 10-digit number
            if len(phone_number) != 10 or not phone_number.isdigit():
                return {'success': False, 'error': 'Invalid phone number'}
            
            # Prepare request
            headers = {
                'authorization': self.api_key,
                'Content-Type': 'application/json'
            }
            
            payload = {
                'route': 'q',  # Quick route
                'message': message[:160],  # Limit to 160 chars
                'language': 'english',
                'flash': 0,
                'numbers': phone_number
            }
            
            # Send request
            response = requests.post(self.base_url, json=payload, headers=headers, timeout=10)
            result = response.json()
            
            if result.get('return'):
                logger.info(f"SMS sent successfully to {phone_number}")
                return {
                    'success': True,
                    'message_id': result.get('request_id'),
                    'message': result.get('message')
                }
            else:
                logger.error(f"SMS failed: {result.get('message')}")
                return {
                    'success': False,
                    'error': result.get('message', 'Unknown error')
                }
                
        except requests.exceptions.Timeout:
            logger.error("SMS request timeout")
            return {'success': False, 'error': 'Request timeout'}
        except Exception as e:
            logger.error(f"SMS exception: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def send_service_request_sms(self, user, service_request):
        """Send SMS when service request is created"""
        message = f"VehicAid: Request #{service_request.id} received. Service: {service_request.get_service_type_display()}. We'll notify you when assigned."
        return self.send_sms(user.phone_number, message)
    
    def send_provider_assigned_sms(self, user, service_request, provider):
        """Send SMS when provider is assigned"""
        message = f"VehicAid: Provider {provider.get_full_name()} assigned to request #{service_request.id}. They'll contact you soon."
        return self.send_sms(user.phone_number, message)
    
    def send_service_completed_sms(self, user, service_request):
        """Send SMS when service is completed"""
        message = f"VehicAid: Service request #{service_request.id} completed! Thank you for using VehicAid."
        return self.send_sms(user.phone_number, message)
    
    def send_otp_sms(self, phone_number, otp):
        """Send OTP for verification"""
        message = f"Your VehicAid OTP: {otp}. Valid for 10 min. Don't share."
        return self.send_sms(phone_number, message)


# Global instance
sms_service = Fast2SMSService()
