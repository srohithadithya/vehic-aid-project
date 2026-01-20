import os
import django
import json

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vehic_aid_backend.settings.development")
django.setup()

from django.test import Client
from django.contrib.auth import get_user_model
from apps.services.models import SubscriptionPlan

User = get_user_model()
client = Client()

print(">>> STARTING SYSTEM VALIDATION <<<")

# 1. Login Booker
print("\n[1] Testing Auth (Booker)...")
try:
    response = client.post('/api/v1/users/token/', {
        'username': 'user_free',
        'password': 'password123'
    }, content_type='application/json')
    
    if response.status_code == 200:
        token = response.json()['access']
        print("PASS: Login Successful.")
    else:
        print(f"FAIL: Login Failed. {response.status_code} {response.content}")
        token = None
except Exception as e:
    print(f"FAIL: Exception {e}")
    token = None

if not token:
    print("CRITICAL: Cannot proceed without token.")
    exit(1)

headers = {'HTTP_AUTHORIZATION': f'Bearer {token}'}

# 2. Check Plans
print("\n[2] Testing Subscription Plans...")
res = client.get('/api/v1/services/subscriptions/plans/', **headers)
if res.status_code == 200 and len(res.json()) >= 4:
    print(f"PASS: Found {len(res.json())} plans.")
else:
    print(f"FAIL: Plans check failed. {res.status_code} {res.content}")

# 3. Check Wallet
print("\n[3] Testing Wallet...")
res = client.get('/api/v1/services/wallet/', **headers)
if res.status_code == 200:
    data = res.json()
    print(f"PASS: Wallet Balance: {data.get('balance')}")
else:
    print(f"FAIL: Wallet check failed. {res.status_code}")

# 4. Check Rewards
print("\n[4] Testing Rewards...")
res = client.get('/api/v1/services/rewards/', **headers)
if res.status_code == 200:
    data = res.json()
    print(f"PASS: Rewards Tier: {data.get('tier')}, Points: {data.get('points')}")
else:
    print(f"FAIL: Rewards check failed. {res.status_code}")

# 5. Check AutoMind (Conversational Booking)
print("\n[5] Testing AutoMind Intelligence...")
res = client.post('/api/v1/services/automind/', {
    'description': 'Flat tire test',
    'latitude': 12.97,
    'longitude': 77.59
}, content_type='application/json', **headers)

if res.status_code in [200, 201]:
    print("PASS: AutoMind responded.")
else:
    print(f"FAIL: AutoMind failed. {res.status_code} {res.content}")

# 6. Check Vehicle Exchange (Eligibility)
# Assuming booker1 is FREE/BASIC initially.
print("\n[6] Testing Subscription Upgrade (Mock)...")
# We'll upgrade locally to PREMIUM to test Exchange
booker = User.objects.get(username='user_free').servicebooker
premium_plan = SubscriptionPlan.objects.get(name='Premium Plan')
# Create sub
from apps.services.models import UserSubscription
from django.utils import timezone
UserSubscription.objects.update_or_create(
    user=booker,
    defaults={
        'plan': premium_plan,
        'start_date': timezone.now().date(),
        'is_active': True,
        'status': 'ACTIVE'
    }
)
print("Updated user_free to PREMIUM.")

# Now check Exchange
print("\n[7] Testing Vehicle Exchange...")
# Note: There isn't a direct "Check Eligibility" endpoint other than /subscriptions/current/
res = client.get('/api/v1/services/subscriptions/current/', **headers)
if res.status_code == 200:
    plan = res.json().get('plan', {}).get('name')
    if plan == 'Premium Plan':
        print("PASS: Subscription is PREMIUM.")
    else:
        print(f"FAIL: Expected Premium Plan, got {plan}")
else:
    print(f"FAIL: Current Sub check failed. {res.status_code}")

# 8. Check Spare Part Stores
print("\n[8] Testing Spare Part Stores...")
res = client.get('/api/v1/services/spare-parts/nearby/?lat=12.97&lng=77.59', **headers)
if res.status_code == 200:
    data = res.json()
    print(f"PASS: Found {len(data)} nearby stores.")
    if len(data) > 0:
        print(f"Sample Store: {data[0]['name']} at {data[0].get('distance_km')}km")
else:
    print(f"FAIL: Spare part stores check failed. {res.status_code}")

# 9. Check Location Name in Service Request
print("\n[9] Testing Service Request with Location Name...")
res = client.post('/api/v1/services/request/', {
    'vehicle_id': booker.user.vehicles.first().id if booker.user.vehicles.exists() else 1,
    'service_type': 'TOWING',
    'latitude': 12.97,
    'longitude': 77.59,
    'location_name': 'Richmond Road, Bangalore'
}, content_type='application/json', **headers)

if res.status_code in [200, 201]:
    req_id = res.json()['id']
    # Verify it was saved
    from apps.services.models import ServiceRequest
    sr = ServiceRequest.objects.get(id=req_id)
    if sr.location_name == 'Richmond Road, Bangalore':
        print("PASS: Location name saved correctly.")
    else:
        print(f"FAIL: Location name mismatch: {sr.location_name}")
else:
    print(f"FAIL: Service request failed. {res.status_code} {res.content}")

print("\n>>> VALIDATION COMPLETE <<<")
exit(0)
