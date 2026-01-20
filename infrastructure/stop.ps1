# stop.ps1
Write-Host "🛑 Shutting down VehicAid Services..." -ForegroundColor Red

# Stop containers
docker-compose stop

Write-Host "`n✅ Services stopped successfully. Containers are still present." -ForegroundColor Yellow
Write-Host "To completely remove containers and networks, run 'docker-compose down'." -ForegroundColor Gray
Write-Host "To restart, simply run the Launch_VehicAid.bat again." -ForegroundColor Cyan
