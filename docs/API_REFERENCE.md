# 📡 VehicAid API Documentation

**Complete REST API reference for VehicAid platform**

---

## 📋 Table of Contents
1. [Authentication](#authentication)
2. [Vehicle Management](#vehicle-management)
3. [Service Requests](#service-requests)
4. [Pricing](#pricing)
5. [Payments](#payments)
6. [Chat](#chat)
7. [Provider Analytics](#provider-analytics)
8. [Subscriptions](#subscriptions)

---

## 🔐 Authentication

### **Base URL**
```
http://localhost:8001/api/v1
```

### **Register User**
```http
POST /auth/register/
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepass123",
  "phone_number": "+919876543210",
  "role": "CUSTOMER"  // or "PROVIDER"
}

Response: 201 Created
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "CUSTOMER"
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### **Login**
```http
POST /auth/login/
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepass123"
}

Response: 200 OK
{
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  },
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "CUSTOMER"
  }
}
```

### **Refresh Token**
```http
POST /auth/token/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

Response: 200 OK
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

## 🚗 Vehicle Management

### **List Vehicles**
```http
GET /vehicles/
Authorization: Bearer <access_token>

Response: 200 OK
{
  "vehicles": [
    {
      "id": 1,
      "license_plate": "MH01AB1234",
      "make": "Honda",
      "model": "Activa",
      "year": 2020,
      "vehicle_type": "TWO_WHEELER",
      "color": "Black",
      "fuel_type": "PETROL"
    }
  ]
}
```

### **Create Vehicle**
```http
POST /vehicles/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "license_plate": "MH01AB1234",
  "make": "Honda",
  "model": "Activa",
  "year": 2020,
  "vehicle_type": "TWO_WHEELER",  // See vehicle types below
  "color": "Black",
  "fuel_type": "PETROL"
}

Response: 201 Created
{
  "id": 1,
  "license_plate": "MH01AB1234",
  "make": "Honda",
  "model": "Activa",
  "year": 2020,
  "vehicle_type": "TWO_WHEELER",
  "color": "Black",
  "fuel_type": "PETROL"
}
```

### **Vehicle Types**
```
- TWO_WHEELER: Motorcycles, Scooters, Bikes
- THREE_WHEELER: Auto Rickshaws, Tuk-Tuks
- FOUR_WHEELER: Cars, Sedans, Hatchbacks
- SUV: Sport Utility Vehicles
- VAN: Minivans, Cargo Vans
- TRUCK: Light/Medium Commercial
- HEAVY_VEHICLE: Buses, Heavy Trucks
```

### **Update Vehicle**
```http
PATCH /vehicles/{id}/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "color": "Red"
}

Response: 200 OK
```

### **Delete Vehicle**
```http
DELETE /vehicles/{id}/
Authorization: Bearer <access_token>

Response: 204 No Content
```

---

## 🛠️ Service Requests

### **Create Service Request**
```http
POST /service-requests/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "service_type": "TOWING",
  "vehicle_id": 1,
  "latitude": 19.0760,
  "longitude": 72.8777,
  "customer_notes": "Car won't start, need towing to nearest garage"
}

Response: 201 Created
{
  "id": 1,
  "service_type": "TOWING",
  "status": "PENDING_DISPATCH",
  "vehicle": {
    "id": 1,
    "license_plate": "MH01AB1234",
    "vehicle_type": "FOUR_WHEELER"
  },
  "latitude": 19.0760,
  "longitude": 72.8777,
  "created_at": "2026-01-17T10:30:00Z"
}
```

### **Service Types**
```
- TOWING: Emergency vehicle towing
- JUMPSTART: Battery jump start
- TIRE_CHANGE: Flat tire replacement
- FUEL_DELIVERY: Emergency fuel delivery
- LOCKOUT: Key locked inside vehicle
- GENERAL: General on-site repair
```

### **List Service Requests**
```http
GET /service-requests/
Authorization: Bearer <access_token>

Query Parameters:
- status: Filter by status (PENDING_DISPATCH, DISPATCHED, etc.)
- limit: Number of results (default: 20)
- offset: Pagination offset

Response: 200 OK
{
  "count": 10,
  "results": [
    {
      "id": 1,
      "service_type": "TOWING",
      "status": "COMPLETED",
      "total_amount": 450.00,
      "created_at": "2026-01-17T10:30:00Z"
    }
  ]
}
```

### **Get Service Request Details**
```http
GET /service-requests/{id}/
Authorization: Bearer <access_token>

Response: 200 OK
{
  "id": 1,
  "service_type": "TOWING",
  "status": "COMPLETED",
  "vehicle": {...},
  "provider": {...},
  "total_amount": 450.00,
  "created_at": "2026-01-17T10:30:00Z",
  "completed_at": "2026-01-17T11:15:00Z"
}
```

### **Update Service Request**
```http
PATCH /service-requests/{id}/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "CANCELLED"
}

Response: 200 OK
```

---

## 💰 Pricing

### **Get Pricing Quote**
```http
POST /pricing/quote/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "service_type": "TOWING",
  "vehicle_type": "SUV",
  "customer_lat": 19.0760,
  "customer_lng": 72.8777,
  "provider_lat": 19.0896,
  "provider_lng": 72.8656
}

Response: 200 OK
{
  "base_price": 500.00,
  "distance_km": 2.5,
  "distance_charge": 37.50,
  "surge_multiplier": 1.0,
  "subtotal": 537.50,
  "discount": 0.00,
  "tax": 96.75,
  "total": 634.25,
  "vehicle_type": "SUV",
  "service_type": "TOWING",
  "breakdown": {
    "base": "₹500.00",
    "distance": "2.5 km × ₹15/km = ₹37.50",
    "tax": "18% GST = ₹96.75"
  }
}
```

### **Pricing Matrix**

| Service | 2W | 3W | 4W | SUV | Van | Truck | Heavy |
|---------|----|----|----|----|-----|-------|-------|
| Towing | ₹150 | ₹200 | ₹300 | ₹500 | ₹600 | ₹800 | ₹1,200 |
| Jumpstart | ₹80 | ₹100 | ₹150 | ₹250 | ₹300 | ₹400 | ₹600 |
| Tire Change | ₹100 | ₹120 | ₹200 | ₹350 | ₹400 | ₹500 | ₹800 |
| Fuel Delivery | ₹70 | ₹90 | ₹150 | ₹250 | ₹300 | ₹400 | ₹600 |
| Lockout | ₹120 | ₹150 | ₹250 | ₹400 | ₹450 | ₹550 | ₹800 |
| General | ₹100 | ₹130 | ₹250 | ₹400 | ₹450 | ₹600 | ₹1,000 |

---

## 💳 Payments

### **Create Payment Order**
```http
POST /payments/create-order/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "service_request_id": 1,
  "amount": 634.25
}

Response: 200 OK
{
  "order_id": "order_MxYz123456",
  "amount": 634.25,
  "currency": "INR",
  "razorpay_key": "rzp_test_..."
}
```

### **Verify Payment**
```http
POST /payments/verify/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "razorpay_order_id": "order_MxYz123456",
  "razorpay_payment_id": "pay_MxYz123456",
  "razorpay_signature": "abc123..."
}

Response: 200 OK
{
  "status": "success",
  "message": "Payment verified successfully"
}
```

### **Payment History**
```http
GET /payments/history/
Authorization: Bearer <access_token>

Response: 200 OK
{
  "payments": [
    {
      "id": 1,
      "amount": 634.25,
      "status": "SUCCESS",
      "service_request": 1,
      "created_at": "2026-01-17T11:15:00Z"
    }
  ]
}
```

---

## 💬 Chat

### **Get Messages**
```http
GET /chat/?request_id=1
Authorization: Bearer <access_token>

Response: 200 OK
{
  "messages": [
    {
      "id": 1,
      "sender": "customer",
      "message": "On my way!",
      "timestamp": "2026-01-17T10:35:00Z"
    }
  ]
}
```

### **Send Message**
```http
POST /chat/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "request_id": 1,
  "message": "I'll be there in 10 minutes"
}

Response: 201 Created
{
  "id": 2,
  "sender": "provider",
  "message": "I'll be there in 10 minutes",
  "timestamp": "2026-01-17T10:36:00Z"
}
```

---

## 📊 Provider Analytics

### **Get Analytics**
```http
GET /providers/analytics/
Authorization: Bearer <access_token>

Response: 200 OK
{
  "total_earnings": 15000.00,
  "today_earnings": 1200.00,
  "week_earnings": 5600.00,
  "month_earnings": 15000.00,
  "completed_jobs": 45,
  "average_rating": 4.8,
  "acceptance_rate": 98,
  "completion_rate": 95,
  "weekly_chart": [
    {"day": "Mon", "earnings": 800},
    {"day": "Tue", "earnings": 1200},
    ...
  ],
  "top_services": [
    {"service": "TOWING", "count": 20, "revenue": 8000},
    {"service": "JUMPSTART", "count": 15, "revenue": 3000}
  ]
}
```

### **Upload Document**
```http
POST /providers/documents/upload/
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

document_type: DRIVING_LICENSE
file: <binary>

Response: 201 Created
{
  "id": 1,
  "document_type": "DRIVING_LICENSE",
  "status": "PENDING",
  "uploaded_at": "2026-01-17T10:00:00Z"
}
```

---

## 📦 Subscriptions

### **Get Current Plan**
```http
GET /subscriptions/current/
Authorization: Bearer <access_token>

Response: 200 OK
{
  "plan": "PREMIUM",
  "status": "ACTIVE",
  "expires_at": "2026-02-17T00:00:00Z",
  "features": [
    "25% discount on all services",
    "Priority support",
    "Free cancellation"
  ]
}
```

### **Subscribe to Plan**
```http
POST /subscriptions/subscribe/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "plan": "PREMIUM"
}

Response: 200 OK
{
  "plan": "PREMIUM",
  "status": "ACTIVE",
  "expires_at": "2026-02-17T00:00:00Z"
}
```

---

## 🔍 Error Responses

### **400 Bad Request**
```json
{
  "error": "Invalid request",
  "details": {
    "vehicle_type": ["This field is required"]
  }
}
```

### **401 Unauthorized**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### **404 Not Found**
```json
{
  "detail": "Not found."
}
```

### **500 Internal Server Error**
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## 📚 Additional Resources

- **Swagger UI**: http://localhost:8001/api/schema/swagger-ui/
- **ReDoc**: http://localhost:8001/api/schema/redoc/
- **Vehicle Types**: [VEHICLE_TYPES.md](VEHICLE_TYPES.md)
- **Deployment**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

**Last Updated**: January 17, 2026  
**API Version**: v1  
**Base URL**: http://localhost:8001/api/v1
