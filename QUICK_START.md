# 🚀 Vehic-Aid Quick Start Guide

## Overview

Welcome to Vehic-Aid! This guide will get you up and running with the complete backend and frontend stack in minutes.

**Project Stack:**
- **Backend:** Django 4.2.14 + DRF 3.14.0 (Python)
- **Frontend:** Next.js 16.0.3 (React/TypeScript)
- **Database:** PostgreSQL 14 (Docker)
- **Cache:** Redis 7 (Docker)
- **ASGI Server:** Daphne (async Django)
- **Task Queue:** Celery + Redis

---

## Prerequisites

- **Windows:** PowerShell 5.1+
- **Docker Desktop:** [Download](https://www.docker.com/products/docker-desktop)
- **Node.js:** v18+ ([Download](https://nodejs.org/))
- **Python:** 3.12+ (optional for local development)
- **Git:** [Download](https://git-scm.com/)

### Verify Installation

```powershell
# Check Docker
docker --version

# Check Node.js
node --version
npm --version

# Check Python (optional)
python --version
```

---

## 🎯 Quick Start (5 minutes)

### Method 1: Automated Script (Easiest)

```powershell
# From project root
.\start-dev.ps1
```

This will:
1. Start Docker containers (PostgreSQL, Redis, Django)
2. Run database migrations
3. Start the Next.js dev server
4. Open services on their respective ports

### Method 2: Manual Start

**Terminal 1 - Backend:**
```powershell
cd 01_backend
docker-compose up -d
```

**Terminal 2 - Frontend:**
```powershell
cd web-admin-panel\admin
npm install  # Only needed on first run
npm run dev
```

---

## 📍 Service URLs

Once everything is running:

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Next.js admin panel |
| Backend API | http://localhost:8000/api/v1/ | REST API endpoints |
| Django Admin | http://localhost:8000/admin/ | Django management panel |
| API Docs | http://localhost:8000/api/ | API documentation (if configured) |

---

## ✅ Verification

Check if everything is working:

```powershell
# Run verification script
.\check-setup.ps1
```

Expected output should show:
- ✅ PostgreSQL Database
- ✅ Redis Cache
- ✅ Django Web Server
- ✅ Frontend Server

---

## 🔧 Configuration

### Backend Environment

**File:** `01_backend/.env.dev`

```bash
DJANGO_SETTINGS_MODULE=vehic_aid_backend.settings.development
DEBUG=True
DATABASE_URL=postgres://vehic_aid:vehic_aid123@localhost:5432/vehic_aid_db
CELERY_BROKER_URL=redis://localhost:6379/0
GOOGLE_MAPS_API_KEY=your_key_here
RAZORPAY_KEY_ID=your_key_here
RAZORPAY_KEY_SECRET=your_secret_here
```

### Frontend Environment

**File:** `web-admin-panel/admin/.env.local`

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📊 Database Management

### View Database

```powershell
# Access PostgreSQL
docker exec -it vehicaid_db psql -U vehic_aid -d vehic_aid_db

# Inside psql
\dt                              # List tables
SELECT * FROM users_customuser;  # Query users
\q                               # Exit
```

### Run Migrations

```powershell
# Apply pending migrations
docker exec vehicaid_web python manage.py migrate

# Create superuser
docker exec vehicaid_web python manage.py createsuperuser

# Check migration status
docker exec vehicaid_web python manage.py showmigrations
```

---

## 🧪 Testing

### Run Backend Tests

```powershell
cd 01_backend
docker exec vehicaid_web pytest -v

# Or with coverage
docker exec vehicaid_web pytest --cov=apps
```

### Run Frontend Tests

```powershell
cd web-admin-panel/admin
npm test

# Or with coverage
npm test -- --coverage
```

---

## 🛠️ Development Workflow

### Create a New API Endpoint

**Backend (Django):**
1. Define model in `apps/services/models.py`
2. Create serializer in `apps/services/serializers.py`
3. Create viewset in `apps/services/views.py`
4. Register URL in `apps/services/urls.py`
5. Run tests and migrations

**Frontend (Next.js):**
1. Create component in `components/`
2. Create page in `app/[section]/`
3. Call API using apiClient from `lib/api.ts`
4. Handle authentication/errors

### Example: Fetch Services

```typescript
// components/ServicesList.tsx
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export default function ServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/services/')
      .then(res => setServices(res.data.results))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  
  return (
    <ul>
      {services.map(service => (
        <li key={service.id}>{service.name}</li>
      ))}
    </ul>
  );
}
```

---

## 🐛 Troubleshooting

### Backend won't start

```powershell
# Check Docker containers
docker ps -a

# View logs
docker logs vehicaid_web

# Restart
docker-compose restart

# Full reset
docker-compose down
docker-compose up -d
```

### Frontend shows "Cannot connect to API"

1. **Check backend is running:**
   ```powershell
   docker ps | Select-String "vehicaid_web"
   ```

2. **Verify API URL in .env.local:**
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

3. **Clear browser cache:** Ctrl+Shift+Delete → Clear all

### Database errors

```powershell
# Reset database
docker exec vehicaid_db psql -U vehic_aid -d vehic_aid_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Re-run migrations
docker exec vehicaid_web python manage.py migrate
```

### "Port already in use"

```powershell
# Find process using port
netstat -ano | findstr :8000

# Kill process
taskkill /PID <PID> /F

# Or use different port
docker-compose -f docker-compose.yml up -d -p 8001:8000
```

---

## 📚 Project Structure

```
vehic-aid-project/
├── 01_backend/                 # Django backend
│   ├── apps/                   # Django apps
│   │   ├── users/              # User management
│   │   ├── services/           # Service booking
│   │   ├── payments/           # Payment processing
│   │   └── iot_devices/        # IoT device management
│   ├── vehic_aid_backend/      # Project settings
│   ├── .env.dev               # Environment variables
│   ├── requirements.txt        # Python dependencies
│   └── docker-compose.yml      # Docker configuration
│
├── web-admin-panel/
│   └── admin/                  # Next.js frontend
│       ├── app/                # Pages and layouts
│       ├── components/         # React components
│       ├── lib/               # Utilities (API client, etc)
│       ├── .env.local         # Frontend environment
│       └── package.json       # NPM dependencies
│
├── docs/                       # Documentation
├── check-setup.ps1            # Setup verification script
└── start-dev.ps1             # Quick start script
```

---

## 🚀 Common Commands

### Backend Commands

```powershell
# Run migrations
docker exec vehicaid_web python manage.py migrate

# Create admin user
docker exec vehicaid_web python manage.py createsuperuser

# Collect static files
docker exec vehicaid_web python manage.py collectstatic --noinput

# Run shell
docker exec -it vehicaid_web python manage.py shell

# Run tests
docker exec vehicaid_web pytest -v
```

### Frontend Commands

```powershell
cd web-admin-panel/admin

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Linting
npm run lint
```

### Docker Commands

```powershell
# List containers
docker ps -a

# View logs
docker logs vehicaid_web
docker logs vehicaid_db

# Stop services
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v

# Rebuild images
docker-compose build --no-cache
```

---

## 🔐 Authentication

### Login Flow

1. User navigates to `http://localhost:3000/login`
2. Enters email and password
3. Frontend sends POST request to `/api/v1/users/login/`
4. Backend returns JWT token
5. Token is stored in localStorage
6. Frontend automatically includes token in all API requests

### JWT Token

- **Stored in:** localStorage (key: `access_token`)
- **Sent as:** `Authorization: Bearer <token>` header
- **Handled by:** apiClient interceptor in `lib/api.ts`
- **Expiration:** Check backend settings for TTL

---

## 📖 Additional Resources

- [Backend Integration Guide](BACKEND_FRONTEND_INTEGRATION.md)
- [Django Documentation](https://docs.djangoproject.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [DRF Documentation](https://www.django-rest-framework.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## 🎓 Learning Path

1. **Understand the architecture:** Read `BACKEND_FRONTEND_INTEGRATION.md`
2. **Explore the codebase:** Start with `01_backend/apps/services/`
3. **Create a test endpoint:** Add simple GET endpoint and test it
4. **Build a UI component:** Create a component that calls the endpoint
5. **Deploy:** Follow production deployment guide

---

## 💡 Tips

- **Keep terminals organized:** Use VS Code terminal split or separate terminal windows
- **Hot reload enabled:** Both backend (Daphne) and frontend (Next.js) support hot reload
- **Use browser DevTools:** Monitor network requests in Network tab
- **Check Django Admin:** http://localhost:8000/admin has data visualization tools
- **Read logs carefully:** Most issues are in Docker/console logs

---

## ❓ FAQ

**Q: How do I reset the database?**
A: Use `docker-compose down -v` then `docker-compose up -d` to start fresh.

**Q: Can I run without Docker?**
A: Yes, use SQLite locally (see local development guide).

**Q: How do I add a new dependency?**
A: Backend: update `requirements.txt`, Frontend: `npm install package`

**Q: What's the default admin login?**
A: Create one using `docker exec vehicaid_web python manage.py createsuperuser`

**Q: Where are uploaded files stored?**
A: In Docker volume `media_files`. Local: `01_backend/media/`

---

## 🆘 Need Help?

1. **Check logs:** Most issues are visible in container logs
2. **Run verification:** `.\check-setup.ps1`
3. **Review configuration:** Check `.env` files
4. **Read documentation:** See `BACKEND_FRONTEND_INTEGRATION.md`
5. **Check dependencies:** Ensure all prerequisites are installed

---

**Happy coding! 🎉**

Last updated: November 25, 2025
Backend Status: ✅ Running (19/19 tests passing)
Frontend Status: ✅ Running (Next.js 16.0.3)
Database: ✅ PostgreSQL 14
Cache: ✅ Redis 7

