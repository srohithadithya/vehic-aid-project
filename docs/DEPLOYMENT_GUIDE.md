# Deployment Guide

**Vehic-Aid System v2.0.0**
*Verified Jan 11, 2026*

This guide details how to deploy the entire Vehic-Aid stack (Backend, Web Apps, Mobile Apps).

---

## 🏗️ 1. Infrastructure (Backend + Web)

The most robust way to deploy the servers is using **Docker Compose**. This spins up:
-   **Backend** (Django API on Port 8000/8001)
-   **Database** (PostgreSQL on Port 5432)
-   **Redis** (Port 6379)
-   **Celery** & **Celery Beat** (Background Workers)
-   **Web Admin** (Port 3002)
-   **Web Booker** (Port 3000)
-   **Web Provider** (Port 3001)

### 🚀 Production Deployment Steps

1.  **Navigate to Infrastructure:**
    ```bash
    cd infrastructure
    ```

2.  **Start Services:**
    ```bash
    # This builds and starts all containers in detached mode
    docker-compose up --build -d
    ```

3.  **Verify Health:**
    -   **Backend API**: [http://localhost:8001/admin/](http://localhost:8001/admin/)
    -   **Web Admin**: [http://localhost:3002](http://localhost:3002)
    -   **Web Provider**: [http://localhost:3001](http://localhost:3001)
    -   **Web Booker**: [http://localhost:3000](http://localhost:3000)

### 🧹 Maintenance Commands
-   **Stop Services**: `docker-compose down`
-   **View Logs**: `docker-compose logs -f [service_name]` (e.g., `docker-compose logs -f web`)
-   **Rebuild Specific Service**: `docker-compose up -d --build web-admin`

---

## 📱 2. Mobile Applications

Mobile apps are built using **Expo**.

### Prerequisites
-   Node.js & npm installed.
-   Expo CLI (`npm install -g expo-cli`).
-   EAS CLI for APK builds (`npm install -g eas-cli`).

### A. Mobile Booker (`mobile-booker`)
1.  **Install Dependencies:**
    ```bash
    cd mobile-booker
    npm install
    ```
2.  **Run Locally (Emulator/Device):**
    ```bash
    npx expo start
    ```
    *Scan the QR code with Expo Go or press 'a' for Android Emulator.*

3.  **Build for Production (APK/AAB):**
    ```bash
    eas build --platform android --profile production
    ```

### B. Mobile Provider (`mobile-provider`)
1.  **Install Dependencies:**
    ```bash
    cd mobile-provider
    npm install
    ```
2.  **Run Locally:**
    ```bash
    npx expo start
    ```

3.  **Build for Production:**
    ```bash
    eas build --platform android --profile production
    ```

---

## ⚙️ 3. Environment Variables

### Backend (`.env`)
Ensure your production `infrastructure/docker-compose.yml` (or `.env` file) uses:
-   `DEBUG=False`
-   `ALLOWED_HOSTS=.yourdomain.com`
-   `CORS_ALLOWED_ORIGINS=https://yourdomain.com`

### Mobile Apps
To point mobile apps to a production server instead of localhost:
1.  Open `src/api/client.ts` in both mobile projects.
2.  Update `BASE_URL`:
    ```typescript
    // Replace with your production IP or Domain
    export const BASE_URL = 'https://api.yourdomain.com/api/v1'; 
    ```

---

## ✅ Deployment Checklist
- [x] **Docker Build**: Verified all web apps compile (`npm run build`).
- [x] **Mobile Deps**: Verified `expo-linear-gradient` and other native modules.
- [x] **Config**: `docker-compose.yml` configured for all services.
- [ ] **SSL**: Configure Nginx/Traefik for SSL termination (Recommended for public launch).
