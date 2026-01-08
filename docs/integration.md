# Backend & Web Admin Panel Integration Guide

## Overview

This document provides a complete setup and integration guide for connecting the Django backend with the Next.js web/admin.

**Current Status:**
- ✅ Backend: Django 4.2.14 with DRF 3.14.0 running on http://localhost:8000
- ✅ Database: PostgreSQL 14 (Docker container)
- ✅ Cache/Broker: Redis 7 (Docker container)
- ✅ Frontend: Next.js 16.0.3 web/admin
- ✅ CORS: Configured and enabled for development
- ✅ API Proxy: Next.js rewrites configured

---

## Part 1: Backend Configuration

### Current Setup

**Running Services:**
```
Database:  PostgreSQL 14 (Container: vehicaid_db, Port: 5432)
Cache:     Redis 7 (Container: vehicaid_redis, Port: 6379)
API:       Django + Daphne (Container: vehicaid_web, Port: 8000)
Worker:    Celery (Container: vehicaid_celery)
```

### Backend Environment Variables

Location: `01_backend/.env.dev`

**Current Configuration:**
```bash
DJANGO_SETTINGS_MODULE=vehic_aid_backend.settings.development
DEBUG=True
SECRET_KEY='ov-*f_xkdc=04*3#pegm9r3*(0r_498p1r70s&d86i$_1ing1*'
ALLOWED_HOSTS=127.0.0.1,localhost

DATABASE_URL=postgres://vehic_aid:vehic_aid123@localhost:5432/vehic_aid_db
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/1

GOOGLE_MAPS_API_KEY=AIzaSyBm_uKQ1V_ef79p7-LB86T6QtCZ-E73el0
RAZORPAY_KEY_ID=RS4AXuz5BlN3gZ
RAZORPAY_KEY_SECRET=zlcpYExnA1lfx67G03EAJ4eQ
```

### CORS Settings

**File:** `01_backend/vehic_aid_backend/settings/development.py`

```python
# CORS settings for development
CORS_ALLOW_ALL_ORIGINS = True  # Allow all origins in development
CORS_ALLOW_CREDENTIALS = True  # Allow cookies/auth headers
```

**For Production:** Update to specific allowed origins:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://yourdomain.com",
]
```

### API Endpoints

**Base URL:** `http://localhost:8000/api/v1/`

**Available Endpoints:**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `users/login/` | POST | User authentication |
| `users/register/` | POST | User registration |
| `users/profile/` | GET/PUT | User profile |
| `services/` | GET/POST | Service management |
| `services/{id}/` | GET/PUT/DELETE | Service details |
| `payments/transactions/` | GET | Payment transactions |
| `payments/settlements/` | GET | Daily settlements |
| `iot/devices/` | GET/POST | IoT device management |

---

## Part 2: Frontend Configuration

### Next.js Setup

- **Frontend (Web):**
    - `03_01_web-provider` -> `web/provider`
    - `03_02_web-booker` -> `web/booker`
    - `03_03_web-admin-panel/admin` -> `web/admin`

### Environment Variables

**File:** `03_web-admin-panel/admin/.env.local`

```bash
# Backend API base URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# App URL (for redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### API Client Configuration

**File:** `03_web-admin-panel/admin/lib/api.ts`

```typescript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// JWT token from localStorage is automatically added to requests
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auto-redirect to login on 401
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
```

### Next.js Config

**File:** `03_web-admin-panel/admin/next.config.ts`

API requests are proxied via Next.js rewrites to avoid CORS issues in browser:

```typescript
async rewrites() {
    return [
        {
            source: '/api/:path*',
            destination: 'http://localhost:8000/api/:path*',
        },
    ];
}
```

---

## Part 3: Running the Full Stack

### Option A: Using Docker (Recommended)

**Start Backend Services:**
```bash
cd 01_backend
docker-compose up -d
```

**Start Frontend:**
```bash
cd 03_web-admin-panel/admin
npm install
npm run dev
```

**Check Status:**
```bash
# List running containers
docker ps

