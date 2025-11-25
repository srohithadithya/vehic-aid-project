import pytest
from rest_framework.test import APIClient


@pytest.fixture
def client():
    """Provide DRF APIClient instead of Django test client for tests that use force_authenticate."""
    return APIClient()
