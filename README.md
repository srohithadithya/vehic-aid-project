# 🚗 Vehic-Aid: AI-Powered Roadside Assistance Platform

**A next-generation, agentic platform connecting stranded motorists with nearby service providers.**
<<<<<<< HEAD

![Logo](web-admin-panel/public/logo.png)

## 📚 Documentation

## 🌟 Executive Summary

Vehic-Aid is not just a booking app; it's an intelligent **Command Center** for roadside assistance. It leverages **Agentic AI** to coordinate service requests, ensuring the fastest possible response time by dynamically ranking providers based on real-time location.

The platform comes with a **High-End "Cosmic Glass" Admin Panel** for operators to monitor the entire ecosystem with subscription intelligence and live revenue tracking.

---

## 🚀 Key Features

### 🧠 Smart Agentic Dispatch
- **Intelligent Ranking**: Uses **Haversine Distance** algorithms to find the nearest valid provider.
- **Automated Coordination**: `BookingAgent` manages the lifecycle from request -> dispatch -> confirmation.
- **Auto-Escalation**: Background tasks monitor stuck requests and re-dispatch automatically.

### 🎨 Cosmic Glass Admin Panel
- **Premium UI**: Deep midnight blue theme with neon accents and frosted glass effects.
- **Live Dashboard**: Interactive visualizations (Recharts) for Revenue Velocity and Active Users.
- **Subscription Analytics**: Dedicated insights page for MRR (Monthly Recurring Revenue) and plan churn.

### 🇮🇳 Indian Market Localization
- **Compliance**: Automated SMS reminders for **Insurance** and **PUC** expiry.
- **Languages**: Backend support for 7+ Indian languages (Hindi, Tamil, Telugu, etc.).
- **Payments**: Integrated **Razorpay** for seamless UPI and Card transactions.

### 📱 IoT & Real-Time Tracking
- **Connected Vehicle**: Simulates IoT device heartbeats for vehicle health monitoring.
- **Live Updates**: WebSocket integration for real-time status changes.

---

## 🛠️ Technology Stack

### Backend (The Core)
- **Framework**: Django 5.0 (Python) with Django REST Framework.
- **Database**: PostgreSQL 14.
- **Async**: Daphne + Channels (WebSockets).
- **Task Queue**: Celery + Redis.
- **API Documentation**: Swagger/OpenAPI.

### Frontend (The Face)
- **Framework**: Next.js 16 (App Router).
- **Styling**: Tailwind CSS v4 + Framer Motion.
- **Components**: Shadcn/UI + Lucide Icons.
- **Charts**: Recharts.

### Integrations
- **Payments**: Razorpay.
- **SMS**: Fast2SMS (simulated wrapper).
- **Maps**: Haversine Logic (Backend) / OpenStreetMap ready.

---

## ⚡ Quick Start (Docker)

Get the entire platform running in minutes.

### 🔄 Automated Updates
To keep your repository in sync with the latest changes, run:
```powershell
./sync-repo.ps1
```

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local frontend dev)

### 1. Launch Backend & Infrastructure
```bash
cd backend
docker-compose up -d --build
```
*This starts Django, PostgreSQL, Redis, and Celery Workers.*

### 2. Launch Admin Panel
```bash
cd web-admin-panel/admin
npm install
npm run dev
```

