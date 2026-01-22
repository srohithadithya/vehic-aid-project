@echo off
REM VehicAid - Quick Start Script for Booker App
REM This script fixes common issues and starts the app

title VehicAid Booker App - Quick Start

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║         🚀 VehicAid Booker App - Quick Start                ║
echo ║                                                               ║
echo ║  This will:                                                  ║
echo ║  ✅ Navigate to the booker app                              ║
echo ║  ✅ Clear Expo cache                                        ║
echo ║  ✅ Start the development server                            ║
echo ║  ✅ You can then choose: a (Android), w (Web), i (iOS)     ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

REM Navigate to booker app
cd /d c:\vehic-aid-project\mobile\apps\booker

echo.
echo 📂 Current directory: %cd%
echo.

REM Start Expo with cache clear
echo 🚀 Starting Expo dev server (with cache clear)...
echo    Press 'a' for Android Emulator
echo    Press 'w' for Web Preview (Recommended)
echo    Press 'i' for iOS Simulator (macOS only)
echo    Press 'c' to clear cache while running
echo    Press Ctrl+C to stop
echo.

npx expo start --clear

pause
