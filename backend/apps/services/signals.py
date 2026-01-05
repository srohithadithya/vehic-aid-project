from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import ServiceRequest
from .services.notifications import PushNotificationService

notification_service = PushNotificationService()

@receiver(post_save, sender=ServiceRequest)
def handle_service_request_change(sender, instance, created, **kwargs):
    if created:
        # If a provider is already assigned during creation (rare but possible in some logic)
        # we would notify them here.
        pass
    else:
        # Check if status has changed (simulated via update_fields or previous state check)
        # Note: In a robust implementation, we'd use a field tracker.
        notification_service.notify_booker_status_change(instance)
        
        if instance.status == 'DISPATCHED' and instance.provider:
            notification_service.notify_provider_new_job(instance.provider, instance)
