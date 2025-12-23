# 📋 Developer Quick Reference Card

## 🚀 Quick Start (Copy & Paste)

### Start Everything
```powershell
# Terminal 1: Start Backend
cd 01_backend
docker-compose up -d

# Terminal 2: Start Frontend
cd 03_web-admin-panel\admin
npm run dev

# Terminal 3: Check Status
.\check-setup.ps1
```

---

## 🌐 Access URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Admin panel |
| **API** | http://localhost:8000/api/v1/ | Backend API |
| **Admin** | http://localhost:8000/admin/ | Django admin |
| **Docs** | Root directory | README.md, guides |

---

## 📁 Important Files

| File | Location | Purpose |
|------|----------|---------|
| Backend config | `01_backend/.env.dev` | Django settings |
| Frontend config | `03_web-admin-panel/admin/.env.local` | Next.js settings |
| API client | `03_web-admin-panel/admin/lib/api.ts` | Axios + JWT |
| Main routes | `01_backend/vehic_aid_backend/urls.py` | API endpoints |
| Next config | `03_web-admin-panel/admin/next.config.ts` | API rewrites |

---

## 🧪 Testing Commands

```bash
# Backend tests
docker exec vehicaid_web pytest -v

# Frontend tests
cd 03_web-admin-panel/admin && npm test

# Backend coverage
docker exec vehicaid_web pytest --cov=apps

# Linting
npm run lint
```

---

## 🐛 Debug & Logs

```bash
# Backend logs
docker logs vehicaid_web -f

# Database logs
docker logs vehicaid_db -f

# Frontend logs
# Terminal where npm run dev is running

# Django shell
docker exec -it vehicaid_web python manage.py shell

# Database access
docker exec -it vehicaid_db psql -U vehic_aid -d vehic_aid_db
```

---

## 🔄 Common Tasks

### Database
```bash
# Create migration
docker exec vehicaid_web python manage.py makemigrations

# Apply migrations
docker exec vehicaid_web python manage.py migrate

# Create admin user
docker exec vehicaid_web python manage.py createsuperuser

# Show migration status
docker exec vehicaid_web python manage.py showmigrations
```

### Docker
```bash
# List containers
docker ps -a

# Stop all
docker-compose down

# Reset (WARNING: deletes data)
docker-compose down -v

# Rebuild
docker-compose build --no-cache

# Logs (last 50 lines)
docker logs vehicaid_web --tail 50
```

### Frontend
```bash
cd 03_web-admin-panel/admin

npm install      # Install deps
npm run dev      # Start dev server
npm run build    # Build for prod
npm start        # Start prod server
npm test         # Run tests
npm run lint     # Lint code
```

---

## 🔐 API Authentication

### Get Access Token
```bash
curl -X POST http://localhost:8000/api/v1/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"user@example.com","password":"pass123"}'
```

### Use Token
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/services/
```

### Token Storage (Frontend)
```typescript
// Stored automatically in localStorage
localStorage.getItem('access_token')

// Clear on logout
localStorage.removeItem('access_token')
```

---

## 🛠️ Troubleshooting Quick Fixes

### Can't connect to backend
```bash
docker ps                    # Check containers
docker logs vehicaid_web     # Check errors
docker-compose restart       # Restart all
```

### Database error
```bash
docker exec vehicaid_web python manage.py migrate
docker-compose down -v && docker-compose up -d
```

### API not responding
```bash
# Check CORS
docker logs vehicaid_web | grep -i cors

# Check network
docker ps  # Ensure all containers running

# Test endpoint
curl http://localhost:8000/admin/
```

### Frontend not loading
```bash
# Clear cache & restart
Ctrl+Shift+Delete  # Browser cache

# Restart Next.js
npm run dev
```

---

## 📊 Project Structure Quick Guide

```
Backend: 01_backend/
  ├── apps/
  │   ├── users/    → Authentication
  │   ├── services/ → Booking system
  │   ├── payments/ → Payment system
  │   └── iot_devices/ → IoT tracking
  └── vehic_aid_backend/ → Settings

Frontend: 03_web-admin-panel/admin/
  ├── app/        → Pages (routing)
  ├── components/ → Reusable UI
  ├── lib/        → Utilities & API
  └── public/     → Static assets
