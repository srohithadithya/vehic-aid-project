"""
Signals for ServiceRequest model to send notifications
"""
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from apps.services.models import ServiceRequest, ChatMessage
from apps.users.models import Notification, CustomUser
from apps.services.utils.email_utils import (
    send_service_request_email,
    send_provider_assigned_email,
    send_service_completed_email
)
from apps.services.utils.sms_utils import sms_service
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import logging

logger = logging.getLogger(__name__)


@receiver(post_save, sender=ServiceRequest)
def service_request_notifications(sender, instance, created, **kwargs):
    """Send notifications when service request is created or updated"""
    
    try:
        # New service request created
        if created:
            logger.info(f"Sending notifications for new request #{instance.id}")
            
            # Send email
            send_service_request_email(instance.booker, instance)
            
            # Send SMS
            sms_service.send_service_request_sms(instance.booker, instance)
            
            # Create in-app notification for the booker
            Notification.objects.create(
                user=instance.booker,
                title="Service Requested",
                message=f"Your request for {instance.service_type} has been received and is being processed."
            )
            
            # Create notifications for all Admins
            admin_users = CustomUser.objects.filter(is_superuser=True)
            for admin in admin_users:
                Notification.objects.create(
                    user=admin,
                    title="New Service Request",
                    message=f"New {instance.service_type} request from {instance.booker.username}."
                )
            
        # Service request updated
        else:
            # Check if provider was just assigned
            if instance.provider and instance.status == 'DISPATCHED':
                # Check if this is a new assignment (not already notified)
                old_instance = ServiceRequest.objects.filter(id=instance.id).first()
                if old_instance and not hasattr(instance, '_provider_notified'):
                    logger.info(f"Sending provider assigned notifications for request #{instance.id}")
                    
                    # Send email
                    send_provider_assigned_email(instance.booker, instance, instance.provider)
                    
                    # Send SMS
                    sms_service.send_provider_assigned_sms(instance.booker, instance, instance.provider)
                    
                    # Mark as notified
                    instance._provider_notified = True
                    
                    # Create in-app notification for booker
                    Notification.objects.create(
                        user=instance.booker,
                        title="Provider Dispatched",
                        message=f"Provider {instance.provider.username} is en-route to your location."
                    )
            
            # Check if service was completed
            if instance.status == 'COMPLETED':
                if not hasattr(instance, '_completed_notified'):
                    logger.info(f"Sending completion notifications for request #{instance.id}")
                    
                    # Send email
                    send_service_completed_email(instance.booker, instance)
                    
                    # Send SMS
                    sms_service.send_service_completed_sms(instance.booker, instance)
                    
                    # Mark as notified
                    instance._completed_notified = True
                    
                    # Create in-app notification for booker
                    Notification.objects.create(
                        user=instance.booker,
                        title="Service Completed",
                        message=f"Your {instance.service_type} service is complete. Please rate the provider."
                    )
                    
    except Exception as e:
        logger.error(f"Notification error for request #{instance.id}: {str(e)}")
        # Don't raise exception - notifications shouldn't break the flow

@receiver(post_save, sender=ChatMessage)
def chat_message_notifications(sender, instance, created, **kwargs):
    """Send real-time updates when a new chat message is created"""
    if created:
        try:
            channel_layer = get_channel_layer()
            room_group_name = f"service_{instance.request.id}"
            
            async_to_sync(channel_layer.group_send)(
                room_group_name,
                {
                    "type": "status_update",  # Using existing type from tracking consumer
                    "status": "CHAT_MESSAGE",
                    "message": "New message received",
                    "data": {
                        "id": instance.id,
                        "sender": instance.sender.username,
                        "message": instance.message,
                        "image": instance.image.url if instance.image else None,
                        "created_at": instance.created_at.isoformat(),
                    }
                }
            )
            
            # Create in-app notification for the recipient (the one who didn't send the message)
            recipient = instance.request.provider if instance.sender == instance.request.booker else instance.request.booker
            if recipient:
                Notification.objects.create(
                    user=recipient,
                    title="New Chat Message",
                    message=f"{instance.sender.username}: {instance.message[:50] if instance.message else 'Image attached'}"
                )
        except Exception as e:
            logger.error(f"Chat notification error for message {instance.id}: {str(e)}")
