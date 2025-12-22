"""
Seed script to populate the database with test data for Vehic-Aid platform.
Run with: python manage.py shell < seed_data.py
"""

import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vehic_aid_backend.settings.development")
django.setup()

from django.contrib.auth import get_user_model
from apps.users.models import ServiceBooker, ServiceProvider
from apps.services.models import Vehicle
from apps.services.models import ServiceRequest, SubscriptionPlan, UserSubscription
from apps.payments.models import Transaction
from apps.iot_devices.models import IoTDevice
from decimal import Decimal
from datetime import datetime, timedelta
from django.utils import timezone

User = get_user_model()

print("Starting database seeding...")

# Create superuser
print("\nCreating superuser...")
if not User.objects.filter(username='admin').exists():
    admin = User.objects.create_superuser(
        username='admin',
        email='admin@vehicaid.com',
        password='admin123',
        phone_number='+919876543210',
        is_service_booker=False,
        is_service_provider=False,
    )
    print("Superuser created: admin/admin123")
else:
    admin = User.objects.get(username='admin')
    print("Superuser already exists")

# Create test customers
print("\nCreating test customers...")
customers_data = [
    {'username': 'customer1', 'email': 'customer1@test.com', 'phone': '+919876543211', 'name': 'Rajesh Kumar', 'lang': 'hi'},
    {'username': 'customer2', 'email': 'customer2@test.com', 'phone': '+919876543212', 'name': 'Priya Sharma', 'lang': 'ta'},
    {'username': 'customer3', 'email': 'customer3@test.com', 'phone': '+919876543213', 'name': 'Amit Patel', 'lang': 'gu'},
]

customers = []
for data in customers_data:
    if not User.objects.filter(username=data['username']).exists():
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password='password123',
            phone_number=data['phone'],
            is_service_booker=True,
            is_service_provider=False,
        )
        booker, created = ServiceBooker.objects.get_or_create(
            user=user,
            defaults={'preferred_language': data.get('lang', 'en')}
        )
        customers.append(booker)
        print(f"Created/Fetched customer: {data['username']} (Lang: {booker.preferred_language})")
    else:
        user = User.objects.get(username=data['username'])
        booker = ServiceBooker.objects.get(user=user)
        customers.append(booker)
        print(f"Customer exists: {data['username']}")

# Create test providers
print("\nCreating test providers...")
providers_data = [
    {'username': 'provider1', 'email': 'provider1@test.com', 'phone': '+919876543221', 'name': 'Suresh Mechanic', 'service': 'TOWING', 'lat': 19.0760, 'lon': 72.8777},
    {'username': 'provider2', 'email': 'provider2@test.com', 'phone': '+919876543222', 'name': 'Ramesh Repairs', 'service': 'FLAT_TIRE', 'lat': 19.1000, 'lon': 72.9000},
    {'username': 'provider3', 'email': 'provider3@test.com', 'phone': '+919876543223', 'name': 'Vijay Services', 'service': 'BATTERY_JUMP', 'lat': 18.9000, 'lon': 72.8000},
]

providers = []
for data in providers_data:
    if not User.objects.filter(username=data['username']).exists():
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password='password123',
            phone_number=data['phone'],
            is_service_booker=False,
            is_service_provider=True,
        )
        provider, created = ServiceProvider.objects.get_or_create(
            user=user,
            defaults={
                'service_types': [data['service']],
                'is_verified': True,
                'is_available': True,
                'average_rating': 4.5,
                'latitude': data.get('lat'),
                'longitude': data.get('lon')
            }
        )
        providers.append(provider)
        print(f"Created/Fetched provider: {data['username']} at ({data.get('lat')}, {data.get('lon')})")
    else:
        user = User.objects.get(username=data['username'])
        provider = ServiceProvider.objects.get(user=user)
        providers.append(provider)
        print(f"Provider exists: {data['username']}")

# Create vehicles for customers
print("\nCreating test vehicles...")
vehicles_data = [
    {'booker': customers[0], 'make': 'Maruti', 'model': 'Swift', 'year': 2020, 'reg': 'MH01AB1234'},
    {'booker': customers[0], 'make': 'Hyundai', 'model': 'i20', 'year': 2021, 'reg': 'MH01CD5678'},
    {'booker': customers[1], 'make': 'Honda', 'model': 'City', 'year': 2019, 'reg': 'MH02EF9012'},
    {'booker': customers[2], 'make': 'Tata', 'model': 'Nexon', 'year': 2022, 'reg': 'MH03GH3456'},
]

vehicles = []
for data in vehicles_data:
    print(f"DEBUG: Vehicle fields: {[f.name for f in Vehicle._meta.get_fields()]}")
    if not Vehicle.objects.filter(license_plate=data['reg']).exists():
        vehicle = Vehicle.objects.create(
            owner=data['booker'].user,
            make=data['make'],
            model=data['model'],
            license_plate=data['reg'],
            fuel_type='PETROL'
        )
        vehicles.append(vehicle)
        print(f"Created vehicle: {data['reg']}")
    else:
        vehicle = Vehicle.objects.get(license_plate=data['reg'])
        vehicles.append(vehicle)
        print(f"Vehicle exists: {data['reg']}")

