import pytest
from django.urls import reverse
from rest_framework import status
from apps.iot_devices.models import IoTDevice
from apps.users.models import CustomUser, ServiceBooker
from decimal import Decimal

@pytest.mark.django_db
class TestIoTIntegration:
    @pytest.fixture
    def setup_device(self):
        user = CustomUser.objects.create_user(username="testbooker", email="test@example.com", password="password123")
        booker = ServiceBooker.objects.create(user=user)
        device = IoTDevice.objects.create(device_id="DEV_123", paired_user=booker)
        return device, user

    def test_heartbeat_updates_telemetry(self, client, setup_device):
        device, _ = setup_device
        url = reverse('iot-data-ingest')
        data = {
            "device_id": "DEV_123",
            "latitude": "12.97160000",
            "longitude": "77.59460000",
            "battery": 85
        }
        response = client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_202_ACCEPTED
        device.refresh_from_db()
        assert device.last_known_latitude == Decimal("12.97160000")
        assert device.last_battery_level == 85
        assert device.is_active is True

    def test_button_press_triggers_task(self, client, setup_device, mocker):
        # Mock the celery task
        mock_task = mocker.patch('apps.iot_devices.views.process_iot_button_press_async.delay')
        
        device, _ = setup_device
        url = reverse('iot-data-ingest')
        data = {
            "device_id": "DEV_123",
            "latitude": "12.97160000",
            "longitude": "77.59460000",
            "button_pressed": 1
        }
        response = client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_202_ACCEPTED
        mock_task.assert_called_once_with(
            device_id="DEV_123",
            button_id=1,
            latitude=12.9716,
            longitude=77.5946
        )

    def test_unknown_device_fails(self, client):
        url = reverse('iot-data-ingest')
        data = {
            "device_id": "UNKNOWN",
            "latitude": "12.0",
            "longitude": "77.0"
        }
        response = client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "device_id" in response.data
