import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vehic_aid_backend.settings.development")
django.setup()

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()

def test_user_preferences():
    print("--- Testing User Profile & Language Preference ---")
    client = APIClient()
    user = User.objects.get(username='customer1')
    client.force_authenticate(user=user)
    
    # 1. Get initial profile
    print("Getting initial profile...")
    response = client.get('/api/v1/users/profile/')
    print(f"Profile: {response.data}")
    initial_lang = response.data.get('preferred_language')

    # 2. Update language
    new_lang = 'hi' if initial_lang != 'hi' else 'ta'
    print(f"\nUpdating language to {new_lang}...")
    update_resp = client.post('/api/v1/users/profile/language/', {'language': new_lang}, format='json')
    print(f"Update Status: {update_resp.status_code}, Msg: {update_resp.data.get('message')}")
    
    # 3. Verify update
    print("\nVerifying update...")
    verify_resp = client.get('/api/v1/users/profile/')
    print(f"Verified Language: {verify_resp.data.get('preferred_language')}")
    if verify_resp.data.get('preferred_language') == new_lang:
        print("Preference Update Passed!")
    else:
        print("Preference Update Failed!")

if __name__ == "__main__":
    test_user_preferences()
