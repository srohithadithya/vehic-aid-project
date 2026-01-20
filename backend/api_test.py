import requests
import json
import time

BASE_URL = "http://localhost:8000/api/v1" # Internal container talk or localhost if run from host

def test_api():
    print("🚀 Starting Comprehensive API Integration Test...")
    
    # We will use the internal URL because this script runs inside the backend container
    # The API is serving on port 8000 inside the container.
    url = "http://localhost:8000/api/v1"
    
    results = []

    def log_test(name, success, info=""):
        results.append({"name": name, "success": success, "info": info})
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name} {f'({info})' if info else ''}")

    # Debug: Check services root
    try:
        root_resp = requests.get(f"{url}/services/", headers={"Authorization": f"Bearer 123"}) # Token doesn't matter for just listing URLs usually if allowed
        print(f"DEBUG: Services Root Output: {root_resp.text}")
    except:
        pass

    # 1. Login as Booker
    print("\n--- AUTH TESTING ---")
    booker_token = None
    try:
        resp = requests.post(f"{url}/users/token/", json={
            "username": "user_premium",
            "password": "password123"
        })
        if resp.status_code == 200:
            booker_token = resp.json().get('access')
            log_test("Booker Login", True)
        else:
            log_test("Booker Login", False, f"Status: {resp.status_code}, Body: {resp.text}")
    except Exception as e:
        log_test("Booker Login", False, str(e))

    # 2. Login as Provider
    provider_token = None
    try:
        resp = requests.post(f"{url}/users/token/", json={
            "username": "prov_tow",
            "password": "password123"
        })
        if resp.status_code == 200:
            provider_token = resp.json().get('access')
            log_test("Provider Login", True)
        else:
            log_test("Provider Login", False, f"Status: {resp.status_code}, Body: {resp.text}")
    except Exception as e:
        log_test("Provider Login", False, str(e))

    if not booker_token:
        print("Stopping tests: Booker token missing.")
        return

    b_headers = {"Authorization": f"Bearer {booker_token}"}
    p_headers = {"Authorization": f"Bearer {provider_token}"} if provider_token else {}

    # 3. Subscription Plans
    print("\n--- SERVICE FEATURES TESTING ---")
    try:
        resp = requests.get(f"{url}/services/subscriptions/plans/", headers=b_headers)
        if resp.status_code == 200:
            plans = resp.json()
            log_test("Fetch Sub Plans", True, f"Count: {len(plans)}")
            # Verify specific plan details from docs
            prem = next((p for p in plans if p['name'] == 'Premium Plan'), None)
            if prem and float(prem['price']) == 199.0:
                 log_test("Premium Plan Price Verification", True)
            else:
                 log_test("Premium Plan Price Verification", False, f"Expected 199.0, got {prem['price'] if prem else 'None'}")
        else:
            log_test("Fetch Sub Plans", False)
    except Exception as e:
        log_test("Fetch Sub Plans", False, str(e))

    # 4. Wallet
    try:
        url_wallet = f"{url}/services/wallet/"
        resp = requests.get(url_wallet, headers=b_headers)
        if resp.status_code == 200:
            bal = resp.json().get('balance')
            log_test("Wallet Balance", True, f"Balance: {bal}")
        else:
            log_test("Wallet Balance", False, f"Status: {resp.status_code}, URL: {url_wallet}, Body: {resp.text}")
    except Exception as e:
        log_test("Wallet Balance", False, str(e))

    # 5. Rewards
    try:
        url_rewards = f"{url}/services/rewards/"
        resp = requests.get(url_rewards, headers=b_headers)
        if resp.status_code == 200:
            pts = resp.json().get('points')
            log_test("Rewards Points", True, f"Points: {pts}")
        else:
            log_test("Rewards Points", False, f"Status: {resp.status_code}, URL: {url_rewards}, Body: {resp.text}")
    except Exception as e:
        log_test("Rewards Points", False, str(e))

    # 6. AutoMind Intelligence
    try:
        resp = requests.post(f"{url}/services/automind/", json={
            "description": "I have an emergency near Indiranagar",
            "latitude": 12.9716,
            "longitude": 77.5946
        }, headers=b_headers)
        if resp.status_code in [200, 201, 202]:
            log_test("AutoMind Booking", True)
        else:
            log_test("AutoMind Booking", False, f"Status: {resp.status_code}, Body: {resp.text}")
    except Exception as e:
        log_test("AutoMind Booking", False, str(e))

    # 7. Provider Dashboard (if token exists)
    if provider_token:
        print("\n--- PROVIDER FEATURES TESTING ---")
        try:
            resp = requests.get(f"{url}/payments/dashboard/provider/", headers=p_headers)
            if resp.status_code == 200:
                log_test("Provider Dashboard", True)
            else:
                # Dashboard might be empty if no transactions, but should return 200
                log_test("Provider Dashboard", False, f"Status: {resp.status_code}")
        except Exception as e:
            log_test("Provider Dashboard", False, str(e))

    print("\n--- FINAL SUMMARY ---")
    passed = sum(1 for r in results if r['success'])
    failed = len(results) - passed
    print(f"Total Tests: {len(results)}")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")

if __name__ == "__main__":
    test_api()
