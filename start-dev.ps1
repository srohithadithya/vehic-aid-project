#!/usr/bin/env pwsh
<#
.SYNOPSIS
Quick start script for Vehic-Aid backend and frontend

.DESCRIPTION
Starts all required services for local development

.NOTES
Run from the project root directory
#>

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Starting Vehic-Aid Backend & Frontend Services" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Starting Backend Services (Docker)" -ForegroundColor Magenta
Write-Host "Running: cd 01_backend && docker-compose up -d" -ForegroundColor Gray

Set-Location "01_backend"
docker-compose up -d

Write-Host ""
Write-Host "Waiting for services to be healthy..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Step 2: Starting Frontend (Next.js)" -ForegroundColor Magenta
Write-Host "Running: cd ../web-admin-panel/admin && npm run dev" -ForegroundColor Gray

Set-Location "..\web-admin-panel\admin"
npm run dev

Write-Host ""
Write-Host "Services will be available at:" -ForegroundColor Green
Write-Host "  • Frontend:     http://localhost:3000" -ForegroundColor White
Write-Host "  • Backend API:  http://localhost:8000/api/v1/" -ForegroundColor White
Write-Host "  • Admin Panel:  http://localhost:8000/admin/" -ForegroundColor White
Write-Host ""
