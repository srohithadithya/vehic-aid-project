#!/usr/bin/env pwsh
<#
.SYNOPSIS
Automated Git Sync Script for Vehic-Aid

.DESCRIPTION
This script fetches the latest changes from GitHub, rebases local changes on top,
and then pushes the result back to GitHub. It handles the "Auto Fetch" requirement.
#>

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "      Vehic-Aid Repository Sync" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Fetch and Pull
Write-Host "⬇️  Fetching latest changes from GitHub..." -ForegroundColor Yellow
try {
    git fetch origin
    git pull --rebase origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅  Local repository updated." -ForegroundColor Green
    }
    else {
        Write-Host "❌  Pull failed. Please resolve conflicts manually." -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "❌  Network error or git not configured." -ForegroundColor Red
    exit 1
}

# 2. Add and Commit (Optional - only if run with -Commit flag, but checking status)
$status = git status --porcelain
if ($status) {
    Write-Host "⚠️  You have uncommitted local changes:" -ForegroundColor Yellow
    Write-Host $status
    Write-Host "ℹ️  Tip: Commit these changes or stash them before running a full sync."
}
else {
    Write-Host "✨  Working tree is clean." -ForegroundColor Green
}

# 3. Push
Write-Host "⬆️  Pushing to GitHub..." -ForegroundColor Yellow
try {
    git push origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅  GitHub is now in sync with your local machine." -ForegroundColor Green
    }
    else {
        Write-Host "❌  Push failed." -ForegroundColor Red
    }
}
catch {
    Write-Host "❌  Spread error." -ForegroundColor Red
}

Write-Host ""
Write-Host "Done." -ForegroundColor Cyan
