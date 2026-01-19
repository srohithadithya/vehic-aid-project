# 🗺️ VehicAid Project Map

**Complete project structure, architecture, and execution guide**

> **🚗 Multi-Vehicle Platform**: Supports 7 vehicle types - Two Wheeler, Three Wheeler, Four Wheeler, SUV, Van, Truck, and Heavy Vehicle with dynamic pricing.

---

## 📁 Project Structure

```
vehic-aid-project/
├── backend/                          # Django REST API
│   ├── apps/
│   │   ├── users/                    # User management & authentication
│   │   ├── services/                 # Service requests & subscriptions
│   │   │   ├── utils/
│   │   │   │   ├── email_utils.py    # Email notifications
│   │   │   │   └── sms_utils.py      # SMS notifications
│   │   │   ├── management/commands/
│   │   │   │   ├── test_email.py     # Email testing command
│   │   │   │   ├── test_sms.py       # SMS testing command
│   │   │   │   └── optimize_db.py    # Database optimization
│   │   │   └── signals.py            # Auto notifications
│   │   ├── payments/                 # Payment processing
│   │   │   ├── utils/
│   │   │   │   └── payment_utils.py  # Razorpay integration
│   │   │   └── views/
│   │   │       └── payment_views.py  # Payment API
│   │   └── iot_devices/              # IoT device management
│   ├── vehic_aid_backend/
│   │   ├── settings/
│   │   │   ├── base.py               # Base settings
│   │   │   ├── development.py        # Dev settings
│   │   │   ├── production.py         # Prod settings
│   │   │   └── logging_config.py     # Logging configuration
│   │   ├── middleware/
│   │   │   └── performance.py        # Performance monitoring
│   │   └── urls.py                   # URL routing
│   ├── logs/                         # Application logs
│   │   ├── django.log
│   │   ├── errors.log
│   │   ├── email.log
│   │   ├── sms.log
│   │   ├── payments.log
│   │   └── performance.log
│   ├── requirements.txt              # Python dependencies
│   ├── manage.py                     # Django management
│   └── .env                          # Environment variables
│
├── web/                              # Next.js Web Applications
│   ├── admin/                        # Admin Dashboard
│   │   ├── app/
│   │   │   ├── dashboard/            # Main dashboard
│   │   │   ├── users/                # User management
│   │   │   ├── bookings/             # Booking management
│   │   │   ├── payments/             # Payment management
│   │   │   ├── reports/              # Advanced reporting
│   │   │   └── email-templates/      # Email template editor
│   │   ├── components/               # Reusable components
│   │   └── package.json
│   │
│   ├── provider/                     # Provider Dashboard
│   │   ├── app/
│   │   │   ├── dashboard/            # Provider dashboard
│   │   │   ├── requests/             # Service requests
│   │   │   ├── earnings/             # Earnings page
│   │   │   └── analytics/            # Advanced analytics
│   │   ├── components/
│   │   │   └── Chat.tsx              # In-app chat
│   │   └── package.json
│   │
│   └── booker/                       # Customer Portal
│       ├── app/
│       │   ├── book/                 # Service booking
│       │   ├── request/[id]/         # Request tracking
│       │   ├── history/              # Service history
│       │   ├── vehicles/             # Vehicle management
│       │   └── invoice/[id]/         # Invoice page
│       ├── components/
│       │   ├── Chat.tsx              # In-app chat
│       │   ├── LocationPicker.tsx    # Google Maps picker
│       │   ├── Notifications.tsx     # Toast notifications
│       │   └── PaymentButton.tsx     # Razorpay payment
│       └── package.json
│
├── mobile/booker/                    # Customer Mobile App (React Native)
│   ├── src/
│   │   ├── screens/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── BookingScreen.tsx
│   │   │   ├── ChatScreen.tsx        # In-app chat
│   │   │   └── SubscriptionScreen.tsx # Subscription management
│   │   ├── components/
│   │   │   └── PaymentButton.tsx     # Razorpay integration
│   │   └── navigation/
│   ├── app.json
│   └── package.json
│
├── mobile-provider/                  # Provider Mobile App (React Native)
│   ├── src/
│   │   ├── screens/
│   │   │   ├── DashboardScreen.tsx
│   │   │   ├── RequestsScreen.tsx
│   │   │   ├── ChatScreen.tsx        # In-app chat
│   │   │   ├── EarningsAnalyticsScreen.tsx # Advanced analytics
│   │   │   └── DocumentsScreen.tsx   # Document upload
│   │   ├── components/
│   │   └── navigation/
│   ├── app.json
│   └── package.json
│
├── infrastructure/                   # Infrastructure & DevOps
│   ├── k8s/                          # Kubernetes manifests
│   │   ├── backend-deployment.yaml   # Backend deployment
│   │   ├── database-deployment.yaml  # PostgreSQL & Redis
│   │   ├── web-deployments.yaml      # Web apps deployment
│   │   ├── secrets.yaml              # Secrets & ConfigMaps
│   │   └── monitoring.yaml           # Prometheus & Grafana
│   ├── docker-compose.yml            # Docker Compose config
│   ├── deploy-k8s.ps1                # K8s deployment script
│   └── INFRASTRUCTURE_GUIDE.md       # Infrastructure docs
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml                 # GitHub Actions pipeline
│
├── docs/                             # Documentation
│   ├── DEPLOYMENT_GUIDE.md           # Deployment instructions
│   ├── SMTP_SETUP.md                 # Email setup guide
│   ├── FREE_SMS_SETUP.md             # SMS setup guide
│   └── NOTIFICATIONS_QUICK_REFERENCE.md # Quick reference
│
├── README.md                         # Main documentation
├── PROJECT_MAP.md                    # This file
├── ROADMAP.md                        # Development roadmap
├── BACKEND_COMPLETE.md               # Backend completion summary
├── CLEANUP_REPORT.md                 # Cleanup report
└── scripts/                          # Utility & DevOps scripts
    ├── ops/                          # Operational scripts
    │   ├── deploy_production.ps1
    │   ├── deploy_linux.sh
    │   ├── build_backend.sh
    │   ├── reset_local_db.sh
    │   └── start_celery_prod.sh
    ├── ci_cd/                        # CI/CD scripts
    │   ├── deploy_staging.sh
    │   └── run_tests_ci.sh
    ├── sync-repo.ps1                 # Git sync script
    ├── start-dev.ps1                 # Dev start script
    ├── check-setup.ps1               # Setup check script
    └── simulate_iot.py               # IoT simulation script
```

