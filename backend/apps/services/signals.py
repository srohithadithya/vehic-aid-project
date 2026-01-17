"""
Signals for ServiceRequest model to send notifications
"""
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from apps.services.models import ServiceRequest
from apps.services.utils.email_utils import (
    send_service_request_email,
    send_provider_assigned_email,
    send_service_completed_email
)
from apps.services.utils.sms_utils import sms_service
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
            send_service_request_email(instance.customer, instance)
            
            # Send SMS
            sms_service.send_service_request_sms(instance.customer, instance)
            
        # Service request updated
        else:
            # Check if provider was just assigned
            if instance.provider and instance.status == 'DISPATCHED':
                # Check if this is a new assignment (not already notified)
                old_instance = ServiceRequest.objects.filter(id=instance.id).first()
                if old_instance and not hasattr(instance, '_provider_notified'):
                    logger.info(f"Sending provider assigned notifications for request #{instance.id}")
                    
                    # Send email
                    send_provider_assigned_email(instance.customer, instance, instance.provider)
                    
                    # Send SMS
                    sms_service.send_provider_assigned_sms(instance.customer, instance, instance.provider)
                    
                    # Mark as notified
                    instance._provider_notified = True
            
            # Check if service was completed
            if instance.status == 'COMPLETED':
                if not hasattr(instance, '_completed_notified'):
                    logger.info(f"Sending completion notifications for request #{instance.id}")
                    
                    # Send email
                    send_service_completed_email(instance.customer, instance)
                    
                    # Send SMS
                    sms_service.send_service_completed_sms(instance.customer, instance)
                    
                    # Mark as notified
                    instance._completed_notified = True
                    
    except Exception as e:
        logger.error(f"Notification error for request #{instance.id}: {str(e)}")
        # Don't raise exception - notifications shouldn't break the flow
