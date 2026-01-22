# VehicAid Backend Integration Guide

## Overview
Complete integration between Mobile Apps, Web Apps, and Django REST Backend API running on `http://localhost:8001/api/v1`.

## Backend Status

### Running Backend
```bash
cd backend
python manage.py runserver 8001
```

### Database
- PostgreSQL running on `localhost:5432`
- Seed data available in `backend/seed_data.py`

### Key Models
- **Users**: Authentication (ServiceBooker, ServiceProvider)
- **Services**: ServiceRequest, ServiceQuote, Vehicle
- **Subscriptions**: SubscriptionPlan, UserSubscription
- **Payments**: Payment, Transaction, Wallet
- **Real-time**: ChatMessage via WebSocket
- **Pricing**: Dynamic pricing based on Service Type × Vehicle Type

---

## Mobile App Integration

### 1. Environment Configuration

File: `mobile/.env.local`
```env
EXPO_PUBLIC_API_URL=http://localhost:8001/api/v1
EXPO_PUBLIC_BACKEND_URL=http://localhost:8001
EXPO_PUBLIC_WS_URL=ws://localhost:8001/ws
EXPO_PUBLIC_RAZORPAY_KEY_ID=your_key_id
```

### 2. API Client Setup

The API client is initialized in `packages/api/src/client.ts` with:
- Automatic JWT token refresh (401 handling)
- Request/response interceptors
- Error handling
- Base URL configuration from environment

### 3. Endpoint Groups

All endpoints are organized in `packages/api/src/endpoints.ts`:

#### Authentication
```typescript
authEndpoints.login(credentials)
authEndpoints.signup(userData)
authEndpoints.logout()
authEndpoints.refreshToken(refreshToken)
```

#### Vehicles
```typescript
vehicleEndpoints.listVehicles()
vehicleEndpoints.createVehicle(vehicleData)
vehicleEndpoints.updateVehicle(id, updates)
vehicleEndpoints.deleteVehicle(id)
```

#### Service Requests
```typescript
serviceEndpoints.listRequests(status)
serviceEndpoints.createRequest(requestData)
serviceEndpoints.getQuote(quoteData)
serviceEndpoints.automindBooking(aiData)  // AI-powered booking
```

#### Service Data (Backend-driven)
```typescript
serviceDataEndpoints.getServiceTypes()     // Get all service types
serviceDataEndpoints.getVehicleTypes()     // Get all vehicle types
serviceDataEndpoints.getPricingRules()     // Get pricing matrix
```

#### Subscriptions
```typescript
subscriptionEndpoints.listPlans()
subscriptionEndpoints.getCurrentSubscription()
subscriptionEndpoints.subscribe(planId)
```

#### Payments
```typescript
paymentEndpoints.createPaymentOrder(amount)
paymentEndpoints.verifyPayment(orderId, paymentId, signature)
paymentEndpoints.getInvoices()
```

#### Provider Jobs
```typescript
jobEndpoints.listAvailableJobs()
jobEndpoints.acceptJob(jobId)
jobEndpoints.updateLocation(coordinates)
```

#### Analytics
```typescript
analyticsEndpoints.getProviderStats()
analyticsEndpoints.getDashboardStats()
```

---

## Screen-by-Screen Integration

### Booker App

#### 1. LoginScreen
- **Use**: `authEndpoints.login()`
- **Backend**: Validates credentials, returns JWT tokens
- **Storage**: Save tokens to AsyncStorage via `@vehic-aid/auth`

```typescript
const login = async (email: string, password: string) => {
  try {
    const response = await authEndpoints.login({ email, password });
    await storage.setTokens(response.access, response.refresh);
    apiClient.setTokens(response.access, response.refresh);
    navigation.navigate('Dashboard');
  } catch (error) {
    showError('Invalid credentials');
  }
};
```

