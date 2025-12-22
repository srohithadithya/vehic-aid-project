# Vehic-Aid Windows Deployment Script
Write-Host "Vehic-Aid Windows Deployment" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green
Write-Host ""

# Stop running servers
Write-Host "Stopping running servers..." -ForegroundColor Yellow
Get-Process | Where-Object { $_.ProcessName -eq "python" } | Stop-Process -Force -ErrorAction SilentlyContinue
Write-Host "Done" -ForegroundColor Green
Write-Host ""

# Clean Docker
Write-Host "Cleaning Docker..." -ForegroundColor Yellow
docker-compose down -v 2>$null
Write-Host "Done" -ForegroundColor Green
Write-Host ""

# Start services
Write-Host "Starting services..." -ForegroundColor Yellow
docker-compose up -d --build

Write-Host ""
Write-Host "=============================" -ForegroundColor Green
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Access:" -ForegroundColor Cyan
Write-Host "  http://localhost:8000/admin/" -ForegroundColor White
Write-Host ""
Write-Host "Credentials:" -ForegroundColor Cyan
Write-Host "  Username: admin" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host ""
