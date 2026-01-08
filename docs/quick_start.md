# 🚀 Vehic-Aid Quick Start Guide

## Overview

This guide provides instructions for starting the Vehic-Aid platform using the recommended Docker environment.

---

## ⚡ Method 1: Docker (Recommended)

This method ensures all services (Django, PostgreSQL, Redis, Celery) are configured correctly.

1. **Navigate to the setup directory:**
   ```powershell
   cd infrastructure
   ```

2. **Start the environment:**
   ```powershell
   docker-compose -f docker-compose.verify.yml up --build -d
   ```

3. **Access Services:**
   - **Web Admin Panel:** [http://localhost:3002/login](http://localhost:3002/login)
   - **Backend Admin:** [http://localhost:8001/admin/](http://localhost:8001/admin/)
   - **API Docs:** [http://localhost:8001/api/docs/](http://localhost:8001/api/docs/)

---

## 🐢 Method 2: Legacy Scripts (Windows)

*Note: These scripts may be outdated compared to the Docker setup.*

```powershell
# From project root
.\start-dev.ps1
```

---

## 🛠️ Verification

To verify the Docker deployment, observe the container status:

```powershell
docker ps
```

You should see containers for:
- `vehicaid_web_verify` (Backend 8001)
- `vehicaid_admin_verify` (Frontend 3002)
- `vehicaid_db_verify` (Postgres)
- `vehicaid_redis_verify` (Redis)

---

## ❓ FAQ

**Q: Default Credentials?**
A: `admin` / `admin123`

**Q: How to view logs?**
A: `docker logs vehicaid_web_verify`

**Q: How to reset data?**
A: `docker-compose -f infrastructure/docker-compose.verify.yml down -v`
