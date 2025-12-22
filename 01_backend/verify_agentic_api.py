import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vehic_aid_backend.settings.development")
django.setup()

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.services.models import ServiceRequest

User = get_user_model()

def test_agentic_api():
    print("--- Testing Agentic Booking API ---")
    client = APIClient()
    user = User.objects.get(username='customer1')
    client.force_authenticate(user=user)
    
    data = {
        'latitude': 19.0762,
        'longitude': 72.8779,
        'service_type': 'FLAT_TIRE',
        'description': 'Tire burst on Eastern Express Highway.'
    }
    
    response = client.post('/api/v1/services/agentic-booking/', data, format='json')
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.data}")
    
    if response.status_code == 201:
        print("API Test Passed!")
    else:
        print("API Test Failed!")

if __name__ == "__main__":
    test_agentic_api()
