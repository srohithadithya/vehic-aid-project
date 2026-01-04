#!/usr/bin/env pwsh
<#
.SYNOPSIS
Verify Backend and Frontend Integration Setup

.DESCRIPTION
This script checks if the Django backend and Next.js frontend are properly configured and running.

.NOTES
Run from the project root directory
#>

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Vehic-Aid Backend & Frontend Setup Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$checks_passed = 0
$checks_failed = 0

# Function to write check result
function Write-CheckResult {
    param(
        [string]$CheckName,
        [bool]$Passed,
        [string]$Message = ""
    )
    
    if ($Passed) {
        Write-Host "✅ $CheckName" -ForegroundColor Green
        $global:checks_passed++
    }
    else {
        Write-Host "❌ $CheckName" -ForegroundColor Red
        if ($Message) {
            Write-Host "   $Message" -ForegroundColor Yellow
        }
        $global:checks_failed++
    }
}

# Check Docker
Write-Host "1. Docker Services" -ForegroundColor Magenta
Write-Host "   Checking if Docker containers are running..."

try {
    $containers = docker ps --filter "name=vehicaid" --format "table {{.Names}}\t{{.Status}}"
    if ($containers) {
        $db_running = docker ps | Select-String "vehicaid_db"
        $redis_running = docker ps | Select-String "vehicaid_redis"
        $web_running = docker ps | Select-String "vehicaid_web"
        
        Write-CheckResult "PostgreSQL Database" ($null -ne $db_running)
        Write-CheckResult "Redis Cache" ($null -ne $redis_running)
        Write-CheckResult "Django Web Server" ($null -ne $web_running)
    }
    else {
        Write-CheckResult "Docker Containers" $false "No vehicaid containers running"
    }
}
catch {
    Write-CheckResult "Docker" $false "Docker not installed or not running"
}

Write-Host ""
Write-Host "2. Backend API" -ForegroundColor Magenta
Write-Host "   Testing backend connectivity..."

# Test backend admin
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/admin/" -UseBasicParsing -ErrorAction SilentlyContinue
    Write-CheckResult "Backend Admin Panel (http://localhost:8000/admin/)" ($response.StatusCode -eq 200)
}
catch {
    Write-CheckResult "Backend Admin Panel" $false "Cannot reach http://localhost:8000"
}

# Test backend API
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/v1/" -UseBasicParsing -ErrorAction SilentlyContinue
    $isResponding = $response.StatusCode -eq 401 -or $response.StatusCode -eq 200
    Write-CheckResult "Backend API (http://localhost:8000/api/v1/)" $isResponding
}
catch {
    Write-CheckResult "Backend API" $false "Cannot reach http://localhost:8000/api/v1/"
}

Write-Host ""
Write-Host "3. Frontend (Next.js)" -ForegroundColor Magenta
Write-Host "   Testing frontend connectivity..."

# Test frontend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -ErrorAction SilentlyContinue
    Write-CheckResult "Frontend Server (http://localhost:3000)" ($response.StatusCode -eq 200)
}
catch {
    Write-CheckResult "Frontend Server" $false "Next.js dev server not running on http://localhost:3000"
}

Write-Host ""
Write-Host "4. Configuration Files" -ForegroundColor Magenta
Write-Host "   Checking required configuration files..."

$backend_env = Test-Path "backend\.env.dev"
Write-CheckResult "Backend Environment (.env.dev)" $backend_env

$frontend_env = Test-Path "web-admin-panel\admin\.env.local"
Write-CheckResult "Frontend Environment (.env.local)" $frontend_env

$next_config = Test-Path "web-admin-panel\admin\next.config.ts"
Write-CheckResult "Next.js Config" $next_config

$api_client = Test-Path "web-admin-panel\admin\lib\api.ts"
Write-CheckResult "API Client Library" $api_client

Write-Host ""
Write-Host "5. Project Structure" -ForegroundColor Magenta
Write-Host "   Verifying project directories..."

$backend_exists = Test-Path "backend"
Write-CheckResult "Backend Directory" $backend_exists

$frontend_exists = Test-Path "03_03_web-admin-panel\admin"
Write-CheckResult "Frontend Directory" $frontend_exists

$docs_exists = Test-Path "BACKEND_FRONTEND_INTEGRATION.md"
Write-CheckResult "Integration Documentation" $docs_exists

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Passed: $checks_passed" -ForegroundColor Green
Write-Host "❌ Failed: $checks_failed" -ForegroundColor Red
Write-Host ""

if ($checks_failed -eq 0) {
    Write-Host "🎉 All systems operational!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Access the application:" -ForegroundColor Cyan
    Write-Host "  • Frontend:  http://localhost:3000" -ForegroundColor White
    Write-Host "  • Backend:   http://localhost:8000" -ForegroundColor White
    Write-Host "  • Admin:     http://localhost:8000/admin/" -ForegroundColor White
    Write-Host "  • API:       http://localhost:8000/api/v1/" -ForegroundColor White
}
else {
    Write-Host "⚠️  Please fix the above issues before deploying" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Cyan
    Write-Host "  1. Start backend: cd 01_backend && docker-compose up -d" -ForegroundColor White
    Write-Host "  2. Start frontend: cd web-admin-panel\admin && npm run dev" -ForegroundColor White
    Write-Host "  3. Check status: ./check-setup.ps1" -ForegroundColor White
}

Write-Host ""
