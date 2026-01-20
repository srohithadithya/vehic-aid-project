# VehicAid - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Environment Setup](#environment-setup)
5. [API Documentation](#api-documentation)
6. [Algorithms & Formulas](#algorithms--formulas)
7. [Features & Capabilities](#features--capabilities)
8. [Database Schema](#database-schema)
9. [Deployment Guide](#deployment-guide)
9. [Deployment Guide](#deployment-guide)
10. [Future Roadmap](#future-roadmap)
11. [Public Stats](#public-stats)

---

## Project Overview

### What is VehicAid?

**VehicAid** is India's most comprehensive roadside assistance platform that connects vehicle owners (Bookers) with verified service providers in real-time. The platform leverages AI-powered triage, dynamic pricing, and IoT integration to deliver rapid, affordable, and reliable roadside assistance across all vehicle types.

### Mission Statement
To democratize roadside assistance in India by making it accessible, affordable, and efficient for all vehicle owners, from two-wheelers to commercial trucks.

### Core Value Propositions
1. **Speed**: Average 15-minute response time
2. **Affordability**: Budget-friendly pricing starting at ₹49
3. **Coverage**: Pan-India network with 1000+ verified providers
4. **Technology**: AI-powered dispatch, real-time tracking, IoT integration
5. **Transparency**: Dynamic pricing with upfront quotes
6. **Inclusivity**: Support for 6 vehicle types (Two-wheeler to Commercial Truck)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT APPLICATIONS                      │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  Web Admin   │ Web Provider │  Web Booker  │ Mobile Apps    │
│  (Next.js)   │  (Next.js)   │  (Next.js)   │ (React Native) │
└──────┬───────┴──────┬───────┴──────┬───────┴────────┬───────┘
       │              │              │                │
       └──────────────┴──────────────┴────────────────┘
                      │
       ┌──────────────▼──────────────────────────┐
       │         API Gateway (Django)            │
       │    REST API + WebSocket (Channels)      │
       └──────────────┬──────────────────────────┘
                      │
       ┌──────────────▼──────────────────────────┐
       │         Business Logic Layer            │
       ├─────────────────────────────────────────┤
        │  • AutoMind (Groq-Powered Intelligence)  │
        │  • Dispatch Logic (Smart Matching)      │
        │  • Pricing Service (Dynamic Quotes)     │
       │  • Notification Service (Push/SMS)      │
       └──────────────┬──────────────────────────┘
                      │
       ┌──────────────▼──────────────────────────┐
       │          Data & Services Layer          │
       ├─────────────────────────────────────────┤
       │  PostgreSQL  │  Redis   │  Celery       │
       │  (Primary DB)│ (Cache)  │ (Task Queue)  │
       └──────────────┴──────────┴───────────────┘
                      │
       ┌──────────────▼──────────────────────────┐
       │        External Integrations            │
       ├─────────────────────────────────────────┤
       │  • Google Maps API (Distance/Routing)   │
       │  • Razorpay (Payments)                  │
       │  • Firebase (Push Notifications)        │
       │  • SMS Gateway (OTP/Alerts)             │
       └─────────────────────────────────────────┘
```

### Component Breakdown

#### 1. **Frontend Applications**
- **Web Admin Panel** (`web/admin/`): Platform management, analytics, user oversight
- **Web Provider Panel** (`web/provider/`): Job management, earnings tracking
- **Web Booker Panel** (`web/booker/`): Service booking, subscription management
- **Mobile Apps** (`mobile/booker/`, `mobile/provider/`): Native mobile experience

#### 2. **Backend Services**
- **Django REST Framework**: Core API server
- **Django Channels**: WebSocket support for real-time features
- **Celery**: Asynchronous task processing
- **Redis**: Caching and message broker

#### 3. **Data Layer**
- **PostgreSQL**: Primary relational database
- **Redis**: Session storage, caching, real-time data

---

## Technology Stack

### Backend Stack

| Technology | Version | Purpose | Why We Use It |
|------------|---------|---------|---------------|
| **Python** | 3.11+ | Core Language | Mature ecosystem, excellent for AI/ML integration |
| **Django** | 5.2.10 | Web Framework | Batteries-included, ORM, admin panel, security |
| **Django REST Framework** | 3.16.1 | API Framework | Powerful serialization, authentication, browsable API |
| **Django Channels** | 4.3.2 | WebSocket Support | Real-time bidirectional communication |
| **Celery** | 5.6.2 | Task Queue | Async processing, scheduled tasks, background jobs |
| **PostgreSQL** | 14+ | Primary Database | ACID compliance, JSON support, spatial queries |
| **Redis** | 7+ | Cache & Broker | In-memory speed, pub/sub, session storage |
| **Daphne** | 4.2.1 | ASGI Server | Production-ready async server for Channels |

### Frontend Stack

| Technology | Version | Purpose | Why We Use It |
|------------|---------|---------|---------------|
| **Next.js** | 15.1.0 | React Framework | SSR, routing, optimization, TypeScript support |
| **React** | 19+ | UI Library | Component-based, virtual DOM, rich ecosystem |
| **TypeScript** | 5+ | Type Safety | Catch errors early, better IDE support, maintainability |
| **Tailwind CSS** | 3+ | Styling | Utility-first, responsive, consistent design |
| **Framer Motion** | 11+ | Animations | Smooth transitions, gesture support |
| **shadcn/ui** | Latest | Component Library | Accessible, customizable, modern components |

### Mobile Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Native** | 0.76+ | Mobile Framework |
| **Expo** | 52+ | Development Platform |
| **TypeScript** | 5+ | Type Safety |
| **React Navigation** | 7+ | Navigation |

### External APIs & Services

| Service | Purpose | Usage |
|---------|---------|-------|
| **Google Maps Distance Matrix API** | Distance calculation, routing | Provider dispatch, pricing |
| **Razorpay** | Payment processing | Subscription payments, service fees |
| **Firebase Cloud Messaging** | Push notifications | Real-time alerts to mobile apps |
| **Fast2SMS** | SMS Gateway | OTP, alerts, notifications | Free tier (50/day), Indian market focused |

---

## Environment Setup

### Prerequisites

```bash
# System Requirements
- Python 3.11 or higher
- Node.js 20 or higher
- PostgreSQL 14 or higher
- Redis 7 or higher
- Docker & Docker Compose (for containerized setup)
```

### Backend Setup

#### 1. **Clone Repository**
```bash
git clone https://github.com/yourusername/vehic-aid-project.git
cd vehic-aid-project
```

#### 2. **Create Virtual Environment**
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

#### 3. **Install Dependencies**
```bash
pip install -r requirements.txt
```

#### 4. **Environment Variables**
Create `backend/.env`:
```env
# Database Configuration
DATABASE_URL=postgresql://vehicaid_user:password@localhost:5432/vehicaid
DB_NAME=vehicaid
DB_USER=vehicaid_user
DB_PASSWORD=your_secure_password

# Django Settings
SECRET_KEY=your-secret-key-here-min-50-chars
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3003

# Redis Configuration
REDIS_URL=redis://localhost:6379/1
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# External APIs
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
FIREBASE_CREDENTIALS_PATH=path/to/firebase-credentials.json
FAST2SMS_API_KEY=your_fast2sms_api_key
SMS_PROVIDER=fast2sms
```

#### 5. **Database Setup**
```bash
# Create PostgreSQL database
createdb vehicaid

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Seed initial data
python seed_data.py
```

#### 6. **Run Development Server**
```bash
# Terminal 1: Django Server
python manage.py runserver 8001

# Terminal 2: Celery Worker
celery -A vehic_aid_backend worker -l info

# Terminal 3: Celery Beat (Scheduled Tasks)
celery -A vehic_aid_backend beat -l info
```

### Frontend Setup

#### Web Applications

```bash
# Admin Panel
cd web/admin
npm install
npm run dev  # Runs on http://localhost:3000

# Provider Panel
cd web/provider
npm install
npm run dev  # Runs on http://localhost:3001

# Booker Panel
cd web/booker
npm install
npm run dev  # Runs on http://localhost:3003
```

#### Environment Variables for Web Apps
Create `.env.local` in each web app directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1
```

#### Mobile Applications

```bash
# Booker App
cd mobile/booker
npm install
npx expo start

# Provider App
cd mobile/provider
npm install
npx expo start
```

### Docker Setup (Recommended for Production-like Environment)

```bash
# From project root
cd infrastructure

# Start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Reset everything (including volumes)
docker-compose down -v
```

---

## API Documentation

### Base URL
- **Development**: `http://localhost:8001/api/v1`
- **Production**: `https://your-domain.com/api/v1`

### Authentication

#### JWT Token Authentication
```http
POST /auth/token/
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
```

#### Using Tokens
```http
GET /services/request/
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

### Core API Endpoints

#### 1. **Service Requests**

**Create Service Request**
```http
POST /services/request/
Authorization: Bearer {token}
Content-Type: application/json

{
  "service_type": "TOWING",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "customer_notes": "Near MG Road metro station",
  "vehicle": 1
}

Response: 201 Created
{
  "id": 42,
  "status": "DISPATCHED",
  "message": "Service requested and dispatch initiated."
}
```

**Get Request Status**
```http
GET /services/request/{request_id}/
Authorization: Bearer {token}

Response: 200 OK
{
  "id": 42,
  "service_type": "TOWING",
  "status": "DISPATCHED",
  "provider_id": 15,
  "created_at": "2026-01-19T10:30:00Z",
  "provider_location": null
}
```

#### 2. **Agentic Booking (AI-Powered)**

```http
POST /services/agentic-booking/
Authorization: Bearer {token}
Content-Type: application/json

{
  "latitude": 12.9716,
  "longitude": 77.5946,
  "service_type": "TOWING",
  "description": "Car stuck in ditch, need flatbed"
}

Response: 201 Created
{
  "status": "SUCCESS",
  "request_id": 43,
  "message": "Service request processed and provider assigned.",
  "dispatch_details": {
    "status": "DISPATCHED",
    "provider_id": 15,
    "quote_id": 28,
    "total_amount": "349.00"
  }
}
```

#### 3. **Subscriptions**

**Get Available Plans**
```http
GET /services/subscriptions/plans/
# No authentication required (public endpoint)

Response: 200 OK
[
  {
    "id": 1,
    "name": "Free Plan",
    "price": "0.00",
    "duration_days": 3650,
    "features": ["Standard access", "Pay-per-use"],
    "description": "Free Plan"
  },
  {
    "id": 2,
    "name": "Basic Plan",
    "price": "99.00",
    "duration_days": 45,
    "features": ["Discounted towing", "Priority"],
    "description": "Basic Plan"
  }
]
```

**Get Current Subscription**
```http
GET /services/subscriptions/current/
Authorization: Bearer {token}

Response: 200 OK
{
  "id": 5,
  "plan": {
    "id": 2,
    "name": "Basic Plan",
    "price": "99.00"
  },
  "start_date": "2026-01-01T00:00:00Z",
  "end_date": "2026-01-31T23:59:59Z",
  "is_active": true,
  "status": "ACTIVE"
}
```

**Subscribe to Plan**
```http
POST /services/subscriptions/
Authorization: Bearer {token}
Content-Type: application/json

{
  "plan": 2,
  "auto_renew": true
}

Response: 201 Created
{
  "id": 6,
  "plan": 2,
  "status": "PENDING",
  "is_active": false
}
```

#### 4. **Chat Messages**

**Get Chat Messages**
```http
GET /services/chat/?request_id=42
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 1,
    "sender": 10,
    "sender_name": "John Doe",
    "message": "I'm on my way, ETA 10 minutes",
    "is_read": true,
    "is_me": false,
    "created_at": "2026-01-19T10:35:00Z"
  }
]
```

**Send Chat Message**
```http
POST /services/chat/
Authorization: Bearer {token}
Content-Type: application/json

{
  "request": 42,
  "message": "Great, I'll be waiting near the gate"
}

Response: 201 Created
{
  "id": 2,
  "message": "Great, I'll be waiting near the gate",
  "created_at": "2026-01-19T10:36:00Z"
}
```

#### 5. **Provider Endpoints**

**Get Available Jobs**
```http
GET /services/provider/jobs/available/
Authorization: Bearer {provider_token}

Response: 200 OK
[
  {
    "id": 42,
    "service_type": "TOWING",
    "latitude": "12.97160000",
    "longitude": "77.59460000",
    "distance_km": 3.5,
    "created_at": "2026-01-19T10:30:00Z"
  }
]
```

**Accept Job**
```http
POST /services/provider/jobs/42/accept/
Authorization: Bearer {provider_token}

Response: 200 OK
{
  "status": "Job accepted",
  "job_id": 42
}
```

**Update Location**
```http
POST /services/provider/location-update/
Authorization: Bearer {provider_token}
Content-Type: application/json

{
  "latitude": 12.9800,
  "longitude": 77.6000
}

Response: 200 OK
{
  "status": "Location updated successfully."
}
```

#### 6. **Admin Analytics**

**Dashboard Stats**
```http
GET /services/admin/dashboard-stats/
Authorization: Bearer {admin_token}

Response: 200 OK
{
  "bookings": {
    "total": 1250,
    "active": 45,
    "completed_today": 23,
    "growth": "+12.5%"
  },
  "providers": {
    "total": 156,
    "online": 89,
    "growth": "+8"
  },
  "financials": {
    "total_revenue": 125000.00,
    "growth": "+18.2%",
    "velocity_data": [...]
  }
}
```

**AI Monitor Stats**
```http
GET /services/admin/ai-stats/
Authorization: Bearer {admin_token}

Response: 200 OK
{
  "total_sessions": 5000,
  "auto_booking_rate": 78.5,
  "triage_accuracy": 96.4,
  "core_engagement_growth": "+18%",
  "triage_data": [...],
  "load_data": [...]
}
```

#### 7. **Public Stats**

**Get Platform Statistics**
```http
GET /services/stats/public/
# No authentication required

Response: 200 OK
{
  "customers": "5000+",
  "providers": "120+",
  "satisfaction": "98%",
  "response_time": "15 min"
}
```
```

### WebSocket Endpoints

#### Real-time Service Tracking
```javascript
// Connect to WebSocket
const ws = new WebSocket('ws://localhost:8001/ws/service/42/');

// Listen for updates
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Status Update:', data);
  // { status: 'DISPATCHED', message: '...', data: {...} }
};

// Send provider location (from provider app)
ws.send(JSON.stringify({
  provider_location: {
    latitude: 12.9800,
    longitude: 77.6000
  }
}));
```

---

## Algorithms & Formulas

### 1. **Provider Dispatch Algorithm**

**Objective**: Find the nearest available provider and assign them to a service request.

**Algorithm Flow**:
```python
def find_nearest_available_provider(service_request):
    """
    Multi-stage provider selection algorithm
    
    Stage 1: Filter by availability and verification
    Stage 2: Calculate distances using Haversine formula
    Stage 3: Rank by distance
    Stage 4: Refine top candidates with real distance (Google Maps API)
    """
    
    # Stage 1: Filter
    available_providers = ServiceProvider.objects.filter(
        is_verified=True,
        is_available=True
    )
    
    # Stage 2 & 3: Calculate and rank
    ranked_providers = []
    for provider in available_providers:
        distance = haversine_distance(
            service_request.latitude,
            service_request.longitude,
            provider.latitude,
            provider.longitude
        )
        provider.distance_km = distance
        ranked_providers.append(provider)
    
    # Sort by distance (ascending)
    ranked_providers.sort(key=lambda x: x.distance_km)
    
    # Return top 3 candidates
    return ranked_providers[:3]
```

**Haversine Formula** (Great-circle distance):
```
Given two points (lat1, lon1) and (lat2, lon2):

a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2)
c = 2 × atan2(√a, √(1-a))
distance = R × c

Where:
- R = Earth's radius (6371 km)
- Δlat = lat2 - lat1 (in radians)
- Δlon = lon2 - lon1 (in radians)
```

**Python Implementation**:
```python
from math import radians, sin, cos, sqrt, atan2

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth's radius in kilometers
    
    # Convert to radians
    lat1_rad = radians(lat1)
    lon1_rad = radians(lon1)
    lat2_rad = radians(lat2)
    lon2_rad = radians(lon2)
    
    # Calculate differences
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    
    # Haversine formula
    a = sin(dlat/2)**2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    
    return R * c
```

### 2. **Dynamic Pricing Algorithm**

**Objective**: Calculate fair, transparent pricing based on service type, distance, and user subscription.

**Pricing Formula**:
```
Total Price = Base Price + Distance Charge - Subscription Discount

Where:
- Base Price: Fixed cost per service type
- Distance Charge: (Distance - Included KM) × Per KM Rate
- Subscription Discount: Percentage based on plan tier
```

**Implementation**:
```python
def calculate_dynamic_price(service_type, distance_km, user_subscription):
    """
    Dynamic pricing calculation
    
    Inputs:
    - service_type: Type of service (TOWING, MECHANIC, etc.)
    - distance_km: Distance from provider to customer
    - user_subscription: User's active subscription plan
    
    Output:
    - ServiceQuote object with detailed pricing breakdown
    """
    
    # Pricing configuration
    PRICING_CONFIG = {
        'TOWING': {
            'base': Decimal("199.00"),
            'included_km': 5,
            'per_km': Decimal("20.00")
        },
        'MECHANIC': {
            'base': Decimal("79.00"),
            'included_km': 5,
            'per_km': Decimal("15.00")
        },
        # ... other service types
    }
    
    config = PRICING_CONFIG.get(service_type)
    base_price = config['base']
    
    # Calculate distance charge
    chargeable_distance = max(0, distance_km - config['included_km'])
    distance_charge = chargeable_distance * config['per_km']
    
    # Calculate subtotal
    subtotal = base_price + distance_charge
    
    # Apply subscription discount
    if user_subscription:
        if user_subscription.plan.name == 'Elite Plan':
            total = Decimal("0.00")  # Free for Elite
        elif user_subscription.plan.name == 'Premium Plan':
            total = subtotal * Decimal("0.50")  # 50% off
        elif user_subscription.plan.name == 'Basic Plan':
            total = subtotal * Decimal("0.85")  # 15% off
        else:
            total = subtotal
    else:
        total = subtotal
    
    return {
        'base_price': base_price,
        'distance_km': distance_km,
        'distance_charge': distance_charge,
        'subtotal': subtotal,
        'total': total
    }
```

**Pricing Tiers**:
**For 2 wheeler**:
| Service Type | Base Price | Included KM | Per KM Rate |
|--------------|------------|-------------|-------------|
| Towing | ₹199 | 5 km | ₹20/km |
| Flatbed Towing | ₹349 | 5 km | ₹25/km |
| Mechanic | ₹99 | 5 km | ₹15/km |
| Fuel Delivery | ₹49 | 5 km | ₹15/km |
| Battery Jump | ₹149 | 5 km | ₹15/km |
| Lockout | ₹149 | 5 km | ₹15/km |
| Flat Tire | ₹99 | 5 km | ₹15/km |

**For 3 wheeler**:
| Service Type | Base Price | Included KM | Per KM Rate |
|--------------|------------|-------------|-------------|
| Towing | ₹249 | 5 km | ₹25/km |
| Flatbed Towing | ₹449 | 5 km | ₹30/km |
| Mechanic | ₹149 | 5 km | ₹20/km |
| Fuel Delivery | ₹49 | 5 km | ₹20/km |
| Battery Jump | ₹1999 | 5 km | ₹20/km |
| Lockout | ₹199 | 5 km | ₹20/km |
| Flat Tire | ₹199 | 5 km | ₹20/km |

**For 4 wheeler**:
| Service Type | Base Price | Included KM | Per KM Rate |
|--------------|------------|-------------|-------------|
| Towing | ₹249 | 5 km | ₹25/km |
| Flatbed Towing | ₹449 | 5 km | ₹35/km |
| Mechanic | ₹349 | 5 km | ₹25/km |
| Fuel Delivery | ₹49 | 5 km | ₹20/km |
| Battery Jump | ₹249 | 5 km | ₹25/km |
| Lockout | ₹299 | 5 km | ₹25/km |
| Flat Tire | ₹249 | 5 km | ₹25/km |

**For SUV wheeler**:
| Service Type | Base Price | Included KM | Per KM Rate |
|--------------|------------|-------------|-------------|
| Towing | ₹299 | 5 km | ₹25/km |
| Flatbed Towing | ₹499 | 5 km | ₹40/km |
| Mechanic | ₹349 | 5 km | ₹30/km |
| Fuel Delivery | ₹49 | 5 km | ₹20/km |
| Battery Jump | ₹249 | 5 km | ₹30/km |
| Lockout | ₹299 | 5 km | ₹30/km |
| Flat Tire | ₹249 | 5 km | ₹30/km |

**For Vans**:
| Service Type | Base Price | Included KM | Per KM Rate |
|--------------|------------|-------------|-------------|
| Towing | ₹349 | 5 km | ₹30/km |
| Flatbed Towing | ₹499 | 5 km | ₹45/km |
| Mechanic | ₹399 | 5 km | ₹40/km |
| Fuel Delivery | ₹49 | 5 km | ₹20/km |
| Battery Jump | ₹299 | 5 km | ₹35/km |
| Lockout | ₹299 | 5 km | ₹35/km |
| Flat Tire | ₹249 | 5 km | ₹35/km |

**For Trucks**:
| Service Type | Base Price | Included KM | Per KM Rate |
|--------------|------------|-------------|-------------|
| Towing | ₹499 | 5 km | ₹40/km |
| Flatbed Towing | ₹699 | 5 km | ₹50/km |
| Mechanic | ₹399 | 5 km | ₹40/km |
| Fuel Delivery | ₹69 | 5 km | ₹20/km |
| Battery Jump | ₹349 | 5 km | ₹40/km |
| Lockout | ₹299 | 5 km | ₹40/km |
| Flat Tire | ₹299 | 5 km | ₹40/km |

### 3. **AI Triage Algorithm**

**Objective**: Automatically categorize service requests and assign priority based on customer description.

**Algorithm**:
```python
def ai_triage(customer_description):
    """
    NLP-based service categorization
    
    Current: Keyword matching (MVP)
    Future: LLM-based classification (GPT-4, LLaMA)
    """
    
    KEYWORD_MAP = {
        'flat': {'type': 'tire_change', 'priority': 'MEDIUM'},
        'puncture': {'type': 'tire_change', 'priority': 'MEDIUM'},
        'smoke': {'type': 'mechanic', 'priority': 'HIGH'},
        'fire': {'type': 'mechanic', 'priority': 'URGENT'},
        'battery': {'type': 'battery_jump', 'priority': 'LOW'},
        'stuck': {'type': 'basic_tow', 'priority': 'HIGH'},
        'ditch': {'type': 'flatbed_tow', 'priority': 'URGENT'},
        'gas': {'type': 'fuel_delivery', 'priority': 'LOW'},
        'locked': {'type': 'lockout', 'priority': 'MEDIUM'}
    }
    
    description_lower = customer_description.lower()
    
    for keyword, mapping in KEYWORD_MAP.items():
        if keyword in description_lower:
            return {
                'suggested_type': mapping['type'],
                'suggested_priority': mapping['priority'],
                'confidence': 0.85
            }
    
    # Default fallback
    return {
        'suggested_type': 'mechanic',
        'suggested_priority': 'LOW',
        'confidence': 0.40
    }
```

**Future Enhancement** (LLM Integration):
```python
import openai

def ai_triage_llm(customer_description):
    """
    GPT-4 powered triage for higher accuracy
    """
    prompt = f"""
    Analyze this roadside assistance request and categorize it:
    
    Request: "{customer_description}"
    
    Categories: towing, mechanic, fuel_delivery, battery_jump, lockout, tire_change
    Priority: LOW, MEDIUM, HIGH, URGENT
    
    Respond in JSON format:
    {{"category": "...", "priority": "...", "confidence": 0.0-1.0}}
    """
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return json.loads(response.choices[0].message.content)
```

### 4. **Rewards Points Calculation**

**Formula**:
```
Points Earned = Base Points + Distance Bonus + Tier Multiplier

Where:
- Base Points: 10 points per completed service
- Distance Bonus: 1 point per km traveled
- Tier Multiplier: Bronze (1x), Silver (1.5x), Gold (2x)

Points Redemption:
- 1 Point = ₹0.10 wallet cash
- Minimum redemption: 100 points (₹10)
```

**Implementation**:
```python
def calculate_reward_points(service_request, user_tier):
    """
    Calculate reward points for completed service
    """
    base_points = 10
    distance_bonus = int(service_request.distance_km)
    
    tier_multipliers = {
        'BRONZE': 1.0,
        'SILVER': 1.5,
        'GOLD': 2.0
    }
    
    multiplier = tier_multipliers.get(user_tier, 1.0)
    total_points = int((base_points + distance_bonus) * multiplier)
    
    return total_points
```

---

## Features & Capabilities

### Core Features

#### 1. **Multi-Platform Support**
- **Web Applications**: Admin, Provider, Booker dashboards
- **Mobile Applications**: Native iOS/Android apps for Booker and Provider
- **Responsive Design**: All web apps work seamlessly on mobile browsers

#### 2. **Real-Time Communication**
- **WebSocket Integration**: Live status updates, provider location tracking
- **Chat System**: Direct messaging between booker and provider
- **Push Notifications**: Firebase Cloud Messaging for instant alerts

#### 3. **AI-Powered Features**
- **Agentic Booking**: AI coordinator handles complex booking flows
- **Smart Triage**: Automatic service categorization from descriptions
- **Predictive Analytics**: Usage patterns, demand forecasting

#### 4. **Dynamic Pricing**
- **Distance-Based Calculation**: Fair pricing using real-time distance
- **Subscription Discounts**: Tiered benefits (Free, Basic, Premium, Elite)
- **Transparent Quotes**: Upfront pricing before service confirmation

#### 5. **Payment Integration**
- **Razorpay Gateway**: Secure payment processing
- **Digital Wallet**: Store money, earn cashback, get rewards
- **Multiple Methods**: UPI, Cards, Net Banking, Wallet

#### 6. **Subscription Plans**
| Plan | Price | Benefits |
|------|-------|----------|
| **Free** | ₹0 | Pay-per-use, standard rates |
| **Basic** | ₹99/45days | 10% discount, priority support |
| **Premium** | ₹199/45days | upto 30% discount, free towing (5-10km), helpline, vehicle exchange for limited time |
| **Elite** | ₹399/45days | Unlimited free services charges, VIP support, vehicle exchange |

#### 7. **Vehicle Type Support**
- Two-Wheeler (Bike/Scooter)
- Three-Wheeler (Auto Rickshaw)
- Four-Wheeler (Car/Sedan/Hatchback)
- SUV (Sport Utility Vehicle)
- Van (Minivan/Cargo Van)
- Truck (Light/Medium Commercial)

#### 8. **Service Types**
- **Towing**: Basic and flatbed options
- **Mechanic**: On-site repairs
- **Fuel Delivery**: Emergency fuel supply
- **Battery Jump**: Jump-start service
- **Lockout Assistance**: Key recovery
- **Flat Tire**: Tire change/repair

#### 9. **Provider Features**
- **Job Marketplace**: Browse and accept available jobs
- **Earnings Dashboard**: Track daily/weekly/monthly income
- **Real-time Navigation**: Integrated maps for routing
- **Performance Metrics**: Ratings, completion rate, response time

#### 10. **Admin Capabilities**
- **User Management**: Approve/suspend users, verify providers
- **Analytics Dashboard**: Revenue, bookings, growth metrics
- **AI Monitor**: Track AI performance, triage accuracy
- **Financial Reports**: Settlements, commissions, payouts

### Advanced Features

#### 1. **Vehicle Exchange Program**
- Rental vehicle provided during service
- Available for Elite plan subscribers
- Seamless handover process

#### 2. **AutoMind Intelligence**
- Unified AI Assistant for support and booking
- Natural language problem diagnosis (Triage)
- Immediate agentic dispatch bypassing forms
- 24/7 conversational support

#### 3. **Vehicle Placement Service**
- Move vehicle to specified location after service
- Privacy-safe location handling
- Additional fee-based service

#### 4. **Helpline Integration**
- 24/7 phone support
- Call logging and recording
- Link calls to service requests

#### 4. **Loyalty Rewards**
- Points for every service
- Tier system (Bronze, Silver, Gold)
- Referral bonuses
- Points-to-cash redemption

#### 5. **IoT Integration** (Future)
- Automatic crash detection
- Vehicle health monitoring
- Predictive maintenance alerts

---

## Database Schema

### Key Models

#### User Models
```python
# CustomUser (extends Django AbstractUser)
- id: AutoField
- username: CharField (unique)
- email: EmailField (unique)
- phone_number: CharField
- is_service_booker: Boolean
- is_service_provider: Boolean
- date_joined: DateTime

# ServiceBooker
- user: OneToOne(CustomUser)
- profile_picture: ImageField
- emergency_contact: CharField

# ServiceProvider
- user: OneToOne(CustomUser)
- is_verified: Boolean
- is_available: Boolean
- service_types: JSONField
- latitude: DecimalField
- longitude: DecimalField
- average_rating: DecimalField
- jobs_completed: Integer
```

#### Service Models
```python
# ServiceRequest
- id: AutoField
- booker: ForeignKey(CustomUser)
- provider: ForeignKey(CustomUser, nullable)
- vehicle: ForeignKey(Vehicle)
- service_type: CharField
- status: CharField (choices)
- priority: CharField (choices)
- latitude: DecimalField
- longitude: DecimalField
- customer_notes: TextField
- created_at: DateTime

# ServiceQuote
- request: ForeignKey(ServiceRequest)
- base_price: DecimalField
- distance_km: DecimalField
- time_estimate_minutes: Integer
- dynamic_total: DecimalField
- status: CharField (PENDING/ACCEPTED/REJECTED)
- valid_until: DateTime

# Vehicle
- owner: ForeignKey(CustomUser)
- license_plate: CharField (unique)
- make: CharField
- model: CharField
- fuel_type: CharField
- vehicle_type: CharField
```

#### Subscription Models
```python
# SubscriptionPlan
- name: CharField (choices)
- price: DecimalField
- duration_days: Integer
- is_exchange_eligible: Boolean
- features: JSONField
- max_requests: Integer

# UserSubscription
- user: ForeignKey(ServiceBooker)
- plan: ForeignKey(SubscriptionPlan)
- start_date: DateTime
- end_date: DateTime
- is_active: Boolean
- status: CharField
- auto_renew: Boolean
```

#### Payment Models
```python
# Transaction
- service_request: ForeignKey(ServiceRequest)
- booker: ForeignKey(ServiceBooker)
- provider: ForeignKey(ServiceProvider)
- amount: DecimalField
- platform_commission: DecimalField
- provider_payout_amount: DecimalField
- status: CharField
- payment_method: CharField
- razorpay_order_id: CharField
- razorpay_payment_id: CharField

# Wallet
- user: OneToOne(ServiceBooker)
- balance: DecimalField
- total_earned: DecimalField
- total_spent: DecimalField
```

#### Communication Models
```python
# ChatMessage
- request: ForeignKey(ServiceRequest)
- sender: ForeignKey(CustomUser)
- message: TextField
- image: ImageField (optional)
- is_read: Boolean
- created_at: DateTime
```

### Database Relationships Diagram
```
CustomUser
├── ServiceBooker (1:1)
│   ├── UserSubscription (1:N)
│   ├── Wallet (1:1)
│   ├── RewardsProgram (1:1)
│   └── ServiceRequest (1:N) [as booker]
│
├── ServiceProvider (1:1)
│   └── ServiceRequest (1:N) [as provider]
│
├── Vehicle (1:N)
│   └── ServiceRequest (1:N)
│
└── ChatMessage (1:N) [as sender]

ServiceRequest
├── ServiceQuote (1:N)
├── Transaction (1:1)
├── Review (1:1)
├── VehicleExchange (1:1)
├── VehiclePlacement (1:1)
└── ChatMessage (1:N)
```

---

## Deployment Guide

### Docker Deployment (Recommended)

#### 1. **Build and Run**
```bash
cd infrastructure
docker-compose up -d --build
```

#### 2. **Verify Services**
```bash
docker-compose ps
docker-compose logs -f backend
```

#### 3. **Seed Database**
```bash
docker-compose exec -T backend python seed_data.py
```

### Render.com Deployment

#### 1. **Prerequisites**
- Render.com account
- External PostgreSQL (Neon/Supabase)
- External Redis (Upstash)

#### 2. **Configuration**
Update `render.yaml`:
```yaml
services:
  - type: web
    name: vehic-aid-backend
    env: docker
    dockerContext: ./backend
    envVars:
      - key: DATABASE_URL
        value: postgresql://user:pass@host:5432/db
      - key: REDIS_URL
        value: redis://host:6379
      - key: SECRET_KEY
        generateValue: true
      - key: ALLOWED_HOSTS
        value: vehic-aid-backend.onrender.com
```

#### 3. **Deploy**
```bash
git push origin main
# Render auto-deploys from main branch
```

### Environment Variables Checklist

**Required**:
- `DATABASE_URL`
- `REDIS_URL`
- `SECRET_KEY`
- `ALLOWED_HOSTS`
- `CORS_ALLOWED_ORIGINS`

**Optional but Recommended**:
- `GOOGLE_MAPS_API_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `FIREBASE_CREDENTIALS_PATH`
- `FAST2SMS_API_KEY`
- `SMS_PROVIDER`

---

## Future Roadmap

### Phase 1: Foundation (Completed ✅)
- ✅ Core booking system
- ✅ Provider dispatch
- ✅ Payment integration
- ✅ Subscription plans
- ✅ Real-time tracking
- ✅ Chat system
- ✅ Mobile apps

### Phase 2: AI Enhancement (In Progress 🚧)
- ✅ AI Triage (keyword-based)
- 🚧 LLM Integration (GPT-4/LLaMA)
- 🚧 Predictive maintenance
- 🚧 Demand forecasting
- 🚧 Route optimization

### Phase 3: IoT Integration (Planned 📋)
- 📋 OBD-II device integration
- 📋 Automatic crash detection
- 📋 Vehicle health monitoring
- 📋 Predictive alerts
- 📋 Fleet management

### Phase 4: Scale & Expansion (Future 🔮)
- 🔮 Multi-language support
- 🔮 International expansion
- 🔮 Insurance partnerships
- 🔮 B2B fleet services
- 🔮 Blockchain-based settlements

### Technology Upgrades
- **AI/ML**: Migrate from keyword matching to transformer-based models
- **Real-time**: Implement GraphQL subscriptions for better real-time data
- **Scalability**: Kubernetes orchestration for auto-scaling
- **Analytics**: Implement data warehouse (BigQuery/Redshift)
- **Security**: Add biometric authentication, end-to-end encryption

---

## Commands Reference

### Development Commands

```bash
# Backend
python manage.py runserver 8001          # Start Django server
python manage.py migrate                 # Run migrations
python manage.py makemigrations          # Create migrations
python manage.py createsuperuser         # Create admin user
python seed_data.py                      # Seed database
celery -A vehic_aid_backend worker -l info    # Start Celery worker
celery -A vehic_aid_backend beat -l info      # Start Celery beat

# Frontend
npm run dev                              # Start dev server
npm run build                            # Production build
npm run lint                             # Run linter
npm run type-check                       # TypeScript check

# Docker
docker-compose up -d                     # Start all services
docker-compose down                      # Stop all services
docker-compose down -v                   # Stop and remove volumes
docker-compose logs -f [service]         # View logs
docker-compose exec backend bash         # Shell into backend
docker-compose ps                        # List running services

# Git
git add .                                # Stage all changes
git commit -m "message"                  # Commit changes
git push origin main                     # Push to remote
git pull origin main                     # Pull from remote
```

### Production Commands

```bash
# Collect static files
python manage.py collectstatic --noinput

# Run with Gunicorn
gunicorn vehic_aid_backend.wsgi:application --bind 0.0.0.0:8000

# Run with Daphne (for WebSockets)
daphne -b 0.0.0.0 -p 8000 vehic_aid_backend.asgi:application

# Database backup
pg_dump vehicaid > backup.sql

# Database restore
psql vehicaid < backup.sql
```

---

## Support & Contact

- **Documentation**: `/docs` directory
- **API Reference**: `/docs/API_REFERENCE.md`
- **GitHub**: https://github.com/yourusername/vehic-aid-project
- **Email**: support@vehicaid.com

---

**Last Updated**: January 19, 2026
**Version**: 1.0.0
**Maintained by**: VehicAid Development Team
