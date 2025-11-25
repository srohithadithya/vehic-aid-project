from celery import shared_task
from django.utils import timezone
from apps.services.models import UserSubscription

@shared_task
def check_subscription_expiry():
    """
    Periodic task to check for expired subscriptions.
    Marks them as EXPIRED if end_date has passed.
    """
    now = timezone.now()
    expired_subs = UserSubscription.objects.filter(
        is_active=True,
        end_date__lt=now
    )
    
    count = 0
    for sub in expired_subs:
        sub.is_active = False
        sub.status = "EXPIRED"
        sub.save()
        # TODO: Send SMS notification about expiry
        count += 1
    
    return f"Processed {count} expired subscriptions."

@shared_task
def auto_renew_subscriptions():
    """
    Periodic task to auto-renew eligible subscriptions.
    """
    now = timezone.now()
    # Find subscriptions expiring soon (e.g., today) that have auto_renew=True
    # This logic can be refined to run on the day of expiry
    expiring_subs = UserSubscription.objects.filter(
        is_active=True,
        auto_renew=True,
        end_date__date=now.date()
    )

    count = 0
    for sub in expiring_subs:
        # Logic to process payment would go here
        # If payment successful:
        sub.renew()
        # TODO: Send SMS notification about renewal
        count += 1
    
    return f"Auto-renewed {count} subscriptions."
