# VehicAid - App Screenshots & Documentation Guide

## Overview

This guide provides detailed specifications for capturing, organizing, and presenting app screenshots for:
- **App Store Listings** (Google Play, App Store)
- **Marketing Materials**
- **Feature Documentation**
- **User Onboarding**

---

## 1. SCREENSHOT SPECIFICATIONS

### Device Sizes

**Google Play Store** (Supported Languages: English):
```
Phone:     1080 x 1920 px (9:16)
Tablet:    2560 x 1600 px (16:10)
Format:    PNG or JPEG (RGB, no alpha channel for JPEG)
Max Size:  8 files per language
```

**App Store** (iOS):
```
iPhone 6.7":  1242 x 2688 px (Max Pro/Pro Max)
iPhone 5.5":  1242 x 2208 px (Regular phones)
iPad Pro:     2048 x 2732 px
Format:       PNG or JPEG
Max Files:    10 per app
```

### Recommended Format
- **Format**: PNG (lossless, transparency support)
- **Compression**: Optimized for web (use tool like TinyPNG)
- **Resolution**: 1080 x 1920 px (baseline) or 1242 x 2688 px (premium)
- **Safe Zone**: 10% margin on all sides for text
- **Text Size**: 24-32pt minimum for readability

---

## 2. BOOKER APP - SCREENSHOT SEQUENCE

### Screenshot #1: Onboarding - Login

**File**: `BOOKER_01_Login.png`  
**Dimensions**: 1080 x 1920 px  
**Dark Mode**: Yes  

**Content**:
```
Top: VehicAid logo (centered)
Body:
  - Email input field (user_free@test.com pre-filled)
  - Password input field (masked)
  - "Keep me signed in" checkbox
  - "Forgot Password?" link
Buttons:
  - "Login" (primary button, orange #FF6B35)
  - "Sign up" (secondary link)
Footer:
  - "Login with Google" option
  - "Login with Apple" option
```

**Overlay Text** (for app store):
```
"Quick & Secure Login
Sign in with your VehicAid account or
use Google/Apple for faster access"
```

---

### Screenshot #2: Dashboard - Home

**File**: `BOOKER_02_Dashboard.png`  
**Dimensions**: 1080 x 1920 px  

**Content**:
```
Header (8% height):
  - User avatar + "Hi, [Name]!"
  - Time: 2:34 PM
  
Quick Stats (15% height):
  - Active Subscription: "Premium"
  - Wallet Balance: ₹2,450.50
  - Rating: ⭐ 4.8/5
  
Recent Booking Card (20% height):
  - Status: "Completed"
  - Service: "Roadside Assistance"
  - Provider: "John Mechanic" ⭐4.8
  - Amount: ₹500
  - Time: "Completed 2 hours ago"

Quick Access (12% height):
  - 4 icons in grid:
    • Book New Service (orange)
    • My Vehicles
    • Wallet
    • Chat

Below: "Book Service Now" button (prominent)
```

**Overlay Text**:
```
"Your Personal Roadside Assistance
Real-time service requests, trusted mechanics,
instant support - anytime, anywhere"
```

---

### Screenshot #3: Booking - Step 1 (Service Selection)

**File**: `BOOKER_03_Book_Step1.png`  
**Dimensions**: 1080 x 1920 px  

**Content**:
```
Header:
  - "Book Service" title
  - Progress: "Step 1 of 6"
  - Back button

Body: Service selection grid (3 columns)
  1. Roadside Assistance
     • Icon: ambulance
     • Price: Variable
  2. Mechanical Repair
     • Icon: wrench
     • Price: Starting ₹500
  3. Battery Service
     • Icon: battery
     • Price: Starting ₹300
  4. Towing
     • Icon: truck  
     • Price: Starting ₹1000
  5. Car Wash
     • Icon: water droplet
     • Price: Starting ₹200
  6. All Services
     • Icon: grid
     • Price: View all

Bottom:
  - Next button (enabled if service selected)
```

