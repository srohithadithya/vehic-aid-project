
import os
import django
import sys
from decimal import Decimal
from django.utils import timezone

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vehic_aid_backend.settings.development")
django.setup()

from apps.services.models import ServiceRequest, Vehicle
from apps.users.models import ServiceBooker, ServiceProvider
from apps.payments.models import Transaction
from django.contrib.auth import get_user_model

User = get_user_model()

def fix_data():
    print("Starting data fix...")
    
    # 1. Ensure we have at least one Booker and Provider
    booker_user = User.objects.filter(username='customer1').first()
    if not booker_user:
        print("Creating customer1")
        booker_user = User.objects.create_user('customer1', 'c1@test.com', 'password123', is_service_booker=True)
    
    if not hasattr(booker_user, 'servicebooker'):
        ServiceBooker.objects.create(user=booker_user)
    booker = booker_user.servicebooker

    provider_user = User.objects.filter(username='provider1').first()
    if not provider_user:
        print("Creating provider1")
        provider_user = User.objects.create_user('provider1', 'p1@test.com', 'password123', is_service_provider=True)
    
    if not hasattr(provider_user, 'serviceprovider'):
        ServiceProvider.objects.create(user=provider_user, is_verified=True)
    provider = provider_user.serviceprovider

    # 2. Ensure Vehicle
    vehicle = Vehicle.objects.first()
    if not vehicle:
        print("Creating vehicle")
        vehicle = Vehicle.objects.create(owner=booker_user, make="TestMake", model="TestModel", license_plate="TEST-1234")

    # 3. Create COMPLETED Service Request
    print("Creating/Updating Service Requests...")
    req_counts = ServiceRequest.objects.count()
    print(f"Current Request Count: {req_counts}")

    if req_counts == 0:
        req = ServiceRequest.objects.create(
            booker=booker_user,
            provider=provider_user,
            vehicle=vehicle,
            service_type='TOWING',
            status='COMPLETED',
            latitude=19.0,
            longitude=72.0
        )
        print(f"Created new COMPLETED request {req.id}")
    else:
        req = ServiceRequest.objects.first()
        req.status = 'COMPLETED'
        req.save()
        print(f"Updated request {req.id} to COMPLETED")

    # 4. Create Transaction
    print("Creating Transaction...")
    if not Transaction.objects.filter(service_request=req).exists():
        try:
            trx = Transaction.objects.create(
                booker=booker,
                provider=provider,
                service_request=req,
                amount=Decimal('500.00'),
                payment_method='UPI',
                status='SUCCESS',
                platform_fee=Decimal('50.00'),
                provider_payout=Decimal('450.00'),
                transaction_id=f"FIX_{req.id}_{int(timezone.now().timestamp())}"
            )
            print(f"SUCCESS: Created Transaction {trx.id} for Request {req.id}")
        except Exception as e:
            print(f"FAILED to create transaction: {e}")
    else:
        print(f"Transaction already exists for Request {req.id}")

    # 5. Verify counts
    print(f"Total Transactions: {Transaction.objects.count()}")

if __name__ == "__main__":
    fix_data()
