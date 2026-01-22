# VehicAid - Build & Sign Configuration Guide

## 1. ANDROID BUILD & SIGN (APK/AAB)

### Prerequisites
```bash
# Install Android SDK
winget install AndroidStudio

# Set Android SDK path (add to environment)
setx ANDROID_HOME "C:\Users\%USERNAME%\AppData\Local\Android\Sdk"
setx JAVA_HOME "C:\Program Files\Android\Android Studio\jre"

# Verify Java
java -version
```

### Generate Signing Key

```bash
# Create keystore file (one-time only)
keytool -genkey -v -keystore android/app/release-keystore.jks `
  -keyalg RSA -keysize 2048 -validity 10000 `
  -alias vehicaid-release `
  -storepass vehicaid@2024 `
  -keypass vehicaid@2024 `
  -dname "CN=VehicAid,OU=Engineering,O=VehicAid Inc,L=Bangalore,S=Karnataka,C=IN"
```

**Store this password securely!**

### Configure Signing in Android

**File**: `android/app/build.gradle`

```gradle
android {
  compileSdkVersion 34

  signingConfigs {
    release {
      keyAlias 'vehicaid-release'
      keyPassword 'vehicaid@2024'
      storeFile file('release-keystore.jks')
      storePassword 'vehicaid@2024'
    }
  }

  buildTypes {
    release {
      signingConfig signingConfigs.release
      minifyEnabled true
      shrinkResources true
      proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
      resValue "string", "app_name", "VehicAid"
      buildConfigField "String", "API_URL", '"https://api.vehicaid.com"'
    }
    
    debug {
      resValue "string", "app_name", "VehicAid (Debug)"
      buildConfigField "String", "API_URL", '"http://localhost:8001"'
    }
  }

  packagingOptions {
    exclude 'META-INF/proguard/androidx-*.pro'
  }
}

dependencies {
  implementation 'com.google.android.material:material:1.9.0'
  implementation 'androidx.appcompat:appcompat:1.6.1'
}
```

### Build APK (for testing)

```bash
cd android

# Clean build
./gradlew clean

# Build debug APK
./gradlew assembleDebug

# APK location: app/build/outputs/apk/debug/app-debug.apk (for testing on real devices)
```

### Build AAB (for Play Store submission)

```bash
cd android

# Build release AAB
./gradlew bundleRelease

# Output: app/build/outputs/bundle/release/app-release.aab
# Size: ~30-50MB
```

**Verification**:
```bash
# Check AAB contents
bundletool dump manifest --bundle=app/build/outputs/bundle/release/app-release.aab

# Check AAB size
ls -lh app/build/outputs/bundle/release/app-release.aab
```

---

## 2. iOS BUILD & SIGN (IPA)

### Prerequisites

```bash
# Install Xcode (macOS required)
xcode-select --install

# Install CocoaPods
sudo gem install cocoapods

# Install Xcode build tools
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

### Setup iOS Development Team

1. **Open Xcode**:
```bash
cd ios
open VehicAid.xcworkspace
```

2. **Configure Signing in Xcode**:
   - Select "VehicAidBooker" target
   - Go to Signing & Capabilities
   - Select your Development Team
   - Use automatic provisioning

### Install Pods

```bash
cd ios

# Install dependencies
pod install

# Wait for completion
```

### Generate App ID in Apple Developer

1. Sign in at https://developer.apple.com
2. Create App IDs:
   - **Booker**: `com.vehicaid.booker`
   - **Provider**: `com.vehicaid.provider`
3. Create Provisioning Profiles
4. Download certificates

### Build Archive

```bash
# Clean build
xcode-select --reset
rm -rf ~/Library/Developer/Xcode/DerivedData/*

cd ios

# Build for release
xcodebuild -workspace VehicAid.xcworkspace \
  -scheme VehicAidBooker \
  -configuration Release \
  -archivePath build/VehicAid.xcarchive \
  archive

# Export IPA
xcodebuild -exportArchive \
  -archivePath build/VehicAid.xcarchive \
  -exportOptionsPlist ExportOptions.plist \
  -exportPath build/ipa
```

**ExportOptions.plist**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>signingStyle</key>
    <string>automatic</string>
    <key>teamID</key>
    <string>YOUR_TEAM_ID</string>
    <key>method</key>
    <string>app-store</string>
    <key>stripSwiftSymbols</key>
    <true/>
    <key>thinning</key>
    <string>&lt;none&gt;</string>
</dict>
</plist>
```

### Verify IPA

```bash
# Check IPA contents
unzip -l build/ipa/VehicAid.ipa | head -20

# Check size
ls -lh build/ipa/VehicAid.ipa

# Validate with Apple
xcrun altool --validate-app -f build/ipa/VehicAid.ipa -t ios \
  -u your-apple-id@email.com \
  -p your-app-password
```

---

## 3. WEB BUILD & DEPLOYMENT

### Build Web

```bash
cd mobile

# Build optimized web bundle
npm run build:web

# Output: build/ folder
# Size: ~5MB gzipped
```

### Optimize Web Build

**File**: `webpack.config.js` or `.env`

```bash
# Enable code splitting
SPLIT_CHUNKS=true

# Enable minification
MINIFY=true

# Enable gzip
COMPRESS=true

# Source maps (disable for production)
GENERATE_SOURCEMAP=false
```

### Deploy Web

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# URL: https://vehicaid-booker.vercel.app
```

#### AWS S3 + CloudFront

```bash
# Configure AWS CLI
aws configure

# Create S3 bucket
aws s3 mb s3://vehicaid-mobile-web

# Upload build
aws s3 sync build/ s3://vehicaid-mobile-web --delete

# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name vehicaid-mobile-web.s3.amazonaws.com \
  --enabled \
  --default-root-object index.html
```

