# backend/apps/iot_devices/signals.py

from celery import shared_task

from apps.services.agent_logic import BookingAgent

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
        priority = "HIGH"
    elif button_id == 2:
        service_type = "MAJOR_TOWING_IOT"
        priority = "URGENT"
    else:
        return {"status": "error", "message": "Invalid button ID."}

    # 1. Use the unified BookingAgent to process the request
    agent = BookingAgent(user.user) # paired_user is a ServiceBooker, we need CustomUser
    
    result = agent.process_booking({
        'latitude': latitude,
        'longitude': longitude,
        'service_type': service_type,
        'description': f"IoT Emergency: {service_type}"
    })

    return result
