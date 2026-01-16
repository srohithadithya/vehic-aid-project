"""
Seed script to populate the database with precise test data:
- 4 Booker Users (Free, Basic, Premium, Elite)
- 4 Service Providers
- 4 Service Requests (1 per user, linked to different providers)
- 4 Subscription Plans (Free, Basic, Premium, Elite)
"""

import os
import django
from decimal import Decimal
from datetime import datetime, timedelta
from django.utils import timezone

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vehic_aid_backend.settings.development")
django.setup()

from django.core.management import call_command
from django.contrib.auth import get_user_model
from apps.users.models import ServiceBooker, ServiceProvider
from apps.services.models import Vehicle, ServiceRequest, SubscriptionPlan, UserSubscription
from apps.payments.models import Transaction

User = get_user_model()

print("🧹 Flushing database...")
call_command('flush', interactive=False)
print("✅ Database flushed.")

# ------------------------------------------------------------------
# 1. Create Superuser
# ------------------------------------------------------------------
print("\nAdmin...")
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@vehicaid.com',
        password='admin123',
        phone_number='+910000000000',
        is_service_booker=True,
        is_service_provider=True
    )
print("Created: admin/admin123")

# ------------------------------------------------------------------
# 2. Create Plans
# ------------------------------------------------------------------
print("\nCreating Plans...")
plans = {}
plan_defs = [
    ('FREE', 'Free Access', 0, 0, 'Pay-per-use services'),
    ('BASIC', 'Basic Plan', 99, 30, 'Discounted towing, Priority'),
    ('PREMIUM', 'Premium Plan', 199, 30, 'Free towing (50km), Helpline'),
    ('ELITE', 'Elite Plan', 499, 30, 'Unlimited towing, VIP support, Exchange'),
]

for code, name, price, days, feats in plan_defs:
    plan = SubscriptionPlan.objects.create(
        name=code,  # Using code as name match model choices
        price=Decimal(price),
        duration_days=days,
        features=[feats],
        description=name
    )
    plans[code] = plan
    print(f"Plan Created: {name} (₹{price})")

# ------------------------------------------------------------------
# 3. Create Bookers (1 per plan)
# ------------------------------------------------------------------
print("\nCreating Bookers...")
bookers = []
booker_defs = [
    ('user_free', 'Free User', 'FREE'),
    ('user_basic', 'Basic User', 'BASIC'),
    ('user_premium', 'Premium User', 'PREMIUM'),
    ('user_elite', 'Elite User', 'ELITE'),
]

for i, (username, full_name, plan_code) in enumerate(booker_defs):
    user = User.objects.create_user(
        username=username,
        email=f'{username}@test.com',
        password='password123',
        phone_number=f'+91900000000{i+1}',
        first_name=full_name.split()[0],
        last_name=full_name.split()[1],
        is_service_booker=True
    )
    booker = ServiceBooker.objects.create(user=user)
    bookers.append(booker)
    
    # Subscription
    if plan_code != 'FREE':
        UserSubscription.objects.create(
            user=booker,
            plan=plans[plan_code],
            start_date=timezone.now().date(),
            end_date=timezone.now().date() + timedelta(days=30),
            is_active=True,
            status='ACTIVE'
        )
        print(f"User Created: {username} -> {plan_code}")
    else:
        print(f"User Created: {username} -> FREE (No Sub)")

# ------------------------------------------------------------------
# 4. Create Vehicles (1 per booker)
# ------------------------------------------------------------------
print("\nCreating Vehicles...")
vehicles = []
vehicle_data = [
    # 2 Four Wheelers
    ('Maruti', 'Swift', 'FOUR_WHEELER'),
    ('Hyundai', 'i20', 'FOUR_WHEELER'),
    # 2 Two Wheelers
    ('Honda', 'Activa', 'TWO_WHEELER'),
    ('Royal Enfield', 'Classic 350', 'TWO_WHEELER')
]
for i, booker in enumerate(bookers):
    v = Vehicle.objects.create(
        owner=booker.user,
        make=vehicle_data[i][0],
        model=vehicle_data[i][1],
        license_plate=f"MH0{i+1}AB{1000+i}",
        fuel_type='PETROL',
        vehicle_type=vehicle_data[i][2]  # Added vehicle type
    )
    vehicles.append(v)
    print(f"Vehicle: {v.license_plate} ({v.vehicle_type}) -> {booker.user.username}")

# ------------------------------------------------------------------
# 5. Create Providers
# ------------------------------------------------------------------
print("\nCreating Providers...")
providers = []
prov_defs = [
    ('prov_tow', 'Towing Expert', 'TOWING'),
    ('prov_mech', 'Mechanic Pro', 'FLAT_TIRE'),
    ('prov_bat', 'Battery King', 'BATTERY_JUMP'),
    ('prov_gen', 'General Aid', 'FUEL_DELIVERY'),
]

for i, (username, name, service) in enumerate(prov_defs):
    u = User.objects.create_user(
        username=username,
        email=f'{username}@test.com',
        password='password123',
        phone_number=f'+91910000000{i+1}',
        first_name=name.split()[0],
        last_name=name.split()[1],
        is_service_provider=True
    )
    p = ServiceProvider.objects.create(
        user=u,
        is_verified=True,
        is_available=True,
        service_types=[service],
        latitude=12.9716 + (i * 0.01),
        longitude=77.5946 + (i * 0.01),
        average_rating=4.5 + (i * 0.1),
        jobs_completed=12 + (i * 5)
    )
    providers.append(p)
    print(f"Provider: {username} ({service})")

# ------------------------------------------------------------------
# 6. Create Service Requests (1 per Booker -> 1 Provider)
# ------------------------------------------------------------------
print("\nCreating Service Requests & Links...")
req_defs = [
    (bookers[0], vehicles[0], providers[0], 'TOWING', 'COMPLETED'),
    (bookers[1], vehicles[1], providers[1], 'FLAT_TIRE', 'COMPLETED'),
    (bookers[2], vehicles[2], providers[2], 'BATTERY_JUMP', 'SERVICE_IN_PROGRESS'),
    (bookers[3], vehicles[3], providers[3], 'FUEL_DELIVERY', 'PENDING_DISPATCH'),
]

for i, (booker, vehicle, provider, service, status) in enumerate(req_defs):
    req = ServiceRequest.objects.create(
        booker=booker.user,
        vehicle=vehicle,
        provider=provider.user,
        service_type=service,
        status=status,
        latitude=provider.latitude,
        longitude=provider.longitude,
        customer_notes=f"Issue #{i+1} for {service}",
        priority='HIGH' if status == 'PENDING_DISPATCH' else 'MEDIUM'
    )
    print(f"Request: #{req.id} {booker.user.username} -> {provider.user.username} ({status})")

    # If completed, add transaction
    if status == 'COMPLETED':
        Transaction.objects.create(
            service_request=req,
            booker=booker,
            provider=provider,
            amount=Decimal('500.00'),
            platform_commission=Decimal('50.00'),
            provider_payout_amount=Decimal('450.00'),
            status='SUCCESS',
            payment_method='UPI'
        )
        print("   -> Payment Created")

print("\n✅ SEEDING COMPLETE")