**Overlay Text**:
```
"What Service Do You Need?
Choose from roadside assistance to
mechanical repairs - we have it all"
```

---

### Screenshot #4: Booking - Step 5 (Quote & Payment)

**File**: `BOOKER_04_Book_Quote.png`  
**Dimensions**: 1080 x 1920 px  

**Content**:
```
Header: "Get Quote" (Step 5 of 6)

Route Details Card (20%):
  - Pick-up: "Current Location"
  - Drop-off: "Service location"
  - Distance: "8.5 km"
  - Estimated Time: "12 mins"

Service Details (15%):
  - Service Type: "Roadside Assistance"
  - Vehicle: "Hyundai I20 - KA01AB1234"
  - Priority: "Standard"

Quote Breakdown (30%):
  - Service Charge: ₹500
  - Distance: 8.5 km × ₹15/km = ₹127.50
  - Subscription Discount: -₹62.75 (Premium)
  - Taxes (18% GST): ₹128.70
  - ─────────────────────
  - TOTAL: ₹693.45
  
Payment Methods:
  - Wallet (✓ Selected) ₹2,450.50 available
  - Add Balance

Buttons:
  - "Confirm Booking" (orange, enabled)
  - "Edit Details" (secondary)
```

**Overlay Text**:
```
"Transparent Pricing
No hidden charges. See exactly what
you're paying for your service"
```

---

### Screenshot #5: Booking Confirmation

**File**: `BOOKER_05_Confirmation.png`  
**Dimensions**: 1080 x 1920 px  

**Content**:
```
Success Animation/Icon (top 20%)
  - ✓ Checkmark in green circle

Status Card (25%):
  - "Booking Confirmed!"
  - Booking ID: BOOK-20240115-001234
  - Status: "Finding Best Mechanic..."
  - Estimated Provider Arrival: "8 mins"

Booking Summary (30%):
  - Service: Roadside Assistance
  - Location: MG Road, Bangalore
  - Vehicle: Hyundai I20
  - Amount: ₹693.45
  - Time Booked: 2:34 PM

Provider Info Card (Will appear after assignment):
  - Coming Soon indicator
  - "We'll notify you when a provider accepts"

Buttons:
  - "View Live Tracking" (primary)
  - "Chat with Provider" (secondary, disabled)
  - "Return to Home" (tertiary)
```

**Overlay Text**:
```
"Booking Confirmed!
Sit back and relax. Help is on the way.
Track your mechanic in real-time"
```

---

### Screenshot #6: Live Tracking

**File**: `BOOKER_06_Tracking.png`  
**Dimensions**: 1080 x 1920 px  

**Content**:
```
Map (60% of screen):
  - Google Maps integration
  - User location (blue pin)
  - Provider location (orange pin with car icon)
  - Route line between them
  - Current zoom level: street level

Provider Info Bar (Bottom 35%):
  - Provider Avatar
  - Name: "John Mechanic"
  - Rating: ⭐ 4.8/5 (324 ratings)
  - Current Status: "3 mins away"
  - Vehicle: "Orange Maruti Swift - KA01CD5678"
  
Buttons:
  - Call (phone icon)
  - Chat (message icon)
  - Share Location (share icon)
  - View Details (arrow)
```

**Overlay Text**:
```
"Live Tracking
See exactly where your mechanic is.
Stay connected throughout the service"
```

---

### Screenshot #7: Chat Screen

**File**: `BOOKER_07_Chat.png`  
**Dimensions**: 1080 x 1920 px  

**Content**:
```
Header:
  - Provider Avatar
  - "John Mechanic ⭐ 4.8"
  - Status: "Online"
  - Call & Info buttons

Chat Bubble Area (70%):
  - User message (right, blue):
    "Hi, I'll be at Gate 3"
    "2:41 PM"
  
  - Provider message (left, gray):
    "Perfect! I see you. One minute 👍"
    "2:42 PM"
    "Typing..."

Input Area (Bottom 20%):
  - Text input: "Type a message..."
  - Attachment button (paperclip)
  - Send button (arrow icon)
  - Emoji button

Additional Elements:
  - Timestamp separators
  - Read receipts (✓✓)
  - Typing indicator
```