---

## 🏗️ Architecture Overview

### **System Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    Load Balancer / Ingress                  │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐   ┌────────▼────────┐   ┌───────▼────────┐
│  Admin Panel   │   │  Provider App   │   │   Booker App   │
│   (Next.js)    │   │   (Next.js)     │   │   (Next.js)    │
│   Port: 3000   │   │   Port: 3001    │   │   Port: 3003   │
└────────┬───────┘   └────────┬────────┘   └────────┬────────┘
         │                    │                      │
         └────────────────────┼──────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │   Backend API      │
                    │   (Django REST)    │
                    │   Port: 8001       │
                    └─────────┬──────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐   ┌────────▼────────┐   ┌───────▼────────┐
│  PostgreSQL    │   │     Redis       │   │    Celery      │
│  Port: 5432    │   │   Port: 6379    │   │   Workers      │
└────────────────┘   └─────────────────┘   └────────────────┘
```

### **Mobile Architecture**

```
┌─────────────────┐         ┌─────────────────┐
│  Mobile Booker  │         │ Mobile Provider │
│  (React Native) │         │  (React Native) │
└────────┬────────┘         └────────┬────────┘
         │                           │
         └───────────┬───────────────┘
                     │
            ┌────────▼─────────┐
            │   Backend API    │
            │  (Django REST)   │
            └──────────────────┘
```

---

## 🌐 Ports & Services

### **Development Environment**

| Service | Port | URL | Credentials |
|---------|------|-----|-------------|
| **Backend API** | 8001 | http://localhost:8001 | - |
| **Django Admin** | 8001 | http://localhost:8001/admin/ | admin_mobile / password123 |
| **Swagger UI** | 8001 | http://localhost:8001/api/schema/swagger-ui/ | - |
| **ReDoc** | 8001 | http://localhost:8001/api/schema/redoc/ | - |
| **Admin Panel** | 3000 | http://localhost:3000 | admin@vehicaid.com / admin123 |
| **Provider App** | 3001 | http://localhost:3001 | provider@test.com / testpass123 |
| **Booker App** | 3003 | http://localhost:3003 | customer@test.com / testpass123 |
| **PostgreSQL** | 5432 | localhost:5432 | vehic_aid / vehic_aid123 |
| **Redis** | 6379 | localhost:6379 | (no password) |

### **Docker Environment**

| Service | Port | Internal URL | External URL |
|---------|------|--------------|--------------|
| **Backend** | 8001 | http://backend:8000 | http://localhost:8001 |
| **Admin** | 3000 | http://web-admin:3000 | http://localhost:3000 |
| **Provider** | 3001 | http://web-provider:3000 | http://localhost:3001 |
| **Booker** | 3003 | http://web-booker:3000 | http://localhost:3003 |
| **PostgreSQL** | 5432 | postgres:5432 | localhost:5432 |
| **Redis** | 6379 | redis:6379 | localhost:6379 |

### **Kubernetes Environment**

| Service | Type | Port | Access |
|---------|------|------|--------|
| **Backend** | ClusterIP | 8000 | Internal only |
| **Admin** | LoadBalancer | 3000 | External IP |
| **Provider** | LoadBalancer | 3000 | External IP |
| **Booker** | LoadBalancer | 3000 | External IP |
| **PostgreSQL** | ClusterIP | 5432 | Internal only |
| **Redis** | ClusterIP | 6379 | Internal only |
| **Prometheus** | LoadBalancer | 9090 | External IP |
| **Grafana** | LoadBalancer | 3000 | External IP |

---

## 🔐 Complete Credentials

### **Database Credentials**
```
PostgreSQL:
  Host: localhost (dev) / postgres (docker) / postgres.vehicaid.svc.cluster.local (k8s)
  Port: 5432
  Database: vehic_aid
  Username: <your-db-username>
  Password: <your-db-password>
  Connection String: postgres://<username>:<password>@localhost:5432/vehic_aid

