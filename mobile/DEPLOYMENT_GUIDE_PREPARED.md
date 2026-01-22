# VehicAid Deployment Guide

## Pre-Deployment Checklist

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] ESLint passes with 0 critical issues
- [ ] All tests passing (>95% pass rate)
- [ ] No console errors or warnings
- [ ] Code coverage > 80%

### Performance
- [ ] API response time < 200ms
- [ ] Bundle size < 300KB (web)
- [ ] APK size < 100MB
- [ ] AAB size < 50MB
- [ ] IPA size < 150MB

### Security
- [ ] No npm vulnerabilities
- [ ] Sensitive data not hardcoded
- [ ] API endpoints use HTTPS
- [ ] Authentication tokens properly stored

### Documentation
- [ ] Changelog updated
- [ ] Version numbers bumped
- [ ] Screenshots captured
- [ ] App descriptions reviewed
- [ ] Privacy policy updated
- [ ] Terms of service updated

## Build Process

### Step 1: Prepare Release
```bash
# Update version
npm version minor

# Install dependencies
npm install

# Run quality checks
npm run type-check
npm run lint
npm test
```

### Step 2: Build Android
```bash
cd android

# Clean build
./gradlew clean

# Build release AAB
./gradlew bundleRelease

# Output: app/build/outputs/bundle/release/app-release.aab
```

### Step 3: Build iOS
```bash
cd ios

# Install pods
pod install

# Build archive
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

### Step 4: Build Web
```bash
# Build optimized bundle
npm run build

# Test locally
npx serve build/
```

## App Store Deployment

### Google Play Console
1. Go to https://play.google.com/console
2. Select your app
3. Click Release → Production
4. Upload AAB file
5. Review changes
6. Submit for review
7. Monitor review status (1-7 days)

### Apple App Store Connect
1. Go to https://appstoreconnect.apple.com
2. Select your app
3. Click Prepare for Submission
4. Upload IPA via Transporter
5. Fill app information
6. Submit for review
7. Monitor review status (1-24 hours)

### Web Deployment (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod
```

## Post-Deployment

### Verification
- [ ] App appears in stores
- [ ] Download works
- [ ] App launches without crashes
- [ ] Core features working
- [ ] Notifications working
- [ ] APIs connecting correctly

### Monitoring
- [ ] User feedback monitored
- [ ] Error logs reviewed
- [ ] Performance metrics checked
- [ ] Security issues addressed

### Rollback Plan
In case of critical issues:
1. Mark version as incompatible
2. Release hotfix version
3. Communicate with users
4. Document issue for future prevention

## Versioning

- Major: v2.0.0 (breaking changes)
- Minor: v1.1.0 (new features)
- Patch: v1.0.1 (bug fixes)

## Support

For deployment issues, contact:
- Engineering Team: engineering@vehicaid.com
- Support: support@vehicaid.com