**Overlay Text**:
```
"Real-time Communication
Chat instantly with your provider.
Share updates and photos in real-time"
```

---

### Screenshot #8: Payment Success

**File**: `BOOKER_08_Payment.png`  
**Dimensions**: 1080 x 1920 px  

**Content**:
```
Success Banner (top 15%):
  - Green checkmark animation
  - "Payment Successful!"

Receipt Card (35%):
  - Booking ID: BOOK-20240115-001234
  - Service: Roadside Assistance
  - Provider: John Mechanic
  - Duration: 45 minutes
  - Completed: "2:34 PM - 3:19 PM"
  - Amount: ₹693.45
  - Payment Method: Wallet
  
Breakdown (20%):
  - Service Charge: ₹500
  - Distance: ₹127.50
  - Discount: -₹62.75
  - Taxes: ₹128.70

Rating Section (20%):
  - "Rate your experience"
  - Star selector (empty stars)
  - Comment box
  - "Submit Rating" button

Buttons (bottom 10%):
  - "Download Receipt" (primary)
  - "Share" (secondary)
  - "Done" (tertiary)
```

**Overlay Text**:
```
"Service Complete!
How was your experience? Help us
improve by sharing your feedback"
```

---

### Screenshot #9: History & Reviews

**File**: `BOOKER_09_History.png`  
**Dimensions**: 1080 x 1920 px  

**Content**:
```
Header:
  - "Booking History"
  - Filter buttons: All | Completed | Cancelled | Pending

Booking Cards (list):
  Card 1 (Completed):
    - Date: Today
    - Service: Roadside Assistance
    - Provider: John Mechanic ⭐4.8
    - Amount: ₹693.45
    - Your Rating: ⭐⭐⭐⭐⭐ (with "Great service!" comment)
    - Action: View Details
  
  Card 2 (Completed):
    - Date: Jan 10
    - Service: Battery Service
    - Provider: Ram Services ⭐4.6
    - Amount: ₹300
    - Your Rating: ⭐⭐⭐⭐ (with "Quick response" comment)
    - Action: View Details
  
  Card 3 (Cancelled):
    - Date: Jan 5
    - Service: Mechanical Repair
    - Status: Cancelled by you
    - Refund: ₹0 (service didn't start)
    - Action: Book again

Additional:
  - Infinite scroll for more bookings
  - Pagination indicator at bottom
```

**Overlay Text**:
```
"Your Service History
Every service tracked and documented.
Easy access to past bookings and reviews"
```

---

### Screenshot #10: Subscription Plans

**File**: `BOOKER_10_Subscriptions.png`  
**Dimensions**: 1080 x 1920 px  

**Content**:
```
Header:
  - "Upgrade Your Plan"
  - Currently: "Premium" (highlighted badge)

Plan Cards (4 plans, scroll horizontal):

1. Free (Current, if not subscribed)
   - Price: ₹0/month
   - Features:
     • 5% discount on services
     • Basic support
     • Monthly newsletter
   - Status: "Current Plan"
   - Action: None

2. Basic ⭐ 
   - Price: ₹199/month
   - Features:
     • 10% discount
     • 24/7 priority support
     • Exclusive deals
     • Monthly coupons
   - Savings: Save ₹200/year
   - Action: "Upgrade Now"

3. Premium (Current badge)
   - Price: ₹499/month
   - Features:
     • All Basic benefits
     • 25% discount
     • Cashback (5%)
     • Free services (2x/year)
   - Savings: Save ₹600/year
   - Status: "Current Plan"
   - Action: "Manage Plan"

4. Elite 👑
   - Price: ₹999/month
   - Features:
     • All Premium benefits
     • 40% discount
     • Concierge service
     • Free services (6x/year)
     • Annual service plan
   - Best Value badge
   - Action: "Upgrade Now"

Bottom:
  - "30-day money back guarantee"
  - "Cancel anytime"
```

