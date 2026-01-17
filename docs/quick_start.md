# 🚀 VehicAid - Quick Start Guide

**Get VehicAid running in 5 minutes!**

---

## ⚡ Prerequisites

- Docker Desktop installed
- Git installed
- 5 minutes of your time

---

## 🎯 Quick Deploy (Recommended)

### **Step 1: Clone Repository**
```bash
git clone https://github.com/srohithadithya/vehic-aid-project.git
cd vehic-aid-project
```

### **Step 2: Start All Services**
```bash
cd infrastructure
docker-compose up -d
```

### **Step 3: Access Applications**

| Application | URL | Credentials |
|-------------|-----|-------------|
| **Admin Panel** | http://localhost:3000 | admin_mobile / password123 |
| **Provider App** | http://localhost:3001 | provider@example.com / testpass123 |
| **Booker App** | http://localhost:3003 | customer@example.com / testpass123 |
| **Backend API** | http://localhost:8001 | - |
| **API Docs** | http://localhost:8001/api/schema/swagger-ui/ | - |

---

## 🚗 Supported Vehicles

VehicAid supports **7 vehicle types**:
- 🏍️ Two Wheeler (Bikes, Scooters)
- 🛺 Three Wheeler (Auto Rickshaws)
- 🚗 Four Wheeler (Cars, Sedans)
- 🚙 SUV (Sport Utility Vehicles)
- 🚐 Van (Minivans, Cargo Vans)
- 🚛 Truck (Commercial Vehicles)
- 🚌 Heavy Vehicle (Buses, Heavy Trucks)

**See**: [VEHICLE_TYPES.md](VEHICLE_TYPES.md) for complete pricing and details

---

## 📱 Features Available

### **For Customers**:
- ✅ Book roadside assistance (all vehicle types)
- ✅ Real-time tracking
- ✅ In-app chat with providers
- ✅ Payment processing
- ✅ Service history
- ✅ Vehicle management
- ✅ Subscription plans

### **For Providers**:
- ✅ Receive service requests
- ✅ In-app chat with customers
- ✅ Earnings analytics
- ✅ Document upload
- ✅ Performance tracking
- ✅ Multi-vehicle type support

### **For Admins**:
- ✅ Dashboard analytics
- ✅ User management
- ✅ Service monitoring
- ✅ Payment tracking
- ✅ Advanced reporting
- ✅ Email template management

---

## 🔧 Common Commands

### **View Logs**
```bash
docker-compose logs -f
```

### **Stop Services**
```bash
docker-compose down
```

### **Restart Services**
```bash
docker-compose restart
```

### **Clean Restart**
```bash
docker-compose down -v
docker-compose up -d
```

---

## 📚 Next Steps

1. **Explore Features**: Try booking a service
2. **Read Documentation**: Check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
3. **Vehicle Types**: See [VEHICLE_TYPES.md](VEHICLE_TYPES.md)
4. **API Integration**: Visit http://localhost:8001/api/schema/swagger-ui/
5. **Customize**: Update environment variables in `.env`

---

## 🆘 Need Help?

- **Full Guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Vehicle Info**: [VEHICLE_TYPES.md](VEHICLE_TYPES.md)
- **API Docs**: http://localhost:8001/api/schema/swagger-ui/
- **Issues**: https://github.com/srohithadithya/vehic-aid-project/issues

---

**Last Updated**: January 17, 2026  
**Version**: 2.0.0
