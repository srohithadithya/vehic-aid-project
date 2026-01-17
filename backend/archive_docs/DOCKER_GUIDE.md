# 🐳 Docker Deployment Guide for Vehic-Aid

## Quick Start (5 Minutes)

### Prerequisites
1. **Install Docker Desktop**: https://www.docker.com/products/docker-desktop/
2. **Start Docker Desktop** (wait for it to fully start)

### Deploy with One Command

```bash
# Navigate to project
cd c:\vehic-aid-project\01_backend

# Build and start all services
docker-compose up -d --build
```

**That's it!** Your application is now running at:
- **API**: http://localhost:8000/api/v1/
- **Admin**: http://localhost:8000/admin/
- **Dashboard**: http://localhost:8000/dashboard/

---

## What Docker Does

Docker will automatically:
- ✅ Create PostgreSQL database
- ✅ Start Redis cache
- ✅ Run migrations
- ✅ Collect static files
- ✅ Start Django application
- ✅ Start Celery worker

---

## Useful Commands

### View Running Containers
```bash
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f web
docker-compose logs -f celery
docker-compose logs -f db
```

### Stop Services
```bash
docker-compose down
```

### Restart Services
```bash
docker-compose restart
```

### Create Superuser
```bash
docker-compose exec web python manage.py createsuperuser
```

### Run Commands Inside Container
```bash
# Django shell
docker-compose exec web python manage.py shell

# Migrations
docker-compose exec web python manage.py migrate

# Collect static
docker-compose exec web python manage.py collectstatic
```

### Clean Everything (Fresh Start)
```bash
docker-compose down -v
docker-compose up -d --build
```

---

## Troubleshooting

### Port Already in Use
If port 8000 is already in use:
```bash
# Stop the running Django server first
# Then run docker-compose
docker-compose up -d
```

### Database Connection Error
```bash
# Check if database is healthy
docker-compose ps

# Restart database
docker-compose restart db

# View database logs
docker-compose logs db
```

### Permission Errors
```bash
# On Windows, run PowerShell as Administrator
# Then run docker-compose commands
```

---

## Access Services

### PostgreSQL Database
```bash
# Connect to database
docker-compose exec db psql -U vehic_aid -d vehic_aid_db

# Or use connection string:
# Host: localhost
# Port: 5432
# Database: vehic_aid_db
# User: vehic_aid
# Password: vehic_aid_pass_123
```

### Redis
```bash
# Connect to Redis
docker-compose exec redis redis-cli

# Test connection
docker-compose exec redis redis-cli ping
```

---

## Production Deployment

For production, update `docker-compose.yml`:
1. Set `DEBUG=False`
2. Change database password
3. Add environment file
4. Use nginx reverse proxy

---

## Summary

**Start**: `docker-compose up -d --build`  
**Stop**: `docker-compose down`  
**Logs**: `docker-compose logs -f`  
**Access**: http://localhost:8000

🎉 **Your application is now running in Docker!**
