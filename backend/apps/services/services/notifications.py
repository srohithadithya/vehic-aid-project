import requests
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class PushNotificationService:
    """
    Handles sending push notifications to mobile devices via Expo Push API.
    """
    EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"

    def send_notification(self, expo_token, title, body, data=None):
        if not expo_token or not expo_token.startswith("ExponentPushToken"):
            logger.warning(f"Invalid expo token: {expo_token}")
            return False

        payload = {
            "to": expo_token,
            "title": title,
            "body": body,
            "data": data or {},
            "sound": "default"
        }

        try:
            response = requests.post(self.EXPO_PUSH_URL, json=payload, timeout=5)
            response.raise_for_status()
            logger.info(f"Notification sent to {expo_token}: {title}")
            return True
        except Exception as e:
            logger.error(f"Failed to send push notification: {e}")
            return False

    def notify_booker_status_change(self, service_request):
        """Notify the customer about a status update."""
        user = service_request.booker.user
        # In production, fetch the token from a model like UserDevice
        # token = user.devices.first().expo_token
        token = "ExponentPushToken[dummy_token]" # Mock for now
        
        status_map = {
            'DISPATCHED': ("Provider Assigned", "A provider is on their way!"),
            'ARRIVED': ("Provider Arrived", "Your help has reached your location."),
            'COMPLETED': ("Service Completed", "Please complete the payment to proceed."),
        }
        
        if service_request.status in status_map:
            title, body = status_map[service_request.status]
            self.send_notification(token, title, body, {"requestId": service_request.id})

    def notify_provider_new_job(self, provider, service_request):
        """Notify a provider about a new assigned job."""
        token = "ExponentPushToken[dummy_provider_token]" # Mock for now
        self.send_notification(
            token, 
            "New Job Assigned", 
            f"New {service_request.service_type} request nearby.",
            {"requestId": service_request.id}
        )
