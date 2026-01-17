# VehicAid - Universal Docker Startup
# One command to RULE THEM ALL: Backend, Database, Redis, and all Web Apps.

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "   Starting VehicAid Complete Stack" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Port Conflict Check
Write-Host "`n[1/4] Checking Port Availability..." -ForegroundColor Yellow
$ports = @(5432, 6379, 8001, 3000, 3001, 3003)
$conflicts = $false

foreach ($port in $ports) {
    if (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue) {
        Write-Host "Conflict: Port $port is already in use!" -ForegroundColor Red
        $conflicts = $true
    }
}

if ($conflicts) {
    Write-Host "Please stop any local services using these ports before continuing." -ForegroundColor Red
    exit 1
}
Write-Host "All ports available!" -ForegroundColor Green

# 2. Verification
Write-Host "`n[2/4] Verifying Docker Installation..." -ForegroundColor Yellow
docker version >$null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}
Write-Host "Docker is ready!" -ForegroundColor Green

# 3. Cleanup
Write-Host "`n[3/4] Cleaning up existing containers..." -ForegroundColor Yellow
cd infrastructure
docker-compose down 2>$null

# 4. Launch
Write-Host "`n[4/4] Building and Launching Complete Stack in Docker... (Python 3.12)" -ForegroundColor Yellow
Write-Host "Note: This will build all 4 application images. It takes 5-10 minutes." -ForegroundColor Gray
docker-compose up --build -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nFAILED to start Docker containers." -ForegroundColor Red
    exit 1
}

Write-Host "`nWaiting for Backend Initialization (Migrations & Superuser)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Final check
Write-Host "`n=========================================" -ForegroundColor Green
Write-Host "   VehicAid is UP AND RUNNING!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

Write-Host "`nAccess points:" -ForegroundColor White
Write-Host " - Admin App:      http://localhost:3000" -ForegroundColor Cyan
Write-Host " - Provider App:   http://localhost:3001" -ForegroundColor Cyan
Write-Host " - Booker App:     http://localhost:3003" -ForegroundColor Cyan
Write-Host " - Backend API:    http://localhost:8001/api/v1/" -ForegroundColor Cyan
Write-Host " - Swagger UI:     http://localhost:8001/api/schema/swagger-ui/" -ForegroundColor Cyan

Write-Host "`nCredentials:" -ForegroundColor White
Write-Host " - Admin Login:    admin" -ForegroundColor Gray
Write-Host " - Password:       admin123" -ForegroundColor Gray

Write-Host "`nMonitoring:" -ForegroundColor White
Write-Host " - View logs:      cd infrastructure; docker-compose logs -f" -ForegroundColor Gray
Write-Host " - Stop services:  cd infrastructure; docker-compose down" -ForegroundColor Gray

cd ..
