# 🚗 VehicAid - AI-Powered Roadside Assistance Platform

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.11-blue.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/django-4.2-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/react-18.0-blue.svg)](https://reactjs.org/)
[![React Native](https://img.shields.io/badge/react--native-0.72-blue.svg)](https://reactnative.dev/)

VehicAid is a comprehensive roadside assistance platform connecting customers with service providers in real-time. Built with Django, React, React Native, and deployed on Kubernetes with complete CI/CD automation.

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

### **Customer Features**
- 🚗 Real-time service request booking
- 📍 Google Maps integration for location tracking
- 💬 In-app chat with service providers
- 💳 Razorpay payment integration
- 📱 Push notifications
- 📊 Service history & invoices
- 🚙 Vehicle management
- 📦 Subscription plans (Basic, Premium, Pro)

### **Provider Features**
- 📋 Service request dashboard
- 💬 In-app chat with customers
- 📊 Advanced earnings analytics
- 📈 Performance metrics
- 📄 Document upload (License, Insurance, etc.)
- 💰 Wallet & payment management
- ⭐ Rating system

### **Admin Features**
- 📊 Advanced reporting & analytics
- 📧 Email template management
- 👥 User management
- 🚗 Service request monitoring
- 💰 Payment & settlement tracking
- 📈 Real-time dashboards
- 📤 Export reports (CSV, PDF, Excel)

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

### **Mobile**
- **Framework**: React Native 0.72
- **Navigation**: React Navigation
- **State Management**: React Context
- **Icons**: Expo Vector Icons
- **Camera**: Expo Image Picker

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
cd mobile-booker
npm install
npx expo start

# Provider App
cd mobile-provider
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
| Backend API | 8000 | http://localhost:8000 | Django REST API |
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
Username: admin_mobile
Password: password123
```

### **Test Users**

**Customer Account**:
```
Email: customer@test.com
Password: testpass123
Phone: +919876543210
```

**Provider Account**:
```
Email: provider@test.com
Password: testpass123
Phone: +919876543211
Provider ID: PRO-001
```

**Admin Account**:
```
Email: admin@vehicaid.com
Password: admin123
```

### **Database**
```
Host: localhost (or postgres in Docker)
Port: 5432
Database: vehic_aid
Username: vehic_aid
Password: vehic_aid123
```

### **Redis**
```
Host: localhost (or redis in Docker)
Port: 6379
Password: (none for local)
URL: redis://localhost:6379/1
```

### **Grafana (Production)**
```
URL: http://<grafana-ip>:3000
Username: admin
Password: admin (change on first login)
```

---

## 📧 Service Credentials

### **Email (Gmail SMTP)**
```
Host: smtp.gmail.com
Port: 587
TLS: True
Email: techflixtelugu@gmail.com
Password: odef xcec xohg woup (App Password)
```

### **SMS (Fast2SMS)**
```
Provider: Fast2SMS
API Key: 83gDaZcwo9QnFdV7frOKSMEjUCkJh6eu1vTHm05pXyNLtPBYqI...
Limit: 50 SMS/day (Free tier)
```

### **Payment (Razorpay)**
```
Mode: Test
Key ID: rzp_test_Rv8j6Dfc25hqRt
Key Secret: U0rUURLVYbnijMi5GcgEAn91
```

### **Google Maps**
```
API Key: AIzaSyBm_uKQ1V_ef79p7-LB86T6QtCZ-E73el0
```

### **Firebase (Push Notifications)**
```
Project ID: studio-7524834929-49622
API Key: AIzaSyDIF6XTIFj478ejVaBecEvJSThXmanQbHI
```

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
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=*

# Database
DATABASE_URL=postgres://vehic_aid:vehic_aid123@localhost:5432/vehic_aid

# Redis
REDIS_URL=redis://localhost:6379/1
CELERY_BROKER_URL=redis://localhost:6379/0

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=techflixtelugu@gmail.com
EMAIL_HOST_PASSWORD=odef xcec xohg woup

# SMS (Fast2SMS)
SMS_PROVIDER=fast2sms
FAST2SMS_API_KEY=your-api-key

# Payment (Razorpay)
RAZORPAY_KEY_ID=rzp_test_Rv8j6Dfc25hqRt
RAZORPAY_KEY_SECRET=U0rUURLVYbnijMi5GcgEAn91

# Google Maps
GOOGLE_MAPS_API_KEY=AIzaSyBm_uKQ1V_ef79p7-LB86T6QtCZ-E73el0
```

### **Web Applications (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8001/ws
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBm_uKQ1V_ef79p7-LB86T6QtCZ-E73el0
```

### **Mobile Applications (.env)**
```env
EXPO_PUBLIC_API_URL=http://localhost:8001/api/v1
EXPO_PUBLIC_WS_URL=ws://localhost:8001/ws
```

---

## 📖 Documentation

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
- **Website**: https://vehicaid.com

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

**Version**: 2.0.0  
**Last Updated**: January 17, 2026
