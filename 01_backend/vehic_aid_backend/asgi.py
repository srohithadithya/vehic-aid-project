import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

# Point to the production settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vehic_aid_backend.settings.production")

# Import routing from the services app
import apps.services.routing

application = ProtocolTypeRouter(
    {
        # Standard Django HTTP requests are delegated to the WSGI application
        "http": get_asgi_application(),
        # WebSocket requests (wss://) are handled here
        "websocket": AuthMiddlewareStack(
            URLRouter(apps.services.routing.websocket_urlpatterns)
        ),
    }
)
