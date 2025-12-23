Vehic-Aid Complete Technical Documentation
Table of Contents
Project Overview
Architecture
Database Schema
API Documentation
Core Algorithms
Business Logic
Deployment Guide
Security
Performance Optimization
Troubleshooting
1. Project Overview
What is Vehic-Aid?
Vehic-Aid is a comprehensive 24/7 roadside assistance platform designed for the Indian market, offering budget-friendly services with a focus on accessibility across all economic segments.

Key Features
Budget-Friendly Pricing: ₹70-500 tiered by vehicle type
Subscription Plans: FREE, STANDARD (₹499), PREMIUM (₹999)
Digital Wallet: Cashback and instant payments
Loyalty Rewards: Bronze/Silver/Gold tiers
Multilingual: 8 Indian languages
Real-time Tracking: GPS-based provider dispatch
24/7 Helpline: Premium subscriber support
Technology Stack
Backend: Django 4.2.14 + Django REST Framework
Database: PostgreSQL
Cache: Redis
Task Queue: Celery
WebSockets: Django Channels
Authentication: JWT (Simple JWT)
Payment: Razorpay integration
Maps: Google Maps Distance Matrix API
SMS: Fast2SMS gateway
2. Architecture
System Architecture
┌─────────────────────────────────────────────────────────────┐
│                     Client Applications                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Customer │  │ Provider │  │   Admin  │  │   IoT    │   │
│  │   App    │  │   App    │  │Dashboard │  │ Devices  │   │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘  └─────┬────┘   │
└────────┼─────────────┼─────────────┼─────────────┼─────────┘
         │             │             │             │
         └─────────────┴─────────────┴─────────────┘
                           │
         ┌─────────────────▼─────────────────┐
         │      Load Balancer (Nginx)        │
         └─────────────────┬─────────────────┘
                           │
         ┌─────────────────▼─────────────────┐
         │    Django Application Server      │
         │         (Gunicorn/Daphne)         │
         └───┬───────────┬──────────┬────────┘
             │           │          │
    ┌────────▼───┐  ┌───▼────┐  ┌──▼─────┐
    │ PostgreSQL │  │ Redis  │  │ Celery │
    │  Database  │  │ Cache  │  │ Worker │
    └────────────┘  └────────┘  └────────┘
