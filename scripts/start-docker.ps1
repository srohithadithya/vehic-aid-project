# VehicAid Complete Docker Setup
# This script starts EVERYTHING in one command using Docker

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  VehicAid 100% Dockerized Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Check Docker
Write-Host "`nStep 1: Checking Docker..." -ForegroundColor Yellow
try {
    docker info > $null 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Docker not running"
    }
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Docker is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    exit 1
}

# Cleanup existing containers (Optional but recommended for a clean start)
# Write-Host "`nStep 2: Cleaning up existing containers..." -ForegroundColor Yellow
# Set-Location infrastructure
# docker-compose down -v
# Set-Location ..

# Start Docker services
Write-Host "`nStep 2: Launching All 8 Services in Docker..." -ForegroundColor Yellow
Write-Host "This includes: DB, Redis, Backend, Celery, Celery-Beat, Admin, Provider, Booker" -ForegroundColor Gray
Write-Host "First build might take 5-10 minutes..." -ForegroundColor Cyan

Set-Location infrastructure
docker-compose up -d --build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ERROR: Failed to start Docker services" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host "`n✅ All services have been instructed to start!" -ForegroundColor Green
Write-Host "Waiting 10 seconds for backend to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 10

# Check status
Write-Host "`nStep 3: Service Status Update" -ForegroundColor Yellow
docker-compose ps

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "  VehicAid Platform Ready!" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Write-Host "`n🌐 Access URLs:" -ForegroundColor Yellow
Write-Host "  Admin Panel:    http://localhost:3000" -ForegroundColor White
Write-Host "  Provider App:   http://localhost:3001" -ForegroundColor White
Write-Host "  Booker App:     http://localhost:3003" -ForegroundColor White
Write-Host "  Backend API:    http://localhost:8001/api/v1/" -ForegroundColor White
Write-Host "  Swagger UI:     http://localhost:8001/api/schema/swagger-ui/" -ForegroundColor White

Write-Host "`n🔐 Credentials:" -ForegroundColor Yellow
Write-Host "  Default Admin:  admin / admin123" -ForegroundColor White
Write-Host "  Test Customer:  customer@example.com / testpass123" -ForegroundColor White
Write-Host "  Test Provider:  provider@example.com / testpass123" -ForegroundColor White

Write-Host "`n📊 Monitoring:" -ForegroundColor Yellow
Write-Host "  View Logs:      docker-compose logs -f" -ForegroundColor Gray
Write-Host "  Backend Logs:   docker-compose logs -f backend" -ForegroundColor Gray

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "  Ready for action!" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Set-Location ..
