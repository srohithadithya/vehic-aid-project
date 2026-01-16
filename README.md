# 🚗 Vehic-Aid: AI-Powered Roadside Assistance Platform

**A next-generation, agentic platform connecting stranded motorists with nearby service providers.**

![Logo](web/admin/public/logo.png)

## 🌟 Executive Summary

Vehic-Aid is an intelligent **Command Center** for roadside assistance. It leverages **Agentic AI** to coordinate service requests, ensuring the fastest possible response time by dynamically ranking providers based on real-time location and availability.

The platform includes a **High-End "Cosmic Glass" Admin Panel** for operators to monitor the entire ecosystem with subscription intelligence, automated dispatching, and live revenue tracking.

---

## ⚡ Quick Start (Docker Verification)

1. Navigate to the infrastructure directory:
   ```powershell
   cd infrastructure
   ```

2. Start the verification environment:
   ```powershell
   docker-compose -f docker-compose.verify.yml up --build -d
   ```

## Services & Credentials

### **Web Admin Panel**
- **URL**: [http://localhost:3002/login](http://localhost:3002/login)
- **Username**: `admin_mobile`
- **Password**: `password123`

### **Web Provider App (Mission Control)**
- **URL**: [http://localhost:3001](http://localhost:3001)
- **Features**: Real-time Dispatch, Earnings Tracker, "Cosmic Glass" UI.

### **Web Booker App (Customer)**
- **URL**: [http://localhost:3000](http://localhost:3000)
- **Features**: Premium Auth, Subscription Plans (INR), Service Requests.

### **Command Center (Backend Admin)**
- **Backend**: `http://localhost:8001`
- **Admin Panel**: `http://localhost:3002`
- **Provider App**: `http://localhost:3001`
- **Booker App**: `http://localhost:3000`

### **API Documentation**
- **Swagger/OpenAPI**: [http://localhost:8001/api/docs/](http://localhost:8001/api/docs/)

---

## 🚀 Key Features

### 🧠 Smart Agentic Dispatch
- **Intelligent Ranking**: Uses **Haversine Distance** algorithms to find the nearest valid provider.
- **Automated Coordination**: `BookingAgent` manages the lifecycle from request -> dispatch -> confirmation.
- **Auto-Escalation**: Background tasks monitor stuck requests and re-dispatch automatically.

### 🎨 Cosmic Glass Admin Panel & Booker
- **Premium UI**: Deep midnight blue theme with neon accents and frosted glass effects.
- **High-Security Auth**: Multi-step registration with identity verification and password strength analysis.
- **Live Dashboard**: Interactive visualizations for Revenue and Active Users.

### 💼 V3 Provider Mission Control
- **Glassmorphism Dashboard**: A stunning, "App-like" web experience for providers with rich gradients and animations.
- **Provider Identity**: Unique **PRO-XXXXXX** IDs, verified statuses, and dynamic service expertises tied to individual performance.
- **Real-Time Financials**: Live tracking of Earnings, Pending Payouts, and Transaction History powered by granular backend APIs.
- **Banking Integration**: Secure display of linked bank accounts and automated daily settlements via Razorpay X.
- **Digital Wallet**: Visual credit-card style wallet component for checking balance at a glance.

### 🇮🇳 Indian Market Localization
- **Currency**: All pricing in INR (₹) with affordable tiers (Free, Basic, Premium).
- **Compliance**: Automated SMS reminders for **Insurance** and **PUC** expiry.
- **Languages**: Multilingual support for 8+ Indian languages.
- **Payments**: Integrated **Razorpay** for seamless UPI and Card transactions.

### 📱 IoT & Real-Time Tracking
- **Connected Vehicle**: Simulates IoT device heartbeats for vehicle health monitoring.
- **Live Updates**: WebSocket integration for real-time status changes.

---

## 🛠️ Technology Stack

### Backend (The Core)
- **Framework**: Django 5.0 (Python) with Django REST Framework.
- **Database**: PostgreSQL 14 (Strictly Enforced).
- **Async**: Daphne + Channels (WebSockets).
- **Task Queue**: Celery + Redis.
- **Security**: Full API permission audit (IsAdminUser/IsAuthenticated).

### Frontend (The Face)
- **Framework**: Next.js 15 (App Router).
- **Styling**: Tailwind CSS + shadcn/ui.
- **Components**: Lucide Icons + Framer Motion.
- **Charts**: Recharts.

### Integrations
- **Payments**: Razorpay.
- **SMS**: Fast2SMS (simulated wrapper).
- **Maps**: OpenStreetMap / Google Maps integration.

---

## 📂 Project Structure
- **Frontend**: Next.js apps in `web/`
  - `web/admin`: Admin Panel
  - `web/booker`: Booking App
  - `web/provider`: Provider App
- **Backend**: Django in `backend/`
- **Infrastructure**: Docker & Deployment configurations in `infrastructure/`

## 🔒 Security & Privacy
- **Permission Audit**: Strict IsAuthenticated/IsAdminUser checks on all sensitive endpoints.
- **Audit Logging**: Tracks all critical admin actions.
- **Data Privacy**: PII masking in logs and secure user profile abstractions.

---

**Built with ❤️ for the Future of Roadside Assistance.**

## 🏃 Run Commands (New!)

### **Quick Start (Docker)**
The easiest way to run the full stack:
```bash
docker-compose -f infrastructure/docker-compose.verify.yml up --build -d
```
Then access:
- **Provider Dashboard**: http://localhost:3001
- **Booker App**: http://localhost:3000
- **Admin Panel**: http://localhost:3002

### **Mobile Apps (Expo)**
Ensure the backend is running first.

**Mobile Booker**:
```bash
cd mobile-booker
npm install
npx expo start -c
```

**Mobile Provider**:
```bash
cd mobile-provider
npm install
npx expo start -c
```
*Press 'a' to run on Android Emulator.*
