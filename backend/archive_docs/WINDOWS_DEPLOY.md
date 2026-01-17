# 🚀 Windows Deployment - Quick Start

## ⚡ One-Command Deployment

```powershell
# Run this in PowerShell (in project directory)
.\deploy-windows.ps1
```

**That's it!** Your application will be running at http://localhost:8000

---

## What This Does

1. ✅ Stops any running Django servers
2. ✅ Cleans old Docker containers
3. ✅ Starts fresh PostgreSQL & Redis
4. ✅ Runs database migrations
5. ✅ Starts Django application
6. ✅ Opens browser automatically

---

## Manual Steps (if needed)

### 1. Clean Everything
```powershell
docker-compose down -v
docker system prune -a --volumes -f
```

### 2. Start Services
```powershell
docker-compose up -d
```

### 3. Access Application
- API: http://localhost:8000/api/v1/
- Admin: http://localhost:8000/admin/
- Dashboard: http://localhost:8000/dashboard/

---

## Troubleshooting

**Port 8000 in use:**
```powershell
# Find and kill process
Get-Process | Where-Object {$_.ProcessName -like "*python*"} | Stop-Process -Force
```

**Docker not starting:**
```powershell
# Restart Docker Desktop
Restart-Service docker
```

**Database errors:**
```powershell
# Reset database
docker-compose down -v
docker-compose up -d
```

---

## Quick Commands

```powershell
# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Restart
docker-compose restart

# Clean and rebuild
docker-compose down -v
docker-compose up -d --build
```
