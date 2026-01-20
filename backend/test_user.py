import os
import django
import traceback

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vehic_aid_backend.settings.development")
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

print("Attempting to create superuser...")
try:
    User.objects.create_superuser(
        username='admin',
        email='admin@vehicaid.com',
        password='admin123',
        phone_number='+910000000000',
        is_service_booker=True,
        is_service_provider=True
    )
    print("SUCCESS")
except Exception:
    print("FAILED")
    traceback.print_exc()
