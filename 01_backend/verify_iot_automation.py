import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vehic_aid_backend.settings.development")
django.setup()

from apps.iot_devices.signals import process_iot_button_press_async
from apps.iot_devices.models import IoTDevice
from apps.users.models import ServiceBooker

def test_iot_automation():
    print("--- Testing Unified IoT Automation ---")
    
    # 1. Setup/Get device
    # (Assuming seed has created this)
    device = IoTDevice.objects.first()
    if not device:
        print("No IoT device found. Skipping.")
        return
        
    print(f"Triggering Button 1 for device {device.device_id}...")
    
    # Simulate the async task manually
    result = process_iot_button_press_async(
        device_id=device.device_id,
        button_id=1,
        latitude=19.0760,
        longitude=72.8777
    )
    
    print(f"Result: {result}")
    
    if result.get('status') == 'SUCCESS':
        print("IoT Automation Test Passed!")
    else:
        print("IoT Automation Test Failed!")

if __name__ == "__main__":
    test_iot_automation()