**Overlay Text**:
```
"Flexible Subscription Plans
More savings with premium plans.
Upgrade, downgrade or cancel anytime"
```

---

### Screenshot #11: User Profile

**File**: `BOOKER_11_Profile.png`  
**Dimensions**: 1080 x 1920 px  

**Content**:
```
Header (20%):
  - Large Avatar
  - Name: "Rajesh Kumar"
  - Email: "user_free@test.com"
  - Edit button (pencil icon)

Stats Row (10%):
  - Bookings: 24 ✓
  - Rating: 4.8 ⭐
  - Member Since: Jan 2024

Profile Sections:

1. Personal Info (15%):
   - Phone: +91 9876543210
   - City: Bangalore
   - Language: English
   - Edit: ← pencil icon

2. Payment Methods (12%):
   - Visa 4242
   - Bank Account
   - Add New: +

3. Emergency Contacts (12%):
   - Mom: +91 98765...
   - Brother: +91 87654...
   - Edit: ← pencil icon

4. Settings (15%):
   - Notification Settings →
   - Privacy & Security →
   - App Preferences →
   - Help & Support →

Bottom Buttons:
  - "Change Password"
  - "Logout"
  - "Delete Account"
```

**Overlay Text**:
```
"Your Profile
Keep your information up-to-date.
Manage all your account settings here"
```

---

### Screenshot #12: Vehicles Management

**File**: `BOOKER_12_Vehicles.png`  
**Dimensions**: 1080 x 1920 px  

**Content**:
```
Header:
  - "My Vehicles"
  - Add Vehicle button (+)

Vehicle Cards:

Card 1 (Primary vehicle):
  - Badge: "PRIMARY"
  - Vehicle Image/Icon
  - 2023 Hyundai I20
  - Color: Black Obsidian
  - Plate: KA-01-AB-1234
  - Status: Active ✓
  - Buttons:
    • Edit
    • Delete
    • Set as Primary (if not already)

Card 2:
  - Badge: None
  - Vehicle Image/Icon
  - 2022 Honda Activa
  - Color: Candy Red
  - Plate: KA-01-CD-5678
  - Status: Active ✓
  - Buttons:
    • Edit
    • Delete
    • Set as Primary

Add Vehicle Card:
  - + Large icon
  - "Add New Vehicle"
  - Tap to add more vehicles

Additional Info:
  - "Select a vehicle before booking"
  - Help text
```

**Overlay Text**:
```
"Your Vehicles
Manage multiple vehicles in one place.
Quick selection during booking"
```

---

### Screenshot #13: Settings & Dark Mode

**File**: `BOOKER_13_Settings.png`  
**Dimensions**: 1080 x 1920 px  

**Content**:
```
Header: "Settings"

Sections:

1. Appearance (15%):
   - Theme: Light | Dark | System (toggle)
   - Language: English ← dropdown
   - Font Size: Small | Medium | Large

2. Notifications (15%):
   - Push Notifications: ON
   - Email Notifications: OFF
   - SMS Updates: ON
   - Silent Hours: 10 PM - 8 AM

3. Privacy (15%):
   - Location Sharing: ON
   - Analytics: ON
   - Promotional Emails: OFF

4. Payment (12%):
   - Saved Payment Methods: Manage →
   - Two-Factor Authentication: ON
   - Biometric Login: ON

5. Support (15%):
   - Help & FAQ: →
   - Contact Support: →
   - About App: →
   - Privacy Policy: →

6. Account (12%):
   - Change Password: →
   - Logout: [Button]
   - Delete Account: [Button]
   - App Version: 1.0.0
```