Redis:
  Host: localhost (dev) / redis (docker) / redis.vehicaid.svc.cluster.local (k8s)
  Port: 6379
  Database: 1 (cache) / 0 (celery)
  Password: <your-redis-password> (or none for local)
  URL: redis://localhost:6379/1
```

### **Application Credentials**
```
Django Admin:
  URL: http://localhost:8001/admin/
  Username: <your-admin-username>
  Password: <your-admin-password>

Test Customer:
  Email: customer@example.com
  Password: <your-password>
  Phone: +91XXXXXXXXXX

Test Provider:
  Email: provider@example.com
  Password: <your-password>
  Phone: +91XXXXXXXXXX
  Provider ID: PRO-XXX

Admin User:
  Email: admin@vehicaid.com
  Password: <your-admin-password>
```

### **Third-Party Service Credentials**

```
Gmail SMTP:
  Host: smtp.gmail.com
  Port: 587
  TLS: True
  Username: <your-email@gmail.com>
  Password: <your-app-password> (16-digit App Password)
  From: VehicAid <<your-email@gmail.com>>

Fast2SMS:
  Provider: Fast2SMS
  API Key: <your-fast2sms-api-key>
  Limit: 50 SMS/day (Free tier)
  Route: Quick (q)

Razorpay:
  Mode: Test
  Key ID: <your-razorpay-key-id>
  Key Secret: <your-razorpay-key-secret>
  Webhook Secret: <configure-in-dashboard>

Google Maps:
  API Key: <your-google-maps-api-key>
  Enabled APIs: Maps JavaScript API, Geocoding API, Places API

Firebase:
  Project ID: <your-firebase-project-id>
  API Key: <your-firebase-api-key>
  Auth Domain: <your-project-id>.firebaseapp.com
  Storage Bucket: <your-project-id>.firebasestorage.app

Upstash Redis (Production):
  URL: redis://<your-upstash-url>
```

### **Monitoring Credentials**
```
Grafana:
  URL: http://<grafana-ip>:3000
  Username: admin
  Password: admin (CHANGE ON FIRST LOGIN!)

Prometheus:
  URL: http://<prometheus-ip>:9090
  No authentication (configure if needed)
```

---

## 🚀 Execution Commands

### **Backend**

```powershell
# Development
cd backend
python manage.py runserver 8001

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic

# Run Celery worker
celery -A vehic_aid_backend worker -l info

# Run Celery beat
celery -A vehic_aid_backend beat -l info

# Test email
python manage.py test_email your@email.com

# Test SMS
python manage.py test_sms 9876543210

# Optimize database
python manage.py optimize_db

# Run tests
python manage.py test

# Shell
python manage.py shell
```

### **Web Applications**

```powershell
# Admin Panel
cd web/admin
npm install
npm run dev          # Development (port 3000)
npm run build        # Production build
npm start            # Production server

# Provider App
cd web/provider
npm install
npm run dev          # Development (port 3001)
npm run build
npm start

# Booker App
cd web/booker
npm install
npm run dev          # Development (port 3003)
npm run build
npm start
```

### **Mobile Applications**

```powershell
# Customer App
cd mobile-booker
npm install
npx expo start       # Start Expo dev server
npx expo start --android  # Android
npx expo start --ios      # iOS
npx expo build:android    # Build APK

# Provider App
cd mobile/provider
npm install
npx expo start
npx expo start --android
npx expo start --ios
npx expo build:android
```

### **Docker**

```powershell
# Start all services
cd infrastructure
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
docker-compose logs -f web

# Rebuild
docker-compose up -d --build

# Execute commands in container
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py createsuperuser

# Database backup
docker-compose exec db pg_dump -U vehic_aid vehic_aid > backup.sql

# Database restore
docker-compose exec -T db psql -U vehic_aid vehic_aid < backup.sql
```

### **Kubernetes**

```powershell
# Deploy
.\infrastructure\deploy-k8s.ps1

