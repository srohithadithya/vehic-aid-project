# VehicAid — Complete Project Explanation
> **Version 2.6.0 | Built with Django 4.2 + Next.js 14 + Groq AI (Llama 3.3)**  

---

## Table of Contents

1. [Project Overview & Problem Statement](#1-project-overview--problem-statement)
2. [System Architecture — Big Picture](#2-system-architecture--big-picture)
3. [User Roles & Features](#3-user-roles--features)
4. [Technology Stack — What & Why](#4-technology-stack--what--why)
5. [Data Models — What Each Table Stores](#5-data-models--what-each-table-stores)
6. [Core Algorithms — Deep Dive](#6-core-algorithms--deep-dive)
7. [Real-Time System — WebSockets & Celery](#7-real-time-system--websockets--celery)
8. [IoT Device Integration](#8-iot-device-integration)
9. [Payment Flow — Razorpay Integration](#9-payment-flow--razorpay-integration)
10. [Security Design](#10-security-design)
11. [API Design — Key Endpoints](#11-api-design--key-endpoints)
12. [Deployment Architecture](#12-deployment-architecture)
13. [Complete Flow — Booking a Service (End to End)](#13-complete-flow--booking-a-service-end-to-end)
14. [Why This Architecture Works — Summary](#14-why-this-architecture-works--summary)

---

## 1. Project Overview & Problem Statement

### What is VehicAid?

VehicAid is a **full-stack, AI-powered roadside assistance platform** designed for the Indian market. It connects **customers who face vehicle breakdowns** with **verified local service providers** (mechanics, towing operators, fuel delivery agents, etc.) in real-time.

### The Problem It Solves

In India, vehicle breakdowns on highways and congested city roads are extremely common. Existing solutions suffer from:

- **No real-time provider matching** — you call a number and wait indefinitely with no ETA
- **Opaque, surprise pricing** — you only find out the cost after the service is done
- **No vehicle-type awareness** — a bike and a truck get charged the same flat rate
- **Smartphone dependency** — if your phone battery is dead or network is poor, you cannot call for help
- **No AI help** — customers often don't know what type of service they need (is it a battery issue or an alternator?)

### VehicAid's Solution

| Problem | VehicAid's Answer |
|---|---|
| No real-time matching | KNN-style GPS dispatch finds the nearest available provider in seconds |
| Opaque pricing | Dynamic Quote Engine calculates a transparent price before booking is confirmed |
| No vehicle-type awareness | 6 vehicle categories (2-wheeler to truck) with custom pricing grids |
| Smartphone dependency | Proprietary 2-button IoT hardware device triggers full dispatch without a smartphone |(Future scope)
| No AI help | AutoMind (Groq + Llama 3.3-70b) triages your problem, suggests service type, gives on-the-spot vehicle diagnostics |

---

## 2. System Architecture — Big Picture

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENTS                               │
│  Customer App (Next.js)  ·  Provider App  ·  Admin Panel    │
│  Mobile App (Planned: React Native)                         │
│  IoT Device (Planned: 2-Button SOS Hardware)                         │
└─────────────────────────┬────────────────────────────────────┘
                          │ HTTP REST + WebSocket (Django Channels)
┌─────────────────────────▼────────────────────────────────────┐
│              DJANGO REST FRAMEWORK (Port 8001)               │
│                                                              │
│  ┌─────────────┐ ┌─────────────┐ ┌──────────┐ ┌──────────┐  │
│  │  users app  │ │services app │ │payments  │ │(iot_dev.)  │  │
│  └─────────────┘ └──────┬──────┘ └──────────┘ └────┬─────┘  │
│                         │                           │        │
│  ┌──────────────────────▼───────────────────────────▼──────┐ │
│  │                 AGENTIC CORE                             │ │
│  │  BookingAgent → AITriage (Groq) → dispatch_logic        │ │
│  │              → PricingService → Notifications           │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────┬───────────────────────────────────┘
           ┌───────────────┼──────────────────────┐
           ▼               ▼                      ▼
    ┌─────────────┐  ┌──────────┐          ┌──────────────┐
    │ PostgreSQL  │  │  Redis   │          │Celery Worker │
    │  (DB)       │  │(Cache +  │          │(Async Tasks) │
    │             │  │ Broker)  │          │              │
    └─────────────┘  └──────────┘          └──────────────┘

Third-Party Services:
  Razorpay · Google Maps API · Firebase FCM · Fast2SMS · Groq AI
```

The architecture follows a **monolithic-with-modules** pattern. All Django apps (`users`, `services`, `payments`, `iot_devices`, `common`) live within one codebase and one process. This is intentional for a startup — simpler to develop, test, and deploy than microservices.

---

## 3. User Roles & Features

### 3.1 Customer (Service Booker)

Customers interact via the **Stranded driver web app** (`web/booker`, port 3003) or the planned React Native mobile app.

#### Feature List and Why Each Feature Exists

| Feature | Why It Exists |
|---|---|
| **Multi-step Service Booking Wizard** | Guided UX reduces friction — a breakdown is already stressful, the booking should be effortless |
| **AutoMind AI Chat (Groq/Llama 3.3)** | Customers often don't know what service type to request; AI diagnoses the problem from plain language |
| **Real-time GPS Map Tracking** | Provider's live location is streamed so the customer knows the exact ETA |
| **6 Vehicle Type Categories** | India has a massive 2-wheeler, 3-wheeler, and commercial vehicle market; flat pricing penalises small-vehicle users |
| **Dynamic Transparent Quote** | Price shown and approved before service starts — no surprise bills |
| **Wallet (Digital Balance)** | Store money, receive cashback — reduces friction for repeat purchases |
| **UPI/Card/Wallet Payment** | Razorpay covers all preferred Indian payment methods |
| **Subscription Plans (FREE/BASIC/PREMIUM/ELITE)** | Frequent users get 10–100% discounts; Elite members get free labor |
| **Planned:**IoT SOS Button** | For highway users with dead/inaccessible phone: single button press triggers full emergency dispatch |
| **In-app Chat with Provider** | Real-time communication (text + image) without sharing phone numbers |
| **Service History + Invoice Download** | Records for company expense claims or insurance reimbursement |
| **Loyalty Rewards Program** | Bronze/Silver/Gold tiers; points earned per service, redeemed as wallet cash |
| **Vehicle Garage** | Register and manage multiple vehicles (personal + family + company fleet) |
| **Replacement Vehicle Service (Elite)** | If your car is towed for major repair, get a rental vehicle in the meantime |
| **Vehicle Placement Service** | After repair, have the vehicle driven to your chosen address (office/home) |
| **Push Notifications (Firebase FCM)** | Instant alerts for dispatch, arrival, payment, and OTP |

#### Subscription Plans

```
FREE    →  Pay full price per service, no discount
BASIC   →  10% discount on every service   | Monthly fee
PREMIUM →  30% discount on every service   | Monthly fee (recommended)
ELITE   →  upto 100% discount on labor charges  | Monthly fee + Replacement Vehicle access
```

---

### 3.2 Service Provider

Providers are verified professionals who use the **provider dashboard** (`web/provider`, port 3001).

| Feature | Why It Exists |
|---|---|
| **Live Job Feed** | Incoming requests appear in real-time so the provider can decide to accept/decline |
| **GPS Navigation Deep-link** | One tap opens Google Maps route to the customer — no manual coordinate entry |
| **Status Workflow** | Structured flow (En Route → Arrived → In Progress → Fare Finalized) prevents payment disputes |
| **Final Fare Submission** | After service, provider submits spare parts used; system recalculates the final bill transparently |
| **Earnings Analytics Dashboard** | Daily/weekly/monthly earnings charts (Recharts) for financial planning |
| **Provider Wallet & Daily Settlement** | Provider receives 70% of service revenue daily — no waiting for manual bank transfers |
| **Document Upload System** | License, insurance, vehicle RC upload for admin verification before allowing dispatch |
| **Availability Toggle** | Provider can go offline/online; only "verified AND available" providers are dispatched |
| **Rating & Review Visibility** | Providers see their average rating and customer feedback |
| **Multi-vehicle Type Support** | Provider specifies which vehicle categories they serve (e.g., 2-wheelers + 4-wheelers) |

---

### 3.3 Admin

Admins use the **Django Admin Panel** (port 8001/admin) + a custom **Next.js admin dashboard** (`web/admin`, port 3000).

| Feature | Why It Exists |
|---|---|
| **User Management** | Approve, suspend, or modify any booker or provider account |
| **Provider Verification** | Review uploaded documents before enabling dispatch |
| **Live Service Request Monitor** | See every active request, its status, provider, and customer in real-time |
| **Payment & Settlement Tracking** | Audit trail for every transaction and daily provider payout |
| **Reports Export (CSV/PDF/Excel)** | Regulatory compliance, investor reporting, financial planning |
| **Vehicle Type Analytics** | Understand which vehicle segments generate the most revenue |
| **Email Template Management** | Customise transactional emails (booking confirmation, invoice, welcome) |
| **Helpline Call Logs** | Every support call is recorded with duration, operator, and linked service request |
| **IoT Device Fleet Management** | Monitor battery, GPS, and last signal time for every device in the field |
| **Prometheus/Grafana Dashboards** | Infrastructure health monitoring — API latency, error rates, database query counts |

---

## 4. Technology Stack — What & Why

### 4.1 Backend: Django REST Framework

**Language:** Python 3.12  
**Framework:** Django 4.2 + Django REST Framework (DRF)

#### Why Django?
- Django's **ORM** handles complex relational queries (service requests ↔ users ↔ providers ↔ payments) with clean, readable syntax and auto-generated migrations.
- DRF provides battle-tested tools for building the REST API: serializers, viewsets, permission classes, authentication backends.
- Django's **Admin Panel** is auto-generated from model definitions — the admin dashboard came essentially for free during development.
- Massive ecosystem of production-tested packages for Indian fintech (Razorpay SDK, SMS gateways, Firebase admin).

#### Authentication: `djangorestframework-simplejwt`
- **Stateless JWT tokens** are essential for mobile apps and SPAs — no server-side session storage needed.
- Two-token flow: **Access token** (60-minute expiry) + **Refresh token** (7-day expiry).
- Refresh tokens allow users to stay logged in without re-entering credentials every hour.

#### Database: PostgreSQL 14
- **Why not SQLite?** VehicAid handles concurrent writes (multiple simultaneous service bookings) and financial data that requires **ACID compliance** (Atomicity, Consistency, Isolation, Durability). SQLite has write-locking issues under concurrency.
- **JSONB columns** (native in PostgreSQL) are used for `features` in SubscriptionPlan, `service_types` in ServiceProvider, `inventory` in SparePartStore — flexible schema within a relational model.
- `@transaction.atomic` decorators wrap the booking pipeline to guarantee all-or-nothing writes.

#### Cache & Message Broker: Redis 7
- Redis serves dual duty: **application cache** (frequently-read subscription plans, provider lists) and **Celery message broker** (task queue).
- Using one Redis instance for both keeps infrastructure simple without sacrificing performance.
- Django Channels also uses Redis as its **channel layer** to broadcast WebSocket events across multiple server instances.

#### Task Queue: Celery
| Task | Why Async? |
|---|---|
|Planned: | IoT button press processing | Device must receive an HTTP 202 in < 100ms; actual booking takes 1-3 seconds |
| SMS sending | Fast2SMS API call can take 2-3 seconds — user shouldn't wait |
| Daily financial settlement | Batch operation, runs at midnight, not user-facing |
| Subscription expiry check | Batch, runs daily |

#### WebSocket: Django Channels
- Upgrades Django from synchronous HTTP to support **persistent bidirectional WebSocket connections**.
- Used for: live service request status, provider GPS location streaming to customer map.
- Channel groups route messages to all subscribers of a service request room.

#### API Documentation: `drf-spectacular`
- Auto-generates OpenAPI 3.0 `schema.yml` from all DRF views.
- Swagger UI at `/api/schema/swagger-ui/` — interactive API testing without Postman.
- File size of generated schema: ~50 KB (49,617 bytes), reflecting the breadth of the API.

---

### 4.2 Frontend (Web) — Next.js 14

**Framework:** Next.js 14 (React 18) | **Language:** TypeScript

#### Why Next.js?
- **App Router + SSR** enables server-side rendering for the public landing page (SEO matters for organic discovery).
- **File-based routing** keeps frontend organised by feature and role.
- React 18 **Concurrent Rendering** ensures smooth UI even during background data fetches.
- Next.js optimises images, fonts, and bundles automatically (Turbopack).

#### Three Separate Applications (Role Isolation)

```
web/admin/    → Port 3000  (Admin Panel)
web/provider/ → Port 3001  (Provider Dashboard)
web/booker/   → Port 3003  (Customer Portal)
```

Separate apps ensure **privilege isolation** — a URL mismatch or CORS misconfiguration cannot expose admin functions to regular users.

| Library | Purpose | Why This One? |
|---|---|---|
| `Tailwind CSS` | Utility-first styling | Rapid consistent design, no class naming overhead |
| `shadcn/ui` | Accessible UI components | Production-ready Dialogs, Tables, Selects, etc. built on Tailwind |
| `Recharts` | Charts/graphs | React-native charting with direct state integration |
| `@react-google-maps/api` | Maps integration | Best geocoding accuracy in India |
| `React Context API` | State management | Sufficient at this scale; avoids Redux boilerplate; reusable in React Native |

---

### 4.3 Mobile: React Native + Expo (Planned)

**Framework:** React Native 0.76+ with Expo SDK 52+ and Expo Router v3

#### Why React Native?
- **Single codebase** for iOS and Android.
- **70% code reuse from the web** — API service functions, Context state, and business logic are all portable.
- **NativeWind** (Tailwind for React Native) lets the same CSS class names work across web and mobile, dramatically speeding up styling.

---

### 4.4 Infrastructure & DevOps

#### Docker
- Every service runs in an isolated container: Django, Next.js apps, PostgreSQL, Redis.
- `docker-compose.yml` brings up the entire local environment with one command.
- Multi-stage Dockerfiles keep production images small (base Python → install deps → copy app code).

#### Kubernetes (K8s) (Planned)
- Production deployment target via `infrastructure/k8s/` manifests.
- **Why K8s?** Roadside emergencies spike during bad weather, festivals, peak traffic hours. K8s **Horizontal Pod Autoscaler** scales Django backend pods based on CPU without manual intervention.
- **Rolling updates** (zero-downtime deployments) via `kubectl set image`.
- Kubernetes Secrets store all sensitive credentials — never in Docker images or git.

#### GitHub Actions (CI/CD)
```
Every push to main:
  Job 1 → Test:   pytest runs all tests → fail fast
  Job 2 → Build:  Docker image built + pushed to registry
  Job 3 → Deploy: kubectl rolling update on K8s cluster
```

#### Prometheus + Grafana
- `django-prometheus` middleware exports request/response metrics.
- Grafana alerts on: error rate > 1%, response time > 2s, DB connections > 80%.

---

### 4.5 Third-Party Services

| Service | Provider | Why This One? |
|---|---|---|
| **Email** | Gmail SMTP | Free 500/day; zero setup for development. App Password (16-digit) used instead of real credentials. |
| **SMS** | Fast2SMS | Largest free-tier Indian SMS gateway (50 SMS/day free); pure HTTP REST API. |
| **Payment** | Razorpay | Native UPI/GPay/PhonePe support; built for INR settlement; trusted by Indian customers. |
| **Maps** | Google Maps API | Best geocoding and Distance Matrix accuracy for Indian roads and highways. |
| **Push Notifications** | Firebase FCM | Cross-platform (iOS/Android/Web), free, globally reliable delivery infrastructure. |
| **AI Engine** | Groq (Llama 3.3-70b-versatile) | Sub-500ms inference latency (10× faster than GPT-4); generous free tier; on-par quality for classification and diagnostics tasks. |

---

## 5. Data Models — What Each Table Stores

### Users Domain

| Model | Key Fields | Purpose |
|---|---|---|
| `CustomUser` | `phone_number`, `role` (admin/booker/provider), `fcm_device_token` | Base Django user extended with VehicAid-specific fields |
| `ServiceBooker` | `preferred_language`, links to IoT device | Profile data for customers |
| `ServiceProvider` | `is_verified`, `is_available`, `latitude`, `longitude`, `service_types` (JSONB), `average_rating`, `bank_account_number` | Profile data for service professionals |
| `Notification` | `title`, `message`, `is_read` | In-app notification bell records |

### Services Domain

| Model | Key Fields | Purpose |
|---|---|---|
| `Vehicle` | `license_plate`, `make`, `model`, `fuel_type`, `vehicle_type` (6 choices), `insurance_expiry`, `puc_expiry` | Customer's registered vehicles |
| `SubscriptionPlan` | `name` (FREE/BASIC/PREMIUM/ELITE), `price`, `duration_days`, `features` (JSONB), `max_requests` | Available plan definitions |
| `UserSubscription` | `user`, `plan`, `start_date`, `end_date`, `is_active`, `status`, `auto_renew` | Active subscription for a booker; auto-expires in `save()` |
| `ServiceRequest` | `booker`, `provider`, `vehicle`, `service_type`, `status` (8-stage lifecycle), `priority` (LOW/MEDIUM/HIGH/URGENT), `latitude`, `longitude`, `source` (APP/IoT/HELPLINE) | **Core model** — one row per roadside assistance event |
| `ServiceQuote` | `base_price`, `distance_km`, `dynamic_total`, `spare_parts_total`, `platform_fee`, `tax_amount`, `is_final`, `provider_payout`, `platform_profit` | Dynamic price quote; updated to final fare post-service |
| `Review` | `rating` (1-5), `comment` | Customer feedback per completed service |
| `ChatMessage` | `request`, `sender`, `message`, `image`, `is_read` | All in-app chat messages between booker and provider |
| `Wallet` | `balance`, `total_earned`, `total_spent` | Digital wallet per booker |
| `WalletTransaction` | `transaction_type` (CREDIT/DEBIT/REWARD/REFUND), `amount`, `balance_after` | Ledger of every wallet operation |
| `RewardsProgram` | `points`, `tier` (BRONZE/SILVER/GOLD), `referral_code`, `referrals_made` | Loyalty program per booker |
| `RewardTransaction` | `points`, `transaction_type` (EARNED/REDEEMED/EXPIRED/BONUS) | Points ledger |
| `Referral` | `referrer`, `referred_user`, `reward_points` | Tracks referral relationships and bonuses |
| `VehicleExchange` | `original_vehicle`, `rental_vehicle`, `pickup_location`, `rental_fee`, `status` | Replacement vehicle request (Elite plan feature) |
| `VehiclePlacement` | `destination_address`, `destination_latitude`, `destination_longitude`, `price`, `status` | Post-repair vehicle delivery request |
| `HelplineCall` | `caller`, `operator`, `call_start`, `call_end`, `recording_url`, `linked_service_request` | Support call audit log |
| `SparePartStore` | `name`, `latitude`, `longitude`, `inventory` (JSONB: `{"part_name": price}`) | Nearby spare parts stores for provider reference |
| `SMSMessageLog` | `to_number`, `message_body`, `sent_at`, `status`, `gateway_response` | SMS delivery audit trail |

### Payments Domain

| Model | Key Fields | Purpose |
|---|---|---|
| `Transaction` | `service_request`, `amount`, `platform_commission`, `provider_payout_amount`, `razorpay_order_id`, `razorpay_payment_id`, `status`, `settled` | One payment record per service |
| `DailySettlement` | `settlement_date`, `total_platform_revenue`, `total_provider_payout_amount`, `transaction_count` | Aggregated daily payout to all providers |

### IoT Domain (Planned)

| Model | Key Fields | Purpose |
|---|---|---|
| `IoTDevice` | `device_id` (primary key), `paired_user` (OneToOne → ServiceBooker), `is_active`, `last_known_latitude`, `last_known_longitude`, `last_battery_level`, `last_signal_time` | One record per physical device in the field |

---

## 6. Core Algorithms — Deep Dive

### 6.1 Haversine Formula — Distance Calculation

**Files:** `dispatch_logic.py`, `services/pricing.py`

#### What It Does
Calculates the **great-circle distance** (shortest path over Earth's spherical surface) between two GPS coordinates (latitude/longitude pairs).

#### Why Not Euclidean Distance?
Earth is not a flat plane. Treating GPS coordinates as Cartesian (x, y) points and computing √((x2−x1)² + (y2−y1)²) introduces errors that grow with distance. For cities spread over tens of kilometres, this error becomes significant and would cause incorrect provider ranking.

#### Mathematical Formula

```
Given: points P1(lat1, lon1) and P2(lat2, lon2)  [all in radians]

Δlat = lat2 − lat1
Δlon = lon2 − lon1

a = sin²(Δlat / 2) + cos(lat1) × cos(lat2) × sin²(Δlon / 2)

c = 2 × atan2( √a , √(1 − a) )

distance = R × c        where R = 6371 km (Earth's mean radius)
```

The intermediate value `a` represents the square of half the chord length between points. `c` is the angular distance in radians. Multiplying by R gives kilometres.

#### Python Implementation (from `dispatch_logic.py`)
```python
from math import atan2, cos, radians, sin, sqrt

def calculate_distance(lat1, lon1, lat2, lon2):
    """Returns distance in kilometers using Haversine algorithm."""
    R = 6371  # Earth's radius in km

    lat1_rad, lon1_rad = radians(lat1), radians(lon1)
    lat2_rad, lon2_rad = radians(lat2), radians(lon2)

    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad

    a = sin(dlat/2)**2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return R * c  # Distance in km
```

#### Hybrid Strategy: Haversine + Google Maps
Haversine gives **straight-line (as-the-crow-flies)** distance, not road distance. A provider might be 2 km straight-line but 5 km via actual roads. VehicAid uses a two-tier approach:

```
Step 1: Haversine for ALL available providers
        → Fast (no API cost), used to RANK/SORT candidates
        
Step 2: Google Maps Distance Matrix for the TOP CANDIDATE ONLY
        → Accurate road distance used for final price quote
        → Only 1 API call per booking (not 100)
```

This saves ~99% of Google Maps API quota while maintaining pricing accuracy.

---

### 6.2 KNN-Style Provider Dispatch

**File:** `dispatch_logic.py` → `find_nearest_available_provider()`

#### What It Does
Given a service request's GPS location, finds the K nearest available, verified providers — effectively a **K-Nearest Neighbour (KNN) search on GPS coordinates**.

#### Why KNN?
The core dispatch problem — "which provider should I send?" — is a nearest-neighbour problem in 2D geographic space. The features are (latitude, longitude) and the query is the customer's location.

#### Algorithm (Brute-Force 1-NN with Top-3 buffer)

```
INPUT:  ServiceRequest (latitude, longitude, service_type)

STEP 1: FILTER eligible candidates
        DB Query: SELECT * FROM ServiceProvider
                  WHERE is_verified = TRUE
                  AND is_available = TRUE

STEP 2: COMPUTE DISTANCE for each candidate
        For each provider in eligible_list:
            dist = haversine(request.lat, request.lon,
                             provider.lat, provider.lon)
            provider.distance_km = dist

STEP 3: SORT by distance (ascending)
        eligible_list.sort(key=lambda p: p.distance_km)

STEP 4: RETURN TOP 3
        return eligible_list[:3]

OUTPUT: [nearest_provider, 2nd_nearest, 3rd_nearest]
```

#### Dispatch Decision
```
STEP 5: ASSIGN best candidate
        best = candidates[0]
        service_request.provider = best.user
        service_request.status = "DISPATCHED"
        service_request.save()

STEP 6: GENERATE QUOTE for the assigned provider
        (uses Google Maps for accurate road distance)
```

#### Why Return 3, Not Just 1?
The top candidate may reject the job (too far, already moving to another job). The list of 3 provides fallback candidates for retry logic — offer to candidate 2 if candidate 1 doesn't accept within 30 seconds (planned feature).

#### Future Optimisation
At large scale (thousands of active providers), a **PostgreSQL PostGIS spatial index** (`ST_DWithin`) would replace the linear scan, reducing complexity from O(n) to O(log n) for geo-queries.

---

### 6.3 Dynamic Pricing Algorithm

**File:** `services/pricing.py` → `PricingService.calculate_quote()`

#### What It Does
Calculates a transparent, fair, multi-variable price for any combination of service type, vehicle category, subscription plan, and time of day.

#### Pricing Formula

```
Final Price = Round( (base_price + distance_charge) × surge_multiplier × (1 − discount_rate) )

Where:
  base_price      = PRICING_GRID[vehicle_type][service_type]   (INR, fixed by category)
  distance_charge = distance_km × PER_KM_RATE[vehicle_type]
  surge_multiplier:
      PEAK   = 1.2  (Mon–Fri 8–10 AM or 6–9 PM)
      NORMAL = 1.0  (all other times)
  discount_rate:
      FREE    = 0.00  (0% discount)
      BASIC   = 0.10  (10% off)
      PREMIUM = 0.30  (30% off)
      ELITE   = 1.00  (100% off — labor is free)
```

#### Base Price Grid (Selected Rows, in INR)

| Vehicle Type     | Towing | Mechanic | Fuel Delivery | Battery Jump | Per KM Rate |
|------------------|--------|----------|---------------|--------------|-------------|
| Two Wheeler      | ₹199   | ₹99      | ₹49           | ₹149         | ₹15/km      |
| Three Wheeler    | ₹249   | ₹149     | ₹49           | ₹199         | ₹20/km      |
| Four Wheeler     | ₹249   | ₹349     | ₹49           | ₹249         | ₹25/km      |
| SUV              | ₹299   | ₹349     | ₹49           | ₹249         | ₹30/km      |
| Van              | ₹349   | ₹399     | ₹49           | ₹299         | ₹40/km      |
| Truck            | ₹499   | ₹399     | ₹69           | ₹349         | ₹40/km      |

#### Worked Example

```
Scenario: Four Wheeler (sedan), PREMIUM plan, needs MECHANIC,
          provider is 8 km away by road, peak hour (8 AM)

base_price      = ₹349                          (Four Wheeler + Mechanic)
distance_charge = 8 km × ₹25/km = ₹200
subtotal        = ₹349 + ₹200 = ₹549
surge           = ₹549 × 1.2 = ₹658.80          (peak hour 20% surge)
discount        = ₹658.80 × 0.30 = ₹197.64      (PREMIUM 30% off)
final_total     = ₹658.80 − ₹197.64 = ₹461      (rounded to nearest ₹1)
```

#### Final Fare Calculation (Post-Service)

After service is complete, `ServiceQuote.finalize_quote()` is called:

```
Final Bill = base_service + spare_parts + platform_fee + tax

Where:
  service_portion  = base_price + distance_km × ₹15             (simplified)
  spare_parts_total= sum of all spare parts submitted by provider
  platform_fee     = ₹20 flat
  tax_amount       = (service + parts + platform_fee) × 5%

Financial Split:
  provider_payout  = (service_portion × 70%) + spare_parts_total
  expenses_amount  = service_portion × 8%    (fuel, overhead)
  platform_profit  = total − provider_payout − expenses_amount
```

---

### 6.4 Groq AI Triage — AutoMind Engine

**File:** `ai_triage.py` → `AITriageService`

#### What It Does
Analyses a customer's natural language description and produces structured classification output — the **brain** behind VehicAid's "AutoMind" conversational assistant.

#### Why Groq + Llama 3.3?
- **Speed:** Groq's LPU (Language Processing Unit) delivers inference in **< 500ms** — essential for a real-time chat feel.
- **Quality:** Llama 3.3-70b handles mixed English/Hindi text, understands Indian automotive terminology (`puncture`, `RTI`, `auto`).
- **Cost:** Free tier covers thousands of requests/day — far more economical than OpenAI GPT-4 for this classification task.
- **JSON Mode:** Groq supports `response_format={"type": "json_object"}` — guarantees structured output without prompt-hacking.

#### Input → Output

```
Input:  "My engine is smoking and the car won't start"

Output JSON:
{
  "intent":             "BOOK_SERVICE",
  "suggested_type":     "MECHANIC",
  "suggested_priority": "HIGH",
  "diagnostic_advice":  "That sounds like possible engine overheating or an 
                          oil leak. Please don't attempt to restart the engine 
                          — it could cause serious damage. I've triggered 
                          dispatch to get a mechanic to you ASAP.",
  "confidence":         0.95
}
```

#### Intent Classification Rules (from prompt)

| Intent | When | Action |
|---|---|---|
| `BOOK_SERVICE` | User needs emergency help RIGHT NOW | Trigger full booking pipeline |
| `DIAGNOSTICS` | User asks a question about a vehicle problem | Return diagnostic advice only, no booking |
| `SUPPORT` | User asks about VehicAid pricing, coverage, how it works | Return support information |

#### Two-Phase Resilience Design

```
Phase 1 — Groq/AI:
  → Call Groq API (Llama 3.3-70b)
  → Parse JSON response
  → If success: return result

Phase 2 — Rule-Based Fallback (if Groq fails):
  → keyword scan: "smoke" → MECHANIC/HIGH
                  "flat" / "puncture" → FLAT_TIRE/MEDIUM
                  "battery" / "dead" → BATTERY_JUMP/LOW
                  "stuck" / "ditch" → TOWING/URGENT
                  "locked" / "keys" → LOCKOUT/MEDIUM
                  "fuel" / "gas" → FUEL_DELIVERY/LOW
  → Return rule-based result with confidence=0.5
```

This design means the booking system **never crashes** due to AI unavailability. The fallback still provides correct service categorisation for the most common scenarios.

---

### 6.5 Agentic Booking Pipeline

**File:** `agent_logic.py` → `BookingAgent.process_booking()`

The `BookingAgent` class is the **orchestration layer** — it chains AI triage, eligibility checking, database operations, dispatch, pricing, and notifications into a single, transactional flow.

#### Pipeline Steps

```
1. ELIGIBILITY CHECK
   → Query active UserSubscription for this user
   → Determine discount tier

2. AI TRIAGE (AITriageService)
   → Groq/Llama 3.3 analyses the customer's description
   → Returns: intent, suggested_type, priority, advice

3. INTENT GATE
   → If intent != "BOOK_SERVICE":
       Return diagnostic/support response (no booking created)
   → If intent == "BOOK_SERVICE":
       Continue...

4. CREATE ServiceRequest (@transaction.atomic)
   → DB insert: booker, GPS coords, service_type (AI-suggested),
                priority (AI-assigned), source="AGENTIC_SERVICE"

5. TRIGGER DISPATCH (dispatch_logic.py)
   → KNN search → find top 3 nearest verified+available providers
   → Assign best candidate → update request.status = "DISPATCHED"

6. GENERATE QUOTE (PricingService)
   → Google Maps real road distance for the assigned provider
   → Calculate fare with vehicle type + plan discount + surge
   → Create ServiceQuote in DB

7. NOTIFICATIONS (parallel)
   → SMS to customer (Fast2SMS)
   → Push notification to provider (Firebase FCM)
   → WebSocket event to customer dashboard

8. RETURN RESPONSE
   → { status, request_id, AI advice + confirmation message, dispatch details }
```

#### Atomicity Guarantee
Steps 4–6 are wrapped in `@transaction.atomic`. If quote generation fails after the ServiceRequest is created, PostgreSQL rolls back the entire transaction. This prevents **orphaned records** (service requests with no quote, or quotes with no matching request).

---

### 6.6 Loyalty Rewards Tier System

**File:** `models.py` → `RewardsProgram`

#### Tier Structure

| Tier | Points Range | Point Multiplier |
|---|---|---|
| BRONZE | 0 – 499 | 1.0× |
| SILVER | 500 – 1,499 | 1.5× |
| GOLD | 1,500+ | 2.0× |

#### Points Earned Per Service

```
points_earned = int( (10 + distance_km) × tier_multiplier )

Base 10 points per service
+1 point per km travelled (rewards urban + highway users equally)
× Tier multiplier (Gold users progress faster, encouraging subscription upgrade)
```

#### Redemption
```
1 point = ₹0.10 wallet credit

100 points → ₹10 wallet credit
1,000 points → ₹100 wallet credit
```

#### Referral Program
```
User A shares referral code → User B signs up using it
Result: User A gets +500 bonus points (~Silver tier threshold)
Why: Viral growth incentive; acquisition cost is lower than ad spending
```

---

### 6.7 Financial Settlement Algorithm

**File:** `payments/tasks.py` (Celery Beat cron task)

```
Runs daily at midnight:

1. QUERY: All transactions WHERE status='SUCCESS' AND settled=False
          for today's date

2. GROUP by provider

3. FOR each provider:
     provider_earnings = sum(provider_payout_amount)
     
4. CREATE DailySettlement record:
     settlement_date = today
     total_platform_revenue = sum(platform_commission)
     total_provider_payout_amount = sum(provider_payout_amount)
     transaction_count = len(transactions)

5. MARK transactions: settled = True

6. (Future) Trigger bank transfer via Razorpay Payout API
```

---

## 7. Real-Time System — WebSockets & Celery

### WebSocket Architecture (Django Channels)

**File:** `consumers.py` → `ServiceTrackingConsumer`

```
CUSTOMER BROWSER
  ↓ WebSocket connect
ws://api:8001/ws/service/{request_id}/
  ↓
Django Channels Consumer
  → channel_layer.group_add("service_1042", channel_name)
  → accept()

[Events flow INTO the group from backend:]
  dispatch_logic.py sends: group_send("service_1042", {type: "status_update", ...})
  Consumer.status_update() → sends to WebSocket

[Events from PROVIDER to customer:]
  Provider app sends JSON: {"provider_location": true, "latitude": 12.97, "longitude": 77.59}
  Consumer.receive() → group_send() → all subscribers in "service_1042" see provider's GPS
```

The Redis Channel Layer acts as a **message bus** — even if the backend runs 3 pods in K8s, they all share the same Redis channel layer and can communicate.

### Celery Beat Scheduled Tasks

| Task | Cron Schedule | What It Does |
|---|---|---|
| `daily_settlement` | `0 0 * * *` (midnight) | Aggregate and record daily provider payouts |
| `check_subscription_expiry` | `0 6 * * *` (6 AM daily) | Mark expired subscriptions; send renewal reminders |
| `deactivate_stale_providers` | Every 30 minutes | Mark providers as unavailable if no GPS ping in > 1 hour |

---

## 8. IoT Device Integration (Planned)

### Hardware Concept

VehicAid's proprietary 2-button device is designed for vehicle dashboard installation:

| Button | Colour | Mapped Service | Priority |
|---|---|---|---|
| Button 1 | Yellow | `COMMON_FIX_IOT` (Fuel, flat tyre, battery) | HIGH |
| Button 2 | Red | `MAJOR_TOWING_IOT` (Mechanic,Towing) | URGENT |

The device contains:
- **GNSS receiver** — reads current GPS coordinates on press
- **LTE/NB-IoT modem** — transmits over cellular (works in low-signal areas)
- **Power management** — battery level reported with each packet

### IoT Data Flow

```
[Physical Button Press]
        ↓
[Device reads GPS + battery]
        ↓
[Device publishes MQTT packet to Cloud MQTT Broker (e.g., HiveMQ Cloud)]
  Payload: { "device_id": "VA-HW-001", "latitude": 12.97, "longitude": 77.59,
             "button_pressed": 2, "battery": 78 }
        ↓
[MQTT Broker → HTTP Bridge]
        ↓
[POST /api/v1/iot/ingest/]  (AllowAny, no user auth needed)
        ↓
[IoTDataIngestionView]
  1. Validate payload (IoTDataSerializer)
  2. Update IoTDevice DB record: GPS, battery, last_signal_time, is_active=True
  3. If button in [1, 2]:
       Celery task: process_iot_button_press_async.delay(device_id, button, lat, lon)
  4. Return HTTP 202 Accepted (< 100ms response)
        ↓
[Celery Worker — process_iot_button_press_async]
  1. Lookup IoTDevice in DB → find paired_user (ServiceBooker)
  2. Determine service_type from button_id
  3. Call BookingAgent(user).process_booking(...)
     → Full AI + Dispatch + Pricing + Notification pipeline runs
```

#### Why MQTT for IoT?
- **MQTT (Message Queuing Telemetry Transport)** is the industry standard for IoT — designed for unreliable networks and low-power devices.
- **Publish-Subscribe model** decouples the device from the backend. The device publishes; the backend (or any analytics service) subscribes.
- Uses only **~200 bytes per packet** — critical for LTE IoT SIM data cost efficiency.

#### Why the IoT Endpoint is `AllowAny`
The device has no user account — it cannot authenticate with JWT. Instead, the `device_id` (burned into firmware at manufacturing) serves as a hardware-level identifier that must match a registered device in the database. Unrecognised `device_id` values are rejected silently.

---

## 9. Payment Flow — Razorpay Integration

**Files:** `payments/views.py`, `payments/models.py`

### Why Razorpay Over Stripe/PayPal?
- **Native UPI support** — GPay, PhonePe, Paytm (dominant in India, ~75% of digital payments)
- **INR settlement** — direct deposit to Indian bank accounts without currency conversion fee
- **Indian compliance** — RBI-compliant, PCI-DSS certified
- **Test mode is completely free** — no charges during development

### Full Payment Lifecycle

```
STEP 1: Customer reviews and approves ServiceQuote
             ↓
STEP 2: POST /api/v1/payments/create-order/
        → Backend calls Razorpay Orders API
        → Razorpay returns: { razorpay_order_id, amount (paise), currency: "INR" }
        → Django creates Transaction(status="PENDING", razorpay_order_id=...)
             ↓
STEP 3: Frontend opens Razorpay Checkout modal
        → Customer selects: UPI / Card / Netbanking / VehicAid Wallet
        → Payment processed inside Razorpay's secure iframe
        → On success: { razorpay_payment_id, razorpay_signature } returned to frontend
             ↓
STEP 4: POST /api/v1/payments/verify/
        → Backend verifies HMAC-SHA256 signature:
          
          expected_signature = HMAC_SHA256(
              key    = razorpay_key_secret,
              message = razorpay_order_id + "|" + razorpay_payment_id
          )
          
          if hmac_equals(expected, received): GENUINE payment
          else: reject with 400 (payment tampered/spoofed)
        
        → Transaction.status = "SUCCESS"
        → ServiceRequest.status = "COMPLETED"
        → RewardsProgram.reward_for_service(request)   # add loyalty points
            ↓
STEP 5: Daily Celery task aggregates and settles provider payouts
```

#### Why HMAC-SHA256 Signature Verification?
Without verification, any malicious user could send a fake POST to `/payments/verify/` claiming they paid, and receive free service. The HMAC signature can **only be generated by Razorpay** (it requires the secret key). The backend re-computes the expected signature and rejects any mismatch.

---

## 10. Security Design

### Authentication & Authorisation
```
All API endpoints require: Authorization: Bearer <JWT access_token>

Permission tiers:
  AllowAny       → IoT ingestion, public stats, registration
  IsAuthenticated → All user-facing endpoints
  IsAdminUser    → Admin management endpoints, device fleet view
```

### Data Integrity
- **`@transaction.atomic`** wraps all multi-step booking flows — guarantees no partial writes
- **`Decimal` (not `float`)** used for all financial arithmetic — avoids floating-point rounding errors (₹0.001 errors in 10,000 transactions = ₹10 discrepancy)
- **HMAC verification** on all Razorpay callbacks — prevents fake payment confirmation attacks

### Credential Management
- Secrets stored in `.env` (local) or Kubernetes Secrets (production)
- `.env` files listed in `.gitignore` — never committed
- `.env.example` in repo with placeholder values for documentation
- Production: all secrets mounted as K8s environment variables, never embedded in Docker images

### API Hardening
- Rate limiting on authentication endpoints (`djangorestframework-throttle`)
- CORS: strict origin whitelist in production
- HTTPS enforced via Let's Encrypt in production
- PostgreSQL: SSL/TLS required; IP whitelist restricts connections to backend pods only

---

## 11. API Design — Key Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register/` | Register new user; returns JWT tokens |
| POST | `/api/v1/auth/login/` | Login; returns access + refresh tokens |
| POST | `/api/v1/auth/token/refresh/` | Get new access token using refresh token |
| POST | `/api/v1/auth/logout/` | Blacklist refresh token |

### Services & Booking
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/service-requests/` | List my service requests |
| POST | `/api/v1/service-requests/` | Create request (triggers full agentic pipeline) |
| GET | `/api/v1/service-requests/{id}/` | Get request details + quote + status |
| PATCH | `/api/v1/service-requests/{id}/` | Update status (provider workflow) |
| DELETE | `/api/v1/service-requests/{id}/` | Cancel request |
| POST | `/api/v1/services/automind/` | AutoMind AI chat (Groq triage) |
| POST | `/api/v1/services/quotes/{id}/accept/` | Customer accepts quote |
| POST | `/api/v1/services/quotes/{id}/finalize/` | Provider submits final fare |

### Payments
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/payments/create-order/` | Create Razorpay order |
| POST | `/api/v1/payments/verify/` | Verify Razorpay HMAC signature |
| GET | `/api/v1/payments/history/` | Payment history for user |

### Chat
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/chat/?request_id={id}` | Get all messages for a request |
| POST | `/api/v1/chat/` | Send message (text or image) |

### Providers
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/providers/analytics/` | Earnings analytics dashboard data |
| GET | `/api/v1/providers/documents/` | List uploaded documents |
| POST | `/api/v1/providers/documents/upload/` | Upload verification document |

### IoT
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/iot/ingest/` | Receive IoT device data from MQTT bridge |
| GET | `/api/v1/iot/device/` | User: get status of paired device |
| GET | `/api/v1/iot/devices/` | Admin: fleet overview of all devices |

### Admin & Analytics
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/stats/public/` | Public landing page stats (total users, requests) |
| GET | `/api/v1/admin/reports/` | Filtered reports for admin dashboard |

### WebSocket
| Protocol | URL | Description |
|---|---|---|
| WS | `ws://api/ws/service/{request_id}/` | Real-time service tracking (status + GPS) |

---

## 12. Deployment Architecture

### Local Development (Docker Compose)
```bash
cd infrastructure
docker-compose up -d

# Services start automatically:
# Django API        → localhost:8001
# Admin Panel       → localhost:3000
# Provider App      → localhost:3001
# Booker App        → localhost:3003
# PostgreSQL        → localhost:5432
# Redis             → localhost:6379
```

### Production (Kubernetes)
```
Internet
    ↓ HTTPS (TLS via Let's Encrypt)
LoadBalancer Services:
    /api/*  → Django Backend Deployment (3 replicas, auto-scales to 10)
    /       → Next.js Booker App Pods
    /admin  → Next.js Admin App Pods
    /pro    → Next.js Provider App Pods
    :9090   → Prometheus
    :3000   → Grafana

Persistent Volumes:
    PV 20Gi  → PostgreSQL data files
    PV 10Gi  → Django media (documents, chat images)

K8s Secrets (not in git):
    db-credentials        → POSTGRES_USER, POSTGRES_PASSWORD
    api-keys              → GROQ_API_KEY, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
    firebase-credentials  → Firebase Admin JSON
    google-maps           → GOOGLE_MAPS_API_KEY
```

### GitHub Actions CI/CD
```
Trigger: push to main branch

Job 1 — Test:
    ├── Set up Python 3.12
    ├── pip install -r requirements.txt
    ├── python manage.py migrate
    └── pytest  → if ANY test fails, pipeline stops here

Job 2 — Build (only if Job 1 passes):
    ├── docker build -t vehicaid-backend:$GITHUB_SHA .
    └── docker push to container registry

Job 3 — Deploy (only if Job 2 passes):
    ├── kubectl set image deployment/vehicaid-backend vehicaid-backend=vehicaid-backend:$GITHUB_SHA
    └── kubectl rollout status deployment/vehicaid-backend
         (waits for rolling update to complete with zero downtime)
```

---

## 13. Complete Flow — Booking a Service (End to End)

**Scenario:** x's car breaks down on NH44. He opens the VehicAid booker web app and types into the AutoMind chat: *"My engine is smoking badly and the car won't start"*

```
════════════════════════════════════════════════════════════════
  LAYER: CUSTOMER BROWSER (Next.js booker app)
════════════════════════════════════════════════════════════════

X types and hits Send.
Frontend reads: GPS coords (12.9716°N, 77.5946°E) via browser geolocation.
Sends: POST /api/v1/services/automind/
       { "message": "My engine is smoking badly...", "latitude": 12.9716, "longitude": 77.5946 }

════════════════════════════════════════════════════════════════
  LAYER: DJANGO API — views.py
════════════════════════════════════════════════════════════════

JWT verified → user = X (PREMIUM plan)
→ Calls BookingAgent(user=X).process_booking(data)

════════════════════════════════════════════════════════════════
  LAYER: AGENTIC CORE — BookingAgent
════════════════════════════════════════════════════════════════

STEP 1 — TRIAGE (AITriageService.analyze_request)
  → Groq API call: llama-3.3-70b-versatile with prompt
  ← AI Response:
    {
      "intent": "BOOK_SERVICE",
      "suggested_type": "MECHANIC",
      "suggested_priority": "HIGH",
      "diagnostic_advice": "Smoking could mean overheating or an oil leak.
                            Don't try to restart — I'm sending help now.",
      "confidence": 0.95
    }

STEP 2 — INTENT GATE: BOOK_SERVICE → proceed

STEP 3 — CREATE ServiceRequest (@transaction.atomic)
  DB INSERT: ServiceRequest {
    id: 1042, booker: X, service_type: MECHANIC, priority: HIGH,
    latitude: 12.9716, longitude: 77.5946, status: PENDING_DISPATCH,
    source: AGENTIC_SERVICE
  }

STEP 4 — DISPATCH (dispatch_logic.trigger_dispatch)
  → DB Query: verified=True AND available=True providers
  → Haversine computed for each:
      Y : 2.1 km,  Abdul: 3.5 km,  Raju: 5.8 km
  → Sorted: [Y, Abdul, Raju]
  → ASSIGN Y to request_1042
  → request_1042.status = "DISPATCHED"
  → DB SAVE

STEP 5 — QUOTE (PricingService.calculate_quote)
  → get_real_distance(): Google Maps Distance Matrix API
      road distance = 2.8 km, ETA = 10 minutes
  → base_price = ₹349  (MECHANIC, FOUR_WHEELER)
  → distance_charge = 2.8 × ₹25 = ₹70
  → subtotal = ₹419
  → surge = 1.0 (not peak hour)
  → PREMIUM discount = 30% off → ₹419 × 0.70 = ₹293
  → DB INSERT: ServiceQuote { id: 802, dynamic_total: ₹293, valid_until: +30min }

STEP 6 — NOTIFICATIONS
  → Fast2SMS: "VehicAid: Mechanic dispatched! ETA ~10min. Quote: ₹293. Track: vehicaid.app/r/1042"
  → Firebase FCM to Y: "New MECHANIC job 2.1km away! Tap to accept."
  → Django Channels: group_send("service_1042", { status: "DISPATCHED", provider: "Y" })

STEP 7 — RESPONSE
  {
    "status": "SUCCESS",
    "request_id": 1042,
    "message": "Smoking could mean overheating. Don't try to restart.\n
                ✅ MISSION TRIGGERED: Provider dispatched to your coordinates.",
    "dispatch_details": { "quote_id": 802, "total_amount": "293.00" }
  }

════════════════════════════════════════════════════════════════
  LAYER: CUSTOMER BROWSER — receives response
════════════════════════════════════════════════════════════════

Chat UI shows AutoMind response + Quote card (₹293, Accept/Reject buttons)
Map widget initialised
WebSocket connects: ws://api/ws/service/1042/
Quote accepted → POST /api/v1/services/quotes/802/accept/

════════════════════════════════════════════════════════════════
  LAYER: PROVIDER APP — Y's dashboard
════════════════════════════════════════════════════════════════

FCM push received → job card appears on Y's screen
Y accepts job
→ WebSocket sends: { "provider_location": true, "latitude": 12.974, "longitude": 77.591 }
→ Django Channels broadcasts Y's GPS to "service_1042" group
→ X sees Y's pin moving on his map every 10 seconds

Y arrives:
→ PATCH /api/v1/service-requests/1042/ { "status": "ARRIVED" }
→ WebSocket pushes "ARRIVED" event to X's browser → notification sound

Y completes work:
→ POST /api/v1/services/quotes/802/finalize/
    { "spare_parts": [{ "name": "radiator hose clamp", "price": 120 }] }
→ finalize_quote() runs:
    service_portion = ₹349 + 2.8×₹15 = ₹391
    spare_parts_total = ₹120
    platform_fee = ₹20
    subtotal = ₹531
    tax (5%) = ₹26.55
    FINAL TOTAL = ₹557.55 ≈ ₹558
    provider_payout = ₹391×70% + ₹120 = ₹393.70
    platform_profit = ₹558 − ₹393.70 − ₹391×8% = ₹133
→ request_1042.status = "FINAL_FARE_PENDING"

════════════════════════════════════════════════════════════════
  LAYER: CUSTOMER — final payment
════════════════════════════════════════════════════════════════

X sees final bill: ₹558 (includes ₹120 spare part)
X approves → POST /api/v1/payments/create-order/  → Razorpay order created
Razorpay Checkout opens → X pays via UPI (PhonePe)
POST /api/v1/payments/verify/
  → HMAC-SHA256 verified ✓
  → Transaction.status = "SUCCESS"
  → request_1042.status = "COMPLETED"
  → RewardsProgram: points += int((10 + 2.8) × 1.5) = 19 points  [SILVER tier]

X rates Y: ⭐⭐⭐⭐ (4 stars)

════════════════════════════════════════════════════════════════
  LAYER: CELERY — midnight settlement
════════════════════════════════════════════════════════════════

Daily settlement task runs:
  Y receives: ₹391×70% + ₹120 = ₹393.70 into provider wallet
  DailySettlement record created for today
  Transaction marked settled=True
```

---

## 14. Why This Architecture Works — Summary

| Design Decision | Rationale |
|---|---|
| **Django monolith** over microservices | Faster to build, simpler testing, no distributed systems complexity at startup scale; can always extract services later |
| **3 separate Next.js apps** | Clean privilege isolation per role; independent deployment and scaling |
| **Groq + Llama 3.3** over GPT-4 | 10× faster inference, cheaper per token, sufficient quality for triage and classification |
| **Haversine for ranking + Google Maps for final quote** | Saves ~99% of API quota; Haversine is accurate enough for sorting, Maps API is accurate enough for billing |
| **Redis as cache + broker** | Reduces infra complexity; one service reliably handles both caching and async task delivery |
| **Razorpay** over Stripe | Built for India; native UPI support; INR settlement without currency fees |
| **PostgreSQL** over MongoDB | ACID guarantees are non-negotiable for financial data; relational model naturally fits the domain |
| **Celery for async** | IoT device needs < 100ms HTTP response; booking processing takes 1-3 seconds; async bridges this gap |
| **Firebase FCM** over custom push | Cross-platform (iOS + Android + Web); globally reliable; zero infrastructure cost |
| **`@transaction.atomic`** wrappers | Prevents orphaned financial records in multi-step booking flows |
| **Decimal arithmetic** for money | Eliminates floating-point precision errors in financial calculations |
| **Two-phase AI (Groq → Rules)** | System never fails due to AI API downtime; rules handle 95% of common cases correctly |
| **HMAC payment verification** | Prevents fake payment confirmation attacks — only Razorpay can generate valid signatures |

---

*VehicAid v2.6.0 — Built for the Indian roadside*
