from django.urls import path

from .views import IoTDataIngestionView, IoTDeviceDetailView, IoTDeviceListView

urlpatterns = [
    # API endpoint to receive data from the external MQTT gateway
    path("data-ingest/", IoTDataIngestionView.as_view(), name="iot-data-ingest"),
    # Fetch status for the user's paired device
    path("status/", IoTDeviceDetailView.as_view(), name="iot-device-status"),
    # Enterprise fleet monitoring
    path("fleet-status/", IoTDeviceListView.as_view(), name="iot-fleet-status"),
]
