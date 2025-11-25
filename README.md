# 🚗 Vehic-Aid: Complete Vehicle Assistance Platform

**Production-ready backend and admin panel for vehicle roadside assistance services**

---

## 📱 Platform Overview

Vehic-Aid is a comprehensive vehicle assistance platform designed to connect customers with nearby service providers for roadside assistance services.

### Key Features

🔧 **Service Management**
- Browse and book services (towing, jump-start, puncture repair, etc)
- Real-time service provider tracking
- Service request status updates

💳 **Payment Processing**
- Multiple payment methods (UPI, Card, Wallet, Cash)
- Secure transaction handling
- Daily provider settlements

📍 **IoT Integration**
- Connected vehicle tracking
- Real-time location sharing
- Device sensor data

👥 **User Management**
- Customer and provider profiles
- Subscription plans
- Performance ratings

📊 **Admin Dashboard**
- Service management
- Payment tracking
- User analytics
- Provider payouts

---

## 🏗️ Architecture

### Technology Stack

**Backend:**
- **Framework:** Django 4.2.14 with Django REST Framework 3.14.0
- **Server:** Daphne (ASGI, async support)
- **Database:** PostgreSQL 14
- **Cache:** Redis 7
- **Task Queue:** Celery + Redis
- **WebSocket:** Channels

**Frontend:**
- **Framework:** Next.js 16.0.3
- **Language:** TypeScript/React 19
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI
- **HTTP Client:** Axios with JWT auth

**Infrastructure:**
- **Containers:** Docker + Docker Compose
- **Server:** Gunicorn (production)
- **Web Server:** Nginx (production)

---

## 🚀 Quick Start

### Prerequisites

✅ **Docker & Docker Compose**
```bash
docker --version
```

✅ **Node.js 18+**
```bash
node --version
npm --version
```

### 5-Minute Setup

**1. Start Backend Services**
```bash
cd 01_backend
docker-compose up -d
```

**2. Start Frontend (New Terminal)**
```bash
cd web-admin-panel/admin
npm run dev
```

**3. Access Services**
```
Frontend:     http://localhost:3000
Backend API:  http://localhost:8000/api/v1/
Admin Panel:  http://localhost:8000/admin/
```

### Verify Setup

```bash
./check-setup.ps1
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **QUICK_START.md** ⭐ | Get started in 5 minutes |
| **INTEGRATION_SUMMARY.md** | Project overview & status |
| **BACKEND_FRONTEND_INTEGRATION.md** | Detailed API integration |
| **PRODUCTION_DEPLOYMENT.md** | Deploy to production |

---

## ✅ Current Status

### Backend
- Status: **Production Ready** ✅
- Tests: **19/19 Passing** ✅
- Database: **Migrated & Healthy** ✅
- API: **Fully Functional** ✅

### Frontend
- Status: **Development Ready** ✅
- Build: **Successful** ✅
- API Client: **Configured** ✅

### Infrastructure
- PostgreSQL 14 ✅
- Redis 7 ✅
- All Services Running ✅

---

## 📖 Project Structure

```
vehic-aid-project/
├── 01_backend/                  # Django Backend
│   ├── apps/
│   │   ├── users/               # Authentication & profiles
│   │   ├── services/            # Service booking
│   │   ├── payments/            # Payment processing
│   │   └── iot_devices/         # IoT management
│   ├── vehic_aid_backend/       # Project settings
│   ├── docker-compose.yml
│   └── requirements.txt
├── web-admin-panel/admin/       # Next.js Frontend
│   ├── app/                     # Pages
│   ├── components/              # React components
│   ├── lib/                     # Utilities
│   └── package.json
├── docs/                        # Documentation
├── QUICK_START.md
├── BACKEND_FRONTEND_INTEGRATION.md
└── PRODUCTION_DEPLOYMENT.md
```

---

## 🔌 API Integration

### Authentication

**Login:** `POST /api/v1/users/login/`

```bash
curl -X POST http://localhost:8000/api/v1/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "user@example.com", "password": "password123"}'
```

### Core Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/users/login/` | POST | User authentication |
| `/services/` | GET/POST | Service management |
| `/payments/transactions/` | GET | Payment transactions |
| `/iot/devices/` | GET/POST | IoT device management |

---

## 🧪 Testing

### Run Tests

**Backend:**
```bash
cd 01_backend
docker exec vehicaid_web pytest -v
```

**Result:** ✅ 19/19 tests passing

### Coverage

```bash
docker exec vehicaid_web pytest --cov=apps --cov-report=html
```

---

## 🛠️ Development

### Add a Feature

1. **Backend:** Define model → Create serializer → Add view → Register URL
2. **Frontend:** Create component → Create page → Call API → Test

See `BACKEND_FRONTEND_INTEGRATION.md` for detailed examples.

---

## 🚀 Deployment

### Development

```bash
./start-dev.ps1
```

### Production

See `PRODUCTION_DEPLOYMENT.md` for:
- Gunicorn + Nginx setup
- Docker multi-stage builds
- SSL configuration
- Monitoring setup
- Backup strategy

---

## 🐛 Troubleshooting

### Common Issues

**"Cannot connect to backend"**
```bash
docker ps  # Check containers
docker logs vehicaid_web  # View logs
```

**"Database error"**
```bash
docker exec vehicaid_web python manage.py migrate
```

**"Frontend not connecting to API"**
- Check `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`
- Clear browser cache: Ctrl+Shift+Delete

See `QUICK_START.md` for more troubleshooting.

---

## 📞 Support

1. Check documentation in project root
2. Review `QUICK_START.md` for setup
3. Check logs: `docker logs vehicaid_web`
4. Verify setup: `./check-setup.ps1`

---

## 🎓 Learning Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Next.js Tutorial](https://nextjs.org/learn)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Docker Guide](https://docs.docker.com/get-started/)

---

## 🎉 Ready to Launch!

Your Vehic-Aid platform is ready for:
- ✅ Local development
- ✅ Production deployment
- ✅ Team collaboration
- ✅ Customer onboarding

**Next Steps:**
1. Review `QUICK_START.md`
2. Read `BACKEND_FRONTEND_INTEGRATION.md`
3. Follow `PRODUCTION_DEPLOYMENT.md` for deployment

---

**Built with ❤️ for the Vehic-Aid community**

Backend: ✅ Production Ready | Frontend: ✅ Ready | DB: ✅ PostgreSQL 14 | Cache: ✅ Redis 7


- **Cache:** Redis

## Documentation

See `/docs` folder for detailed documentation.