#### 2. BookScreen (Service Booking)
- **Fetch Service Types**: `serviceDataEndpoints.getServiceTypes()`
- **Fetch Vehicle Types**: `serviceDataEndpoints.getVehicleTypes()`
- **Get Quote**: `serviceEndpoints.getQuote()`
- **Create Request**: `serviceEndpoints.createRequest()`

```typescript
// Fetch available services and vehicles from backend
useEffect(() => {
  const fetchData = async () => {
    const services = await serviceDataEndpoints.getServiceTypes();
    const vehicles = await vehicleEndpoints.listVehicles();
    setServiceTypes(services);
    setVehicles(vehicles);
  };
  fetchData();
}, []);

// Calculate price from backend
const getQuote = async () => {
  const quote = await serviceEndpoints.getQuote({
    service_type: selectedService,
    location_lat: location.latitude,
    location_lon: location.longitude,
    vehicle_id: selectedVehicle,
    distance: distance
  });
  setEstimatedPrice(quote.total_estimated_price);
};
```

#### 3. VehiclesScreen
- **List**: `vehicleEndpoints.listVehicles()`
- **Add**: `vehicleEndpoints.createVehicle()`
- **Edit**: `vehicleEndpoints.updateVehicle()`
- **Delete**: `vehicleEndpoints.deleteVehicle()`

#### 4. HistoryScreen
- **List**: `serviceEndpoints.listRequests()`
- **Details**: `serviceEndpoints.getRequest(id)`
- **Rate**: `ratingEndpoints.rateService()`

#### 5. SubscriptionDetailsScreen
- **List Plans**: `subscriptionEndpoints.listPlans()`
- **Current**: `subscriptionEndpoints.getCurrentSubscription()`
- **Upgrade**: `subscriptionEndpoints.subscribe(planId)`

#### 6. PaymentScreen
- **Wallet**: `walletEndpoints.getWallet()`
- **History**: `walletEndpoints.getTransactionHistory()`
- **Add Balance**: `paymentEndpoints.createPaymentOrder()`
- **Verify**: `paymentEndpoints.verifyPayment()`

#### 7. ChatScreen
- **Send**: `chatEndpoints.sendMessage(chatId, text)`
- **Load**: `chatEndpoints.getMessages(chatId)`
- **Real-time**: WebSocket connection at `ws://localhost:8001/ws`

#### 8. LocationTrackingScreen
- **Update**: `jobEndpoints.updateLocation({latitude, longitude})`
- **WebSocket**: Real-time location updates

### Provider App

#### 1. DashboardScreen
- **Stats**: `analyticsEndpoints.getProviderStats()`
- **Real-time data**: WebSocket connection

#### 2. JobsScreen
- **Available**: `jobEndpoints.listAvailableJobs()`
- **Accept**: `jobEndpoints.acceptJob(jobId)`
- **Status**: `jobEndpoints.updateJobStatus()`

#### 3. EarningsScreen
- **Today**: `earningsEndpoints.getEarnings('today')`
- **History**: `earningsEndpoints.getEarningsHistory()`
- **Payout**: `earningsEndpoints.requestPayout()`

#### 4. AnalyticsScreen
- **Stats**: `analyticsEndpoints.getProviderStats()`
- **Performance**: Rendered from backend data

---

## Web Apps Integration

### Web Booker (`web/booker`)
- Connects to same backend at `http://localhost:8001/api/v1`
- Environment: `web/booker/.env.local`
- Uses same endpoint groups as mobile

### Web Provider (`web/provider`)
- Connects to backend for job management
- Real-time updates via WebSocket
- Environment: `web/provider/.env.local`

### Web Admin (`web/admin`)
- Dashboard statistics
- Analytics and reporting
- Environment: `web/admin/.env.local`

---

## Data Sync Strategy

### 1. Service Types & Pricing (Backend-Driven)
- Fetch once on app launch
- Cache in local Redux store
- Update every hour or on app resume

