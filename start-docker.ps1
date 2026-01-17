# VehicAid Complete Docker Setup
# This script starts EVERYTHING you need in one command

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  VehicAid Complete Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Check Docker
Write-Host "`nStep 1: Checking Docker..." -ForegroundColor Yellow
try {
    docker info > $null 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Docker not running"
    }
    Write-Host "Docker is running" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Docker is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop" -ForegroundColor Yellow
    exit 1
}

# Start Docker services
Write-Host "`nStep 2: Starting Docker services..." -ForegroundColor Yellow
Set-Location infrastructure
docker-compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to start Docker" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host "Docker services started (PostgreSQL + Redis)" -ForegroundColor Green
Start-Sleep -Seconds 5

# Check Docker status
docker-compose ps
Set-Location ..

# Set environment
Write-Host "`nStep 3: Setting up environment..." -ForegroundColor Yellow
$env:DATABASE_URL = "postgresql://vehic_aid:vehic_aid123@localhost:5432/vehic_aid"
$env:REDIS_URL = "redis://localhost:6379/1"
$env:CELERY_BROKER_URL = "redis://localhost:6379/0"

# Run migrations
Write-Host "`nStep 4: Running database migrations..." -ForegroundColor Yellow
Set-Location backend
python manage.py migrate --noinput

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Migrations failed" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host "Migrations completed" -ForegroundColor Green

# Create superuser
Write-Host "`nStep 5: Creating superuser..." -ForegroundColor Yellow
$tempScript = Join-Path $env:TEMP "create_superuser.py"
$pythonCode = "from django.contrib.auth import get_user_model`n"
$pythonCode += "User = get_user_model()`n"
$pythonCode += "if not User.objects.filter(username=`"admin`").exists():`n"
$pythonCode += "    User.objects.create_superuser(`"admin`", `"admin@vehicaid.com`", `"admin123`")`n"
$pythonCode += "    print(`"Created`")`n"
$pythonCode += "else:`n"
$pythonCode += "    print(`"Exists`")`n"

Set-Content -Path $tempScript -Value $pythonCode -Encoding UTF8
Get-Content $tempScript | python manage.py shell 2>$null
Remove-Item $tempScript -ErrorAction SilentlyContinue

Write-Host "Superuser ready (admin/admin123)" -ForegroundColor Green

# Start backend in background
Write-Host "`nStep 6: Starting backend server..." -ForegroundColor Yellow
Write-Host "Starting on http://localhost:8001..." -ForegroundColor Gray

# Create a new PowerShell window to run the backend
$backendScript = @"
Set-Location '$PWD'
`$env:DATABASE_URL = 'postgresql://vehic_aid:vehic_aid123@localhost:5432/vehic_aid'
`$env:REDIS_URL = 'redis://localhost:6379/1'
`$env:CELERY_BROKER_URL = 'redis://localhost:6379/0'
python manage.py runserver 8001
"@

$backendScriptPath = Join-Path $env:TEMP "start_backend.ps1"
Set-Content -Path $backendScriptPath -Value $backendScript

Start-Process powershell -ArgumentList "-NoExit", "-File", $backendScriptPath

Write-Host "Backend server starting in new window..." -ForegroundColor Green
Start-Sleep -Seconds 5

Set-Location ..

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "  All Services Running!" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Write-Host "`nServices Started:" -ForegroundColor Green
Write-Host "  [Docker] PostgreSQL - localhost:5432" -ForegroundColor White
Write-Host "  [Docker] Redis      - localhost:6379" -ForegroundColor White
Write-Host "  [Local]  Backend    - http://localhost:8001" -ForegroundColor White

Write-Host "`nAccess URLs:" -ForegroundColor Yellow
Write-Host "  Backend API:  http://localhost:8001/api/v1/" -ForegroundColor White
Write-Host "  Django Admin: http://localhost:8001/admin/" -ForegroundColor White
Write-Host "  Swagger UI:   http://localhost:8001/api/schema/swagger-ui/" -ForegroundColor White

Write-Host "`nCredentials:" -ForegroundColor Yellow
Write-Host "  Django Admin: admin / admin123" -ForegroundColor White
Write-Host "  Database:     vehic_aid / vehic_aid123" -ForegroundColor White

Write-Host "`nOptional - Start Web Apps:" -ForegroundColor Yellow
Write-Host "  cd web/admin && npm run dev      # Port 3000" -ForegroundColor Gray
Write-Host "  cd web/provider && npm run dev   # Port 3001" -ForegroundColor Gray
Write-Host "  cd web/booker && npm run dev     # Port 3003" -ForegroundColor Gray

Write-Host "`nUseful Commands:" -ForegroundColor Yellow
Write-Host "  Stop Docker:  docker-compose -f infrastructure/docker-compose.yml down" -ForegroundColor Gray
Write-Host "  View logs:    docker-compose -f infrastructure/docker-compose.yml logs -f" -ForegroundColor Gray

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "  Ready!" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
