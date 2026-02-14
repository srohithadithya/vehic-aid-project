
# VehicAid API Reference (v2.6)

**Base URL**: `http://localhost:8001/api/v1`  
**Authentication**: Bearer Token (JWT)

---

## 1. Authentication (`/users/`)

### Register
`POST /users/register/`
- **Body**: `{ "username": "user", "email": "user@example.com", "password": "...", "role": "CUSTOMER" }`
- **Response**: `201 Created` with tokens.

### Login
`POST /users/token/`
- **Body**: `{ "username": "...", "password": "..." }`
- **Response**: `{ "access": "...", "refresh": "..." }`

### Refresh Token
`POST /users/token/refresh/`
- **Body**: `{ "refresh": "..." }`
- **Response**: `{ "access": "..." }`

### User Profile
`GET /users/profile/`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` (User details)

---

## 2. Service Booking (`/services/`)

### Get Quote
`POST /services/quote/`
- **Body**: `{ "service_type": "TOWING", "latitude": 12.97, "longitude": 77.59, "vehicle_id": 1 }`
- **Response**: `200 OK` (Price estimate)

### Create Request
`POST /services/request/`
- **Body**: `{ "description": "Flat tire", "latitude": 12.97, "longitude": 77.59, "vehicle_id": 1 }`
- **Response**: `201 Created` (Request ID, Status)

### List Requests
`GET /services/request/`
- **Response**: `200 OK` (List of user's requests)

### Request Details
`GET /services/request/{id}/`
- **Response**: `200 OK` (Status, provider info, chat history)

---

## 3. AutoMind AI (`/services/automind/`)

### Chat with AI
`POST /services/automind/chat/`
- **Body**: `{ "message": "My car won't start", "context": {} }`
- **Response**: `200 OK` (AI response, suggested actions)

### AI-Initiated Booking
`POST /services/agentic-booking/`
- **Body**: `{ "description": "stuck in mud", "latitude": 12.34, "longitude": 56.78 }`
- **Response**: `201 Created` (If booking successful)

---

## 4. Admin Analytics (`/services/admin/`)

### Dashboard Stats
`GET /services/admin/dashboard-stats/`
- **Auth**: Admin Only
- **Response**: `200 OK` (Revenue, bookings, active providers)

### AI Performance Stats
`GET /services/admin/ai-stats/`
- **Auth**: Admin Only
- **Response**: `200 OK` (Triage accuracy, request load, auto-booking rate)

---

## 5. Provider Endpoints (`/services/provider/`)

### Available Jobs
`GET /services/provider/jobs/available/`
- **Response**: `200 OK` (Nearby unassigned requests)

### Accept Job
`POST /services/provider/jobs/{id}/accept/`
- **Response**: `200 OK` (Job assigned)

### Update Location
`POST /services/provider/location-update/`
- **Body**: `{ "latitude": 12.97, "longitude": 77.59 }`
- **Response**: `200 OK`

### Earnings
`GET /services/provider/earnings/`
- **Response**: `200 OK` (Daily/Weekly earnings)

---

## 6. Subscriptions (`/services/subscriptions/`)

### List Plans
`GET /services/subscriptions/plans/`
- **Response**: `200 OK` (Free, Basic, Premium, Elite)

### Current Status
`GET /services/subscriptions/current/`
- **Response**: `200 OK` (Active plan, expiry)

### Subscribe
`POST /services/subscriptions/subscribe/`
- **Body**: `{ "plan_id": 2, "payment_id": "pay_..." }`
- **Response**: `200 OK`

---

## 7. Public Stats (`/services/stats/`)

### Landing Page Stats
`GET /services/stats/public/`
- **Auth**: None
- **Response**: `200 OK` (Customers, Providers, Satisfaction%)

---

## 8. WebSocket (`/ws/`)

### Service Tracking
`ws://localhost:8001/ws/service/{request_id}/`
- **Events**: `status_update`, `location_update`, `chat_message`

### Chat
`ws://localhost:8001/ws/chat/{request_id}/`
- **Events**: `new_message`, `typing`
