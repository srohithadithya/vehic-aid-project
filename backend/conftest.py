import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vehic_aid_backend.settings.development')
import django
django.setup()
import pytest
from rest_framework.test import APIClient

@pytest.fixture
def client():
    """Provide DRF APIClient instead of Django test client for tests that use force_authenticate."""
    return APIClient()
