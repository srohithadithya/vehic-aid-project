import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vehic_aid_backend.settings.development")
django.setup()

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.services.models import ServiceRequest, ServiceQuote

User = get_user_model()

def test_automated_pricing():
    print("--- Testing Automated Pricing based on Subscription ---")
    client = APIClient()
    
    # 1. Test Customer 1 (Basic Plan - hi)
    u1 = User.objects.get(username='customer1')
    client.force_authenticate(user=u1)
    
    data = {
        'latitude': 19.0762,
        'longitude': 72.8779,
        'service_type': 'TOWING',
        'description': 'Basic plan test.'
    }
    
    print(f"Requesting for {u1.username} (Basic Plan)...")
    resp1 = client.post('/api/v1/services/agentic-booking/', data, format='json')
    quote1 = ServiceQuote.objects.get(id=resp1.data['dispatch_details']['quote_id'])
    print(f"Quote Total: {quote1.dynamic_total} (Should be full price)")

    # 2. Test Customer 2 (Premium Plan - ta)
    u2 = User.objects.get(username='customer2')
    client.force_authenticate(user=u2)
    
    data['description'] = 'Premium plan test.'
    print(f"\nRequesting for {u2.username} (Premium Plan)...")
    resp2 = client.post('/api/v1/services/agentic-booking/', data, format='json')
    quote2 = ServiceQuote.objects.get(id=resp2.data['dispatch_details']['quote_id'])
    print(f"Quote Total: {quote2.dynamic_total} (Should be 50% discount)")

if __name__ == "__main__":
    test_automated_pricing()
