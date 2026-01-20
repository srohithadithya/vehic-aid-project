@echo off
TITLE Launching VehicAid via Docker...
color 0B

echo ===================================================
echo   🐳  INITIALIZING VEHICAID CONTAINERS  🐳
echo ===================================================
echo.

cd infrastructure

echo [1/3] Building and Starting Containers (Detached Mode)...
docker-compose up -d --build

echo.
echo [2/3] Waiting for Backend Health...
timeout /t 15 >nul

echo.
echo [3/3] Running Migrations & Seeding Data...
docker-compose exec -T backend python manage.py migrate
docker-compose exec -T backend python seed_data.py

echo.
echo ===================================================
echo   ✅  DOCKER ENVIRONMENT LIVE
echo ===================================================
echo.
echo   - Backend API:    http://localhost:8001
echo   - Celery Worker:  Running in background
echo   - Admin Panel:    http://localhost:3000
echo   - Provider App:   http://localhost:3001
echo   - Booker App:     http://localhost:3003
echo.
echo   Output logs can be viewed via Docker Desktop or:
echo   "docker-compose logs -f"
echo.
pause