Application Structure
01_backend/
├── apps/
│   ├── users/          # User management & authentication
│   ├── services/       # Core service logic
│   ├── payments/       # Payment processing
│   └── iot_devices/    # IoT device management
├── vehic_aid_backend/
│   ├── settings/       # Environment-specific settings
│   ├── middleware/     # Custom middleware
│   └── urls.py         # Main URL routing
├── web_admin/          # Admin dashboard
│   ├── templates/      # HTML templates
│   ├── static/         # CSS, JS, images
│   └── views.py        # Dashboard views
└── locale/             # Translation files
3. Database Schema
Core Models
User Models
CustomUser (AbstractUser)
├── email (unique)
├── phone_number
├── is_service_booker
├── is_service_provider
└── is_verified
ServiceBooker (OneToOne → CustomUser)
├── wallet → Wallet
├── rewards → RewardsProgram
└── subscriptions → UserSubscription[]
ServiceProvider (OneToOne → CustomUser)
├── average_rating
├── total_services
└── is_available
Service Models
ServiceRequest
├── booker → ServiceBooker
├── provider → ServiceProvider
├── service_type (TOWING, JUMPSTART, etc.)
├── status (PENDING, DISPATCHED, COMPLETED)
├── latitude, longitude
├── dynamic_price
└── created_at
Review
├── request → ServiceRequest
├── booker → ServiceBooker
├── provider → ServiceProvider
├── rating (1-5)
└── comment
Financial Models
SubscriptionPlan
├── name (FREE, STANDARD, PREMIUM)
├── price
├── duration_days
└── features
UserSubscription
├── user → ServiceBooker
├── plan → SubscriptionPlan
├── status (ACTIVE, EXPIRED, CANCELLED)
├── start_date, end_date
└── auto_renew
Wallet
├── user → ServiceBooker
├── balance
├── total_earned
└── total_spent
WalletTransaction
├── wallet → Wallet
├── transaction_type (CREDIT, DEBIT, REWARD)
├── amount
└── description
RewardsProgram
├── user → ServiceBooker
├── points
├── tier (BRONZE, SILVER, GOLD)
└── referral_code
RewardTransaction
├── rewards_program → RewardsProgram
├── points
├── transaction_type
└── description
Database Indexes
-- Performance indexes
CREATE INDEX idx_service_request_status ON services_servicerequest(status);
CREATE INDEX idx_service_request_created ON services_servicerequest(created_at DESC);
CREATE INDEX idx_subscription_active ON services_usersubscription(is_active, status);
CREATE INDEX idx_wallet_transactions ON services_wallettransaction(wallet_id, created_at DESC);
4. API Documentation
Base URL
Development: http://localhost:8000/api/v1/
Production: https://api.vehicaid.com/api/v1/
Authentication
POST /users/login/
Content-Type: application/json
{
  "username": "user@example.com",
  "password": "password123"
}
Response:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
Core Endpoints
Service Requests
# Create request
POST /services/request/
Authorization: Bearer <token>
{
  "service_type": "TOWING",
  "latitude": "28.6139",
  "longitude": "77.2090",
  "vehicle_type": "FOUR_WHEELER",
  "customer_notes": "Car broke down"
}
# Get status
GET /services/request/{id}/
Wallet Operations
# Get balance
GET /services/wallet/{user_id}/
# Add money
POST /services/wallet/add-money/
{
  "amount": "500.00"
}
# Get transactions
GET /services/wallet/transactions/
Rewards
# Get rewards
GET /services/rewards/{user_id}/
# Redeem points
POST /services/rewards/redeem/
{
  "points": 500
}
5. Core Algorithms
5.1 Dynamic Pricing Algorithm
def calculate_quote(service_type, provider_lat, provider_lng, 
                   customer_lat, customer_lng, vehicle_type, user_plan):
    """
    Calculate budget-friendly quote for Indian market.
    
    Algorithm:
    1. Get base price for service type and vehicle
    2. Calculate distance using Google Maps API
    3. Calculate distance charge (distance × per_km_rate)
    4. Apply surge pricing if peak hours
    5. Apply subscription discount
    6. Round to nearest rupee
    """
    
    # Step 1: Base price lookup
    base_prices = {
        "TWO_WHEELER": {"TOWING": 150, "JUMPSTART": 80, ...},
        "FOUR_WHEELER": {"TOWING": 300, "JUMPSTART": 150, ...},
        "SUV_LUXURY": {"TOWING": 500, "JUMPSTART": 250, ...}
    }
    base_price = base_prices[vehicle_type][service_type]
    
    # Step 2: Distance calculation
    distance_km = google_maps_distance(
        provider_lat, provider_lng,
        customer_lat, customer_lng
    )
    
    # Step 3: Distance charge
    per_km_rates = {
        "TWO_WHEELER": 5,
        "FOUR_WHEELER": 10,
        "SUV_LUXURY": 15
    }
    distance_charge = distance_km * per_km_rates[vehicle_type]
    
    # Step 4: Surge pricing
    surge_multiplier = get_surge_multiplier()  # 1.0 or 1.2
    subtotal = (base_price + distance_charge) * surge_multiplier
    
    # Step 5: Subscription discount
    discounts = {"FREE": 0, "STANDARD": 0.15, "PREMIUM": 0.25}
    discount = subtotal * discounts[user_plan]
    
    # Step 6: Final total
    total = round(subtotal - discount)
    
    return {
        "base_price": base_price,
        "distance_km": distance_km,
        "distance_charge": distance_charge,
        "surge_multiplier": surge_multiplier,
        "discount": discount,
        "total": total
    }
Time Complexity: O(1) for calculation + O(n) for Google Maps API call
Space Complexity: O(1)