# Or manually
kubectl apply -f infrastructure/k8s/

# Check status
kubectl get pods -n vehicaid
kubectl get svc -n vehicaid

# View logs
kubectl logs -f deployment/vehicaid-backend -n vehicaid

# Execute commands
kubectl exec -it deployment/vehicaid-backend -n vehicaid -- python manage.py migrate

# Scale
kubectl scale deployment vehicaid-backend --replicas=5 -n vehicaid

# Port forward
kubectl port-forward svc/vehicaid-backend-service 8000:8000 -n vehicaid

# Delete
kubectl delete -f infrastructure/k8s/
```

### **Production Deployment**
 
 ```powershell
 # Full production deployment
 .\scripts\ops\deploy_production.ps1
 ```
# This will:
# 1. Pull latest code
# 2. Install dependencies
# 3. Run migrations
# 4. Collect static files
# 5. Optimize database
# 6. Build frontend apps
# 7. Start Docker services
# 8. Run health checks
```

---

## 📊 Monitoring & Logs

### **Application Logs**

```powershell
# Backend logs (local)
cd backend/logs
tail -f django.log        # General logs
tail -f errors.log        # Error logs
tail -f email.log         # Email notifications
tail -f sms.log           # SMS notifications
tail -f payments.log      # Payment transactions
tail -f performance.log   # Performance metrics

# Docker logs
docker-compose logs -f web
docker-compose logs -f db
docker-compose logs -f redis

# Kubernetes logs
kubectl logs -f deployment/vehicaid-backend -n vehicaid
kubectl logs -f statefulset/postgres -n vehicaid
```

### **Monitoring Access**

```
Prometheus:
  URL: http://<prometheus-ip>:9090
  Metrics: /metrics endpoint on backend
  Scrape Interval: 15s
  Retention: 15 days

Grafana:
  URL: http://<grafana-ip>:3000
  Username: admin
  Password: admin
  Dashboards: Application, Database, Infrastructure
```

---

## 🔄 CI/CD Pipeline

### **GitHub Actions Workflow**

```
Trigger: Push to main branch

Stages:
1. Backend Test
   - Setup PostgreSQL & Redis
   - Install dependencies
   - Run Django tests
   - Run linting

2. Backend Build
   - Build Docker image
   - Push to GitHub Container Registry
   - Tag: latest, commit SHA

3. Web Build (Matrix)
   - Build admin, provider, booker
   - Push Docker images
   - Tag: latest, commit SHA

4. Deploy
   - Configure kubectl
   - Apply Kubernetes manifests
   - Verify rollout

5. Notify
   - Send success notification
```

### **Manual Trigger**

```bash
# Trigger workflow
gh workflow run ci-cd.yml

# View workflow status
gh run list

# View workflow logs
gh run view <run-id>
```

---

## 📚 API Endpoints Reference

### **Base URL**: `http://localhost:8001/api/v1`

### **Authentication**
- `POST /auth/register/` - Register new user
- `POST /auth/login/` - Login
- `POST /auth/token/refresh/` - Refresh JWT
- `POST /auth/logout/` - Logout

### **Service Requests**
- `GET /service-requests/` - List requests
- `POST /service-requests/` - Create request
- `GET /service-requests/{id}/` - Get details
- `PATCH /service-requests/{id}/` - Update request
- `DELETE /service-requests/{id}/` - Cancel request

### **Payments**
- `POST /payments/create-order/` - Create Razorpay order
- `POST /payments/verify/` - Verify payment
- `GET /payments/history/` - Payment history

### **Chat**
- `GET /chat/?request_id={id}` - Get messages
- `POST /chat/` - Send message

### **Providers**
- `GET /providers/analytics/` - Analytics
- `GET /providers/documents/` - Documents
- `POST /providers/documents/upload/` - Upload document

### **Subscriptions**
- `GET /subscriptions/current/` - Current plan
- `POST /subscriptions/subscribe/` - Subscribe to plan

---

## 🎯 Quick Reference

### **Start Development**
```powershell
# Terminal 1: Backend
cd backend
python manage.py runserver 8001

# Terminal 2: Admin Panel
cd web/admin
npm run dev

# Terminal 3: Provider App
cd web/provider
npm run dev

# Terminal 4: Booker App
cd web/booker
npm run dev
```

### **Access Applications**
- Backend API: http://localhost:8001
- Admin Panel: http://localhost:3000
- Provider App: http://localhost:3001
- Booker App: http://localhost:3003

### **Test Credentials**
- Admin: admin_mobile / password123
- Customer: customer@test.com / testpass123
- Provider: provider@test.com / testpass123

---

**Last Updated**: January 17, 2026  
**Version**: 2.0.0  
**Status**: Production Ready ✅