**Overlay Text**:
```
"Customize Your Experience
Full control over notifications,
privacy, and preferences"
```

---

## 3. PROVIDER APP - SCREENSHOT SEQUENCE

### Provider Screenshot #1: Provider Login

**File**: `PROVIDER_01_Login.png`  
Similar to Booker but with provider-specific messaging

---

### Provider Screenshot #2: Dashboard - Jobs

**File**: `PROVIDER_02_Dashboard.png`  
**Dimensions**: 1080 x 1920 px  

**Content**:
```
Header (10%):
  - "VA Provider Dashboard"
  - Online Status Toggle (Green/Red)
  - Notification bell

Quick Stats (15%):
  - Today's Earnings: ₹3,450.50
  - Active Jobs: 2
  - Completed Today: 6
  - Rating: 4.9 ⭐

Featured Job Card (25%):
  - NEW badge (red)
  - Customer: "Rajesh Kumar" ⭐ 4.8
  - Service: "Roadside Assistance"
  - Location: "MG Road, Bangalore" (12 km away)
  - Vehicle: "Hyundai I20 - KA01AB1234"
  - Offered Amount: ₹700
  - Estimated Duration: "30-40 mins"
  - Buttons:
    • Accept (green)
    • Reject (gray)

Available Jobs List (30%):
  - Job 2: Battery Service | ₹300 | 5 km away
  - Job 3: Car Wash | ₹250 | 3 km away
  - Job 4: Mechanical | ₹500 | 8 km away
  - View all jobs (link)

Active Jobs (15%):
  - "You have 2 active jobs"
  - View active jobs (link)
```

**Overlay Text**:
```
"Accept Jobs. Earn Money.
Real-time job notifications.
Flexible working hours. Best rates"
```

---

### Provider Screenshot #3: Active Job - In Progress

**File**: `PROVIDER_03_ActiveJob.png`  
**Dimensions**: 1080 x 1920 px  

**Content**:
```
Header (8%):
  - "Active Job" | Job ID: JOB-001234
  - Status: "Accepted" (yellow badge)

Map (40%):
  - Google Maps
  - Current location (blue pin)
  - Customer location (orange pin)
  - Route

Customer Info Card (25%):
  - Avatar + "Rajesh Kumar" ⭐4.8
  - Phone number (tap to call)
  - Location: "MG Road, Bangalore"
  - Vehicle: "Black Hyundai I20"
  - Service: "Roadside Assistance"
  - Amount: ₹700
  - Your ETA: "8 mins away"

Actions (15%):
  - "Start Service" button (primary, green)
  - Chat button
  - Call button
  - More options (navigation menu)

Additional:
  - Job timer (elapsed time)
  - Service checklist items
```

**Overlay Text**:
```
"On the Way
Tap 'Start Service' when you arrive.
Customer location is highlighted"
```

---

### Provider Screenshot #4: Earnings & Analytics

**File**: `PROVIDER_04_Earnings.png`  
**Dimensions**: 1080 x 1920 px  

**Content**:
```
Header: "Your Earnings"

Earnings Summary (20%):
  - Today: ₹3,450.50
  - This Week: ₹24,870
  - This Month: ₹98,500
  - All Time: ₹287,600

Earnings Chart (25%):
  - Line chart showing earnings trend
  - Last 30 days data
  - Toggle: Day | Week | Month | Year

Breakdown (20%):
  - Services: ₹98,500 (95%)
  - Tips: ₹5,200 (5%)
  - Bonus: ₹0 (This month)
  - Commission: -₹14,775 (12%)

Wallet (15%):
  - Available Balance: ₹15,450.75
  - Pending: ₹3,450.50
  - "Request Withdrawal" button

Recent Transactions:
  - Jan 15, 2:34 PM - Roadside Assist +₹700
  - Jan 15, 1:20 PM - Battery Service +₹300
  - Jan 14, 11:45 PM - Withdrawal -₹5,000
```

