# backend/apps/iot_devices/models.py

from django.db import models
from django.utils import timezone

from apps.users.models import ServiceBooker  # Assumed Import


class IoTDevice(models.Model):
    """
    Model for the proprietary two-button IoT device. This is the official and
    only definition of the model.
    """

    device_id = models.CharField(max_length=50, unique=True, primary_key=True)

    paired_user = models.OneToOneField(
        ServiceBooker,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="iot_device",
    )

    is_active = models.BooleanField(default=False)
    last_known_latitude = models.DecimalField(
        max_digits=10, decimal_places=8, null=True, blank=True
    )
    last_known_longitude = models.DecimalField(
        max_digits=10, decimal_places=8, null=True, blank=True
    )
    last_battery_level = models.IntegerField(null=True, blank=True)
    last_signal_time = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = "IoT Device"
        verbose_name_plural = "IoT Devices"

    def __str__(self):
        return f"Device {self.device_id}"
