Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "      VEHIC-AID DOCKER FIXER (NUCLEAR)    " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Stop everything
Write-Host "1. Stopping containers..." -ForegroundColor Yellow
docker-compose down

# 2. Force delete containers
Write-Host "2. Deleting persistent containers..." -ForegroundColor Yellow
docker rm -f vehicaid_web vehicaid_celery 2>$null

# 3. Force delete images
Write-Host "3. Deleting backend images..." -ForegroundColor Yellow
docker rmi vehicaid_backend:py3.12_v1 2>$null
docker rmi vehicaid_backend 2>$null

# 4. Prune build cache (This is the magic bullet for stuck layers)
Write-Host "4. Pruning build cache (Say 'y' if prompted)..." -ForegroundColor Yellow
docker builder prune -a -f

# 5. Build fresh
Write-Host "5. Building fresh images (This will take time like a new setup)..." -ForegroundColor Yellow
docker-compose build --no-cache

# 6. Start
Write-Host "6. Starting Application..." -ForegroundColor Green
docker-compose up

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  IF YOU SEE 'Python Version: 3.12.x'     " -ForegroundColor Cyan
Write-Host "        THEN WE HAVE WON.                 " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
