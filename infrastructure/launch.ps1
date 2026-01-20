# launch.ps1
Write-Host "🚀 VehicAid All-in-One Launcher & Rebuilder" -ForegroundColor Cyan

# Check for Docker
docker info >$null 2>&1
if ($LastExitCode -ne 0) {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit
}

# Ask if user wants a clean rebuild
$choice = Read-Host "Do you want to perform a CLEAN rebuild of all images? (y/n) [Default: n]"
if ($choice -eq 'y') {
    Write-Host "🧹 Cleaning old VehicAid containers and images..." -ForegroundColor Yellow
    docker-compose down --rmi all --volumes --remove-orphans
    Write-Host "🏗️ Rebuilding everything... This may take a few minutes." -ForegroundColor Cyan
    docker-compose up -d --build
} else {
    Write-Host "▶️ Starting containers..." -ForegroundColor Cyan
    docker-compose up -d
}

Write-Host "⏳ Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -s 10

Write-Host "🛠️ Applying Database Migrations..." -ForegroundColor Cyan
docker-compose exec -T backend python manage.py migrate

Write-Host "🌱 Seeding Updated Data (Subscriptions, Reward logic, 45-day plans)..." -ForegroundColor Cyan
docker-compose exec -T backend python seed_data.py

Write-Host "`n✨ VEHICAID IS UP AND RUNNING! ✨" -ForegroundColor Green
Write-Host "-------------------------------------------"
Write-Host "Backend API:   http://localhost:8001/api/v1"
Write-Host "Admin Panel:   http://localhost:3000"
Write-Host "Provider App:  http://localhost:3001"
Write-Host "Booker App:    http://localhost:3003"
Write-Host "-------------------------------------------"
Write-Host "Note: Code changes in both Backend and Web Apps will now reflect INSTANTLY."
Write-Host "No more rebuilding required for code updates!"
Write-Host "-------------------------------------------"
