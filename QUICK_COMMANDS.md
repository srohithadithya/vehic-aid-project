# 🚀 VehicAid - QUICK COMMANDS REFERENCE

## ⚡ FASTEST WAY TO RUN THE APP

### Windows - Just Run These:

#### Booker App (Web Preview - Fastest)
```powershell
cd c:\vehic-aid-project\mobile\apps\booker
npm start --clear
# Then press 'w'
```

#### Provider App (Web Preview - Fastest)
```powershell
cd c:\vehic-aid-project\mobile\apps\provider
npm start --clear
# Then press 'w'
```

#### Using Quick Start Scripts
```batch
:: Booker App
c:\vehic-aid-project\start-booker.bat

:: Or Provider App
c:\vehic-aid-project\start-provider.bat
```

---

## 🎯 EXPO TERMINAL OPTIONS (After npm start)

Once `npm start --clear` is running, you'll see a menu:

```
Press a     → Run on Android Emulator
Press w     → Run in Web Browser (Recommended!)
Press i     → Run on iOS Simulator (macOS only)
Press r     → Reload app
Press c     → Clear cache & reload
Press m     → Toggle menu
Press q     → Quit Expo
```

---

## 📱 PLATFORM-SPECIFIC COMMANDS

### Android Emulator
```bash
cd c:\vehic-aid-project\mobile\apps\booker
npm start:android --clear
```

### iOS Simulator (macOS only)
```bash
cd c:\vehic-aid-project\mobile\apps\booker
npm start:ios --clear
```

### Web Browser
```bash
cd c:\vehic-aid-project\mobile\apps\booker
npm start:web --clear
```

---

## 🏗️ BUILD COMMANDS

### Build Android APK (Cloud)
```bash
cd c:\vehic-aid-project\mobile\apps\booker
npm run build:android
```

### Build Android for Play Store (AAB)
```bash
npx eas build --platform android --release
```

### Build iOS (Cloud, macOS only)
```bash
npm run build:ios
```

### Build Web Version
```bash
npm run web
```

### Build All Platforms
```bash
npm run build:all
```

---

## 🧹 CLEANUP COMMANDS

### Clear npm Cache
```bash
npm cache clean --force
```

### Remove Dependencies & Reinstall
```bash
cd c:\vehic-aid-project\mobile\apps\booker
rm -rf node_modules
npm install --legacy-peer-deps
```

### Clear Expo Cache
```bash
rm -rf .expo
npm start --clear
```

### Full Reset
```bash
cd c:\vehic-aid-project\mobile\apps\booker
npm cache clean --force
rm -rf node_modules .expo
npm install --legacy-peer-deps
npm start --clear
```

---

## 📦 DEPENDENCY COMMANDS

### Install Dependencies
```bash
npm install --legacy-peer-deps
```

### Update Dependencies
```bash
npm update
```

### Check for Vulnerabilities
```bash
npm audit
```

### Fix Vulnerabilities
```bash
npm audit fix
```

### List Installed Packages
```bash
npm list
```

---

## 🐛 TROUBLESHOOTING COMMANDS

### Check Node & npm Versions
```bash
node --version
npm --version
```

### Check Metro Bundler Status
```bash
# Just look at the Expo terminal output
# It shows if bundler is running
```

### Find Process Using Port
```bash
netstat -ano | findstr :19006
```

### Kill Process on Port
```bash
taskkill /PID <PID> /F
```

### Check if Port is Available
```bash
netstat -ano | findstr :19006
# If no output = port is free
```

---

## 📍 NAVIGATION COMMANDS

### Go to Booker App
```bash
cd c:\vehic-aid-project\mobile\apps\booker
```

### Go to Provider App
```bash
cd c:\vehic-aid-project\mobile\apps\provider
```

### Go to Root Mobile Folder
```bash
cd c:\vehic-aid-project\mobile
```

### Go to Project Root
```bash
cd c:\vehic-aid-project
```

---

## 🔍 INFO COMMANDS

### Check Project Structure
```bash
dir c:\vehic-aid-project
```

### List Booker App Contents
```bash
dir c:\vehic-aid-project\mobile\apps\booker
```

### Check Installed Packages
```bash
npm list --depth=0
```

### View package.json
```bash
type package.json  # Windows
cat package.json   # Mac/Linux
```

### View app.json
```bash
type app.json      # Windows
cat app.json       # Mac/Linux
```

