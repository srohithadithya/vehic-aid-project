from django.urls import path

from .views import IoTDataIngestionView

# from .views import IoTDevicePairingView # Placeholder for future API

urlpatterns = [
    # API endpoint to receive data from the external MQTT gateway (high traffic, simple POST)
    path("data-ingest/", IoTDataIngestionView.as_view(), name="iot-data-ingest"),
    # Future endpoint for a user to scan and pair their new device via the mobile app
    # path('pair-device/', IoTDevicePairingView.as_view(), name='iot-device-pair'),
]