# Backend logs
docker logs vehicaid_web

# Database health
docker exec vehicaid_db pg_isready -U vehic_aid

# Redis health
docker exec vehicaid_redis redis-cli ping
```

### Option B: Local Development (SQLite + Local Redis)

**Backend:**
```bash
cd 01_backend

# Create/update database
python manage.py migrate

# Create superuser (if needed)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

**Frontend:**
```bash
cd 03_web-admin-panel/admin
npm install
npm run dev
```

**Access:**
- Backend Admin: http://localhost:8001/admin
- API: http://localhost:8001/api/v1/
- Frontend: http://localhost:3000

---

## Part 4: Authentication Flow

### Login Process

1. **User submits credentials** on `/login` page
2. **Frontend calls:** `POST /api/v1/users/login/`
3. **Backend returns:** `{ access_token, refresh_token, user_id, ... }`
4. **Frontend stores:** 
   - `access_token` in `localStorage`
   - Optionally `refresh_token` for token refresh
5. **Subsequent requests:** Include `Authorization: Bearer <token>` header (automatic via apiClient)

### JWT Token Storage

```typescript
// Login response
const { access_token } = response.data;

// Store token
localStorage.setItem('access_token', access_token);

// Auto-logout on 401
if (error.response?.status === 401) {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
}
```

---

## Part 5: Data Flow Example

### Example: Fetching Services List

**Frontend Component:**
```typescript
import { apiClient } from '@/lib/api';

export default function Services() {
    const [services, setServices] = useState([]);

    useEffect(() => {
        // Request to /api/v1/services/
        // Will include: Authorization: Bearer <token>
        apiClient.get('/services/')
            .then(response => setServices(response.data.results))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            {services.map(service => (
                <div key={service.id}>{service.name}</div>
            ))}
        </div>
    );
}
```

**Backend API Response:**
```json
{
    "count": 50,
    "next": "http://localhost:8000/api/v1/services/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "name": "Towing",
            "description": "Vehicle towing service",
            "price": "500.00",
            "status": "ACTIVE"
        },
        ...
    ]
}
```

---

## Part 6: Database Schema

### Key Models

**Users App:**
- `CustomUser`: Base user model (email/phone login)
- `ServiceBooker`: Customer profile
- `ServiceProvider`: Professional profile

**Services App:**
- `Service`: Service offerings
- `ServiceRequest`: Booking requests
- `SubscriptionPlan`: Pricing tiers
- `UserSubscription`: Customer subscriptions
- `Wallet`: Payment wallet

**Payments App:**
- `Transaction`: Payment records
- `DailySettlement`: Provider payouts

**IoT Devices App:**
- `Device`: Connected vehicles
- `DeviceData`: Sensor readings

---

## Part 7: Development Workflows

### Adding a New Admin Feature

1. **Create API Endpoint** (Backend):
   ```bash
   # Add view in apps/services/views.py
   # Add URL in apps/services/urls.py
   # Run: python manage.py test
   ```

2. **Create UI Component** (Frontend):
   ```bash
   # Create component in components/
   # Create page in app/dashboard/ or relevant section
   ```

3. **Connect to API** (Frontend):
   ```typescript
   import { apiClient } from '@/lib/api';
   
   const fetchData = async () => {
       const response = await apiClient.get('/endpoint/');
       return response.data;
   };
   ```

4. **Test End-to-End**:
   ```bash
   # Backend
   docker logs vehicaid_web
   
   # Frontend
   npm run dev
   
   # Browser: http://localhost:3000
   ```

### Debugging

**Backend API Issues:**
```bash
# Check backend logs
docker logs vehicaid_web

# Test API directly
curl -H "Authorization: Bearer <token>" \
     http://localhost:8000/api/v1/services/

# Django shell
docker exec vehicaid_web python manage.py shell
```

