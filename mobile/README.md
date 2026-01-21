# 📱 VehicAid Mobile Applications

Complete React Native + Expo mobile apps for VehicAid - a 24/7 vehicle service platform.

## 🎯 Apps Included

### **Booker App (Customer)**
- Browse available service providers
- Book vehicle services
- Real-time tracking
- In-app chat
- Payment processing
- Service history
- Subscription management

### **Provider App (Service Provider)**
- Receive job notifications
- Accept/reject jobs
- Real-time location tracking
- Earnings dashboard
- Payment settlements
- Customer ratings & reviews

## 🏗️ Architecture

### Monorepo Structure
- **packages/api** - HTTP client, API endpoints, types
- **packages/auth** - JWT authentication, contexts
- **packages/storage** - Local storage, persistence
- **packages/ui** - Shared React Native components
- **packages/core** - Validators, formatters, constants

### Apps
- **apps/booker** - Customer application
- **apps/provider** - Provider application

## ⚡ Tech Stack

- **React Native 0.74** - Mobile framework
- **Expo 51** - Development & deployment
- **TypeScript** - Type safety
- **React Navigation** - Navigation
- **React Native Reanimated** - Animations
- **AsyncStorage** - Local persistence
- **Axios** - HTTP client
- **Socket.io** - Real-time communications

## 🚀 Quick Start

```bash
# Install all dependencies
npm install

# Start Booker app
npm run dev:booker

# Start Provider app
npm run dev:provider

# Build for production
npm run build:booker
npm run build:provider
```

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions.

## 📦 Features Roadmap

### ✅ Day 1 - Foundation (COMPLETE)
- Monorepo setup
- Shared packages
- Auth screens
- Navigation structure
- Design system

### 🔄 Day 2 - Booker Core
- Dashboard
- Booking wizard (6 steps)
- Vehicle management
- Quote calculation
- Animations

### 🔄 Day 3 - Provider Core
- Dashboard with KPIs
- Job feed (real-time)
- Job acceptance flow
- Location tracking
- Animations

### 🔄 Day 4 - Integration
- Backend API integration
- WebSocket for real-time
- Chat functionality
- Payment processing
- Wallet system

### 🔄 Day 5 - Polish
- History & analytics
- Settings pages
- Push notifications
- Offline support
- Testing & optimization

## 📁 Project Layout

```
mobile/
├── packages/
│   ├── api/              # Centralized API client
│   ├── auth/             # Auth context & hooks
│   ├── storage/          # AsyncStorage wrapper
│   ├── ui/               # Reusable components & theme
│   └── core/             # Utils, validators, constants
│
├── apps/
│   ├── booker/           # Customer app
│   │   ├── app/          # Screens & navigation
│   │   ├── components/   # Custom components
│   │   └── assets/       # Images, fonts
│   │
│   └── provider/         # Provider app
│       ├── app/          # Screens & navigation
│       ├── components/   # Custom components
│       └── assets/       # Images, fonts
│
├── SETUP_GUIDE.md        # Detailed setup guide
└── package.json          # Monorepo config
```

## 🔑 Key Features

### Authentication
- Email/password registration & login
- JWT token management
- Automatic token refresh
- Secure storage

### Real-time Capabilities
- Live job notifications
- Service tracking
- In-app chat
- Location updates

### UI/UX
- Clean, modern design
- Smooth animations
- Dark mode support
- Responsive layouts
- Custom component library

### Business Logic
- Multi-step booking wizard
- Pricing calculations
- Earnings tracking
- Rating & review system
- Wallet management

## 🛠️ Development

### Running Development Server

```bash
# Booker app
cd apps/booker
expo start

# Provider app
cd apps/provider
expo start
```

### Testing on Devices

1. **Android Emulator**: Press `a` when server starts
2. **iOS Simulator**: Press `i` when server starts
3. **Physical Device**: Scan QR code with Expo Go app

### Building

```bash
# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Build both
eas build --platform all
```

## 📊 API Integration

All endpoints are in `packages/api/src/endpoints.ts`:

```typescript
import { 
  authEndpoints, 
  serviceEndpoints, 
  jobEndpoints 
} from '@vehic-aid/api';

// Example usage
const response = await authEndpoints.login({
  email: 'user@example.com',
  password: 'password'
});
```

## 🎨 Styling

Theme configuration in `packages/ui/src/theme.ts`:

```typescript
import { colors, typography, spacing } from '@vehic-aid/ui';

// Usage
<View style={{ 
  backgroundColor: colors.primary,
  padding: spacing.lg 
}}>
  <Text style={typography.h2}>Title</Text>
</View>
```

## 🔐 Security

- JWT tokens with refresh mechanism
- Secure token storage
- API request/response interceptors
- Input validation on all forms
- Protected routes

## 📱 Device Support

- **Android**: 5.0+ (API 21+)
- **iOS**: 13.0+
- **Web**: Supported via Expo Web

## 🚨 Troubleshooting

See [SETUP_GUIDE.md](./SETUP_GUIDE.md#-troubleshooting) for common issues.

## 📚 Documentation

- [Setup Guide](./SETUP_GUIDE.md)
- [API Reference](../docs/API_REFERENCE.md)
- [Features Overview](../docs/WEB_APPLICATIONS_FEATURES.md)
- [Backend Setup](../backend/README.md)

## 📞 Support

For issues or questions, check the troubleshooting guide or backend documentation.

## 📄 License

Proprietary © VehicAid 2026

---

**Status**: 🚀 Development in progress (Day 1 complete)  
**Next**: Day 2 - Booker Core Features
