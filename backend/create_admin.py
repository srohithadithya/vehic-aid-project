import os
import django
from django.contrib.auth import get_user_model

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vehic_aid_backend.settings.base')
django.setup()

User = get_user_model()
username = 'admin'
email = 'admin@vehicaid.com'
password = 'admin123'

try:
    user, created = User.objects.get_or_create(username=username, defaults={'email': email})
    user.set_password(password)
    user.is_superuser = True
    user.is_staff = True
    user.save()
    if created:
        print(f"Successfully created superuser: {username}")
    else:
        print(f"Successfully updated password for existing superuser: {username}")
except Exception as e:
    print(f"Error creating/updating superuser: {str(e)}")
