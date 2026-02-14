# 🗺️ VehicAid Project Map

**Complete project structure, architecture, and execution guide**

> **🚗 Multi-Vehicle Platform**: Supports 7 vehicle types - Two Wheeler, Three Wheeler, Four Wheeler, SUV, Van, Truck, and Heavy Vehicle with dynamic pricing.
> **🧠 AutoMind Intelligence**: Unified AI engine (Groq-powered) that handles diagnostics, conversational booking, and 24/7 automotive support.

---

## 📁 Project Structure

```
vehic-aid-project/
├── backend/                          # Django REST API (Standardized Port: 8001)
│   ├── apps/
│   │   ├── users/                    # User management & authentication
│   │   ├── services/                 # Service requests & AutoMind Triage
│   │   │   ├── ai_triage.py          # Groq-powered Intelligence
│   │   │   ├── agent_logic.py        # Autonomous Booking Coordinator
│   │   │   ├── public_stats_view.py  # Real-time Public Statistics
│   │   │   ├── utils/
│   │   │   │   ├── email_utils.py    # Email notifications
│   │   │   │   └── sms_utils.py      # SMS notifications
│   │   │   ├── signals.py            # Auto notifications
│   │   └── payments/                 # Payment processing (Razorpay)
│   ├── requirements.txt              # Standardized Dependencies (Groq integrated)
│   └── .env                          # Environment variables (Sanitized)
│
├── web/                              # Next.js Web Applications
│   ├── admin/                        # Admin Dashboard (Port: 3000)
│   │   ├── app/dashboard/            # Platform oversight
│   │   └── components/               # Professional Shadcn UI
│   │
│   ├── provider/                     # Provider Dashboard (Port: 3001)
│   │   ├── app/dashboard/            # Live job feed & KPIs
│   │   ├── app/earnings/             # Direct payout management
│   │   ├── app/analytics/            # Performance metrics
│   │   └── app/history/              # Completed jobs
│   │
│   └── booker/                       # Customer Portal (Port: 3003)
│       ├── app/                      # 18+ feature pages
│       │   ├── automind/             # AI Conversational Gateway
│       │   ├── dashboard/            # User dashboard with KPIs
│       │   ├── book/                 # Multi-step booking wizard
│       │   ├── history/              # Service history
│       │   ├── vehicles/             # Garage management (7 types)
│       │   ├── subscription/         # Plan management
│       │   ├── wallet/               # Wallet & transactions
│       │   ├── exchange/             # Vehicle marketplace
│       │   ├── health/               # IoT diagnostics
│       │   └── ...                   # 10+ more features
│       └── components/               # Reusable UI components
│
├── mobile/                           # Mobile Applications (Postponed)
│   └── [Cleared to focus on Web completion]
│
├── infrastructure/                   # Infrastructure & DevOps
│   ├── launch.ps1                    # Universal System Launcher
│   ├── docker-compose.yml            # Container Orchestration
│   └── k8s/                          # Production Scalability
│
├── docs/                             # Documentation
│   ├── COMPLETE_DOCUMENTATION.md     # Master Reference
│   ├── WEB_APPLICATIONS_FEATURES.md  # Detailed Web Features (NEW)
│   └── ...                           # API, Deployment, Setup guides
│
├── README.md                         # Main documentation
└── PROJECT_MAP.md                    # This file (AutoMind Ready)
```

---

## 🏗️ Architecture Overview

### **Intelligence Layer (AutoMind)**
VehicAid uses a multi-layered intelligence strategy:
1.  **Groq (Llama 3.3)**: Primary real-time conversational processing.
2.  **Autonomous Agent**: Directly manages DB transactions and dispatching.
3.  **Keyword Fallback**: Guaranteed availability even if external APIs fail.

---

## 🚀 Execution Commands

### **Universal Launcher**
```powershell
# Start the entire ecosystem (Backend + 3 Web Apps)
.\Launch_VehicAid.bat
```

### **Access Applications**
- **AutoMind Gateway**: http://localhost:3003/automind
- **Admin Command**: http://localhost:3000
- **Provider Hub**: http://localhost:3001
- **API Portal**: http://localhost:8001/api/v1

---

**Last Updated**: January 20, 2026  
**Version**: 2.5.0  
**Status**: AutoMind Integrated ✅
