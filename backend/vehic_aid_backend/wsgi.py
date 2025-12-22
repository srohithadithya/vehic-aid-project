import os

from django.core.wsgi import get_wsgi_application

# Point to the production settings in a real-world scenario
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vehic_aid_backend.settings.production")

application = get_wsgi_application()
