
---

## Web Admin Features

**Base URL**: `http://localhost:3000`  
**Tech Stack**: Next.js 15.1.0, React 19, TypeScript, Tailwind CSS, Recharts

### 1. **Command Center** (`/dashboard`)
- **Features**:
  - **Real-time Operational Overview**:
    - Total revenue, active bookings, online providers
    - Growth metrics (revenue, user acquisition)
  - **Live Activity Feed**:
    - Recent bookings and status changes
    - System health indicators
  - **Visualizations**:
    - Revenue velocity trend (6-month history)
    - Booking volume charts

- **API Endpoints**:
  - `GET /services/admin/dashboard-stats/` - Aggregated platform metrics

### 2. **AI Monitor** (`/ai-monitor`)
- **Features**:
  - **AutoMind Analytics**:
    - Triage accuracy tracking vs human intervention
    - Autonomous booking success rates
    - Request load distribution (hourly heatmaps)
  - **Category Classification**:
    - AI-determined service type breakdown
    - Confidence score monitoring

- **API Endpoints**:
  - `GET /services/admin/ai-stats/` - Neural network performance metrics

### 3. **Subscription Analytics** (`/analytics`)
- **Features**:
  - **Revenue Intelligence**:
    - Monthly Recurring Revenue (MRR)
    - Active subscription counts
    - Plan popularity breakdown (Free vs Premium/Elite)
  - **Churn Prediction**:
    - Expiring subscriptions alert
    - Retention metrics

- **API Endpoints**:
  - `GET /services/subscriptions/analytics/` - SaaS metrics

### 4. **User & Booking Management**
- **Features**:
  - **User Directory**: List, search, and manage Bookers/Providers
  - **Booking Oversight**: Force-assign providers, cancel requests, view logs
  - **Provider Verification**: Approve/Reject provider documents

- **API Endpoints**:
  - `GET /users/` - User list (Admin flavored)
  - `GET /services/bookings/` - Global booking list

