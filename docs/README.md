# 📚 VehicAid Documentation

**Complete documentation for the VehicAid platform**

---

## 📋 Quick Navigation

### **Getting Started**
- 🚀 [Quick Start Guide](quick_start.md) - Get running in 5 minutes
- 📖 [Deployment Guide](DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- 🆓 [Free Deploy Guide](FREE_DEPLOY_GUIDE.md) - Deploy using free services

### **Features & Capabilities**
- 🚗 [Vehicle Types Guide](VEHICLE_TYPES.md) - All 7 vehicle types, pricing, and implementation
- 📡 [API Reference](API_REFERENCE.md) - Complete REST API documentation
- 🔔 [Notifications Quick Reference](NOTIFICATIONS_QUICK_REFERENCE.md) - Email & SMS setup

### **Setup Guides**
- 📧 [SMTP Setup](SMTP_SETUP.md) - Email configuration (Gmail)
- 📱 [Free SMS Setup](FREE_SMS_SETUP.md) - SMS configuration (Fast2SMS)
- 🔗 [Integration Guide](INTEGRATION_GUIDE.md) - Third-party integrations

---

## 🚗 Supported Vehicle Types

VehicAid supports **7 comprehensive vehicle categories**:

| Type | Icon | Examples | Base Price | Per KM |
|------|------|----------|------------|--------|
| Two Wheeler | 🏍️ | Bikes, Scooters | ₹70-₹150 | ₹5/km |
| Three Wheeler | 🛺 | Auto Rickshaws | ₹90-₹200 | ₹6/km |
| Four Wheeler | 🚗 | Cars, Sedans | ₹150-₹300 | ₹10/km |
| SUV | 🚙 | Sport Utility | ₹250-₹500 | ₹15/km |
| Van | 🚐 | Minivans, Cargo | ₹300-₹600 | ₹18/km |
| Truck | 🚛 | Commercial | ₹400-₹800 | ₹25/km |
| Heavy Vehicle | 🚌 | Buses, Heavy Trucks | ₹600-₹1,200 | ₹35/km |

**Details**: See [VEHICLE_TYPES.md](VEHICLE_TYPES.md)

---

## 🎯 Documentation by User Type

### **For New Users**
1. Start with [Quick Start Guide](quick_start.md)
2. Review [Vehicle Types](VEHICLE_TYPES.md)
3. Check [Deployment Guide](DEPLOYMENT_GUIDE.md)

### **For Developers**
1. Read [API Reference](API_REFERENCE.md)
2. Review [Integration Guide](INTEGRATION_GUIDE.md)
3. Check [Deployment Guide](DEPLOYMENT_GUIDE.md)

### **For DevOps**
1. Start with [Deployment Guide](DEPLOYMENT_GUIDE.md)
2. Review [Free Deploy Guide](FREE_DEPLOY_GUIDE.md)
3. Set up [SMTP](SMTP_SETUP.md) and [SMS](FREE_SMS_SETUP.md)

### **For Business Users**
1. Review [Vehicle Types & Pricing](VEHICLE_TYPES.md)
2. Check [API Reference](API_REFERENCE.md) for capabilities
3. See [Integration Guide](INTEGRATION_GUIDE.md) for partnerships

---

## 📖 Documentation Files

### **Core Documentation**
- **[Quick Start](quick_start.md)** - 5-minute setup guide
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Complete deployment (Docker, Development, Production)
- **[Vehicle Types](VEHICLE_TYPES.md)** - All vehicle types, pricing matrix, implementation
- **[API Reference](API_REFERENCE.md)** - Complete REST API documentation

### **Setup Guides**
- **[SMTP Setup](SMTP_SETUP.md)** - Gmail email configuration
- **[Free SMS Setup](FREE_SMS_SETUP.md)** - Fast2SMS configuration
- **[Free Deploy Guide](FREE_DEPLOY_GUIDE.md)** - Deploy with free services
- **[Integration Guide](INTEGRATION_GUIDE.md)** - Third-party integrations

### **Reference Guides**
- **[Notifications Quick Reference](NOTIFICATIONS_QUICK_REFERENCE.md)** - Email & SMS templates
- **[Integration](integration.md)** - Integration details

---

## 🚀 Quick Start

### **1. Clone & Deploy**
```bash
git clone https://github.com/srohithadithya/vehic-aid-project.git
cd vehic-aid-project/infrastructure
docker-compose up -d
```

### **2. Access Applications**
- Admin Panel: http://localhost:3000
- Provider App: http://localhost:3001
- Booker App: http://localhost:3003
- Backend API: http://localhost:8001
- API Docs: http://localhost:8001/api/schema/swagger-ui/

### **3. Default Credentials**
- Admin: `admin_mobile` / `password123`
- Customer: `customer@example.com` / `testpass123`
- Provider: `provider@example.com` / `testpass123`

---

## 💡 Key Features

### **Platform Capabilities**
- ✅ 7 vehicle types supported
- ✅ 6 service types (Towing, Jumpstart, Tire Change, Fuel, Lockout, General)
- ✅ Dynamic pricing based on vehicle type
- ✅ Real-time tracking & chat
- ✅ Payment processing (Razorpay)
- ✅ Email & SMS notifications
- ✅ Subscription plans
- ✅ Advanced analytics

### **Technical Stack**
- **Backend**: Django 4.2, PostgreSQL, Redis
- **Web**: Next.js 14, React 18, Tailwind CSS
- **Mobile**: React Native 0.72, Expo
- **Infrastructure**: Docker, Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus, Grafana

---

## 📊 API Overview

### **Base URL**
```
http://localhost:8001/api/v1
```

### **Key Endpoints**
- `/auth/register/` - User registration
- `/auth/login/` - User login
- `/vehicles/` - Vehicle management
- `/service-requests/` - Service bookings
- `/pricing/quote/` - Get pricing quote
- `/payments/create-order/` - Create payment
- `/chat/` - In-app messaging
- `/providers/analytics/` - Provider analytics

**Full Reference**: [API_REFERENCE.md](API_REFERENCE.md)

---

## 🔧 Configuration

### **Required Services**
- **Google Maps API** - Location & routing
- **Razorpay** - Payment processing (optional)
- **Gmail SMTP** - Email notifications (optional)
- **Fast2SMS** - SMS notifications (optional)

### **Setup Guides**
- Google Maps: [Deployment Guide](DEPLOYMENT_GUIDE.md#google-maps-setup)
- Email: [SMTP Setup](SMTP_SETUP.md)
- SMS: [Free SMS Setup](FREE_SMS_SETUP.md)
- Payments: [Deployment Guide](DEPLOYMENT_GUIDE.md#payment-gateway-setup)

---

## 🎓 Learning Path

### **Beginner**
1. ✅ [Quick Start](quick_start.md) - Get it running
2. ✅ [Vehicle Types](VEHICLE_TYPES.md) - Understand capabilities
3. ✅ [API Reference](API_REFERENCE.md) - Explore endpoints

### **Intermediate**
1. ✅ [Deployment Guide](DEPLOYMENT_GUIDE.md) - Production setup
2. ✅ [SMTP Setup](SMTP_SETUP.md) - Email notifications
3. ✅ [SMS Setup](FREE_SMS_SETUP.md) - SMS notifications

### **Advanced**
1. ✅ [Integration Guide](INTEGRATION_GUIDE.md) - Custom integrations
2. ✅ [Free Deploy Guide](FREE_DEPLOY_GUIDE.md) - Cost optimization
3. ✅ Kubernetes deployment (see infrastructure/)

---

## 📞 Support & Resources

### **Documentation**
- **This Folder**: Complete guides
- **Root README**: [../README.md](../README.md)
- **Project Map**: [../PROJECT_MAP.md](../PROJECT_MAP.md)
- **Roadmap**: [../ROADMAP.md](../ROADMAP.md)

### **API Documentation**
- **Swagger UI**: http://localhost:8001/api/schema/swagger-ui/
- **ReDoc**: http://localhost:8001/api/schema/redoc/
- **API Reference**: [API_REFERENCE.md](API_REFERENCE.md)

### **Community**
- **GitHub**: https://github.com/srohithadithya/vehic-aid-project
- **Issues**: https://github.com/srohithadithya/vehic-aid-project/issues
- **Discussions**: GitHub Discussions

---

## 🔄 Updates & Changelog

### **Version 2.0.0** (January 17, 2026)
- ✅ Added 7 vehicle types support
- ✅ Complete pricing matrix
- ✅ UI/UX for all vehicle types
- ✅ Comprehensive documentation
- ✅ API reference guide
- ✅ Vehicle types guide

### **Version 1.5.0** (January 2026)
- ✅ Mobile applications
- ✅ Real-time features
- ✅ Chat system
- ✅ Push notifications

---

## 📋 Documentation Checklist

### **Before Deployment**
- [ ] Read [Quick Start](quick_start.md)
- [ ] Review [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [ ] Configure [SMTP](SMTP_SETUP.md) (optional)
- [ ] Configure [SMS](FREE_SMS_SETUP.md) (optional)
- [ ] Review [Vehicle Types](VEHICLE_TYPES.md)

### **After Deployment**
- [ ] Test all vehicle types
- [ ] Verify API endpoints
- [ ] Check email notifications
- [ ] Test payment flow
- [ ] Review analytics

---

**Last Updated**: January 17, 2026  
**Version**: 2.0.0  
**Status**: Production Ready ✅
