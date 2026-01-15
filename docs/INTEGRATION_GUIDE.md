# 🔗 Vehic-Aid Platform - Complete Integration Guide

## 🏗️ Platform Architecture

The Vehic-Aid platform consists of **three web applications** and **one backend API**:

```
┌─────────────────────────────────────────────────────────────┐
│                    Vehic-Aid Platform                        │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐     ┌──────────────┐
│ Admin Panel  │      │ Customer App │     │ Provider App │
│ Port: 3000   │      │ Port: 3002   │     │ Port: 3001   │
└──────────────┘      └──────────────┘     └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   Backend API    │
                    │   Port: 8000     │
                    │  Django + DRF    │
                    └──────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
            ┌──────────────┐    ┌──────────────┐
            │ PostgreSQL   │    │    Redis     │
            │  Port: 5432  │    │  Port: 6379  │
            └──────────────┘    └──────────────┘
```

---

## 📱 Application Details

### 1. Admin Panel (Port 3002)

**Purpose:** Platform management and monitoring

**Location:** `web/admin/`

**Features:**
- ✅ Dashboard with platform statistics
- ✅ User management (customers & providers)
- ✅ Service request monitoring
- ✅ Payment tracking
- ✅ Real-time activity feed

**Access:**
- URL: http://localhost:3000
- Login: admin / admin123
- Token Storage: `access_token` (localStorage)

**Key Pages:**
- `/login` - Admin authentication
- `/dashboard` - Overview statistics
- `/users` - User management
- `/bookings` - Service request management
- `/payments` - Payment tracking

---

### 2. Provider Portal (Port 3001)

**Purpose:** Service provider dashboard

**Location:** `web/provider/`

**Features:**
- ✅ Provider authentication
- ✅ Service request dashboard
- ✅ Accept/reject requests
- ✅ Complete service requests
- ✅ Earnings tracking
- ✅ Availability toggle
- 📋 Location updates (planned)
- 📋 Chat with customers (planned)

**Access:**
- URL: http://localhost:3001
- Login: provider1 / password123
- Token Storage: `provider_access_token` (localStorage)

**Key Pages:**
- `/login` - Provider authentication
- `/dashboard` - Service requests & stats
- `/earnings` - Payout history (planned)
- `/settings` - Profile management (planned)

---

### 3. Customer App (Port 3000)

**Purpose:** Customer service booking

**Location:** `web/booker/`

**Features:**
- ✅ Customer authentication
- ✅ Service request wizard
- ✅ Real-time tracking (Maps)
- ✅ Booking history
- ✅ Subscription management
- ✅ Wallet & rewards

**Access:**
- URL: http://localhost:3000
- Login: user_basic / password123
- Token Storage: `customer_access_token` (localStorage)

**Status:** ✅ Implementation Complete / Beta

---

## 🔐 Authentication Flow

All three applications use **JWT token authentication** with the same backend:

### Login Process

```typescript
// 1. User submits credentials
POST /api/v1/users/token/
{
  "username": "user@example.com",
  "password": "password123"
}

// 2. Backend returns JWT tokens
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

// 3. Frontend stores tokens
localStorage.setItem('access_token', response.data.access);
localStorage.setItem('refresh_token', response.data.refresh);

// 4. All API requests include token
headers: {
  'Authorization': 'Bearer <access_token>'
}
```

### Token Storage Keys

| Application | Access Token Key | Refresh Token Key |
|------------|------------------|-------------------|
| Admin Panel | `access_token` | `refresh_token` |
| Provider Portal | `provider_access_token` | `provider_refresh_token` |
| Customer App | `customer_access_token` | `customer_refresh_token` |

---

## 🌐 API Endpoints

### Shared Endpoints

All applications connect to: `http://localhost:8001/api/v1`

#### Authentication
- `POST /users/token/` - Login (all users)
- `POST /users/token/refresh/` - Refresh token
- `POST /users/register/booker/` - Customer registration
- `POST /users/register/provider/` - Provider registration

#### Service Requests
- `GET /services/admin/bookings/` - List all requests (admin)
- `POST /services/request/` - Create request (customer)
- `PUT /services/provider/update/{id}/` - Update request (provider)

#### Dashboard Stats
- `GET /services/admin/dashboard-stats/` - Platform statistics
- `GET /services/admin/recent-activity/` - Recent activity feed

#### Payments
- `GET /payments/dashboard/provider/` - Provider Real-time Earnings
- `GET /payments/transactions/` - Payment history
- `GET /payments/settlements/` - Provider settlements

---

## 🚀 Running All Applications

### Start Backend (Required First)

```bash
cd infrastructure
docker-compose up -d --build
```