5.2 Rewards Points Algorithm
def calculate_rewards(service_cost, user_tier, is_birthday=False):
    """
    Calculate loyalty points earned.
    
    Algorithm:
    1. Base points: 1 point per ₹10 spent
    2. Tier multiplier: Bronze=1x, Silver=1.5x, Gold=2x
    3. Birthday bonus: 2x points
    4. Update user tier based on total points
    """
    
    # Step 1: Base points
    base_points = int(service_cost / 10)
    
    # Step 2: Tier multiplier
    tier_multipliers = {
        "BRONZE": 1.0,
        "SILVER": 1.5,
        "GOLD": 2.0
    }
    points = base_points * tier_multipliers[user_tier]
    
    # Step 3: Birthday bonus
    if is_birthday:
        points *= 2
    
    # Step 4: Update tier
    total_points = user.rewards.points + points
    if total_points >= 1500:
        new_tier = "GOLD"
    elif total_points >= 500:
        new_tier = "SILVER"
    else:
        new_tier = "BRONZE"
    
    return int(points), new_tier
Time Complexity: O(1)
Space Complexity: O(1)

5.3 Provider Matching Algorithm
def find_nearest_provider(customer_lat, customer_lng, service_type):
    """
    Find nearest available provider using Haversine formula.
    
    Algorithm:
    1. Filter available providers by service type
    2. Calculate distance to each provider
    3. Sort by distance (ascending)
    4. Return top 5 nearest providers
    """
    
    from math import radians, sin, cos, sqrt, atan2
    
    # Step 1: Filter providers
    providers = ServiceProvider.objects.filter(
        is_available=True,
        service_types__contains=service_type
    )
    
    # Step 2 & 3: Calculate and sort by distance
    provider_distances = []
    for provider in providers:
        # Haversine formula
        R = 6371  # Earth radius in km
        lat1, lon1 = radians(customer_lat), radians(customer_lng)
        lat2, lon2 = radians(provider.latitude), radians(provider.longitude)
        
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * atan2(sqrt(a), sqrt(1-a))
        distance = R * c
        
        provider_distances.append((provider, distance))
    
    # Step 4: Sort and return top 5
    provider_distances.sort(key=lambda x: x[1])
    return provider_distances[:5]
Time Complexity: O(n log n) where n = number of available providers
Space Complexity: O(n)

6. Business Logic
Subscription Lifecycle
class UserSubscription(models.Model):
    def save(self, *args, **kwargs):
        """Auto-calculate end_date on creation."""
        if not self.pk and not self.end_date:
            self.end_date = self.start_date + timedelta(
                days=self.plan.duration_days
            )
        super().save(*args, **kwargs)
    
    def check_expiry(self):
        """Check if subscription has expired."""
        if self.end_date < timezone.now().date():
            self.status = 'EXPIRED'
            self.is_active = False
            self.save()
            return True
        return False
    
    def renew(self):
        """Renew subscription for another period."""
        if self.auto_renew:
            # Process payment
            payment_success = process_payment(
                self.user, self.plan.price
            )
            if payment_success:
                self.start_date = timezone.now().date()
                self.end_date = self.start_date + timedelta(
                    days=self.plan.duration_days
                )
                self.status = 'ACTIVE'
                self.is_active = True
                self.save()
                return True
        return False
Wallet Management
class Wallet(models.Model):
    def add_money(self, amount, description):
        """Add money to wallet with transaction log."""
        self.balance += amount
        self.save()
        
        WalletTransaction.objects.create(
            wallet=self,
            transaction_type='CREDIT',
            amount=amount,
            description=description
        )
    
    def deduct_money(self, amount, description):
        """Deduct money with balance check."""
        if self.balance >= amount:
            self.balance -= amount
            self.total_spent += amount
            self.save()
            
            WalletTransaction.objects.create(
                wallet=self,
                transaction_type='DEBIT',
                amount=amount,
                description=description
            )
            return True
        return False
