# Vehic-Aid Project Map (Runmap)

## 🗺️ Project Architecture
The project is organized into logical layers for clarity and scalability.

### 🏛️ 1. Core Services (Backend)
- **`backend/`**: Django REST API, WebSockets (Daphne), Celery Workers.
- **`iot-firmware/`**: Embedded logic for vehicle telemetry ingestion.

### 🌐 2. Web Interfaces (Next.js)
- **`web-booker/`**: Customer interface for requesting assistance.
- **`web-provider/`**: Provider dashboard for receiving/managing jobs.
- **`web-admin-panel/`**: Centralized management and monitoring console.

### 📱 3. Mobile Applications (Expo)
- **`mobile-booker/`**: Cross-platform customer app (Phase 2).
- **`mobile-provider/`**: Cross-platform provider app (Phase 2).

### 🛠️ 4. Support & Infrastructure
- **`(a)_infrastructure/`**: Production deployment configs (AWS/Docker/Render).
- **`(b)_scripts/`**: Development automation, setup, and sync scripts.
- **`(c)_tests/`**: Integration and unit tests for backend and mobile.
- **`docs/`**: Comprehensive guides (Deployment, Developer, Integration).

## 🚀 Execution Streams
- **Development**: Use `(b)_scripts/start-dev.ps1` to launch local stack.
- **Orchestration**: `docker-compose.yml` manages the full local containerized ecosystem.
- **Verification**: `docs/verification_report.md` tracks the latest health checks.

## 🏁 Roadmap
Refer to **`ROADMAP.md`** for Phase-specific progress tracking.

---
*Generated: 2026-01-04*