**Overlay Text**:
```
"Real-time Earnings Tracking
See exactly what you're earning.
Withdraw anytime to your bank"
```

---

### Provider Screenshots #5-6: History & Analytics

**File**: `PROVIDER_05_History.png` & `PROVIDER_06_Analytics.png`

(Following similar patterns to Booker app but focused on provider metrics)

---

## 4. SCREENSHOT CAPTURE SPECIFICATIONS

### Device Setup

**For Screenshots**:
1. **Device**: iPhone 12 Pro Max (1242 x 2688) or Pixel 5 (1080 x 2340)
2. **Time**: Set to 9:41 (standard iOS time) or 2:34 PM (Android)
3. **Battery**: 100% or plugged in
4. **WiFi/Signal**: Full bars
5. **Do Not Disturb**: Enable
6. **Brightness**: 100% (for clarity)

### Simulator Setup

```bash
# iOS Simulator
xcrun simctl status_bar iPhone13ProMax override --time 9:41 \
  --dataNetwork wifi --wifiMode active --wifiBars 3 \
  --cellularMode active --cellularBars 4 --batteryState charged \
  --batteryLevel 100

# Android Emulator
adb shell settings put global show_touches 0
adb shell settings put secure show_ime_with_hard_keyboard 1
```

### Capture Process

1. **Prepare App State**:
   - Log in with test account
   - Navigate to target screen
   - Wait for all content to load
   - Dismiss any alerts or modals

2. **Capture Screenshot**:
   ```bash
   # iOS
   xcrun simctl io booted screenshot screenshot.png
   
   # Android
   adb shell screencap -p /sdcard/screenshot.png
   adb pull /sdcard/screenshot.png ./screenshot.png
   ```

3. **Optimize Image**:
   ```bash
   # Compress PNG (reduce size by 30-50%)
   optipng -o2 -strip all screenshot.png
   
   # Or use online: https://tinypng.com
   ```

4. **Add Text Overlay** (using ImageMagick):
   ```bash
   convert screenshot.png \
     -gravity SouthWest -background black -splice 0x100 \
     -pointsize 30 -fill white \
     -gravity Southwest -annotate +20+20 "Tap to book now →" \
     screenshot_with_text.png
   ```

---

## 5. APPSTORE SUBMISSION CHECKLIST

### Google Play Store

```
Screenshots (Required):
  - [ ] 2-8 screenshots per locale
  - [ ] Minimum 1 screenshot (max 8)
  - [ ] 1080 x 1920 px or 1440 x 2560 px
  - [ ] PNG or JPEG
  - [ ] No alpha channel for JPEG
  - [ ] File size < 5MB each
  - [ ] Landscape/portrait mix recommended

Feature Graphic:
  - [ ] 1024 x 500 px
  - [ ] PNG or JPEG
  - [ ] Highlights key app feature

Preview Video (Optional):
  - [ ] 15-30 seconds
  - [ ] Show key features
  - [ ] Text overlay required
```

### Apple App Store

```
Screenshots (Required):
  - [ ] Minimum 1 screenshot (max 10)
  - [ ] 1242 x 2688 px (iPhone 6.7")
  - [ ] 1242 x 2208 px (iPhone 5.5")
  - [ ] 2048 x 2732 px (iPad Pro)
  - [ ] PNG or JPEG
  - [ ] Safe zone: Avoid notch/edges

Preview Video (Optional):
  - [ ] 15-30 seconds
  - [ ] Shows user experience
  - [ ] Must be compelling
```

---

## 6. TEXT OVERLAY TEMPLATES

### Standard Overlay Formula
```
Line 1 (Large, Bold): Feature/Benefit
Line 2 (Medium): How it works
Line 3 (Small): Call to action
```

### Examples for Each Screen

