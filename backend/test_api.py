import requests
import json

print("Testing Vehic-Aid Backend API Endpoints...")
print("=" * 50)

base_url = "http://localhost:8000/api/v1/services"

endpoints = [
    "/admin/dashboard-stats/",
    "/admin/recent-activity/",
    "/admin/users/",
    "/admin/bookings/",
    "/admin/payments/",
]

for endpoint in endpoints:
    url = base_url + endpoint
    print(f"\n📡 Testing: {endpoint}")
    try:
        response = requests.get(url, timeout=5)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, dict):
                print(f"   Keys: {list(data.keys())}")
            elif isinstance(data, list):
                print(f"   Items: {len(data)}")
            print("   ✅ SUCCESS")
        else:
            print(f"   ❌ ERROR: {response.text[:200]}")
    except Exception as e:
        print(f"   ❌ EXCEPTION: {str(e)}")

print("\n" + "=" * 50)
print("Testing complete!")