```

---

## 🔌 API Endpoints Cheat Sheet

```bash
# Users
POST   /api/v1/users/login/
POST   /api/v1/users/register/
GET    /api/v1/users/profile/
PUT    /api/v1/users/profile/

# Services
GET    /api/v1/services/
POST   /api/v1/services/
GET    /api/v1/services/{id}/
PUT    /api/v1/services/{id}/
DELETE /api/v1/services/{id}/

# Requests
GET    /api/v1/services/requests/
POST   /api/v1/services/requests/

# Payments
GET    /api/v1/payments/transactions/
GET    /api/v1/payments/settlements/

# IoT
GET    /api/v1/iot/devices/
POST   /api/v1/iot/devices/
```

---

## 📚 Documentation Quick Links

| Document | Purpose |
|----------|---------|
| `QUICK_START.md` | Setup & basics |
| `INTEGRATION_SUMMARY.md` | Overview & status |
| `BACKEND_FRONTEND_INTEGRATION.md` | Detailed guide |
| `PRODUCTION_DEPLOYMENT.md` | Deploy to prod |
| `README.md` | Project info |

---

## 🎯 Development Workflow

### 1. Create Feature
```bash
git checkout -b feature/new-feature
```

### 2. Backend Work
```bash
cd 01_backend
# Edit models → serializers → views → urls
# Write tests
docker exec vehicaid_web pytest -v
```

### 3. Frontend Work
```bash
cd 03_web-admin-panel/admin
# Create components → pages → API calls
npm test
```

### 4. Test
```bash
# Full test suite
docker exec vehicaid_web pytest -v
npm test
```

### 5. Commit & Push
```bash
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

---

## 🚀 Deployment Commands

### Production Build
```bash
# Backend
docker build -f Dockerfile -t vehic-aid:latest .

# Frontend
cd 03_web-admin-panel/admin
npm run build
npm start
```

### Deploy
```bash
# Using Docker
docker-compose -f docker-compose.yml up -d

# Or manual deployment
gunicorn vehic_aid_backend.wsgi:application
```

---

## 💡 Tips & Tricks

1. **Hot Reload:** Both backend and frontend support hot reload
2. **Debug:** Use `pdb` in Python and browser DevTools for JS
3. **Database:** Use `django-extensions` for `graph_models`
4. **Performance:** Use `django-debug-toolbar` in development
5. **Testing:** Write tests as you code, not after
6. **Git:** Commit frequently, write descriptive messages
7. **Docs:** Update docs when adding features
8. **Security:** Never commit `.env` files or secrets

---

## ⚡ Performance Tips

- Use `select_related()` and `prefetch_related()` for queries
- Enable Redis caching for frequent queries
- Minimize API calls (combine endpoints if possible)
- Use lazy loading for lists
- Optimize images and static files
- Monitor database query performance
- Setup monitoring before scaling

---

## 🔐 Security Checklist

- [ ] Never commit secrets or `.env` files
- [ ] Use environment variables for all sensitive data
- [ ] Validate all user inputs
- [ ] Use HTTPS in production
- [ ] Enable CORS only for trusted domains
- [ ] Implement rate limiting
- [ ] Use strong passwords
- [ ] Enable 2FA for admin accounts
- [ ] Regular security audits
- [ ] Keep dependencies updated

---

## 📞 Quick Help

### Where to find answers?

1. **Setup issues?** → `QUICK_START.md`
2. **API questions?** → `BACKEND_FRONTEND_INTEGRATION.md`
3. **Deployment?** → `PRODUCTION_DEPLOYMENT.md`
4. **Status check?** → `./check-setup.ps1`
5. **Code errors?** → `docker logs vehicaid_web`

### Emergency Reset
```bash
# Full reset (WARNING: loses data)
docker-compose down -v
rm 01_backend/db.sqlite3
docker-compose up -d

# This will:
# - Delete all Docker volumes
# - Remove local SQLite database
# - Restart with fresh database
```

---

## 📅 Useful URLs

- Django Docs: https://docs.djangoproject.com/
- DRF Docs: https://www.django-rest-framework.org/
- Next.js Docs: https://nextjs.org/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/
- Axios Docs: https://axios-http.com/
- Tailwind Docs: https://tailwindcss.com/docs

---

**Version:** 1.0 | **Date:** November 25, 2025
**Status:** ✅ Ready for Development
**Support:** Check docs in project root

Print this card and keep it nearby! 📋

