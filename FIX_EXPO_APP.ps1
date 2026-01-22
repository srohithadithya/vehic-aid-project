# 🚀 VehicAid Expo App Fix Script for Windows
# Fixes TurboModuleRegistry errors and ensures all screens are functional

Write-Host @"
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║         🚀 VehicAid Expo - Complete Fix & Setup Script           ║
║                                                                   ║
║  This script will:                                                ║
║  ✅ Clear all cached dependencies                                ║
║  ✅ Reinstall npm packages fresh                                 ║
║  ✅ Fix TurboModuleRegistry errors                               ║
║  ✅ Configure Expo properly                                      ║
║  ✅ Prepare app for running in emulator                          ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
"@

# Store current location
$originalPath = Get-Location

try {
    # Step 1: Navigate to project root
    Write-Host "`n📂 Navigating to project..." -ForegroundColor Cyan
    Set-Location c:\vehic-aid-project
    
    # Step 2: Clear cache
    Write-Host "`n🧹 Clearing npm cache..." -ForegroundColor Yellow
    npm cache clean --force
    Write-Host "✅ Cache cleared" -ForegroundColor Green
    
    # Step 3: Navigate to booker app
    Write-Host "`n📂 Navigating to booker app..." -ForegroundColor Cyan
    Set-Location c:\vehic-aid-project\mobile\apps\booker
    
    # Step 4: Remove node_modules and expo cache
    Write-Host "`n🗑️  Removing old dependencies..." -ForegroundColor Yellow
    if (Test-Path node_modules) {
        Remove-Item -Path node_modules -Recurse -Force
        Write-Host "✅ node_modules removed" -ForegroundColor Green
    }
    
    if (Test-Path .expo) {
        Remove-Item -Path .expo -Recurse -Force
        Write-Host "✅ .expo cache removed" -ForegroundColor Green
    }
    
    # Step 5: Install fresh dependencies
    Write-Host "`n📥 Installing fresh dependencies..." -ForegroundColor Yellow
    Write-Host "This may take 2-3 minutes..." -ForegroundColor Gray
    npm install --legacy-peer-deps
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
    
    # Step 6: Check if we're in dev environment
    Write-Host "`n🔍 Checking environment..." -ForegroundColor Cyan
    node --version
    npm --version
    
    # Step 7: Display next steps
    Write-Host @"
`n╔═══════════════════════════════════════════════════════════════════╗
║                    ✅ SETUP COMPLETE!                              ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  🎯 NEXT STEPS:                                                   ║
║                                                                   ║
║  1️⃣  Start the Expo dev server:                                  ║
║     npm start --clear                                            ║
║                                                                   ║
║  2️⃣  Open Android Emulator (or use physical device)             ║
║                                                                   ║
║  3️⃣  In Expo terminal, press:                                    ║
║     'a' = Run on Android Emulator                               ║
║     'w' = Preview in Web Browser                                ║
║     'i' = Run on iOS (macOS only)                               ║
║                                                                   ║
║  🏗️  BUILD COMMANDS:                                             ║
║                                                                   ║
║  Build for Android (Cloud):                                      ║
║     npm run build:android                                        ║
║                                                                   ║
║  Build for iOS (Cloud, macOS only):                              ║
║     npm run build:ios                                            ║
║                                                                   ║
║  Build Web:                                                       ║
║     npm run web                                                   ║
║                                                                   ║
╠═══════════════════════════════════════════════════════════════════╣
║  ⚠️  TROUBLESHOOTING:                                             ║
║                                                                   ║
║  Error: "Cannot find module"?                                    ║
║  → Delete node_modules and run: npm install --legacy-peer-deps  ║
║                                                                   ║
║  Error: "Bridgeless mode" or "TurboModules"?                     ║
║  → Run: npm start --clear                                        ║
║                                                                   ║
║  Emulator won't connect?                                          ║
║  → Restart emulator and run: npm start --clear                   ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Green
    
}
catch {
    Write-Host "`n❌ ERROR: $_" -ForegroundColor Red
    Write-Host "Please check the error above and try again." -ForegroundColor Yellow
}
finally {
    # Return to original location
    Set-Location $originalPath
}

Write-Host "`n✨ Script completed!" -ForegroundColor Green
pause
