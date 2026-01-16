# VehicAid - Complete Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Docker Deployment](#docker-deployment)
4. [Development Setup](#development-setup)
5. [Configuration](#configuration)
6. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### Required Software
- **Docker Desktop** (Windows/Mac) or Docker Engine (Linux)
- **Docker Compose** v2.0+
- **Git** for version control
- **Node.js** 18+ (for local development)
- **Python** 3.11+ (for local development)

### API Keys & Services
- **Google Maps API Key** (Required for location features)
  - Enable: Maps JavaScript API
  - Enable: Geocoding API
  - Get key from: https://console.cloud.google.com/

- **Razorpay Account** (Optional - for payments)
  - Sign up at: https://razorpay.com/

---

## 🌍 Environment Setup

### 1. Clone the Repository
```bash
git clone https://github.com/srohithadithya/vehic-aid-project.git
cd vehic-aid-project
```

### 2. Configure Environment Variables
```bash
cd infrastructure
cp .env.example .env
```

### 3. Edit `.env` File
Open `.env` and update the following **required** variables:

```env
# REQUIRED: Google Maps API Key
GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key_here

# Database (default values work for Docker)
POSTGRES_DB=vehic_aid
POSTGRES_USER=vehic_aid
POSTGRES_PASSWORD=vehic_aid123

# Django Secret (CHANGE IN PRODUCTION!)
SECRET_KEY=your-super-secret-key-change-this-in-production

# Debug Mode (False in production)
DEBUG=True
```

---

## 🐳 Docker Deployment

### Quick Start (All Services)
```bash
cd infrastructure
docker-compose up --build -d
```

### Service URLs
After deployment, access the applications at:

| Service | URL | Port |
|---------|-----|------|
| **Admin Panel** | http://localhost:3000 | 3000 |
| **Provider App** | http://localhost:3001 | 3001 |
| **Booker App** | http://localhost:3003 | 3003 |
| **Backend API** | http://localhost:8001 | 8001 |
| **PostgreSQL** | localhost:5432 | 5432 |
| **Redis** | localhost:6379 | 6379 |

### Default Credentials
- **Admin Username**: `admin_mobile`
- **Admin Password**: `password123`

### Verify Deployment
```bash
# Check all containers are running
docker-compose ps

# View logs
docker-compose logs -f

# Check specific service
docker-compose logs -f web-booker
```

### Stop Services
```bash
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

---

## 💻 Development Setup

### Backend (Django)
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup database
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver 8001
```

### Web Admin Panel
```bash
cd web/admin

# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1" > .env.local

# Run development server
npm run dev
```

### Web Provider App
```bash
cd web/provider

# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1" > .env.local

# Run development server
npm run dev
```

### Web Booker App
```bash
cd web/booker

# Install dependencies
npm install

# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
EOF

# Run development server
npm run dev
```

---

## ⚙️ Configuration

### Google Maps Setup

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project** (or select existing)

3. **Enable Required APIs**
   - Maps JavaScript API
   - Geocoding API

4. **Create API Key**
   - Navigate to: APIs & Services > Credentials
   - Click: Create Credentials > API Key
   - Copy the key

5. **Restrict API Key** (Recommended)
   - Application restrictions: HTTP referrers
   - Add: `http://localhost:3003/*`
   - API restrictions: Select Maps JavaScript API and Geocoding API

6. **Add to Environment**
   ```env
   GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

### Payment Gateway Setup (Optional)

#### Razorpay
1. Sign up at https://razorpay.com/
2. Get API keys from Dashboard
3. Add to `.env`:
   ```env
   RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
   RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXX
   ```

### Email Configuration (Optional)

For Gmail:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password
EMAIL_USE_TLS=True
```

---

## 🔍 Troubleshooting

### Docker Issues

**Problem**: Containers won't start
```bash
# Check logs
docker-compose logs

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

**Problem**: Port already in use
```bash
# Find process using port (Windows)
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F

# Or change port in docker-compose.yml
```

### Database Issues

**Problem**: Database connection refused
```bash
# Check if PostgreSQL is running
docker-compose ps db

# Restart database
docker-compose restart db

# Check database logs
docker-compose logs db
```

**Problem**: Migrations not applied
```bash
# Run migrations manually
docker-compose exec web python manage.py migrate

# Or rebuild web container
docker-compose up --build web
```

### Frontend Issues

**Problem**: API connection errors
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify backend is running: http://localhost:8001
- Check browser console for CORS errors

**Problem**: Google Maps not loading
- Verify API key is correct
- Check browser console for errors
- Ensure APIs are enabled in Google Cloud Console

**Problem**: Build errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### WebSocket Issues

**Problem**: Real-time updates not working
- Check WebSocket connection in browser DevTools (Network tab)
- Verify Redis is running: `docker-compose ps redis`
- Check backend logs for Channels errors

---

## 📊 Monitoring

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f web
docker-compose logs -f celery
docker-compose logs -f web-booker
```

### Database Access
```bash
# Connect to PostgreSQL
docker-compose exec db psql -U vehic_aid -d vehic_aid

# Common queries
SELECT * FROM auth_user;
SELECT * FROM services_servicerequest;
```

### Redis Access
```bash
# Connect to Redis
docker-compose exec redis redis-cli

# Check keys
KEYS *

# Monitor commands
MONITOR
```

---

## 🚀 Production Deployment

### Security Checklist
- [ ] Change `SECRET_KEY` to a strong random value
- [ ] Set `DEBUG=False`
- [ ] Update `ALLOWED_HOSTS` with your domain
- [ ] Configure HTTPS/SSL certificates
- [ ] Restrict Google Maps API key to your domain
- [ ] Use strong database passwords
- [ ] Enable firewall rules
- [ ] Set up backup strategy
- [ ] Configure monitoring (Sentry, etc.)

### Performance Optimization
- [ ] Enable Redis caching
- [ ] Configure CDN for static files
- [ ] Set up load balancer
- [ ] Optimize database queries
- [ ] Enable Gzip compression
- [ ] Configure proper logging

---

## 📞 Support

For issues or questions:
- **GitHub Issues**: https://github.com/srohithadithya/vehic-aid-project/issues
- **Documentation**: Check `docs/` folder
- **Logs**: Always check `docker-compose logs` first

---

## 🎯 Quick Reference

### Common Commands
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild specific service
docker-compose up --build web-booker

# View logs
docker-compose logs -f

# Execute command in container
docker-compose exec web python manage.py shell

# Database backup
docker-compose exec db pg_dump -U vehic_aid vehic_aid > backup.sql

# Database restore
docker-compose exec -T db psql -U vehic_aid vehic_aid < backup.sql
```

### Port Reference
- `3000` - Admin Panel
- `3001` - Provider App
- `3003` - Booker App
- `8001` - Backend API
- `5432` - PostgreSQL
- `6379` - Redis

---

**Last Updated**: January 2026
**Version**: 2.0.0