7. Deployment Guide
Production Setup
1. Server Requirements
OS: Ubuntu 22.04 LTS
RAM: 4GB minimum, 8GB recommended
CPU: 2 cores minimum
Storage: 50GB SSD
Python: 3.11+
PostgreSQL: 14+
Redis: 7+
2. Installation Steps
# Update system
sudo apt update && sudo apt upgrade -y
# Install dependencies
sudo apt install python3.11 python3.11-venv python3-pip postgresql redis-server nginx -y
# Create project directory
sudo mkdir -p /var/www/vehic-aid
cd /var/www/vehic-aid
# Clone repository
git clone <your-repo-url> .
# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate
# Install requirements
pip install -r requirements.txt
# Setup environment
cp .env.prod.template .env.prod
nano .env.prod  # Fill in production values
# Collect static files
python manage.py collectstatic --noinput
# Run migrations
python manage.py migrate
# Create superuser
python manage.py createsuperuser
3. Gunicorn Configuration
# /etc/systemd/system/vehic-aid.service
[Unit]
Description=Vehic-Aid Gunicorn Service
After=network.target
[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/vehic-aid
Environment="PATH=/var/www/vehic-aid/venv/bin"
EnvironmentFile=/var/www/vehic-aid/.env.prod
ExecStart=/var/www/vehic-aid/venv/bin/gunicorn \
    --workers 4 \
    --bind unix:/var/www/vehic-aid/gunicorn.sock \
    vehic_aid_backend.wsgi:application
[Install]
WantedBy=multi-user.target
4. Nginx Configuration
# /etc/nginx/sites-available/vehic-aid
server {
    listen 80;
    server_name api.vehicaid.com;
    
    client_max_body_size 5M;
    
    location /static/ {
        alias /var/www/vehic-aid/staticfiles/;
    }
    
    location /media/ {
        alias /var/www/vehic-aid/media/;
    }
    
    location / {
        proxy_pass http://unix:/var/www/vehic-aid/gunicorn.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
5. Celery Worker
# /etc/systemd/system/vehic-aid-celery.service
[Unit]
Description=Vehic-Aid Celery Worker
After=network.target
[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/vehic-aid
Environment="PATH=/var/www/vehic-aid/venv/bin"
EnvironmentFile=/var/www/vehic-aid/.env.prod
ExecStart=/var/www/vehic-aid/venv/bin/celery -A vehic_aid_backend worker -l info
[Install]
WantedBy=multi-user.target
6. Start Services
# Enable and start services
sudo systemctl enable vehic-aid vehic-aid-celery
sudo systemctl start vehic-aid vehic-aid-celery
sudo systemctl enable nginx
sudo systemctl restart nginx
# Check status
sudo systemctl status vehic-aid
sudo systemctl status vehic-aid-celery
8. Security
Security Features Implemented
HTTPS Enforcement (Production)
JWT Authentication with token refresh
CORS Protection with whitelist
SQL Injection Prevention (Django ORM)
XSS Protection (Django templates)
CSRF Protection enabled
Rate Limiting on API endpoints
Password Hashing (PBKDF2)
Secure Headers (HSTS, X-Frame-Options)
Environment Variables for secrets
Security Best Practices
# settings/production.py
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
X_FRAME_OPTIONS = 'DENY'
9. Performance Optimization
Caching Strategy
# Cache expensive queries
from django.core.cache import cache
def get_active_subscriptions(user_id):
    cache_key = f'user_{user_id}_subscriptions'
    subscriptions = cache.get(cache_key)
    
    if not subscriptions:
        subscriptions = UserSubscription.objects.filter(
            user_id=user_id,
            is_active=True
        ).select_related('plan')
        cache.set(cache_key, subscriptions, 300)  # 5 min
    
    return subscriptions
Database Optimization
# Use select_related for foreign keys
requests = ServiceRequest.objects.select_related(
    'booker', 'provider'
).all()
# Use prefetch_related for many-to-many
users = ServiceBooker.objects.prefetch_related(
    'subscriptions', 'wallet__transactions'
).all()
# Use only() to fetch specific fields
users = CustomUser.objects.only('id', 'username', 'email')
10. Troubleshooting
Common Issues
Issue: Database connection error
Solution: Check PostgreSQL service and credentials in .env

Issue: Redis connection failed
Solution: Ensure Redis is running: sudo systemctl start redis

Issue: Static files not loading
Solution: Run python manage.py collectstatic

Issue: Celery tasks not executing
Solution: Check Celery worker status and Redis connection

Appendix
Useful Commands
# Development
python manage.py runserver
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
# Production
gunicorn vehic_aid_backend.wsgi:application
celery -A vehic_aid_backend worker -l info
python manage.py collectstatic --noinput
# Testing
pytest
pytest apps/services/tests/
# Database
python manage.py dbshell
python manage.py dumpdata > backup.json
python manage.py loaddata backup.json
Document Version: 1.0
Last Updated: November 24, 2025