| Screen | Line 1 | Line 2 | Line 3 |
|--------|--------|--------|---------|
| Login | Quick & Secure | Sign in with your account | Login with Google too |
| Dashboard | Your Personal Assistant | Real-time bookings & updates | Book service now |
| Booking | Book in 6 Easy Steps | Service → Vehicle → Location | Confirm your booking |
| Quote | Transparent Pricing | No hidden charges | See total before paying |
| Tracking | Live GPS Tracking | Follow your mechanic | Stay connected always |
| Chat | Direct Communication | Message your provider | Instant responses |
| Payment | Secure Payment Gateway | Multiple payment options | Withdraw to bank |
| History | Service History | Every booking documented | Easy access anytime |
| Plans | Flexible Plans | Save with subscriptions | Upgrade anytime |
| Profile | Manage Your Account | Complete control | Keep info updated |
| Vehicles | Multiple Vehicles | Add your vehicles | Quick selection |
| Settings | Customize Experience | Full control | Your preferences |

---

## 7. LAUNCH ASSETS DIRECTORY STRUCTURE

```
mobile/
├── screenshots/
│   ├── booker/
│   │   ├── BOOKER_01_Login_1080x1920.png
│   │   ├── BOOKER_02_Dashboard_1080x1920.png
│   │   ├── BOOKER_03_Book_Step1_1080x1920.png
│   │   ├── BOOKER_04_Book_Quote_1080x1920.png
│   │   ├── BOOKER_05_Confirmation_1080x1920.png
│   │   ├── BOOKER_06_Tracking_1080x1920.png
│   │   ├── BOOKER_07_Chat_1080x1920.png
│   │   ├── BOOKER_08_Payment_1080x1920.png
│   │   └── [9-13: Other screens]
│   │
│   ├── provider/
│   │   ├── PROVIDER_01_Login_1080x1920.png
│   │   ├── PROVIDER_02_Dashboard_1080x1920.png
│   │   ├── PROVIDER_03_ActiveJob_1080x1920.png
│   │   ├── PROVIDER_04_Earnings_1080x1920.png
│   │   ├── PROVIDER_05_History_1080x1920.png
│   │   └── PROVIDER_06_Analytics_1080x1920.png
│   │
│   └── optimized/
│       ├── booker_compressed/
│       └── provider_compressed/
│
├── app_store_assets/
│   ├── booker/
│   │   ├── icon_1024x1024.png
│   │   ├── featured_graphic_1024x500.png
│   │   ├── preview_video.mp4
│   │   └── description_text.txt
│   │
│   └── provider/
│       ├── icon_1024x1024.png
│       ├── featured_graphic_1024x500.png
│       ├── preview_video.mp4
│       └── description_text.txt
│
└── SCREENSHOTS_GUIDE.md (this file)
```

---

## 8. SCREENSHOT VALIDATION CHECKLIST

Before Uploading:

- [ ] All 13 Booker screenshots captured
- [ ] All 6 Provider screenshots captured
- [ ] Correct dimensions (1080x1920 or 1242x2688)
- [ ] PNG format, properly compressed
- [ ] Text overlays added and readable
- [ ] No personal information visible
- [ ] No error messages or crashes shown
- [ ] Consistent styling across all screenshots
- [ ] Dark mode displays correctly
- [ ] Safe zone respected (no cut-off text)
- [ ] All buttons/UI elements visible
- [ ] Proper color balance and brightness
- [ ] Screenshots tell a story (sequential flow)
- [ ] Text overlays are professional
- [ ] No duplicated screenshots
- [ ] Naming convention followed (BOOKER_XX_Name.png)

---

## 9. SCREENSHOT OPTIMIZATION PROCESS

### Step 1: Capture (Time: 30 mins)
- Set up simulators/devices
- Prepare test data
- Capture all 19 screenshots

### Step 2: Edit (Time: 1 hour)
- Add text overlays
- Ensure consistency
- Crop if needed
- Color correction if needed

### Step 3: Optimize (Time: 20 mins)
- Compress images
- Verify file sizes
- Verify dimensions
- Check for artifacts

