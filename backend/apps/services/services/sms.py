import requests
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

class SMSService:
    """
    SMS service wrapper for sending notifications via Fast2SMS or similar gateway.
    """
    
    def __init__(self):
        self.api_key = getattr(settings, 'SMS_API_KEY', '')
        self.sender_id = getattr(settings, 'SMS_SENDER_ID', 'VEHICAID')
        self.base_url = "https://www.fast2sms.com/dev/bulkV2"
    
    def send_sms(self, phone_number, message):
        """
        Send SMS to a phone number.
        Returns dict with status and response.
        """
        if not self.api_key:
            print("SMS_API_KEY not configured")
            return {"status": "FAILED", "message": "API key not configured"}
        
        try:
            # Clean phone number (remove +91 if present)
            phone = phone_number.replace("+91", "").replace(" ", "").replace("-", "")
            
            payload = {
                "sender_id": self.sender_id,
                "message": message,
                "route": "v3",
                "numbers": phone,
            }
            
            headers = {
                "authorization": self.api_key,
                "Content-Type": "application/x-www-form-urlencoded",
                "Cache-Control": "no-cache",
            }
            
            response = requests.post(
                self.base_url,
                data=payload,
                headers=headers,
                timeout=10
            )
            
            response.raise_for_status()
            data = response.json()
            
            if data.get("return"):
                return {
                    "status": "SENT",
                    "message": "SMS sent successfully",
                    "response": data
                }
            else:
                return {
                    "status": "FAILED",
                    "message": data.get("message", "Unknown error"),
                    "response": data
                }
                
        except Exception as e:
            logger.error(f"Error sending SMS: {e}")
            return {
                "status": "FAILED",
                "message": str(e),
                "response": None
            }
    
    def send_subscription_expiry_alert(self, user, days_remaining):
        """Send alert when subscription is about to expire."""
        message = f"Hi {user.user.username}, your Vehic-Aid {user.plan.name} plan expires in {days_remaining} days. Renew now to continue enjoying premium benefits!"
        return self.send_sms(user.user.phone_number, message)
    
    def send_subscription_renewed(self, user):
        """Send confirmation when subscription is renewed."""
        message = f"Your Vehic-Aid {user.plan.name} plan has been renewed successfully. Thank you for choosing Vehic-Aid!"
        return self.send_sms(user.user.phone_number, message)
    
    def send_service_request_confirmation(self, request):
        """Send confirmation when service request is created."""
        message = f"Your service request #{request.id} for {request.service_type} has been received. A provider will be assigned shortly."
        return self.send_sms(request.booker.phone_number, message)
    
    def send_provider_assigned(self, request, provider):
        """Send notification when provider is assigned."""
        message = f"Provider {provider.user.username} has been assigned to your request #{request.id}. They will arrive shortly."
        return self.send_sms(request.booker.phone_number, message)
    
    def send_service_completed(self, request):
        """Send notification when service is completed."""
        message = f"Your service request #{request.id} has been completed. Thank you for using Vehic-Aid!"
        return self.send_sms(request.booker.phone_number, message)
