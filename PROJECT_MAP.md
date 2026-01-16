# 🗺️ Vehic-Aid Master Project Map (Runmap)

Comprehensive guide for architecture, setup, and execution of the Vehic-Aid ecosystem.

---

## 🏛️ 1. Architecture Overview
The project is a multi-tier, AI-powered roadside assistance platform.

### **Core Services (Backend)**
- **`backend/`**: Django 5.0 REST API. Contains the `BookingAgent` (AI Dispatch), `SubscriptionEngine`, and `PaymentGateway` (Razorpay).
- **`iot-firmware/`**: Simulation logic for vehicle telemetry and emergency button heartbeats.

### **Web Interfaces (Next.js)**
- **`web/booker/`**: Customer-facing portal with real-time chat, Google Maps, and notifications.
- **`web/provider/`**: Real-time dashboard for service providers to manage jobs and earnings.
- **`web/admin/`**: "Cosmic Glass" management console with AI Monitor and Analytics.

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

### **Full Stack (Dockerized) - RECOMMENDED**
To launch the entire ecosystem including DB, Redis, Workers, and all web apps:
```bash
cd infrastructure
cp .env.example .env
# Edit .env with your Google Maps API key
docker-compose up -d --build
```

**Access Points:**
- Admin Panel: http://localhost:3000
- Provider App: http://localhost:3001
- Booker App: http://localhost:3003
- Backend API: http://localhost:8001

### **Manual Backend Execution**
1. **Migrations**: `python manage.py migrate`
2. **Server**: `python manage.py runserver 8001`
3. **Workers**: `celery -A vehic_aid_backend worker -l info`
4. **WebSocket**: `daphne -b 0.0.0.0 -p 8001 vehic_aid_backend.asgi:application`

### **Frontend Apps (Next.js)**
*Requires `npm install` in each directory.*
- **Admin**: `cd web/admin && npm run dev` (Port 3000)
- **Provider**: `cd web/provider && npm run dev` (Port 3001)
- **Booker**: `cd web/booker && npm run dev` (Port 3003)

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

### **Environment Configuration**
1. **Infrastructure**: Copy `infrastructure/.env.example` to `infrastructure/.env`
2. **Web Apps**: Create `.env.local` in each web app directory
3. **Required**: Google Maps API key for location features

---

## 🎯 4. Latest Features (v2.0.0)

### **Real-Time Communication**
- ✅ Customer-Provider Chat (3-second polling)
- ✅ WebSocket status updates
- ✅ Toast notifications system
- ✅ Live request tracking

### **Location Services**
- ✅ Google Maps integration
- ✅ Interactive location picker
- ✅ Reverse geocoding
- ✅ Current location detection

### **Currency Standardization**
- ✅ All amounts in INR (₹)
- ✅ IndianRupee icons throughout
- ✅ Localized for Indian market

### **Real-Time Analytics**
- ✅ AI Monitor (10-second polling)
- ✅ Subscription Analytics (30-second polling)
- ✅ Live dashboard updates

---

## 🏁 5. Roadmap & Progress
Refer to **`ROADMAP.md`** for detailed feature tracking.
- **Phase 1**: Full-Stack Foundation & Web Interfaces (**COMPLETED**)
- **Phase 2**: Mobile App Development & Deployment (**COMPLETED**)
- **Phase 3**: Real-Time Features & Integration (**COMPLETED**)
    - [x] Provider Identity & Banking
    - [x] Live Location Tracking
    - [x] Customer-Provider Chat
    - [x] Google Maps Integration
    - [x] Real-Time Notifications
    - [x] Currency Standardization (INR)
    - [x] Docker Deployment
- **Phase 4**: Payment Gateway & Advanced Features (**IN PROGRESS**)
    - [ ] Razorpay/Stripe Integration
    - [ ] Email Notifications
    - [ ] SMS Alerts
    - [ ] Advanced Analytics

---

## 📚 6. Documentation

- **README.md**: Project overview and quick start
- **docs/DEPLOYMENT_GUIDE.md**: Complete deployment instructions
- **docs/DEVELOPER_GUIDE.md**: Development setup and guidelines
- **docs/INTEGRATION_GUIDE.md**: API integration details
- **ROADMAP.md**: Feature roadmap and progress tracking

---

*Last Updated: 2026-01-16 (v2.0.0)*
*Status: Production Ready*
