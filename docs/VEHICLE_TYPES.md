# 🚗 VehicAid - Vehicle Types Guide

**Complete guide to supported vehicle types, pricing, and implementation**

---

## 📋 Table of Contents
1. [Supported Vehicle Types](#supported-vehicle-types)
2. [Pricing Structure](#pricing-structure)
3. [Implementation Details](#implementation-details)
4. [UI/UX Components](#uiux-components)
5. [API Integration](#api-integration)

---

## 🚗 Supported Vehicle Types

VehicAid supports **7 comprehensive vehicle categories** covering all types of vehicles on the road:

### **1. Two Wheeler (🏍️)**
- **Code**: `TWO_WHEELER`
- **Examples**: Motorcycles, Scooters, Bikes
- **Market Share**: ~70% in India
- **Base Price Range**: ₹70 - ₹150
- **Per KM Rate**: ₹5/km

### **2. Three Wheeler (🛺)**
- **Code**: `THREE_WHEELER`
- **Examples**: Auto Rickshaws, Tuk-Tuks
- **Market Share**: ~5% in India
- **Base Price Range**: ₹90 - ₹200
- **Per KM Rate**: ₹6/km

### **3. Four Wheeler (🚗)**
- **Code**: `FOUR_WHEELER`
- **Examples**: Cars, Sedans, Hatchbacks
- **Market Share**: ~20% in India
- **Base Price Range**: ₹150 - ₹300
- **Per KM Rate**: ₹10/km

### **4. SUV (🚙)**
- **Code**: `SUV`
- **Examples**: Sport Utility Vehicles, Crossovers
- **Market Share**: ~3% in India
- **Base Price Range**: ₹250 - ₹500
- **Per KM Rate**: ₹15/km

### **5. Van (🚐)**
- **Code**: `VAN`
- **Examples**: Minivans, Cargo Vans, Passenger Vans
- **Market Share**: ~1% in India
- **Base Price Range**: ₹300 - ₹600
- **Per KM Rate**: ₹18/km

### **6. Truck (🚛)**
- **Code**: `TRUCK`
- **Examples**: Light/Medium Commercial Vehicles
- **Market Share**: ~1% in India
- **Base Price Range**: ₹400 - ₹800
- **Per KM Rate**: ₹25/km

### **7. Heavy Vehicle (🚌)**
- **Code**: `HEAVY_VEHICLE`
- **Examples**: Buses, Heavy Trucks, Construction Vehicles
- **Market Share**: <1% in India
- **Base Price Range**: ₹600 - ₹1,200
- **Per KM Rate**: ₹35/km

---

## 💰 Pricing Structure

### **Complete Pricing Matrix**

| Service Type | 2W | 3W | 4W | SUV | Van | Truck | Heavy |
|--------------|----|----|----|----|-----|-------|-------|
| **Towing** | ₹150 | ₹200 | ₹300 | ₹500 | ₹600 | ₹800 | ₹1,200 |
| **Jumpstart** | ₹80 | ₹100 | ₹150 | ₹250 | ₹300 | ₹400 | ₹600 |
| **Tire Change** | ₹100 | ₹120 | ₹200 | ₹350 | ₹400 | ₹500 | ₹800 |
| **Fuel Delivery** | ₹70 | ₹90 | ₹150 | ₹250 | ₹300 | ₹400 | ₹600 |
| **Lockout** | ₹120 | ₹150 | ₹250 | ₹400 | ₹450 | ₹550 | ₹800 |
| **General** | ₹100 | ₹130 | ₹250 | ₹400 | ₹450 | ₹600 | ₹1,000 |

### **Distance Charges**

| Vehicle Type | Per KM Rate |
|--------------|-------------|
| Two Wheeler | ₹5 |
| Three Wheeler | ₹6 |
| Four Wheeler | ₹10 |
| SUV | ₹15 |
| Van | ₹18 |
| Truck | ₹25 |
| Heavy Vehicle | ₹35 |

### **Pricing Calculation Formula**

```
Total Price = Base Price + (Distance × Per KM Rate) + Surge + Taxes - Discount

Where:
- Base Price: From pricing matrix above
- Distance: Calculated via Google Maps API
- Surge: 20% during peak hours (8-10 AM, 6-9 PM weekdays)
- Taxes: 18% GST
- Discount: 15-25% for subscription members
```

### **Example Calculations**

**Example 1: Two Wheeler Towing (10 km)**
```
Base Price: ₹150
Distance: 10 km × ₹5 = ₹50
Subtotal: ₹200
Tax (18%): ₹36
Total: ₹236
```

**Example 2: SUV Towing (10 km) with Premium Subscription**
```
Base Price: ₹500
Distance: 10 km × ₹15 = ₹150
Subtotal: ₹650
Discount (25%): -₹162.50
After Discount: ₹487.50
Tax (18%): ₹87.75
Total: ₹575.25
```

**Example 3: Heavy Vehicle Towing (10 km) during Peak Hours**
```
Base Price: ₹1,200
Distance: 10 km × ₹35 = ₹350
Subtotal: ₹1,550
Surge (20%): ₹310
After Surge: ₹1,860
Tax (18%): ₹334.80
Total: ₹2,194.80
```

---

## 🔧 Implementation Details

### **Backend Model**

**File**: `backend/apps/services/models.py`

```python
VEHICLE_TYPE_CHOICES = [
    ("TWO_WHEELER", "Two Wheeler (Bike/Scooter)"),
    ("THREE_WHEELER", "Three Wheeler (Auto Rickshaw)"),
    ("FOUR_WHEELER", "Four Wheeler (Car/Sedan/Hatchback)"),
    ("SUV", "SUV (Sport Utility Vehicle)"),
    ("VAN", "Van (Minivan/Cargo Van)"),
    ("TRUCK", "Truck (Light/Medium Commercial)"),
    ("HEAVY_VEHICLE", "Heavy Vehicle (Bus/Heavy Truck)"),
]

vehicle_type = models.CharField(
    max_length=20, 
    choices=VEHICLE_TYPE_CHOICES, 
    default="FOUR_WHEELER",
    help_text="Type of vehicle for appropriate service and pricing"
)
```

### **Pricing Service**

**File**: `backend/apps/services/services/pricing.py`

All 7 vehicle types are configured with:
- Base prices for 6 service types
- Per-kilometer rates
- Subscription discounts
- Peak hour surge pricing

### **Database Migration**

**File**: `backend/apps/services/migrations/0014_add_all_vehicle_types.py`

Migration automatically updates existing vehicles to new schema.

---

## 🎨 UI/UX Components

### **Web Booker - Vehicle Selection**

**File**: `web/booker/app/vehicles/page.tsx`

**Features**:
- Visual grid selector (4 columns on desktop)
- Large icons with labels and descriptions
- Selected state highlighting
- Responsive design

**Usage**:
```tsx
const vehicleTypes = [
  { value: 'TWO_WHEELER', label: 'Two Wheeler', icon: '🏍️', desc: 'Bike/Scooter' },
  // ... all 7 types
];
```

### **Mobile Booker - Vehicle Type Selector**

**File**: `mobile-booker/src/components/VehicleTypeSelector.tsx`

**Features**:
- Horizontal scrollable cards
- Touch-friendly design (120px wide cards)
- Selected state with blue border
- Smooth animations

**Usage**:
```tsx
<VehicleTypeSelector 
  value={selectedType} 
  onChange={setSelectedType} 
/>
```

### **Mobile Provider - Vehicle Capabilities**

**File**: `mobile-provider/src/screens/VehicleCapabilitiesScreen.tsx`

**Features**:
- Multi-select grid (2 columns)
- Checkmark indicators
- Selected count display
- Info card with instructions

**Usage**:
Providers can select multiple vehicle types they can service.

---

## 🔌 API Integration

### **Vehicle Endpoints**

#### **List Vehicles**
```http
GET /api/v1/vehicles/
Authorization: Bearer <token>

Response:
{
  "vehicles": [
    {
      "id": 1,
      "license_plate": "MH01AB1234",
      "make": "Honda",
      "model": "Activa",
      "vehicle_type": "TWO_WHEELER",
      "year": 2020
    }
  ]
}
```

#### **Create Vehicle**
```http
POST /api/v1/vehicles/
Authorization: Bearer <token>
Content-Type: application/json

{
  "license_plate": "MH01AB1234",
  "make": "Honda",
  "model": "Activa",
  "vehicle_type": "TWO_WHEELER",
  "year": 2020,
  "color": "Black"
}
```

#### **Get Pricing Quote**
```http
POST /api/v1/pricing/quote/
Authorization: Bearer <token>
Content-Type: application/json

{
  "service_type": "TOWING",
  "vehicle_type": "SUV",
  "customer_lat": 19.0760,
  "customer_lng": 72.8777,
  "provider_lat": 19.0896,
  "provider_lng": 72.8656
}

Response:
{
  "base_price": 500.00,
  "distance_km": 2.5,
  "distance_charge": 37.50,
  "subtotal": 537.50,
  "tax": 96.75,
  "total": 634.25,
  "vehicle_type": "SUV",
  "service_type": "TOWING"
}
```

---

## 📊 Analytics & Reporting

### **Vehicle Type Distribution**

Track service requests by vehicle type:
```sql
SELECT 
  vehicle_type,
  COUNT(*) as request_count,
  AVG(total_amount) as avg_price
FROM services_servicerequest
GROUP BY vehicle_type
ORDER BY request_count DESC;
```

### **Revenue by Vehicle Type**

```sql
SELECT 
  vehicle_type,
  SUM(total_amount) as total_revenue,
  COUNT(*) as service_count
FROM services_servicerequest
WHERE status = 'COMPLETED'
GROUP BY vehicle_type;
```

---

## 🎯 Best Practices

### **For Customers**
1. **Select Correct Type**: Choose the right vehicle type for accurate pricing
2. **Add Multiple Vehicles**: Save all your vehicles for quick booking
3. **Update Details**: Keep vehicle information current

### **For Providers**
1. **Select Capabilities**: Only select vehicle types you can service
2. **Proper Equipment**: Ensure you have tools for selected types
3. **Pricing Awareness**: Understand pricing for each vehicle type

### **For Admins**
1. **Monitor Distribution**: Track which vehicle types are most common
2. **Adjust Pricing**: Update pricing based on market conditions
3. **Provider Matching**: Ensure adequate providers for all types

---

## 🔄 Future Enhancements

### **Planned Features**
- [ ] Electric vehicle category
- [ ] Luxury vehicle premium pricing
- [ ] Agricultural vehicle support
- [ ] Specialized equipment vehicles
- [ ] Dynamic pricing based on demand

---

## 📞 Support

For vehicle type related questions:
- **Documentation**: This guide
- **API Docs**: http://localhost:8001/api/schema/swagger-ui/
- **GitHub Issues**: https://github.com/srohithadithya/vehic-aid-project/issues

---

**Last Updated**: January 17, 2026  
**Version**: 2.0.0  
**Coverage**: 100% of vehicle market ✅
