# VehicAid Docker Complete Setup
# Starts ALL services in Docker containers

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  VehicAid Docker Complete Setup" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

Write-Host "`nThis will start ALL services in Docker:" -ForegroundColor Yellow
Write-Host "  - PostgreSQL Database" -ForegroundColor White
Write-Host "  - Redis Cache" -ForegroundColor White
Write-Host "  - Backend API (Django)" -ForegroundColor White
Write-Host "  - Celery Worker" -ForegroundColor White
Write-Host "  - Admin Panel (Next.js)" -ForegroundColor White
Write-Host "  - Provider App (Next.js)" -ForegroundColor White
Write-Host "  - Booker App (Next.js)" -ForegroundColor White

Write-Host "`nBuilding and starting containers..." -ForegroundColor Yellow
Write-Host "This may take 5-10 minutes on first run..." -ForegroundColor Gray

# Navigate to infrastructure directory
Set-Location infrastructure

# Stop any existing containers
Write-Host "`nStopping existing containers..." -ForegroundColor Yellow
docker-compose down 2>$null

# Build and start all services
Write-Host "`nBuilding and starting all services..." -ForegroundColor Yellow
docker-compose up -d --build

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nFailed to start Docker services" -ForegroundColor Red
    Write-Host "Please check Docker Desktop is running" -ForegroundColor Yellow
    Set-Location ..
    exit 1
}

# Wait for services to start
Write-Host "`nWaiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Check status
Write-Host "`nChecking service status..." -ForegroundColor Yellow
docker-compose ps

Set-Location ..

Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host "  Docker Services Started!" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

Write-Host "`nAccess your applications:" -ForegroundColor Green
Write-Host "  - Backend API: http://localhost:8001/api/v1/" -ForegroundColor White
Write-Host "  - Django Admin: http://localhost:8001/admin/" -ForegroundColor White
Write-Host "  - Swagger UI: http://localhost:8001/api/schema/swagger-ui/" -ForegroundColor White
Write-Host "  - Admin Panel: http://localhost:3000" -ForegroundColor White
Write-Host "  - Provider App: http://localhost:3001" -ForegroundColor White
Write-Host "  - Booker App: http://localhost:3003" -ForegroundColor White

Write-Host "`nCredentials:" -ForegroundColor Yellow
Write-Host "  - Django Admin: admin / admin123" -ForegroundColor White
Write-Host "  - Database: vehic_aid / vehic_aid123" -ForegroundColor White

Write-Host "`nUseful Commands:" -ForegroundColor Yellow
Write-Host "  View logs: docker-compose -f infrastructure/docker-compose.yml logs -f" -ForegroundColor Gray
Write-Host "  Stop all: docker-compose -f infrastructure/docker-compose.yml down" -ForegroundColor Gray
Write-Host "  Restart: docker-compose -f infrastructure/docker-compose.yml restart" -ForegroundColor Gray

Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host "  All Services Running!" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
