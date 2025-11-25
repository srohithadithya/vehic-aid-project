# backend/apps/iot_devices/views.py

from django.db import transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

# Import the model and serializer correctly
from .models import IoTDevice
from .serializers import IoTDataSerializer
from .signals import process_iot_button_press_async


class IoTDataIngestionView(APIView):
    """
    Public API endpoint to receive data forwarded from the Cloud's MQTT broker.
    """

    permission_classes = []

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
