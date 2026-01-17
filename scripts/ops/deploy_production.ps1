# VehicAid Production Deployment Script
# Run this script to deploy the application

Write-Host "🚀 VehicAid Production Deployment" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Step 1: Pull latest code
Write-Host "`n📥 Pulling latest code from GitHub..." -ForegroundColor Yellow
git pull origin main

# Step 2: Backend setup
Write-Host "`n🔧 Setting up backend..." -ForegroundColor Yellow
cd backend

# Install dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Gray
pip install -r requirements.txt

# Run migrations
Write-Host "Running database migrations..." -ForegroundColor Gray
python manage.py migrate

# Collect static files
Write-Host "Collecting static files..." -ForegroundColor Gray
python manage.py collectstatic --noinput

# Optimize database
Write-Host "Optimizing database..." -ForegroundColor Gray
python manage.py optimize_db

cd ..

# Step 3: Frontend setup
Write-Host "`n🎨 Setting up frontend..." -ForegroundColor Yellow

# Web Admin
Write-Host "Building web admin..." -ForegroundColor Gray
cd web/admin
npm install
npm run build
cd ../..

# Web Provider
Write-Host "Building web provider..." -ForegroundColor Gray
cd web/provider
npm install
npm run build
cd ../..

# Web Booker
Write-Host "Building web booker..." -ForegroundColor Gray
cd web/booker
npm install
npm run build
cd ../..

# Step 4: Docker deployment
Write-Host "`n🐳 Starting Docker services..." -ForegroundColor Yellow
cd infrastructure
docker-compose down
docker-compose up --build -d
cd ..

# Step 5: Health check
Write-Host "`n🏥 Running health checks..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

$services = @(
    @{Name="Backend API"; URL="http://localhost:8001/api/v1/"},
    @{Name="Admin Panel"; URL="http://localhost:3000"},
    @{Name="Provider App"; URL="http://localhost:3001"},
    @{Name="Booker App"; URL="http://localhost:3003"}
)

foreach ($service in $services) {
    try {
        $response = Invoke-WebRequest -Uri $service.URL -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $($service.Name) is running" -ForegroundColor Green
        }
    } catch {
        Write-Host "❌ $($service.Name) is not responding" -ForegroundColor Red
    }
}

# Step 6: Display summary
Write-Host "`n📊 Deployment Summary" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan
Write-Host "Backend API:    http://localhost:8001" -ForegroundColor White
Write-Host "Admin Panel:    http://localhost:3000" -ForegroundColor White
Write-Host "Provider App:   http://localhost:3001" -ForegroundColor White
Write-Host "Booker App:     http://localhost:3003" -ForegroundColor White
Write-Host "`nDefault Credentials:" -ForegroundColor Yellow
Write-Host "Username: admin_mobile" -ForegroundColor White
Write-Host "Password: password123" -ForegroundColor White

Write-Host "`n✅ Deployment complete!" -ForegroundColor Green
Write-Host "📝 Check logs: docker-compose logs -f" -ForegroundColor Gray
