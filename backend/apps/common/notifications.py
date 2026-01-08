import firebase_admin
from firebase_admin import credentials, messaging
from django.conf import settings
import logging
import os

logger = logging.getLogger(__name__)

class PushNotificationService:
    _initialized = False

    @classmethod
    def initialize(cls):
        if cls._initialized:
            return

        try:
            cred_path = os.path.join(settings.BASE_DIR, 'firebase-adminsdk.json')
            if os.path.exists(cred_path):
                cred = credentials.Certificate(cred_path)
                firebase_admin.initialize_app(cred)
                cls._initialized = True
                logger.info("Firebase Admin SDK initialized successfully.")
            else:
                logger.warning(f"Firebase credentials not found at {cred_path}. Push notifications will be disabled.")
        except Exception as e:
            logger.error(f"Failed to initialize Firebase: {e}")

    @classmethod
    def send_to_user(cls, user, title, body, data=None):
        """
        Sends a push notification to a specific user via FCM.
        """
        if not cls._initialized:
            cls.initialize()
            if not cls._initialized:
                logger.warning("Skipping push notification: Firebase not initialized.")
                return False

        if not user.fcm_device_token:
            logger.warning(f"Skipping push notification: User {user.id} has no FCM token.")
            return False

        try:
            message = messaging.Message(
                notification=messaging.Notification(
                    title=title,
                    body=body,
                ),
                data=data or {},
                token=user.fcm_device_token,
            )
            response = messaging.send(message)
            logger.info(f"Successfully sent message to user {user.id}: {response}")
            return True
        except Exception as e:
            logger.error(f"Error sending FCM message to user {user.id}: {e}")
            return False
