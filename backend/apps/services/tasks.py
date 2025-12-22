from celery import shared_task
from django.utils import timezone
from apps.services.models import UserSubscription, Vehicle, ServiceRequest
from apps.services.services.sms import SMSService
from apps.services.dispatch_logic import trigger_dispatch
from datetime import timedelta

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
    sms_service = SMSService()
    for sub in expired_subs:
        sub.is_active = False
        sub.status = "EXPIRED"
        sub.save()
        
        # Send SMS notification about expiry
        sms_service.send_subscription_expiry_alert(sub, 0)
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
    sms_service = SMSService()
    for sub in expiring_subs:
        # Logic to process payment would go here
        # If payment successful:
        sub.renew()
        # Send SMS notification about renewal
        sms_service.send_subscription_renewed(sub)
        count += 1
    
    return f"Auto-renewed {count} subscriptions."

@shared_task
def send_compliance_reminders():
    """
    Periodic task to remind users about Insurance and PUC expiration.
    Critical for the Indian market compliance.
    """
    sms_service = SMSService()
    reminder_days = [7, 3, 1]  # Remind 7, 3, and 1 day before
    count = 0
    now_date = timezone.now().date()
    
    for days in reminder_days:
        target_date = now_date + timedelta(days=days)
        
        # Check Insurance
        vehicles_ins = Vehicle.objects.filter(insurance_expiry=target_date)
        for vehicle in vehicles_ins:
            msg = f"Reminder: Insurance for your vehicle {vehicle.license_plate} expires in {days} days. Renew now via Vehic-Aid."
            sms_service.send_sms(vehicle.owner.phone_number, msg)
            count += 1
            
        # Check PUC
        vehicles_puc = Vehicle.objects.filter(puc_expiry=target_date)
        for vehicle in vehicles_puc:
            msg = f"Reminder: PUC (Pollution Check) for {vehicle.license_plate} expires in {days} days. Stay compliant!"
            sms_service.send_sms(vehicle.owner.phone_number, msg)
            count += 1
            
    return f"Sent {count} compliance reminders."

@shared_task
def auto_escalate_stuck_requests():
    """
    Automates the escalation of service requests that are stuck in 'DISPATCHED' 
    status for more than 15 minutes without progress.
    """
    timeout = timezone.now() - timedelta(minutes=15)
    stuck_requests = ServiceRequest.objects.filter(
        status='DISPATCHED',
        updated_at__lt=timeout
    )
    
    count = 0
    for req in stuck_requests:
        # Re-trigger dispatch but maybe with higher priority or different logic
        # For now, we just re-run standard dispatch which might pick a different provider
        trigger_dispatch(req)
        count += 1
        
    return f"Escalated {count} stuck requests."
