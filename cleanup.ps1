# VehicAid Project Cleanup Script
# Removes unnecessary files, caches, and duplicates

Write-Host "🧹 VehicAid Project Cleanup" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

$cleaned = 0
$errors = 0

# Function to remove directory safely
function Remove-DirectorySafe {
    param($path, $name)
    if (Test-Path $path) {
        try {
            Remove-Item -Path $path -Recurse -Force -ErrorAction Stop
            Write-Host "✓ Removed $name" -ForegroundColor Green
            return 1
        }
        catch {
            Write-Host "✗ Failed to remove $name" -ForegroundColor Red
            return 0
        }
    }
    return 0
}

# Function to remove files by pattern
function Remove-FilesByPattern {
    param($pattern, $name)
    $files = Get-ChildItem -Path . -Filter $pattern -Recurse -ErrorAction SilentlyContinue
    if ($files) {
        $count = 0
        foreach ($file in $files) {
            try {
                Remove-Item -Path $file.FullName -Force -ErrorAction Stop
                $count++
            }
            catch {
                # Silently continue
            }
        }
        if ($count -gt 0) {
            Write-Host "✓ Removed $count $name files" -ForegroundColor Green
            return $count
        }
    }
    return 0
}

Write-Host "`n📦 Cleaning Python cache files..." -ForegroundColor Yellow
$cleaned += Remove-FilesByPattern "*.pyc" "Python bytecode"
$cleaned += Remove-FilesByPattern "*.pyo" "Python optimized"
$cleaned += Remove-FilesByPattern "*.pyd" "Python DLL"

Write-Host "`n📦 Cleaning Python __pycache__ directories..." -ForegroundColor Yellow
$pycache = Get-ChildItem -Path . -Filter "__pycache__" -Recurse -Directory -ErrorAction SilentlyContinue
if ($pycache) {
    $count = 0
    foreach ($dir in $pycache) {
        $count += Remove-DirectorySafe $dir.FullName "__pycache__"
    }
    $cleaned += $count
}

Write-Host "`n📦 Cleaning .pytest_cache..." -ForegroundColor Yellow
$cleaned += Remove-DirectorySafe ".\.pytest_cache" ".pytest_cache"

Write-Host "`n📦 Cleaning Node.js cache files..." -ForegroundColor Yellow
# Clean node_modules in web apps (keep them, just clean cache)
$cleaned += Remove-FilesByPattern "package-lock.json.bak" "package-lock backups"

Write-Host "`n📦 Cleaning build artifacts..." -ForegroundColor Yellow
$cleaned += Remove-DirectorySafe ".\backend\build" "backend build"
$cleaned += Remove-DirectorySafe ".\backend\dist" "backend dist"
$cleaned += Remove-DirectorySafe ".\backend\*.egg-info" "egg-info"

# Clean Next.js build caches
$nextDirs = @("web\admin\.next", "web\provider\.next", "web\booker\.next")
foreach ($dir in $nextDirs) {
    if (Test-Path $dir) {
        Write-Host "  Keeping $dir (needed for production)" -ForegroundColor Gray
    }
}

Write-Host "`n📦 Cleaning temporary files..." -ForegroundColor Yellow
$cleaned += Remove-FilesByPattern "*.tmp" "temporary"
$cleaned += Remove-FilesByPattern "*.temp" "temp"
$cleaned += Remove-FilesByPattern "*~" "backup"
$cleaned += Remove-FilesByPattern ".DS_Store" "macOS"
$cleaned += Remove-FilesByPattern "Thumbs.db" "Windows thumbnail"
$cleaned += Remove-FilesByPattern "desktop.ini" "Windows desktop"

Write-Host "`n📦 Cleaning log files (keeping structure)..." -ForegroundColor Yellow
# Keep log directory structure but clean old logs if needed
if (Test-Path ".\backend\logs") {
    Write-Host "  Log directory exists (keeping for production)" -ForegroundColor Gray
}

Write-Host "`n📦 Cleaning duplicate documentation..." -ForegroundColor Yellow
# Check for duplicate docs
$duplicates = @(
    ".\docs\integration.md"  # We have INTEGRATION_GUIDE.md
)
foreach ($dup in $duplicates) {
    if (Test-Path $dup) {
        $content1 = Get-Content $dup -Raw -ErrorAction SilentlyContinue
        $mainDoc = $dup -replace "integration.md", "INTEGRATION_GUIDE.md"
        if (Test-Path $mainDoc) {
            $content2 = Get-Content $mainDoc -Raw -ErrorAction SilentlyContinue
            if ($content1 -eq $content2) {
                Remove-Item $dup -Force
                Write-Host "✓ Removed duplicate: $dup" -ForegroundColor Green
                $cleaned++
            }
        }
    }
}

Write-Host "`n📦 Verifying .gitignore..." -ForegroundColor Yellow
if (Test-Path ".\.gitignore") {
    Write-Host "✓ .gitignore exists" -ForegroundColor Green
}
else {
    Write-Host "✗ .gitignore missing!" -ForegroundColor Red
}

Write-Host "`n📊 Cleanup Summary" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host "Items cleaned: $cleaned" -ForegroundColor Green
Write-Host "Errors: $errors" -ForegroundColor $(if ($errors -eq 0) { "Green" } else { "Red" })

Write-Host "`n✅ Cleanup complete!" -ForegroundColor Green
Write-Host "`n💡 Recommendations:" -ForegroundColor Yellow
Write-Host "  1. Run 'git status' to verify changes"
Write-Host "  2. Test applications after cleanup"
Write-Host "  3. Commit cleaned project"