```typescript
// In App.tsx or InitializationScreen
useEffect(() => {
  const syncServiceData = async () => {
    try {
      const data = await Promise.all([
        serviceDataEndpoints.getServiceTypes(),
        serviceDataEndpoints.getVehicleTypes(),
        serviceDataEndpoints.getPricingRules(),
      ]);
      dispatch(setServiceData(data));
    } catch (error) {
      console.error('Failed to sync service data');
    }
  };
  
  syncServiceData();
  const interval = setInterval(syncServiceData, 60 * 60 * 1000); // 1 hour
  return () => clearInterval(interval);
}, []);
```

### 2. User-Specific Data (Cached with TTL)
- Vehicles: Cache 15 minutes
- Subscriptions: Cache 30 minutes
- Wallet: Cache 5 minutes
- Bookings: Cache 10 minutes

### 3. Real-Time Data (WebSocket)
- Chat messages
- Job status updates
- Location tracking
- Provider availability

---

## Seed Data Population

Run seed script to populate backend with test data:

```bash
cd backend
python seed_data.py
```

### Generated Data
- 4 Booker Users (FREE, BASIC, PREMIUM, ELITE subscriptions)
- 4 Service Providers
- 6 Vehicles (all types)
- 4 Service Requests (various statuses)
- 3 Spare Part Stores
- Subscription Plans

---

## Testing Integration

### 1. Test Login
```bash
curl -X POST http://localhost:8001/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user_free@test.com","password":"password123"}'
```

### 2. Test Service Types
```bash
curl http://localhost:8001/api/v1/services/types/ \
  -H "Authorization: Bearer {access_token}"
```

### 3. Test Pricing Quote
```bash
curl -X POST http://localhost:8001/api/v1/services/quote/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {access_token}" \
  -d '{
    "service_type":"TOWING",
    "location_lat":12.9716,
    "location_lon":77.5946,
    "distance":25
  }'
```

---

## Common Errors & Solutions

### 1. API_URL Not Recognized
**Problem**: App can't connect to backend
**Solution**: 
- Check `.env.local` has correct `EXPO_PUBLIC_API_URL`
- Ensure backend is running on port 8001
- Check network connectivity

### 2. 401 Unauthorized
**Problem**: Token expired or invalid
**Solution**:
- Auto token refresh handles this (already implemented)
- Check refresh endpoint: `/auth/token/refresh/`
- If still failing, user must re-login

### 3. CORS Issues
**Problem**: "Access to XMLHttpRequest blocked by CORS policy"
**Solution**:
- Backend has `django-cors-headers` configured
- Check `CORS_ALLOWED_ORIGINS` in `backend/vehic_aid_backend/settings/`

### 4. Connection Refused
**Problem**: `connect ECONNREFUSED 127.0.0.1:8001`
**Solution**:
- Start backend: `python manage.py runserver 8001`
- Check port 8001 is available: `netstat -an | grep 8001`

---

## Deployment Checklist

- [ ] Backend environment variables configured (Firebase, Razorpay, SMS gateway)
- [ ] Database migrated on production
- [ ] Seed data loaded (or real data imported)
- [ ] Mobile app `.env.local` updated with production backend URL
- [ ] Web apps `.env.local` updated with production backend URL
- [ ] CORS settings allow production domains
- [ ] SSL/TLS enabled on backend
- [ ] API documentation accessible at `/api/schema/swagger-ui/`
- [ ] Admin panel accessible for management

---

## API Documentation

Full Swagger documentation available at:
```
http://localhost:8001/api/schema/swagger-ui/
```

Alternative format:
```
http://localhost:8001/api/schema/
```

---

## Support & Troubleshooting

### Backend Logs
```bash
cd backend
python manage.py runserver 8001 --verbosity 3
```

### Database Query
```bash
cd backend
python manage.py dbshell
```

### Cache & Redis
```bash
redis-cli
FLUSHDB  # Clear cache if needed
```

---

**Last Updated**: January 22, 2026  
**Status**: ✅ Ready for Production Integration
