import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vehic_aid_backend.settings.development")
django.setup()

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.services.models import RewardsProgram

User = get_user_model()

def test_referrals():
    print("--- Testing Referral System ---")
    client = APIClient()
    
    # 1. Get Referrer (Customer 1) code
    u1 = User.objects.get(username='customer1')
    client.force_authenticate(user=u1)
    resp = client.get('/api/v1/services/rewards/None/') # retrieve detail for current user
    code = resp.data.get('referral_code')
    print(f"Referrer ({u1.username}) code: {code}")

    # 2. Use code with Customer 3 (who has no referrer yet)
    u3 = User.objects.get(username='customer3')
    client.force_authenticate(user=u3)
    print(f"\nSubmitting referral for {u3.username}...")
    submit_resp = client.post('/api/v1/services/rewards/submit-referral/', {'code': code}, format='json')
    print(f"Submit Status: {submit_resp.status_code}, Msg: {submit_resp.data.get('message')}")
    
    # 3. List referrals for Customer 1
    client.force_authenticate(user=u1)
    print(f"\nListing referrals for {u1.username}...")
    list_resp = client.get('/api/v1/services/rewards/list-referrals/')
    print(f"Referrals List: {list_resp.data}")
    
    if len(list_resp.data) > 0 and list_resp.data[0]['referred_user'] == u3.username:
        print("Referral Tracking Passed!")
    else:
        print("Referral Tracking Failed!")

if __name__ == "__main__":
    test_referrals()
