@echo off
REM Workaround for Node 22 and Expo Metro bundler issues
cd /d c:\vehic-aid-project\mobile\apps\booker

REM Clear cache
rmdir /s /q .expo 2>nul
rmdir /s /q metro-cache 2>nul
rmdir /s /q watchman-cache 2>nul

REM Start Expo with specific configurations
npx expo start --clear
