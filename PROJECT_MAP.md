# 🗺️ Vehic-Aid Master Project Map (Runmap)

Comprehensive guide for architecture, setup, and execution of the Vehic-Aid ecosystem.

---

## 🏛️ 1. Architecture Overview
The project is a multi-tier, AI-powered roadside assistance platform.

### **Core Services (Backend)**
- **`backend/`**: Django 5.0 REST API. Contains the `BookingAgent` (AI Dispatch), `SubscriptionEngine`, and `PaymentGateway` (Razorpay).
- **`iot-firmware/`**: Simulation logic for vehicle telemetry and emergency button heartbeats.

### **Web Interfaces (Next.js)**
- **`web-booker/`**: Customer-facing portal for requesting assistance in seconds.
- **`web-provider/`**: Real-time dashboard for service providers to manage jobs.
- **`web-admin-panel/`**: "Cosmic Glass" management console for full platform control.

### **Mobile Applications (Expo)**
- **`mobile-booker/`**: Phase 2 customer app (React Native).
- **`mobile-provider/`**: Phase 2 provider app (React Native).

### **Support Layers**
- **`infrastructure/`**: Docker Compose, Render configs, and AWS deployment manifests.
- **`scripts/`**: Automation for setup, repository syncing, and health checks.
- **`tests/`**: Suite of unit and integration tests for backend and mobile logic.
- **`docs/`**: Detailed guides for developers and deployment.

---

## 🚀 2. Server Execution Commands

### **Full Stack (Dockerized)**
To launch the entire backend ecosystem including DB, Redis, and Workers:
```bash
cd infrastructure
docker-compose up -d --build
```

### **Manual Backend Execution**
1. **Migrations**: `python manage.py migrate`
2. **Server**: `python manage.py runserver`
3. **Workers**: `celery -A core worker -l info`
4. **WebSocket**: `daphne -b 0.0.0.0 -p 8001 core.asgi:application`

### **Frontend Apps (Next.js)**
*Requires `npm install` in each directory.*
- **Booker**: `cd web-booker && npm run dev` (Port 3001)
- **Provider**: `cd web-provider && npm run dev` (Port 3002)
- **Admin**: `cd web-admin-panel/admin && npm run dev` (Port 3000)

---

## 🛠️ 3. Setup & Maintenance

### **Automated Setup**
Run the health check and setup script to verify environment variables and dependencies:
```powershell
./scripts/check-setup.ps1
```

### **Repository Sync**
Pull latest changes and clean local environment:
```powershell
./scripts/sync-repo.ps1
```

---

## 🏁 4. Roadmap & Progress
Refer to **`ROADMAP.md`** for detailed feature tracking.
- **Phase 1**: Full-Stack Foundation & Web Interfaces (**COMPLETED**)
- **Phase 2**: Mobile App Development & Auth Integration (**IN PROGRESS**)

---
*Last Updated: 2026-01-04*
