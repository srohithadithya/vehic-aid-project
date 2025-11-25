# backend/apps/iot_devices/signals.py

from celery import shared_task

# FIX: Correctly importing the actual function name (trigger_dispatch)
from apps.services.dispatch_logic import trigger_dispatch

# Assumed imports for external apps
from apps.services.models import ServiceRequest

# Import the necessary model
from .models import IoTDevice


@shared_task(name="iot.process_button_press")
def process_iot_button_press_async(
    device_id: str, button_id: int, latitude: float, longitude: float
):
    """
    Celery task to handle the actual creation and dispatch of the emergency request
    triggered by the IoT device.
    """
    try:
        # Use the correctly imported IoTDevice model
        device = IoTDevice.objects.select_related("paired_user").get(
            device_id=device_id
        )
    except IoTDevice.DoesNotExist:
        # Log: Device not found
        return {"status": "error", "message": "Device not found."}

    if not device.paired_user:
        # Log: Unpaired device used
        return {"status": "error", "message": "Device is not paired."}

    user = device.paired_user

    # Determine Service Type based on button press (1 or 2)
    if button_id == 1:
        service_type = "COMMON_FIX_IOT"
        priority = ServiceRequest.PRIORITY_CHOICES.HIGH
    elif button_id == 2:
        service_type = "MAJOR_TOWING_IOT"
        priority = ServiceRequest.PRIORITY_CHOICES.URGENT
    else:
        return {"status": "error", "message": "Invalid button ID."}

    # 1. Create the Service Request
    new_request = ServiceRequest.objects.create(
        booker=user,
        service_type=service_type,
        status="PENDING_DISPATCH",
        priority=priority,
        latitude=latitude,
        longitude=longitude,
        source="IoT Device",
    )

    # 2. Trigger the automated dispatch process using the CORRECT function name
    # We pass the newly created request object to the service logic
    trigger_dispatch(new_request)

    return {"status": "success", "request_id": new_request.id}
