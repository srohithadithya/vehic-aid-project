from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    # WebSocket path to connect to a specific service request's tracking channel
    re_path(
        r"ws/service/(?P<request_id>\w+)/$", consumers.ServiceTrackingConsumer.as_asgi()
    ),
]
