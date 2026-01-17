# VehicAid Complete Startup Script
# Starts all services using Docker for DB/Redis and local processes for apps

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  VehicAid Complete Startup" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Step 1: Start Docker services (Database + Redis)
Write-Host "`n📦 Starting Docker services (PostgreSQL + Redis)..." -ForegroundColor Yellow
docker-compose -f docker-compose-simple.yml up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start Docker services" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker services started" -ForegroundColor Green

# Step 2: Wait for services to be healthy
Write-Host "`n⏳ Waiting for services to be healthy..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Step 3: Set environment variables
Write-Host "`n🔧 Setting environment variables..." -ForegroundColor Yellow
$env:DATABASE_URL = "postgresql://vehic_aid:vehic_aid123@localhost:5432/vehic_aid"
$env:REDIS_URL = "redis://localhost:6379/1"
$env:CELERY_BROKER_URL = "redis://localhost:6379/0"

# Step 4: Run migrations
Write-Host "`n🗄️  Running database migrations..." -ForegroundColor Yellow
Set-Location backend
python manage.py migrate --noinput

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Migrations failed" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host "✅ Migrations completed" -ForegroundColor Green

# Step 5: Create superuser if needed
Write-Host "`n👤 Checking for superuser..." -ForegroundColor Yellow
$createSuperuser = @'
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username="admin").exists():
    User.objects.create_superuser("admin", "admin@vehicaid.com", "admin123")
    print("Superuser created")
else:
    print("Superuser exists")
'@
$createSuperuser | python manage.py shell 2>$null
Write-Host "✅ Superuser ready (admin/admin123)" -ForegroundColor Green

Set-Location ..

# Step 6: Display startup information
Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host "  Services Ready!" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

Write-Host "`n✅ Docker Services:" -ForegroundColor Green
Write-Host "  • PostgreSQL: localhost:5432" -ForegroundColor White
Write-Host "  • Redis: localhost:6379" -ForegroundColor White

Write-Host "`n📝 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Start Backend:" -ForegroundColor White
Write-Host "     cd backend && python manage.py runserver 8001" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Start Web Apps (in separate terminals):" -ForegroundColor White
Write-Host "     cd web/admin && npm run dev      # Port 3000" -ForegroundColor Gray
Write-Host "     cd web/provider && npm run dev   # Port 3001" -ForegroundColor Gray
Write-Host "     cd web/booker && npm run dev     # Port 3003" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Start Mobile Apps (in separate terminals):" -ForegroundColor White
Write-Host "     cd mobile-booker && npx expo start" -ForegroundColor Gray
Write-Host "     cd mobile-provider && npx expo start" -ForegroundColor Gray

Write-Host "`n🔗 Access URLs:" -ForegroundColor Yellow
Write-Host "  • Backend API: http://localhost:8001/api/v1/" -ForegroundColor White
Write-Host "  • Django Admin: http://localhost:8001/admin/" -ForegroundColor White
Write-Host "  • Swagger UI: http://localhost:8001/api/schema/swagger-ui/" -ForegroundColor White
Write-Host "  • Admin Panel: http://localhost:3000" -ForegroundColor White
Write-Host "  • Provider App: http://localhost:3001" -ForegroundColor White
Write-Host "  • Booker App: http://localhost:3003" -ForegroundColor White

Write-Host "`n🔐 Credentials:" -ForegroundColor Yellow
Write-Host "  • Django Admin: admin / admin123" -ForegroundColor White

Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host "  Ready for Development!" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