#### GitHub Pages

```bash
# Update package.json
{
  "homepage": "https://vehicaid.com",
  "scripts": {
    "build": "react-scripts build",
    "deploy": "gh-pages -d build"
  }
}

# Deploy
npm run deploy
```

---

## 4. VERSION MANAGEMENT

### Semantic Versioning

```
MAJOR.MINOR.PATCH

v1.0.0 = Initial Release
v1.0.1 = Hotfix
v1.1.0 = Minor features
v2.0.0 = Major rewrite
```

### Update Versions

**mobile/package.json**:
```json
{
  "version": "1.0.0",
  "expo": {
    "version": "1.0.0"
  }
}
```

**iOS (Xcode)**:
- Product → Scheme → Edit Scheme
- Version: 1.0.0
- Build: 1

**Android (gradle)**:
```gradle
versionCode 1
versionName "1.0.0"
```

**Web**:
```json
{
  "version": "1.0.0"
}
```

### Build Increment

```bash
# Increment patch version
npm version patch    # 1.0.0 → 1.0.1

# Increment minor version
npm version minor    # 1.0.0 → 1.1.0

# Increment major version
npm version major    # 1.0.0 → 2.0.0
```

---

## 5. PRE-RELEASE CHECKLIST

- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Code coverage > 80%
- [ ] No console errors/warnings
- [ ] All screens tested
- [ ] Icons configured
- [ ] Version bumped
- [ ] Changelog updated
- [ ] Build succeeds without errors
- [ ] Signed APK/AAB/IPA generated
- [ ] File sizes acceptable:
  - APK: < 100MB
  - AAB: < 50MB
  - IPA: < 150MB
  - Web: < 10MB

---

## 6. DEPLOYMENT PIPELINE (CI/CD)

### GitHub Actions (`.github/workflows/release.yml`)

```yaml
name: Build & Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build Android AAB
        run: cd android && ./gradlew bundleRelease
      
      - name: Upload AAB
        uses: actions/upload-artifact@v2
        with:
          name: app-release.aab
          path: android/app/build/outputs/bundle/release/app-release.aab

  build-ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install && cd ios && pod install
      
      - name: Build iOS Archive
        run: |
          xcodebuild -workspace ios/VehicAid.xcworkspace \
            -scheme VehicAidBooker \
            -configuration Release \
            -archivePath build/VehicAid.xcarchive \
            archive
      
      - name: Export IPA
        run: |
          xcodebuild -exportArchive \
            -archivePath build/VehicAid.xcarchive \
            -exportOptionsPlist ios/ExportOptions.plist \
            -exportPath build/ipa
      
      - name: Upload IPA
        uses: actions/upload-artifact@v2
        with:
          name: VehicAid.ipa
          path: build/ipa/VehicAid.ipa

  build-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build web
        run: npm run build:web
      
      - name: Deploy to Vercel
        run: npx vercel deploy --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## 7. POST-BUILD TESTING

### Test APK on Android Device

```bash
# Install APK
adb install app/build/outputs/apk/release/app-release.apk

# Run app
adb shell am start -n com.vehicaid.booker/.MainActivity

# View logs
adb logcat | grep VehicAid
```

### Test IPA on iOS Device

```bash
# Install IPA using Xcode or Apple Configurator
# Or use: ios-deploy -b app.ipa

# Or submit via TestFlight for beta testing
```

### Test Web Build

```bash
# Serve locally
npx serve build/

# Test at http://localhost:3000

# Check performance
npm run analyze

# Check bundle size
npm run build:web && npm run build:web:analyze
```

---

## 8. APP STORE SUBMISSION

### Google Play Console

1. **Create app**: https://play.google.com/console
2. **Upload AAB**: Select app → Release → Production
3. **Fill details**: Description, screenshots, privacy policy
4. **Submit for review**: Takes 1-7 days

### Apple App Store Connect

1. **Create app**: https://appstoreconnect.apple.com
2. **Upload IPA**: Via Xcode or Transporter
3. **Fill details**: Description, screenshots, keywords
4. **Submit for review**: Takes 1-24 hours

---

## 9. TROUBLESHOOTING

### Android Build Issues

```bash
# Clean and rebuild
./gradlew clean
./gradlew bundleRelease

# Check for unsupported API
./gradlew lint

# Check dependencies
./gradlew dependencies
```

### iOS Build Issues

```bash
# Clean build folder
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# Update pods
cd ios && pod repo update && pod install

# Reset Xcode cache
xcrun simctl erase all
```

### Web Build Issues

```bash
# Clear node modules
rm -rf node_modules package-lock.json
npm install

# Clear cache
npm cache clean --force

# Rebuild
npm run build:web
```

---

## 10. SIGNING CREDENTIALS MANAGEMENT

### Store Securely

```bash
# Keep keystore in secure location
# DON'T commit to Git

# Add to .gitignore
/android/app/release-keystore.jks
/ios/certs/
/ios/profiles/

# Use GitHub Secrets for CI/CD
ANDROID_KEYSTORE_PASSWORD
APPLE_CERTIFICATE_PASSWORD
```

### Backup Credentials

```bash
# Backup keystore
cp android/app/release-keystore.jks ~/backup/release-keystore.jks

# Export iOS certs
security export-ident-cert "iPhone Distribution: VehicAid" -o ~/backup/dist-cert.cer

# Keep passwords in secure password manager
```

---

**Version**: 1.0  
**Last Updated**: January 22, 2026  
**Status**: Ready for Implementation
