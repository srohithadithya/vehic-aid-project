# backend/apps/iot_devices/admin.py

from django.contrib import admin

from .models import IoTDevice


@admin.register(IoTDevice)
class IoTDeviceAdmin(admin.ModelAdmin):
    list_display = (
        "device_id",
        "paired_user",
        "is_active",
        "last_battery_level",
        "last_signal_time",
    )
    list_filter = ("is_active", "last_battery_level")
    search_fields = ("device_id", "paired_user__email", "paired_user__phone_number")
    ordering = ("-last_signal_time",)

    # Readonly fields to prevent accidental changes to tracking data
    readonly_fields = (
        "last_known_latitude",
        "last_known_longitude",
        "last_signal_time",
    )

    fieldsets = (
        (None, {"fields": ("device_id", "paired_user", "is_active")}),
        (
            "Last Status Data",
            {
                "fields": (
                    "last_known_latitude",
                    "last_known_longitude",
                    "last_battery_level",
                    "last_signal_time",
                )
            },
        ),
    )
