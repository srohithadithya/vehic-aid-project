from rest_framework import serializers

from .models import IoTDevice


class IoTDataSerializer(serializers.Serializer):
    """
    Validates the data payload received by the API from the MQTT broker.
    """

    device_id = serializers.CharField(max_length=50)
    latitude = serializers.DecimalField(max_digits=10, decimal_places=8)
    longitude = serializers.DecimalField(max_digits=10, decimal_places=8)

    # The button pressed (1 or 2) is used to determine the emergency type.
    button_pressed = serializers.IntegerField(required=False, min_value=1, max_value=2)
    battery = serializers.IntegerField(required=False, min_value=0, max_value=100)

    def validate_device_id(self, value):
        """Ensures the device ID exists in the database."""
        try:
            IoTDevice.objects.get(device_id=value)
        except IoTDevice.DoesNotExist:
            raise serializers.ValidationError("Unknown or unregistered IoT Device ID.")
        return value
