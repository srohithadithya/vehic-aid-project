# 🚗 Vehic-Aid: AI-Powered Roadside Assistance Platform

**A next-generation, agentic platform connecting stranded motorists with nearby service providers.**

![Logo](web-admin-panel/admin/public/logo.png)

---

## 🌟 Executive Summary

Vehic-Aid is an intelligent **Command Center** for roadside assistance. It leverages **Agentic AI** to coordinate service requests, ensuring the fastest possible response time by dynamically ranking providers based on real-time location and availability.

The platform includes a **High-End "Cosmic Glass" Admin Panel** for operators to monitor the entire ecosystem with subscription intelligence, automated dispatching, and live revenue tracking.

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
- **Languages**: Multilingual support for 8+ Indian languages (Hindi, Tamil, Telugu, etc.).
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

## ⚡ Quick Start

### 1. Launch Backend & Infrastructure
```bash
cd backend
docker-compose up -d --build
```
*This starts Django, PostgreSQL, Redis, and Celery Workers.*

### 2. Launch Web Apps
Each web app requires `npm install` before running.
- **Admin Panel**: `cd web-admin-panel/admin && npm run dev`
- **Booker App**: `cd web-booker && npm run dev`
- **Provider App**: `cd web-provider && npm run dev`

### 3. Launch Mobile Apps (Expo)
- **Mobile Booker**: `cd mobile-booker && npx expo start`
- **Mobile Provider**: `cd mobile-provider && npx expo start`

### 4. Access
- **Admin Panel**: [http://localhost:3000](http://localhost:3000)
- **Booker App**: [http://localhost:3001](http://localhost:3001)
- **Provider App**: [http://localhost:3002](http://localhost:3002)
- **Backend API**: [http://localhost:8000/api/v1/](http://localhost:8000/api/v1/)

---

## 📂 Project Structure
Refer to **`PROJECT_MAP.md`** for a detailed architectural breakdown.

---

## 🔒 Security & Privacy
- **Permission Audit**: Strict IsAuthenticated/IsAdminUser checks on all sensitive endpoints.
- **Audit Logging**: Tracks all critical admin actions.
- **Data Privacy**: PII masking in logs and secure user profile abstractions.

---

**Built with ❤️ for the Future of Roadside Assistance.**