# Create subscription plans
print("\nCreating subscription plans...")
plans_data = [
    {'name': 'Basic', 'price': 499, 'duration': 30, 'features': 'Unlimited towing within 50km, 24/7 helpline'},
    {'name': 'Premium', 'price': 999, 'duration': 30, 'features': 'Unlimited towing within 100km, Priority support, Free battery jump'},
    {'name': 'Gold', 'price': 1999, 'duration': 90, 'features': 'Unlimited towing within 200km, VIP support, All services included'},
]

plans = []
for data in plans_data:
    plan, created = SubscriptionPlan.objects.get_or_create(
        name=data['name'],
        defaults={
            'price': Decimal(data['price']),
            'duration_days': data['duration'],
            'features': data['features']
        }
    )
    plans.append(plan)
    if created:
        print(f"Created plan: {data['name']}")
    else:
        print(f"Plan exists: {data['name']}")

# Create service requests
print("\nCreating service requests...")
requests_data = [
    {'booker': customers[0], 'vehicle': vehicles[0], 'provider': providers[0], 'service': 'TOWING', 'status': 'COMPLETED'},
    {'booker': customers[0], 'vehicle': vehicles[1], 'provider': providers[1], 'service': 'FLAT_TIRE', 'status': 'PENDING'},
    {'booker': customers[1], 'vehicle': vehicles[2], 'provider': providers[2], 'service': 'BATTERY_JUMP', 'status': 'IN_PROGRESS'},
    {'booker': customers[2], 'vehicle': vehicles[3], 'provider': providers[0], 'service': 'TOWING', 'status': 'COMPLETED'},
]

service_requests = []
for idx, data in enumerate(requests_data):
    if ServiceRequest.objects.filter(booker=data['booker'].user).count() < 2:
        request = ServiceRequest.objects.create(
            booker=data['booker'].user,
            provider=data['provider'].user,
            service_type=data['service'],
            status=data['status'],
            latitude=19.0760,
            longitude=72.8777,
            customer_notes=f'Test service request {idx+1}',
            priority='HIGH'
        )
        service_requests.append(request)
        print(f"Created service request #{request.id}")
    else:
        print(f"Service requests exist for {data['booker'].user.username}")

# Create payments
print("\nCreating payment records...")
if not service_requests:
    service_requests = ServiceRequest.objects.all()

for request in service_requests:
    if request.status == 'COMPLETED':
        print(f"DEBUG: Processing request {request.id}")
        print(f"DEBUG: request.booker: {request.booker} (type: {type(request.booker)})")
        try:
            print(f"DEBUG: request.booker.servicebooker: {request.booker.servicebooker} (type: {type(request.booker.servicebooker)})")
        except Exception as e:
            print(f"DEBUG: Error accessing servicebooker: {e}")

        if not Transaction.objects.filter(service_request=request).exists():
            try:
                payment = Transaction.objects.create(
                    booker=request.booker.servicebooker,
                    provider=request.provider.serviceprovider,
                    service_request=request,
                    amount=Decimal('500.00'),
                    payment_method='UPI',
                    status='SUCCESS',
                    platform_fee=Decimal('100.00'),
                    provider_payout=Decimal('400.00')
                )
                print(f"Created payment for request #{request.id}")
            except Exception as e:
                print(f"Error creating payment for request {request.id}: {e}")

# Create user subscriptions
print("\nCreating user subscriptions...")
for idx, customer in enumerate(customers[:2]):
    if not UserSubscription.objects.filter(user=customer).exists():
        subscription = UserSubscription.objects.create(
            user=customer,
            plan=plans[idx],
            start_date=timezone.now().date(),
            end_date=(timezone.now() + timedelta(days=plans[idx].duration_days)).date(),
            is_active=True,
            auto_renew=True
        )
        print(f"Created subscription for {customer.user.username}")
        print(f"Subscription exists for {customer.user.username}")

# Create IoT Devices
print("\nCreating IoT devices...")
for idx, customer in enumerate(customers[:1]):
    device_id = f"IOT-DEV-{idx+1000}"
    if not IoTDevice.objects.filter(device_id=device_id).exists():
        device = IoTDevice.objects.create(
            device_id=device_id,
            paired_user=customer,
            is_active=True,
            last_known_latitude=19.0760,
            last_known_longitude=72.8777
        )
        print(f"Created IoT device: {device_id} for {customer.user.username}")
    else:
        print(f"IoT device exists: {device_id}")

print("\nDatabase seeding completed successfully!")
print("\nSummary:")
print(f"   - Users: {User.objects.count()}")
print(f"   - Customers: {ServiceBooker.objects.count()}")
print(f"   - Providers: {ServiceProvider.objects.count()}")
print(f"   - Vehicles: {Vehicle.objects.count()}")
print(f"   - Service Requests: {ServiceRequest.objects.count()}")
print(f"   - Payments: {Transaction.objects.count()}")
print(f"   - Subscription Plans: {SubscriptionPlan.objects.count()}")
print(f"   - User Subscriptions: {UserSubscription.objects.count()}")
print("\nLogin credentials:")
print("   Admin: admin / admin123")
print("   Customer: customer1 / password123")
print("   Provider: provider1 / password123")
