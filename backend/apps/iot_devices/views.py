# backend/apps/iot_devices/views.py

from django.db import transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser


class IoTDeviceListView(APIView):
    """
    Enterprise endpoint to monitor entire fleet of IoT devices.
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        devices = IoTDevice.objects.all()
        data = [{
            "device_id": d.device_id,
            "user": d.servicebooker.user.username if hasattr(d, 'servicebooker') else 'Unassigned',
            "is_active": d.is_active,
            "battery": d.last_battery_level,
            "last_signal": d.last_signal_time
        } for d in devices]
        return Response(data)

# Import the model and serializer correctly
from .models import IoTDevice
from .serializers import IoTDataSerializer
from .signals import process_iot_button_press_async


class IoTDeviceDetailView(APIView):
    """
    Endpoint for a user to fetch the current status and health of their paired IoT device.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            booker = request.user.servicebooker
            device = booker.iot_device
            return Response({
                "device_id": device.device_id,
                "is_active": device.is_active,
                "battery": device.last_battery_level,
                "latitude": float(device.last_known_latitude) if device.last_known_latitude else None,
                "longitude": float(device.last_known_longitude) if device.last_known_longitude else None,
                "last_signal": device.last_signal_time
            })
        except (AttributeError, IoTDevice.DoesNotExist):
            return Response({"error": "No paired device found."}, status=status.HTTP_404_NOT_FOUND)


class IoTDataIngestionView(APIView):
    """
    Public API endpoint to receive data forwarded from the Cloud's MQTT broker.
    """

    permission_classes = [AllowAny]

    @transaction.atomic
    def post(self, request, format=None):
        serializer = IoTDataSerializer(data=request.data)

        if serializer.is_valid():
            data = serializer.validated_data
            device_id = data["device_id"]
            button = data.get("button_pressed")

            # 1. Update the device's last known status
            IoTDevice.objects.filter(device_id=device_id).update(
                last_known_latitude=data["latitude"],
                last_known_longitude=data["longitude"],
                last_battery_level=data.get("battery"),
                is_active=True,
                last_signal_time=timezone.now(),
            )

            # 2. Trigger the asynchronous job for button press
            if button in [1, 2]:
                process_iot_button_press_async.delay(
                    device_id=device_id,
                    button_id=button,
                    latitude=float(data["latitude"]),
                    longitude=float(data["longitude"]),
                )

            return Response(
                {"message": "IoT data processed successfully."},
                status=status.HTTP_202_ACCEPTED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
