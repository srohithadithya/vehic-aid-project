# backend/vehic_aid_backend/celery.py

import os

from celery import Celery

# Set the default Django settings module for the 'celery' program.
# This ensures Celery loads your Django settings (including broker URL, etc.).
os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE", "vehic_aid_backend.settings.development"
)

# Create a Celery application instance
# The 'vehic_aid_backend' string is used as the namespace
app = Celery("vehic_aid_backend")

# Load task settings from Django settings (settings.CELERY_*)
app.config_from_object("django.conf:settings", namespace="CELERY")

# Automatically discover and load tasks from all installed Django apps.
# Celery will look for a 'tasks.py' file in every app listed in INSTALLED_APPS.
app.autodiscover_tasks()