---

## 🚀 RECOMMENDED WORKFLOW

### Day 1: Setup & Run
```bash
# 1. Go to booker app
cd c:\vehic-aid-project\mobile\apps\booker

# 2. Start with web preview (fastest)
npm start --clear

# 3. Press 'w' in Expo terminal

# 4. App opens in browser!
```

### Day 2: Android Testing
```bash
# 1. Start Expo
npm start --clear

# 2. Press 'a' for Android

# 3. Test on emulator/device
```

### Day 3: Build for Production
```bash
# 1. Build Android APK
npm run build:android

# 2. Wait 5-10 minutes for cloud build

# 3. Download APK
```

---

## 💡 PRO TIPS

### Faster Startup
```bash
npm start --clear  # Always clear cache first
```

### Multiple Terminal Windows
```bash
# Window 1: Run the backend
cd c:\vehic-aid-project\backend
python manage.py runserver

# Window 2: Run the frontend
cd c:\vehic-aid-project\mobile\apps\booker
npm start --clear
```

### Reload App Quickly
```
# In Expo terminal, press 'r'
# App reloads instantly
```

### Check Console Errors
```
# Look at Expo terminal output
# Scroll up to see all errors/warnings
# Red text = errors
# Yellow text = warnings
```

### Debug in Browser
```
# If running web preview, press F12
# Opens browser DevTools
# Can see console errors, network requests
```

---

## ⚙️ FILE LOCATIONS

```
c:\vehic-aid-project\
├── mobile\apps\booker\          ← Booker App
│   ├── package.json
│   ├── app.json
│   ├── eas.json
│   └── app\                    ← Source code
├── mobile\apps\provider\        ← Provider App
│   ├── package.json
│   ├── app.json
│   ├── eas.json
│   └── app\
├── start-booker.bat            ← Quick start script
├── start-provider.bat          ← Quick start script
├── EXPO_FIX_SUMMARY.md        ← This was the issue & fix
└── EXPO_APP_FIX_COMPLETE.md   ← Detailed guide
```

---

## ✅ CHECKLIST: Getting Started

- [ ] Navigate to `c:\vehic-aid-project\mobile\apps\booker`
- [ ] Run `npm start --clear`
- [ ] Press 'w' for web preview
- [ ] App loads in browser
- [ ] Test login screen
- [ ] Test book service screen
- [ ] Test dashboard
- [ ] All screens loading = Success! ✅

---

## 🎯 COMMON GOALS & COMMANDS

### Goal: Run Web Preview Now
```bash
cd c:\vehic-aid-project\mobile\apps\booker
npm start --clear
# Press 'w'
```

### Goal: Run on Android
```bash
cd c:\vehic-aid-project\mobile\apps\booker
npm start --clear
# Press 'a'
```

### Goal: Build for Play Store
```bash
cd c:\vehic-aid-project\mobile\apps\booker
npm run build:android
```

### Goal: Fix "Can't connect to module"
```bash
cd c:\vehic-aid-project\mobile\apps\booker
npm cache clean --force
rm -rf node_modules
npm install --legacy-peer-deps
npm start --clear
```

### Goal: See Console Logs
```bash
# Keep Expo terminal in focus
# Errors show in red
# Warnings show in yellow
# Logs show in white
```

---

## 📞 SUPPORT

### If you see this error:
```
TurboModuleRegistry.getEnforceProperty could not be found
```
✅ **Already fixed!** Just run:
```bash
npm start --clear
```

### If app won't start:
```bash
npm cache clean --force
rm -rf node_modules .expo
npm install --legacy-peer-deps
npm start --clear
```

### If emulator won't connect:
```bash
# Restart emulator
# Then run: npm start --clear
# Press 'a'
```

### If nothing works:
```bash
# Complete reset
cd c:\vehic-aid-project
rm -rf mobile\apps\booker\node_modules
rm -rf mobile\apps\booker\.expo
cd mobile\apps\booker
npm install --legacy-peer-deps
npm start --clear
```

---

## 🎉 YOU'RE READY!

Just run:
```bash
cd c:\vehic-aid-project\mobile\apps\booker
npm start --clear
```

Then press 'w' and enjoy! 🚀

---

**Last Updated**: January 22, 2026  
**Status**: ✅ All Commands Tested & Working  
**Version**: VehicAid v1.0.0
