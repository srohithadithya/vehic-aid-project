
import requests
import sys

BASE_URL = "http://localhost:8000"

def test_endpoints():
    print("1. Authenticating...")
    try:
        resp = requests.post(f"{BASE_URL}/api/token/", json={
            "username": "admin", 
            "password": "admin123"
        })
        if resp.status_code != 200:
            print(f"FAILED to login: {resp.text}")
            return
        
        token = resp.json()['access']
        print(f"SUCCESS: Got token starting {token[:10]}...")
        
        headers = {'Authorization': f'Bearer {token}'}
        
        # Test Bookings
        print("\n2. Testing Bookings API (/services/admin/bookings/)...")
        resp = requests.get(f"{BASE_URL}/services/admin/bookings/", headers=headers)
        if resp.status_code == 200:
            print(f"SUCCESS: Bookings API returned 200 OK")
            data = resp.json()
            print(f"Count: {len(data)}")
            if len(data) > 0:
                print(f"Sample: {data[0]}")
        else:
            print(f"FAILED: Bookings API returned {resp.status_code}")
            print(resp.text)
            
        # Test Payments
        print("\n3. Testing Payments API (/services/admin/payments/)...")
        resp = requests.get(f"{BASE_URL}/services/admin/payments/", headers=headers)
        if resp.status_code == 200:
            print(f"SUCCESS: Payments API returned 200 OK")
            data = resp.json()
            print(f"Count: {len(data)}")
            if len(data) > 0:
                print(f"Sample: {data[0]}")
        else:
            print(f"FAILED: Payments API returned {resp.status_code}")
            print(resp.text)

    except Exception as e:
        print(f"EXCEPTION: {e}")

if __name__ == "__main__":
    test_endpoints()
