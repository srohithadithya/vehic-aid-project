import requests
import json
import time
import sys

# Color Helpers
def print_pass(msg):
    try:
        print(f"✅ {msg}")
    except UnicodeEncodeError:
        print(f"[PASS] {msg}")

def print_fail(msg):
    try:
        print(f"❌ {msg}")
    except UnicodeEncodeError:
        print(f"[FAIL] {msg}")

def print_section(msg):
    print(f"\n⚡ {msg}")
    print("-" * 50)

# Configuration
# Adapting to port 8000 as per current running instance
BASE_URL = "http://localhost:8001/api/v1"
HEADERS_BOOKER = {}
HEADERS_PROVIDER = {}

def full_simulation():
    print_section("STARTING FULL END-TO-END AUTOMIND SIMULATION")
    
    # ----------------------------------------------------
    # 1. AUTHENTICATION
    # ----------------------------------------------------
    print("STEP 1: Authenticating Users...")
    
    # Booker Login
    try:
        resp = requests.post(f"{BASE_URL}/users/token/", json={
            "username": "user_premium", 
            "password": "password123"
        })
        if resp.status_code == 200:
            token = resp.json()['access']
            HEADERS_BOOKER["Authorization"] = f"Bearer {token}"
            print_pass("Booker Logged In (Premium User)")
        else:
            print_fail(f"Booker Login Failed: {resp.text}")
            # Try registering if login fails (optional, but good for robustness)
            print("Attempting registration...")
            reg_resp = requests.post(f"{BASE_URL}/users/register/", json={
                "username": "user_premium",
                "email": "user_premium@example.com",
                "password": "password123",
                "phone_number": "9999999999",
                "role": "BOOKER"
            })
            if reg_resp.status_code == 201:
                print_pass("User Registered. Retrying login...")
                # Retry Login
                resp = requests.post(f"{BASE_URL}/users/token/", json={
                    "username": "user_premium", 
                    "password": "password123"
                })
                if resp.status_code == 200:
                    token = resp.json()['access']
                    HEADERS_BOOKER["Authorization"] = f"Bearer {token}"
                    print_pass("Booker Logged In (After Registration)")
                else:
                    sys.exit(1)
            else:
                sys.exit(1)
    except Exception as e:
        print_fail(f"Connection Error: {e}")
        print("Ensure 'python manage.py runserver 8000' is running.")
        sys.exit(1)

    # Provider Login
    try:
        resp = requests.post(f"{BASE_URL}/users/token/", json={
            "username": "prov_tow", 
            "password": "password123"
        })
        if resp.status_code == 200:
            token = resp.json()['access']
            HEADERS_PROVIDER["Authorization"] = f"Bearer {token}"
            print_pass("Provider Logged In (Towing Specialist)")
        else:
            print_fail(f"Provider Login Failed: {resp.text}")
            # Continuing without provider just to test AI part if strictly needed, but better to fail.
            # print("Provider login failed. Skipping provider steps.")
    except Exception as e:
        print_fail(f"Provider Auth Exception: {e}")

    # ----------------------------------------------------
    # 2. AUTOMIND BOOKING
    # ----------------------------------------------------
    print_section("STEP 2: Booking via AutoMind Intelligence")
    
    service_request_id = None
    
    payload = {
        "description": "I need a tow truck immediately, my car is completely broken down.",
        "latitude": 12.9716,
        "longitude": 77.5946
    }
    
    try:
        resp = requests.post(f"{BASE_URL}/services/automind/", json=payload, headers=HEADERS_BOOKER)
        
        if resp.status_code in [200, 201, 202]:
            data = resp.json()
            service_request_id = data.get('request_id')
            print_pass(f"AutoMind Created Request ID: {service_request_id}")
            print(f"   > AI Message: {data.get('message')}")
            # print(f"   > Intelligence Data: {json.dumps(data.get('dispatch_details', {}), indent=2)}")
        else:
            print_fail(f"AutoMind Failed: {resp.text}")
            sys.exit(1)
            
    except Exception as e:
        print_fail(f"AutoMind Exception: {e}")
        sys.exit(1)

    if not service_request_id:
        print_fail("No Request ID returned.")
        sys.exit(1)

    # ----------------------------------------------------
    # 3. VERIFY STATUS (PENDING/ASSIGNED)
    # ----------------------------------------------------
    print_section("STEP 3: Verifying Dispatch Status")
    
    time.sleep(2) # Give DB a moment
    
    try:
        resp = requests.get(f"{BASE_URL}/services/request/{service_request_id}/", headers=HEADERS_BOOKER)
        if resp.status_code == 200:
            request_data = resp.json()
            current_status = request_data.get('status')
            service_type = request_data.get('service_type')
            print_pass(f"Request Found on Backend. Status: {current_status}")
            print_pass(f"AI Categorized As: {service_type}")
            
            if service_type in ['MECHANIC', 'TOWING']:
                print_pass("AI Classification Correct (MECHANIC/TOWING).")
            else: 
                print_fail(f"AI Classification Suspect: {service_type}")

    except Exception as e:
        print_fail(f"Status Check Failed: {e}")

    # ----------------------------------------------------
    # 4. PROVIDER ACTION (Accept/Complete)
    # ----------------------------------------------------
    # Only verify this if provider logged in successfully
    if HEADERS_PROVIDER:
        print_section("STEP 4: Simulating Provider Workflow")
        
        new_status = "IN_PROGRESS"
        try:
            print(f"   Attempting to set status to {new_status}...")
            # Note: This might fail if the provider is not the assigned one.
            resp = requests.post(
                f"{BASE_URL}/services/provider/update/{service_request_id}/", 
                json={"status": new_status},
                headers=HEADERS_PROVIDER
            )
            
            if resp.status_code == 200:
                print_pass("Provider Status Update Success (Job Started)")
            else:
                print(f"   ℹ️ Provider update returned {resp.status_code}. (Expected if provider mismatch)")
                
        except Exception as e:
            print_fail(f"Provider Action Error: {e}")

    # ----------------------------------------------------
    # 5. PAYMENT GENERATION
    # ----------------------------------------------------
    print_section("STEP 5: Payment Initiation")
    
    try:
        # User initiates payment for the service
        pay_payload = {
            "amount": 500, # Mock amount in smallest currency unit? No, typically INR
            "currency": "INR",
            "service_request_id": service_request_id
        }
        resp = requests.post(f"{BASE_URL}/payments/create-order/", json=pay_payload, headers=HEADERS_BOOKER)
        
        if resp.status_code == 200:
            order_data = resp.json()
            print_pass(f"Payment Order Created: {order_data.get('order_id')}")
        else:
            print_fail(f"Payment Creation Failed: {resp.text}")

    except Exception as e:
        print_fail(f"Payment Exception: {e}")

    print_section("FULL SIMULATION COMPLETE")

if __name__ == "__main__":
    full_simulation()
