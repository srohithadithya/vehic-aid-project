# 🚀 VehicAid - Build to APK Quick Start Guide

**Status**: ✅ Ready to Build  
**Date**: January 22, 2026  
**Version**: 1.0.0

---

## 📱 Quick Build Options

### Option 1: Build Debug APK (Fastest - For Testing)
```bash
# Navigate to Android folder
cd c:\vehic-aid-project\android

# Clean previous builds
./gradlew clean

# Build debug APK
./gradlew assembleDebug

# Output: app/build/outputs/apk/debug/app-debug.apk (~80MB)
# This APK can be installed directly on Android devices for testing
```

### Option 2: Build Release APK (For Play Store)
```bash
# Build release APK (with signing)
./gradlew assembleRelease

# Output: app/build/outputs/apk/release/app-release.apk (~50-60MB)
```

### Option 3: Build AAB (Bundle - Recommended for Play Store)
```bash
# Build App Bundle (best for Play Store)
./gradlew bundleRelease

# Output: app/build/outputs/bundle/release/app-release.aab (~30-50MB)
```

---

## 🔧 Prerequisites

### What You Need:
1. **Android SDK** - Download from Android Studio
2. **Gradle** - Included with Android Studio
3. **Java JDK 11+** - Required for building

### Verify Setup:
```bash
# Check Java version
java -version

# Check Android SDK
echo %ANDROID_HOME%

# Check Gradle
./gradlew --version
```

---

## 📋 Installation on Test Device

### Install Debug APK:
```bash
# Connect Android device via USB (Debug mode enabled)
adb devices

# Install the APK
adb install app/build/outputs/apk/debug/app-debug.apk

# Or drag & drop APK file to device
```

### Install Release APK:
```bash
# Uninstall old version first
adb uninstall com.vehicaid.booker

# Install new version
adb install app/build/outputs/apk/release/app-release.apk
```

---

## 🎯 What to Test After Installation

### Booker App Features to Test:
- ✅ Onboarding flow
- ✅ Login/Signup
- ✅ Browse services
- ✅ Book a service
- ✅ Make payment
- ✅ View bookings
- ✅ Chat with provider
- ✅ Profile management
- ✅ Notifications

### Expected Performance:
- ✅ App loads in < 3 seconds
- ✅ Screens transition smoothly
- ✅ API responses < 200ms
- ✅ No crashes or errors
- ✅ Responsive to touches

---

## 🎨 Custom Build Configuration

### Change App Name:
**File**: `android/app/build.gradle`
```gradle
android {
  defaultConfig {
    applicationId "com.vehicaid.booker"
    versionCode 1
    versionName "1.0.0"
  }
}
```

### Change App Version:
```gradle
defaultConfig {
  versionCode 2  // Increment for each build
  versionName "1.0.1"
}
```

### Configure App Icon:
**File**: `android/app/src/main/AndroidManifest.xml`
```xml
<application
  android:icon="@mipmap/ic_launcher"
  android:roundIcon="@mipmap/ic_launcher_round"
>
```

---

## 📊 Build Troubleshooting

### Issue: "Gradle build failed"
```bash
# Solution: Clean and rebuild
./gradlew clean
./gradlew assembleDebug
```

### Issue: "Java version mismatch"
```bash
# Set JAVA_HOME to JDK 11+
setx JAVA_HOME "C:\Program Files\Java\jdk-11"
```

### Issue: "SDK not found"
```bash
# Set ANDROID_HOME
setx ANDROID_HOME "%USERPROFILE%\AppData\Local\Android\Sdk"
```

### Issue: "Out of memory"
```bash
# Increase heap size in gradle.properties
org.gradle.jvmargs=-Xmx4096m
```

---

## 📦 Build Outputs Explained

### Debug APK
```
app/build/outputs/apk/debug/app-debug.apk
├─ Size: ~80MB
├─ Time to build: 2-3 minutes
├─ Uses: Test device installation
├─ Signing: Auto-signed for debug
└─ Features: All enabled, debugging symbols included
```

### Release APK
```
app/build/outputs/apk/release/app-release.apk
├─ Size: ~50-60MB
├─ Time to build: 3-5 minutes
├─ Uses: Play Store or direct installation
├─ Signing: Requires release keystore
└─ Features: Optimized, no debug symbols
```

### App Bundle (AAB)
```
app/build/outputs/bundle/release/app-release.aab
├─ Size: ~30-50MB
├─ Time to build: 3-5 minutes
├─ Uses: Play Store submission (recommended)
├─ Advantage: Google Play handles optimization
└─ Feature: Different APKs for different devices
```

---

## ✅ Production Build Checklist

Before submitting to Play Store:

- [ ] App version bumped
- [ ] Changelog updated
- [ ] Screenshots prepared
- [ ] Privacy policy ready
- [ ] Terms of service ready
- [ ] App description written
- [ ] Signing certificate ready
- [ ] Keystore backed up
- [ ] All tests passing
- [ ] Performance verified

---

## 🚀 Next Steps

### 1. Build Debug APK (Now):
```bash
cd c:\vehic-aid-project\android
./gradlew assembleDebug
```

### 2. Test on Android Device:
```bash
adb install app/build/outputs/apk/debug/app-debug.apk
```

### 3. Verify All Features:
- Test login/signup
- Test booking flow
- Test payments
- Test notifications
- Verify performance

### 4. Build Release AAB:
```bash
./gradlew bundleRelease
```

### 5. Submit to Google Play:
- Go to https://play.google.com/console
- Upload AAB file
- Fill app details
- Submit for review

---

## 📞 Support Commands

```bash
# View all connected devices
adb devices

# Install APK
adb install path/to/app.apk

# Uninstall app
adb uninstall com.vehicaid.booker

# View app logs
adb logcat | grep VehicAid

# Open app on device
adb shell am start -n com.vehicaid.booker/.MainActivity

# Clear app data
adb shell pm clear com.vehicaid.booker
```

---

## 📊 Build Performance

| Build Type | Time | Size | Purpose |
|-----------|------|------|---------|
| Debug | 2-3m | 80MB | Testing |
| Release | 3-5m | 50-60MB | Installation |
| AAB | 3-5m | 30-50MB | Play Store |

---

**Ready to build?**

```bash
cd c:\vehic-aid-project\android && ./gradlew assembleDebug
```

The app will be ready in 2-3 minutes!

---

For more details, see [BUILD_AND_SIGN_GUIDE.md](BUILD_AND_SIGN_GUIDE.md)
