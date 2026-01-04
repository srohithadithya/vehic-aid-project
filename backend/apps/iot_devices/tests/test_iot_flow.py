
import pytest
from apps.iot_devices.models import IoTDevice
from apps.users.models import ServiceBooker, CustomUser
from decimal import Decimal

@pytest.mark.django_db
class TestIoTDeviceFlow:
    
    def test_device_creation_and_pairing(self):
        """
        Test that an IoT device can be created and paired with a user.
        """
        user = CustomUser.objects.create(username="iotuser", email="iot@example.com")
        booker = ServiceBooker.objects.create(user=user)
        
        device = IoTDevice.objects.create(device_id="IOT-12345")
        
        # Pair device
        device.paired_user = booker
        device.is_active = True
        device.save()
        
        fetched_device = IoTDevice.objects.get(device_id="IOT-12345")
        assert fetched_device.paired_user == booker
        assert fetched_device.is_active is True

    def test_device_telemetry_update(self):
        """
        Test updating device telemetry (simulating data coming from the firmware).
        """
        device = IoTDevice.objects.create(device_id="IOT-TEL-001")
        
        # Simulate update
        device.last_known_latitude = Decimal("12.9999")
        device.last_known_longitude = Decimal("77.9999")
        device.last_battery_level = 85
        device.save()
        
        updated_device = IoTDevice.objects.get(device_id="IOT-TEL-001")
        assert updated_device.last_known_latitude == Decimal("12.9999")
        assert updated_device.last_battery_level == 85
