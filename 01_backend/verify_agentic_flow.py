import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vehic_aid_backend.settings.development")
django.setup()

from django.contrib.auth import get_user_model
from apps.services.agent_logic import BookingAgent
from apps.users.models import ServiceBooker

User = get_user_model()

def test_booking_flow():
    print("--- Testing Agentic Booking Flow ---")
    
    # 1. Get a test user (customer1)
    user = User.objects.get(username='customer1')
    agent = BookingAgent(user)
    
    # 2. Mock service data (in Mumbai near provider1)
    service_data = {
        'latitude': 19.0762,
        'longitude': 72.8779,
        'service_type': 'TOWING',
        'description': 'Car broke down near BKC.'
    }
    
    # 3. Process booking via Agent
    print(f"Agent processing booking for {user.username}...")
    result = agent.process_booking(service_data)
    
    print(f"Result: {result}")
    
    if result['status'] == 'SUCCESS':
        print("Test Passed: Booking successfully handled by Agent.")
    else:
        print(f"Flow Status: {result['status']} - {result['message']}")

if __name__ == "__main__":
    test_booking_flow()