### Step 4: Review (Time: 30 mins)
- Quality check
- Get feedback from team
- Test on actual app store
- Make final adjustments

**Total Time**: ~2.5 hours for all screenshots

---

## 10. APP STORE LISTING TEXT

### Google Play Store - Booker App

**Title** (50 char max):
```
VehicAid - Roadside Assistance 24/7
```

**Short Description** (80 char max):
```
On-demand vehicle assistance & repair services
```

**Full Description** (4000 char max):
```
VehicAid - Your Personal Roadside Assistance App

Emergency vehicle breakdown? Flat tire? Battery issues? 
Get instant help with VehicAid.

✨ KEY FEATURES:

📍 Real-Time GPS Tracking
- Track your mechanic in real-time
- Get accurate ETAs
- Never wait in the dark again

💰 Transparent Pricing
- No hidden charges
- See exact prices before booking
- Multiple payment methods

⭐ Trusted Mechanics
- All mechanics verified & rated
- Read real customer reviews
- Safety assured

🚗 All Vehicle Types
- Cars, motorcycles, trucks, SUVs
- Any vehicle, any issue

📞 24/7 Support
- Chat with mechanics instantly
- Call support anytime
- Quick resolution

🎁 Subscription Plans
- Free basic support
- Discounts with premium plans
- Flexible terms

🔒 Secure & Verified
- End-to-end encryption
- Verified mechanics
- Insurance coverage

HOW IT WORKS:

1. Book Service
   Select your service type and vehicle

2. Get Quote
   See exact price before confirming

3. Confirm Booking
   Confirm and add payment method

4. Track Provider
   See your mechanic arrive via GPS

5. Complete Service
   Chat, pay, and rate the experience

SUPPORTED SERVICES:
- Roadside Assistance
- Mechanical Repairs
- Battery Service
- Towing
- And many more

DOWNLOAD NOW AND GET:
- First booking discount
- 24/7 support
- Real-time tracking
- Trusted mechanics

Questions? Contact us at support@vehicaid.com

Download VehicAid today!
```

### Apple App Store - Booker App

**Name** (30 char max):
```
VehicAid
```

**Subtitle** (30 char max):
```
On-Demand Roadside Help
```

**Keywords** (100 char max):
```
roadside assistance, vehicle repair, mechanics, emergency, breakdown, help
```

**Description**:
(Same as Google Play, formatted for iOS)

---

## 11. SOCIAL MEDIA TEMPLATES

### Instagram Post Caption
```
🚗 You're Just One Tap Away from Help! 📱

Whether it's a flat tire, dead battery, or engine trouble - 
VehicAid is here 24/7.

✨ Real-time tracking
✨ Trusted mechanics  
✨ Transparent pricing
✨ Instant support

Download now from App Store & Google Play!
Link in bio 🔗

#VehicAid #RoadsideAssistance #VehicleRepair 
#Mechanics #Emergency #MobileApp #Innovation
```

### Twitter Post
```
🚗 Breaking down is stressful. Help shouldn't be.

VehicAid: Real-time roadside assistance at your fingertips.
- GPS tracking 📍
- Trusted mechanics ⭐
- Transparent pricing 💰
- 24/7 support 🛠️

Download now! 
[Link]

#VehicAid #RoadsideHelp #MobileApp
```

### Facebook Post
```
Introducing VehicAid - Your Personal Roadside Assistant!

Don't let vehicle breakdowns ruin your day. With VehicAid:

✅ Book services in seconds
✅ Track your mechanic in real-time  
✅ Chat with mechanics directly
✅ Transparent pricing - no surprises
✅ Trusted, verified mechanics
✅ Available 24/7

Download VehicAid Today:
iOS: [App Store Link]
Android: [Play Store Link]
```

---

*Last Updated*: January 22, 2026  
*Total Screenshots Required*: 19 (13 Booker + 6 Provider)  
*Status*: Documentation Complete - Ready for Capture Phase
