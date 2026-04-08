# 🚗 VehicAid - Groq-Powered AI Roadside Assistance

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.12-blue.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/django-4.2-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/react-18.0-blue.svg)](https://reactjs.org/)
[![React Native](https://img.shields.io/badge/react--native-0.72-blue.svg)](https://reactnative.dev/)

> **⚠️ SECURITY NOTICE**: This documentation uses placeholder values for all sensitive credentials. Never commit real API keys, passwords, or secrets to version control. See [Security Best Practices](#security-best-practices) below.

VehicAid is a comprehensive roadside assistance platform connecting customers with service providers in real-time. Built with Django, React, React Native, and deployed locally using docker.

---

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Ports & URLs](#ports--urls)
- [Default Credentials](#default-credentials)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Monitoring](#monitoring)
- [Contributing](#contributing)

---

## ✨ Features

### **🚗 Multi-Vehicle Support**
VehicAid supports **ALL types of vehicles** with customized pricing and services:
- 🏍️ **Two Wheelers** - Motorcycles, Scooters, Bikes
- 🛺 **Three Wheelers** - Auto Rickshaws, Tuk-Tuks
- 🚗 **Four Wheelers** - Cars, Sedans, Hatchbacks
- 🚙 **SUVs** - Sport Utility Vehicles, Crossovers
- 🚐 **Vans** - Minivans, Cargo Vans, Passenger Vans
- 🚛 **Trucks** - Light/Medium Commercial Vehicles

### **Customer Features**
- 🚗 Real-time service request booking (all vehicle types)
- 📍 Google Maps integration for location tracking
- 💬 In-app chat with service providers
- 💳 Razorpay payment integration
- 📱 Push notifications
- 📊 Service history & invoices
- 🚙 Vehicle management (add multiple vehicles)
- 📦 Subscription plans (Basic, Premium, Pro)
- 📊 Service history & invoices
- 🚙 Vehicle management (add multiple vehicles)
- 📦 Subscription plans (Basic, Premium, Pro)
- 💰 Dynamic pricing based on vehicle type
- 📈 **NEW: Real-time Platform Stats** on Landing Page

### **Provider Features**
- 📋 Service request dashboard
- 💬 In-app chat with customers
- 📊 Advanced earnings analytics
- 📈 Performance metrics
- 📄 Document upload (License, Insurance, etc.)
- 💰 Wallet & payment management
- ⭐ Rating system
- 🚗 Multi-vehicle type support

### **Admin Features**
- 📊 Advanced reporting & analytics
- 📧 Email template management
- 👥 User management
- 🚗 Service request monitoring (all vehicle types)
- 💰 Payment & settlement tracking
- 📈 Real-time dashboards
- 📤 Export reports (CSV, PDF, Excel)
- 🚦 Vehicle type analytics

---

## 🏗️ Architecture

```
VehicAid Platform
├── Backend (Django REST API)
│   ├── PostgreSQL Database
│   ├── Redis Cache
│   ├── Celery Workers
│   └── WebSocket Support
├── Web Applications (Next.js)
│   ├── Admin Panel
│   ├── Provider Dashboard
│   └── Customer Portal
├── Mobile Applications (React Native)
│   ├── Customer App
│   └── Provider App
└── Infrastructure
    ├── Kubernetes Manifests
    ├── CI/CD Pipelines
    └── Monitoring (Prometheus/Grafana)
```

---

## 🚗 Supported Vehicle Types & Pricing

VehicAid provides comprehensive roadside assistance for **ALL vehicle types** with dynamic pricing based on vehicle category:

### **Vehicle Categories**

| Vehicle Type | Examples | Base Price Range | Per KM Rate |
|--------------|----------|------------------|-------------|
| 🏍️ **Two Wheeler** | Motorcycles, Scooters, Bikes | ₹70 - ₹150 | ₹5/km |
| 🛺 **Three Wheeler** | Auto Rickshaws, Tuk-Tuks | ₹90 - ₹200 | ₹6/km |
| 🚗 **Four Wheeler** | Cars, Sedans, Hatchbacks | ₹150 - ₹300 | ₹10/km |
| 🚙 **SUV** | Sport Utility Vehicles, Crossovers | ₹250 - ₹500 | ₹15/km |
| 🚐 **Van** | Minivans, Cargo Vans, Passenger Vans | ₹300 - ₹600 | ₹18/km |
| 🚛 **Truck** | Light/Medium Commercial Vehicles | ₹400 - ₹800 | ₹25/km |

### **Service Types (All Vehicles)**
- 🚗 **Towing** - Emergency vehicle towing to nearest garage
- 🔋 **Battery Jumpstart** - On-site battery boost
- 🛞 **Tire Change** - Flat tire replacement
- ⛽ **Fuel Delivery** - Emergency fuel delivery
- 🔑 **Lockout Service** - Key locked inside vehicle
- 🔧 **General Repair** - On-site minor repairs

### **Pricing Features**
- ✅ **Dynamic Pricing** - Based on vehicle type and service
- ✅ **Distance-Based** - Fair per-kilometer charges
- ✅ **Subscription Discounts** - 10-30% off for members
- ✅ **Transparent Pricing** - No hidden charges
- ✅ **Peak Hour Surge** - Minimal 20% during rush hours
- ✅ **Budget-Friendly** - Designed for Indian market

---

## 🛠️ Technology Stack

### **Backend**
- **Framework**: Django 4.2, Django REST Framework
- **Database**: PostgreSQL 14
- **Cache**: Redis 7
- **Task Queue**: Celery with Redis broker
- **WebSocket**: Django Channels
- **Authentication**: JWT (Simple JWT)
- **API Documentation**: drf-spectacular (Swagger/OpenAPI)

### **Frontend (Web)**
- **Framework**: Next.js 14 (React 18)
- **UI Library**: Tailwind CSS, shadcn/ui
- **State Management**: React Context
- **Maps**: Google Maps API
- **Charts**: Recharts

### **Mobile (React Native / Expo) - Planned**
- **Framework**: React Native 0.76+ with Expo SDK 52+
- **Routing**: Expo Router v3 (File-based)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State**: React Context (reused from web apps)
- **Icons**: Lucide React Native
- **Maps**: React Native Maps

### **Mobile Apps Status**

#### 1. Vehic-Aid Booker (Customer App)
**Path**: `mobile/booker` (Planned)
- **Status**: 🟡 Ready for development 
- **Features to Port from Web**:
  - 🧠 **AutoMind Intelligence**: Groq-powered conversational diagnostics and booking
  - 📱 **Dashboard**: KPIs, active requests, quick actions
  - 🗺️ **Service Booking**: Multi-step wizard with location picker
  - 💬 **Real-time Chat**: In-app messaging with providers
  - 🚗 **Vehicle Management**: Garage with 7 vehicle types
  - 💳 **Payments & Subscriptions**: Razorpay integration
  - 📊 **Service History**: Past requests and invoices
  - 💰 **Wallet**: Balance, transactions, add money
  - 🔔 **Notifications**: Push notifications via Firebase
- **Stack**: Expo Router, NativeWind, React Context (from web)
- **Code Reuse**: ~70% (API services, contexts, business logic)

#### 2. Vehic-Aid Provider (Partner App)
**Path**: `mobile/provider` (Planned)
- **Status**: 🟡 Ready for development 
- **Features to Port from Web**:
  - 🌙 **Dashboard**: Real-time job feed with distance calculation
  - 🛎️ **Job Management**: Accept/decline jobs, navigation
  - 💰 **Earnings Tracker**: Daily/weekly/monthly analytics
  - 📊 **Analytics**: Performance metrics, ratings
  - 📝 **Profile Management**: Documents, verification status
  - 💬 **Chat**: Customer communication
  - 📍 **Location Updates**: Real-time GPS tracking
- **Stack**: Expo Router, NativeWind, React Context (from web)
- **Code Reuse**: ~70% (API services, contexts, business logic)

> 📱 **Mobile Development Guide**: See [Web Features](docs/WEB_FEATURES.md#mobile-app-readiness) for detailed feature parity analysis and development roadmap.

### **Infrastructure**
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus, Grafana
- **Logging**: File-based rotating logs

### **Third-Party Services (All FREE)**
- **Email**: Gmail SMTP
- **SMS**: Fast2SMS (50 SMS/day free)
- **Payment**: Razorpay (Test mode)
- **Maps**: Google Maps API
- **Cache**: Redis (Upstash free tier)

---

## 🚀 Quick Start

### **Prerequisites**
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Docker & Docker Compose (optional)

### **1. Clone Repository**
```bash
git clone https://github.com/srohithadithya/vehic-aid-project.git
cd vehic-aid-project
```

### **2. Backend Setup**
```bash
cd backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run server
python manage.py runserver 8001
```

### **3. Web Applications Setup**
```bash
# Admin Panel
cd web/admin
npm install
npm run dev  # Runs on port 3000

# Provider App
cd web/provider
npm install
npm run dev  # Runs on port 3001

# Booker App
cd web/booker
npm install
npm run dev  # Runs on port 3003
```

### **4. Mobile Applications Setup**
```bash
# Customer App
cd mobile/booker
npm install
npx expo start

# Provider App
cd mobile/provider
npm install
npx expo start
```

### **5. Docker Deployment (Recommended)**
```bash
cd infrastructure
docker-compose up -d
```

---

## 🌐 Ports & URLs

### **Development**
| Service | Port | URL | Description |
|---------|------|-----|-------------|
| Backend API | 8001 | http://localhost:8001 | Django REST API |
| API Documentation | 8001 | http://localhost:8001/api/schema/swagger-ui/ | Swagger UI |
| Django Admin | 8001 | http://localhost:8001/admin/ | Django Admin Panel |
| Admin Panel | 3000 | http://localhost:3000 | Web Admin Dashboard |
| Provider App | 3001 | http://localhost:3001 | Web Provider Dashboard |
| Booker App | 3003 | http://localhost:3003 | Web Customer Portal |
| PostgreSQL | 5432 | localhost:5432 | Database |
| Redis | 6379 | localhost:6379 | Cache & Message Broker |

### **Docker Deployment**
| Service | Port | URL | Description |
|---------|------|-----|-------------|
| Backend API | 8001 | http://localhost:8001 | Django REST API |
| Admin Panel | 3000 | http://localhost:3000 | Web Admin Dashboard |
| Provider App | 3001 | http://localhost:3001 | Web Provider Dashboard |
| Booker App | 3003 | http://localhost:3003 | Web Customer Portal |
| PostgreSQL | 5432 | localhost:5432 | Database |
| Redis | 6379 | localhost:6379 | Cache |

### **Production (Kubernetes)**
| Service | Type | Description |
|---------|------|-------------|
| Backend API | LoadBalancer | External IP assigned |
| Admin Panel | LoadBalancer | External IP assigned |
| Provider App | LoadBalancer | External IP assigned |
| Booker App | LoadBalancer | External IP assigned |
| Prometheus | LoadBalancer | http://<external-ip>:9090 |
| Grafana | LoadBalancer | http://<external-ip>:3000 |

---

## 🔐 Default Credentials

### **Django Admin**
```
URL: http://localhost:8001/admin/
Username: <your-admin-username>
Password: <your-admin-password>
```

### **Test Users**

**Customer Account**:
```
Email: customer@example.com
Password: <your-password>
Phone: +91XXXXXXXXXX
```

**Provider Account**:
```
Email: provider@example.com
Password: <your-password>
Phone: +91XXXXXXXXXX
Provider ID: PRO-XXX
```

**Admin Account**:
```
Email: admin@vehicaid.com
Password: <your-admin-password>
```

### **Database**
```
Host: localhost (or postgres in Docker)
Port: 5432
Database: vehic_aid
Username: <your-db-username>
Password: <your-db-password>
```

### **Redis**
```
Host: localhost (or redis in Docker)
Port: 6379
Password: <your-redis-password> (or none for local)
URL: redis://localhost:6379/1
```

### **Grafana (Production)**
```
URL: http://<grafana-ip>:3000
Username: admin
Password: <change-on-first-login>
```

---

## 📧 Service Credentials

### **Email (Gmail SMTP)**
```
Host: smtp.gmail.com
Port: 587
TLS: True
Email: <your-email@gmail.com>
Password: <your-app-password> (16-digit App Password)
```

**Setup Instructions**: See [SMTP_SETUP.md](docs/SMTP_SETUP.md)

### **SMS (Fast2SMS)**
```
Provider: Fast2SMS
API Key: <your-fast2sms-api-key>
Limit: 50 SMS/day (Free tier)
```

**Setup Instructions**: See [FREE_SMS_SETUP.md](docs/FREE_SMS_SETUP.md)

### **Payment (Razorpay)**
```
Mode: Test
Key ID: <your-razorpay-key-id>
Key Secret: <your-razorpay-key-secret>
```

**Setup Instructions**: Get credentials from [Razorpay Dashboard](https://dashboard.razorpay.com/)

### **Google Maps**
```
API Key: <your-google-maps-api-key>
```

**Setup Instructions**: Get API key from [Google Cloud Console](https://console.cloud.google.com/)

### **Firebase (Push Notifications)**
```
Project ID: <your-firebase-project-id>
API Key: <your-firebase-api-key>
Auth Domain: <your-project-id>.firebaseapp.com
Storage Bucket: <your-project-id>.firebasestorage.app
```

**Setup Instructions**: Get credentials from [Firebase Console](https://console.firebase.google.com/)

---

## 📚 API Documentation

### **Swagger UI**
- **URL**: http://localhost:8001/api/schema/swagger-ui/
- **Interactive API testing and documentation**

### **ReDoc**
- **URL**: http://localhost:8001/api/schema/redoc/
- **Clean API documentation**

### **Key Endpoints**

#### **Authentication**
```
POST /api/v1/auth/register/          # Register new user
POST /api/v1/auth/login/             # Login
POST /api/v1/auth/token/refresh/     # Refresh JWT token
POST /api/v1/auth/logout/            # Logout
```

#### **Service Requests**
```
GET    /api/v1/service-requests/     # List requests
POST   /api/v1/service-requests/     # Create request
GET    /api/v1/service-requests/{id}/ # Get request details
PATCH  /api/v1/service-requests/{id}/ # Update request
DELETE /api/v1/service-requests/{id}/ # Cancel request
```

#### **Payments**
```
POST /api/v1/payments/create-order/  # Create Razorpay order
POST /api/v1/payments/verify/        # Verify payment
GET  /api/v1/payments/history/       # Payment history
```

#### **Chat**
```
GET  /api/v1/chat/?request_id={id}   # Get messages
POST /api/v1/chat/                   # Send message
```

#### **Providers**
```
GET /api/v1/providers/analytics/     # Provider analytics
GET /api/v1/providers/documents/     # Get documents
POST /api/v1/providers/documents/upload/ # Upload document
```

---

## 🚀 Deployment

### **Docker Deployment**
```powershell
# Quick deploy
.\deploy-production.ps1

# Or manually
cd infrastructure
docker-compose up -d
```

### **Kubernetes Deployment**
```powershell
# Quick deploy
.\infrastructure\deploy-k8s.ps1

# Or manually
kubectl apply -f infrastructure/k8s/
```

### **CI/CD Pipeline**
- **Trigger**: Push to `main` branch
- **Stages**: Test → Build → Deploy
- **Platform**: GitHub Actions
- **Configuration**: `.github/workflows/ci-cd.yml`

---

## 📊 Monitoring

### **Prometheus**
- **URL**: http://<prometheus-ip>:9090
- **Metrics**: Request rate, error rate, response time, database queries
- **Retention**: 15 days

### **Grafana**
- **URL**: http://<grafana-ip>:3000
- **Dashboards**: Application, Database, Infrastructure
- **Alerts**: Configured for high error rates, slow responses

### **Logs**
```bash
# Backend logs
cd backend/logs
tail -f django.log
tail -f errors.log
tail -f payments.log

# Docker logs
docker-compose logs -f web

# Kubernetes logs
kubectl logs -f deployment/vehicaid-backend -n vehicaid
```

---

## 🧪 Testing

### **Backend Tests**
```bash
cd backend
python manage.py test

# With coverage
pip install coverage
coverage run manage.py test
coverage report
```

### **Email Test**
```bash
python manage.py test_email your@email.com
```

### **SMS Test**
```bash
python manage.py test_sms 9876543210
```

### **Database Optimization**
```bash
python manage.py optimize_db
```

---

## 📦 Environment Variables

### **Backend (.env)**
```env
# Django
DEBUG=True
SECRET_KEY=<your-secret-key-here>
ALLOWED_HOSTS=*

# Database
DATABASE_URL=postgres://<username>:<password>@localhost:5432/vehic_aid

# Redis
REDIS_URL=redis://localhost:6379/1
CELERY_BROKER_URL=redis://localhost:6379/0

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=<your-email@gmail.com>
EMAIL_HOST_PASSWORD=<your-app-password>

# SMS (Fast2SMS)
SMS_PROVIDER=fast2sms
FAST2SMS_API_KEY=<your-api-key>

# Payment (Razorpay)
RAZORPAY_KEY_ID=<your-key-id>
RAZORPAY_KEY_SECRET=<your-key-secret>

# Google Maps
GOOGLE_MAPS_API_KEY=<your-api-key>
```

**Note**: Copy `.env.example` to `.env` and fill in your credentials.

### **Web Applications (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8001/ws
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<your-api-key>
```

### **Mobile Applications (.env)**
```env
EXPO_PUBLIC_API_URL=http://localhost:8001/api/v1
EXPO_PUBLIC_WS_URL=ws://localhost:8001/ws
```

---

## 🔐 Security Best Practices

### **Credential Management**
1. **Never commit sensitive data** to version control
2. **Use `.env` files** for local development (already in `.gitignore`)
3. **Use environment variables** in production (Kubernetes Secrets)
4. **Copy `.env.example`** to `.env` and fill in your credentials
5. **Rotate credentials regularly** (every 90 days recommended)

### **API Keys & Secrets**
- **Email**: Use Gmail App Passwords (16 digits), enable 2FA
- **SMS**: Keep Fast2SMS API key secure, monitor usage
- **Payment**: Use Razorpay test keys for development, live keys for production
- **Maps**: Restrict Google Maps API key by domain/IP
- **Firebase**: Use Firebase security rules, restrict API key usage

### **Database Security**
- Use strong passwords (minimum 16 characters)
- Enable SSL/TLS for database connections in production
- Regular backups (automated daily backups recommended)
- Restrict database access by IP whitelist

### **Production Deployment**
- Use HTTPS/SSL certificates (Let's Encrypt recommended)
- Enable rate limiting on all API endpoints
- Implement CORS properly (restrict origins in production)
- Use Kubernetes Secrets for all sensitive data
- Enable network policies in Kubernetes
- Regular security audits and dependency updates

### **Monitoring & Alerts**
- Monitor for suspicious activity
- Set up alerts for failed login attempts
- Track API usage and rate limit violations
- Regular log reviews

---

## 📖 Documentation

- **[Complete Documentation](docs/COMPLETE_DOCUMENTATION.md)** - Master reference guide
- **[Web Applications & Admin Features](docs/WEB_FEATURES.md)** - Detailed web app & admin panel features
- **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[SMTP Setup](docs/SMTP_SETUP.md)** - Email configuration guide
- **[Free SMS Setup](docs/FREE_SMS_SETUP.md)** - SMS service configuration
- **[Infrastructure Guide](infrastructure/INFRASTRUCTURE_GUIDE.md)** - Kubernetes & monitoring
- **[Project Map](PROJECT_MAP.md)** - Project structure overview
- **[Roadmap](ROADMAP.md)** - Development roadmap

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Development**: VehicAid Team
- **Contact**: support@vehicaid.com
- **Website**: https://vehicaid.xxx

---

## 🙏 Acknowledgments

- Django REST Framework
- Next.js
- React Native
- Kubernetes
- All open-source contributors

---

## 📞 Support

- **Email**: support@vehicaid.com
- **Documentation**: https://docs.vehicaid.com
- **Issues**: https://github.com/srohithadithya/vehic-aid-project/issues

---

**Built with ❤️ by the VehicAid Team**

**Version**: 2.6.0  
**Last Updated**: February 14, 2026