**Frontend Issues:**
```bash
# Check browser console (F12)
# Check Next.js terminal output
# Test API client in browser console:
# localStorage.getItem('access_token')
```

**Database Issues:**
```bash
# Check Postgres
docker exec vehicaid_db psql -U vehic_aid -d vehic_aid_db -c "SELECT * FROM users_customuser;"

# Check migrations
docker exec vehicaid_web python manage.py showmigrations

# Apply pending migrations
docker exec vehicaid_web python manage.py migrate
```

---

## Part 8: Deployment Checklist

### Before Going to Production

- [ ] Update `SECRET_KEY` in production settings
- [ ] Set `DEBUG = False`
- [ ] Configure `ALLOWED_HOSTS` with actual domain
- [ ] Update `CORS_ALLOWED_ORIGINS` with frontend domain
- [ ] Use environment variables for sensitive data
- [ ] Set up proper database backups
- [ ] Configure SSL/TLS certificates
- [ ] Use production-grade web server (Nginx/Gunicorn instead of Daphne)
- [ ] Enable HTTPS on frontend
- [ ] Update `NEXT_PUBLIC_API_URL` to production backend URL
- [ ] Test authentication flow thoroughly
- [ ] Set up monitoring and logging
- [ ] Configure CI/CD pipeline

### Production Environment

**Backend (.env.production):**
```bash
DJANGO_SETTINGS_MODULE=vehic_aid_backend.settings.production
DEBUG=False
SECRET_KEY=<strong-random-key>
ALLOWED_HOSTS=yourdomain.com,api.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com

DATABASE_URL=postgres://<user>:<pass>@<host>:5432/<db>
CELERY_BROKER_URL=redis://<host>:6379/0

# Enable email notifications
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=<your-email>
EMAIL_HOST_PASSWORD=<your-app-password>
```

**Frontend (.env.production):**
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## Part 9: API Documentation

Full API documentation available at: `http://localhost:8000/api/v1/`

### Common Endpoints

**Authentication:**
```bash
POST /api/v1/users/login/
{
    "username": "user@example.com",
    "password": "password123"
}
```

**Get Services:**
```bash
GET /api/v1/services/?limit=10&offset=0
```

**Create Service Request:**
```bash
POST /api/v1/services/requests/
{
    "service_id": 1,
    "location": "123 Main St",
    "description": "My car won't start"
}
```

---

## Troubleshooting

### Backend Connection Issues

**"Cannot connect to localhost:8000"**
- Ensure Docker containers are running: `docker ps`
- Check if port 8000 is already in use: `netstat -ano | findstr :8000`
- Restart containers: `docker-compose restart`

### CORS Errors

**"Access to XMLHttpRequest blocked by CORS policy"**
- Verify `CORS_ALLOW_ALL_ORIGINS=True` in development
- Check browser console for exact error
- Verify frontend URL is in `CORS_ALLOWED_ORIGINS` in production

### Authentication Issues

**"401 Unauthorized"**
- Check if token is being sent: Browser DevTools → Network → Request Headers
- Verify token hasn't expired (JWT tokens have expiration)
- Implement token refresh logic if needed

### Database Errors

**"column does not exist"**
- Run migrations: `docker exec vehicaid_web python manage.py migrate`
- Check migration status: `docker exec vehicaid_web python manage.py showmigrations`

---

## Summary

The backend and frontend are now fully integrated:

✅ Backend API serves on `http://localhost:8000/api/v1/`
✅ Frontend (Next.js) on `http://localhost:3000`
✅ CORS enabled for cross-origin requests
✅ JWT authentication configured
✅ API client with interceptors ready
✅ PostgreSQL + Redis in Docker
✅ All tests passing (19/19)

**To start developing:**
```bash
# Terminal 1: Start backend
cd 01_backend
docker-compose up -d

# Terminal 2: Start frontend
cd 03_web-admin-panel/admin
npm run dev

# Open http://localhost:3000 in browser
```