### 3. Access the Platform
- **Admin Panel**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000/api/v1/](http://localhost:8000/api/v1/)
- **Django Admin**: [http://localhost:8000/admin/](http://localhost:8000/admin/)

---

=======

![Logo](backend/web_admin/static/img/logo/vehic_aid_logo.png)

---

## 🌟 Executive Summary

Vehic-Aid is not just a booking app; it's an intelligent **Command Center** for roadside assistance. It leverages **Agentic AI** to coordinate service requests, ensuring the fastest possible response time by dynamically ranking providers based on real-time location.

The platform comes with a **High-End "Cosmic Glass" Admin Panel** for operators to monitor the entire ecosystem with subscription intelligence and live revenue tracking.

---

## 🚀 Key Features

### 🧠 Smart Agentic Dispatch
- **Intelligent Ranking**: Uses **Haversine Distance** algorithms to find the nearest valid provider.
- **Automated Coordination**: `BookingAgent` manages the lifecycle from request -> dispatch -> confirmation.
- **Auto-Escalation**: Background tasks monitor stuck requests and re-dispatch automatically.

### 🎨 Cosmic Glass Admin Panel
- **Premium UI**: Deep midnight blue theme with neon accents and frosted glass effects.
- **Live Dashboard**: Interactive visualizations (Recharts) for Revenue Velocity and Active Users.
- **Subscription Analytics**: Dedicated insights page for MRR (Monthly Recurring Revenue) and plan churn.

### 🇮🇳 Indian Market Localization
- **Compliance**: Automated SMS reminders for **Insurance** and **PUC** expiry.
- **Languages**: Backend support for 7+ Indian languages (Hindi, Tamil, Telugu, etc.).
- **Payments**: Integrated **Razorpay** for seamless UPI and Card transactions.

### 📱 IoT & Real-Time Tracking
- **Connected Vehicle**: Simulates IoT device heartbeats for vehicle health monitoring.
- **Live Updates**: WebSocket integration for real-time status changes.

---

## 🛠️ Technology Stack

### Backend (The Core)
- **Framework**: Django 5.0 (Python) with Django REST Framework.
- **Database**: PostgreSQL 14.
- **Async**: Daphne + Channels (WebSockets).
- **Task Queue**: Celery + Redis.
- **API Documentation**: Swagger/OpenAPI.

### Frontend (The Face)
- **Framework**: Next.js 16 (App Router).
- **Styling**: Tailwind CSS v4 + Framer Motion.
- **Components**: Shadcn/UI + Lucide Icons.
- **Charts**: Recharts.

### Integrations
- **Payments**: Razorpay.
- **SMS**: Fast2SMS (simulated wrapper).
- **Maps**: Haversine Logic (Backend) / OpenStreetMap ready.

---

## ⚡ Quick Start (Docker)

Get the entire platform running in minutes.

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local frontend dev)

### 1. Launch Backend & Infrastructure
```bash
cd backend
docker-compose up -d --build
```
*This starts Django, PostgreSQL, Redis, and Celery Workers.*

### 2. Launch Admin Panel
```bash
cd web-admin-panel/admin
npm install
npm run dev
```

### 3. Access the Platform
- **Admin Panel**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000/api/v1/](http://localhost:8000/api/v1/)
- **Django Admin**: [http://localhost:8000/admin/](http://localhost:8000/admin/)

---

>>>>>>> origin/main
## 🔌 API Reference

### Authentication
- `POST /api/v1/users/token/`: Get JWT Access/Refresh tokens.
- `POST /api/v1/users/register/`: Create new user account.

### Services
- `POST /api/v1/services/book/`: **Agentic Booking** (Smart Dispatch).
- `GET /api/v1/services/subscriptions/analytics/`: **Business Intelligence** data.

### Payments
- `POST /api/v1/payments/create_order/`: Initialize Razorpay order.

---

## 📂 Project Structure

```text
vehic-aid-project/
├── backend/             # Django Agentic Backend
│   ├── apps/
│   │   ├── services/       # Dispatch & Booking Logic
│   │   ├── users/          # Auth & Profiles
│   │   └── payments/       # Razorpay Integration
│   └── docker-compose.yml
├── web-admin-panel/        # Next.js "Cosmic Glass" Frontend
│   └── admin/
│       ├── app/            # App Router Pages (Dashboard, Login)
│       └── components/     # UI Components (Sidebar, Charts)
└── README.md               # You are here
```

---

## 🔒 Security & Privacy
- **Audit Logging**: Tracks all critical admin actions (`django-auditlog`).
- **PII Masking**: Logs mask phone numbers and sensitive info.
- **Throttling**: Rate limiting on all auth & booking endpoints.

---

**Built with ❤️ for the Future of Roadside Assistance.**
