@echo off
TITLE Stopping VehicAid Docker...
color 0C

echo ===================================================
echo   🛑  STOPPING VEHICAID CONTAINERS  🛑
echo ===================================================
echo.

REM Ensure we execute from the correct directory
cd /d "%~dp0\infrastructure"

echo [1/3] Bringing down Docker containers (cleaning orphans)...
docker-compose down --remove-orphans

echo.
echo [2/3] Force killing lingering node/python processes...
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM python.exe /T 2>nul

echo.
echo [3/3] Pruning stopped containers...
docker container prune -f >nul

echo.
echo ===================================================
echo   ✅  SYSTEM SHUTDOWN COMPLETE
echo ===================================================
echo Window will close in 5 seconds...
timeout /t 5