**Services Started:**
- PostgreSQL (port 5432)
- Redis (port 6379)
- Django API (port 8001)
- Celery worker

### Start Admin Panel

```bash
cd web/admin
npm run dev
```

Access at: http://localhost:3002

### Start Provider Portal

```bash
cd web/provider
npm run dev
```

Access at: http://localhost:3001

### Start Customer App

```bash
cd web/booker
npm run dev
```

Access at: http://localhost:3000

---

## 🔄 Data Flow Examples

### Example 1: Customer Books Service

```
1. Customer App → POST /services/request/
   {
     "service_type": "TOWING",
     "latitude": 19.0760,
     "longitude": 72.8777,
     "customer_notes": "Car broke down on highway"
   }

2. Backend → Creates ServiceRequest
   - Status: PENDING_DISPATCH
   - Notifies available providers

3. Provider Portal → GET /services/admin/bookings/
   - Sees new request
   - Clicks "Accept"

4. Provider Portal → PUT /services/provider/update/{id}/
   {
     "status": "DISPATCHED"
   }

5. Admin Panel → Dashboard updates
   - Shows request in progress
   - Updates statistics

6. Provider completes service
   - Provider Portal → PUT /services/provider/update/{id}/
   {
     "status": "COMPLETED"
   }

7. Payment processed
   - Transaction created
   - Provider earnings updated
   - Customer charged
```

### Example 2: Admin Monitors Platform

```
1. Admin Panel → GET /services/admin/dashboard-stats/
   Response: {
     "total_users": 8,
     "total_bookings": 4,
     "total_revenue": 1000,
     "active_providers": 3
   }

2. Admin Panel → GET /services/admin/recent-activity/
   Shows last 10 service requests with status

3. Admin can:
   - View all users
   - Monitor bookings
   - Track payments
   - Manage providers
```

---

## 📊 Database Schema

### Key Models

**Users:**
- `CustomUser` - Base user (admin, customer, provider)
- `ServiceBooker` - Customer profile
- `ServiceProvider` - Provider profile

**Services:**
- `ServiceRequest` - Booking requests
- `SubscriptionPlan` - Pricing tiers
- `UserSubscription` - Active subscriptions
- `Wallet` - Customer wallet

**Payments:**
- `Transaction` - Payment records
- `DailySettlement` - Provider payouts

---

## 🎨 UI/UX Consistency

### Design System

All three applications share:
- **Colors:** Blue primary, Green success, Red danger
- **Typography:** Inter font family
- **Components:** Tailwind CSS utilities
- **Icons:** Lucide React icons

### Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Touch-friendly buttons and inputs

---

## 🔧 Configuration Files

### Admin Panel (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3002
```

### Provider Portal (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### Customer App (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend (.env.dev)
```bash
DJANGO_SETTINGS_MODULE=vehic_aid_backend.settings.development
DEBUG=True
DATABASE_URL=postgres://vehic_aid:vehic_aid123@db:5432/vehic_aid_db
CELERY_BROKER_URL=redis://redis:6379/0
```

---

## 🧪 Testing Credentials

### Admin
```
Username: admin_mobile
Password: password123
URL: http://localhost:3002/login
```

### Provider
```
Username: prov_tow
Password: password123
URL: http://localhost:3001/login
```

### Customer
```
Username: user_basic
Password: password123
URL: http://localhost:3000/login
```

---

## 📈 Next Steps

### Immediate
- [x] Admin panel - Complete ✅
- [x] Provider portal - Complete ✅
- [x] Customer app - Complete ✅
- [x] Link all three with real-time updates

### Short Term
- [ ] Real-time notifications (WebSockets)
- [ ] Google Maps integration
- [ ] Payment gateway (Razorpay)
- [ ] Chat between customer and provider

### Long Term
- [x] Mobile apps (React Native) - Phase 2 Complete
- [ ] IoT device integration
- [ ] AI-powered provider matching
- [ ] Analytics dashboard

---

## 🎯 Summary

**Platform Status:**

| Component | Status | Port | Features |
|-----------|--------|------|----------|
| Backend API | ✅ Complete | 8001 | 19/19 tests passing |
| Admin Panel | ✅ Complete | 3002 | Dashboard, CRUD operations |
| Provider Portal | ✅ Complete | 3001 | Request management, earnings |
| Customer App | ✅ Complete | 3000 | Booking Wizard, Profile |

**All applications are linked through:**
- Shared backend API
- JWT authentication
- Consistent data models
- Real-time updates (via polling, WebSockets planned)

---

**Last Updated:** January 16, 2026
**Platform Version:** 1.0.0
**Status:** ✅ Admin & Provider Ready | ✅ Customer Ready
