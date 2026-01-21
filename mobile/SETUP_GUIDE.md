# VehicAid Mobile Apps - Setup & Build Guide

## 📱 Project Structure

```
mobile/
├── packages/              # Shared libraries
│   ├── api/              # HTTP client & API endpoints
│   ├── auth/             # Authentication context
│   ├── storage/          # Local storage & persistence
│   ├── ui/               # Reusable UI components
│   └── core/             # Validators, formatters, constants
│
├── apps/
│   ├── booker/           # Customer app
│   │   ├── app/          # Navigation & screens
│   │   ├── components/   # Custom components
│   │   ├── app.json      # App config
│   │   └── package.json
│   │
│   └── provider/         # Service provider app
│       ├── app/          # Navigation & screens
│       ├── components/   # Custom components
│       ├── app.json      # App config
│       └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Expo CLI installed globally
- Android emulator or iOS simulator (or Expo Go app on phone)
- Backend running on `http://localhost:8001`

### Installation

```bash
# Install dependencies (run from mobile root)
npm install
# or
yarn install

# This will install all packages and apps
```

### Environment Setup

Create `.env.local` files in each app directory:

**apps/booker/.env.local:**
```
EXPO_PUBLIC_API_URL=http://192.168.1.100:8001/api/v1
EXPO_PUBLIC_APP_NAME=VehicAid Booker
EXPO_PUBLIC_ENVIRONMENT=development
```

**apps/provider/.env.local:**
```
EXPO_PUBLIC_API_URL=http://192.168.1.100:8001/api/v1
EXPO_PUBLIC_APP_NAME=VehicAid Provider
EXPO_PUBLIC_ENVIRONMENT=development
```

> Note: Replace `192.168.1.100` with your backend server IP if different

### Running the Apps

#### Booker App
```bash
npm run dev:booker
# or
cd apps/booker && expo start
```

Then:
- Press `a` for Android
- Press `i` for iOS
- Press `w` for web
- Scan QR code with Expo Go app (mobile)

#### Provider App
```bash
npm run dev:provider
# or
cd apps/provider && expo start
```

### Testing Credentials

Both apps accept any valid email format for testing:

**Customer (Booker):**
```
Email: customer@test.com
Password: Test@123456
```

**Provider:**
```
Email: provider@test.com
Password: Test@123456
```

## 📦 Building for Production

### Using EAS (Expo Application Services)

#### Setup EAS Account
```bash
eas login
```

#### Build for Android
```bash
npm run build:booker
# or specific platform
eas build --platform android
```

#### Build for iOS
```bash
npm run build:ios
```

#### Build All
```bash
npm run build:all
```

### Manual Native Build

#### Prebuild (generates native code)
```bash
npm run prebuild:booker
# or
eas prebuild --platform all --clean
```

## 🔧 Development

### Shared Packages Usage

#### Import from API package
```typescript
import { apiClient, authEndpoints, userEndpoints } from '@vehic-aid/api';

// Example
const response = await userEndpoints.getProfile();
```

#### Import from Auth package
```typescript
import { useAuth } from '@vehic-aid/auth';

const { user, login, logout, isAuthenticated } = useAuth();
```

#### Import from UI package
```typescript
import { Button, Input, Card, colors, typography, spacing } from '@vehic-aid/ui';

<Button title="Click me" onPress={() => {}} variant="primary" />
<Input label="Name" placeholder="Enter name" />
<Card>Content here</Card>
```

#### Import from Core package
```typescript
import { validateEmail, formatCurrency } from '@vehic-aid/core';
import { SERVICE_TYPES, USER_ROLES } from '@vehic-aid/core';
```

### Adding New Screens

1. Create screen component in `app/screens/`
2. Add to navigation stack in `RootNavigator.tsx`
3. Import and wire up navigation

### API Integration

All API calls are centralized in `@vehic-aid/api/src/endpoints.ts`

Example:
```typescript
import { serviceEndpoints } from '@vehic-aid/api';

// Create request
const request = await serviceEndpoints.createRequest({
  service_type: 'MECHANIC',
  vehicle_id: 1,
  description: 'Oil change needed',
  location: { latitude: 17.3850, longitude: 78.4867, address: 'xyz' }
});

// List requests
const requests = await serviceEndpoints.listRequests('PENDING');

// Cancel request
await serviceEndpoints.cancelRequest(1);
```

## 🎨 Styling

All colors, typography, and spacing are defined in `@vehic-aid/ui/src/theme.ts`

```typescript
import { colors, typography, spacing, borderRadius } from '@vehic-aid/ui';

<View style={{ 
  backgroundColor: colors.primary,
  padding: spacing.lg,
  borderRadius: borderRadius.md 
}}>
  <Text style={typography.h2}>Hello</Text>
</View>
```

## 📡 Real-time Features (Coming Soon)

- WebSocket integration for live job feed
- Chat functionality with Socket.io
- Real-time location tracking
- Push notifications with Firebase

## 🔐 Security

- JWT token management (access + refresh)
- Automatic token refresh on 401
- Secure token storage using AsyncStorage
- Protected API routes with token validation

## 📊 Project Status

### Day 1 Complete ✅
- ✅ Monorepo structure
- ✅ Shared packages (api, auth, storage, ui, core)
- ✅ Booker app navigation & auth screens
- ✅ Provider app navigation & auth screens
- ✅ Theme & design system

### Day 2-5 Tasks
- Booking wizard implementation
- Job feed & job management
- Real-time tracking
- Chat integration
- Payment processing
- Wallet & subscription management
- Analytics dashboards
- Animations & polish

## 🐛 Troubleshooting

### App won't connect to backend
- Check backend is running on port 8001
- Verify API URL in `.env.local`
- Check network connectivity
- Try using device IP instead of localhost

### Dependencies not installing
```bash
npm install
cd apps/booker && npm install
cd ../provider && npm install
```

### Port already in use
```bash
# Kill process on port 8001
# Windows
netstat -ano | findstr :8001
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8001
kill -9 <PID>
```

## 📚 Documentation

- API Reference: See `docs/API_REFERENCE.md`
- Features: See `docs/WEB_APPLICATIONS_FEATURES.md`
- Backend Setup: See `backend/README.md`

## 🤝 Support

For issues or questions:
1. Check logs in terminal
2. Review API response errors
3. Verify backend connectivity
4. Check `.env.local` configuration

## 📝 License

Proprietary - VehicAid 2026
