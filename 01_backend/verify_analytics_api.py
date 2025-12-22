import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vehic_aid_backend.settings.development")
django.setup()

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()

def test_analytics_api():
    print("--- Testing Subscription Analytics API ---")
    client = APIClient()
    user = User.objects.get(username='admin')
    client.force_authenticate(user=user)
    
    response = client.get('/api/v1/services/subscriptions/analytics/')
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.data}")
    
    if response.status_code == 200:
        print("Analytics API Test Passed!")
    else:
        print("Analytics API Test Failed!")

if __name__ == "__main__":
    test_analytics_api()
