# VehicAid - Requirements Specification

## System Requirements

### Hardware Requirements

#### Development Environment
- **Processor**: Intel i5 / AMD Ryzen 5 or better
- **RAM**: Minimum 8GB (16GB recommended)
- **Storage**: 20GB free space (SSD recommended)
- **Network**: Stable internet connection for API calls

#### Production Server (Minimum)
- **CPU**: 2 vCPUs
- **RAM**: 4GB
- **Storage**: 50GB SSD
- **Bandwidth**: 100GB/month

#### Production Server (Recommended)
- **CPU**: 4 vCPUs
- **RAM**: 8GB
- **Storage**: 100GB SSD
- **Bandwidth**: 500GB/month

### Software Requirements

#### Backend Development
```
Operating System:
- Windows 10/11
- macOS 11+
- Ubuntu 20.04+ / Debian 11+

Required Software:
- Python 3.11 or 3.12
- PostgreSQL 14+
- Redis 7+
- Git 2.30+

Optional:
- Docker Desktop 4.0+
- Docker Compose 2.0+
- pgAdmin 4 (database management)
- Redis Commander (Redis GUI)
```

#### Frontend Development
```
Required:
- Node.js 20.x LTS
- npm 10.x or yarn 1.22+
- Git 2.30+

Recommended:
- VS Code with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features
```

#### Mobile Development
```
Required:
- Node.js 20.x
- Expo CLI 52+
- Android Studio (for Android development)
- Xcode 14+ (for iOS development, macOS only)

For Testing:
- Android Emulator or physical device
- iOS Simulator or physical device
```

---

## Python Dependencies

### Core Framework
```txt
Django==5.2.10
  Purpose: Web framework
  Why: Mature, secure, batteries-included framework with excellent ORM
  
djangorestframework==3.16.1
  Purpose: REST API framework
  Why: Industry standard for building APIs in Django
  
django-environ==0.12.0
  Purpose: Environment variable management
  Why: Secure configuration management, 12-factor app compliance
  
django-cors-headers==4.9.0
  Purpose: CORS handling
  Why: Enable cross-origin requests from frontend apps
```

### Authentication & Security
```txt
djangorestframework-simplejwt==5.5.1
  Purpose: JWT authentication
  Why: Stateless authentication for mobile/web apps
  
bcrypt==4.1.2
  Purpose: Password hashing
  Why: Secure password storage with adaptive hashing
  
cryptography>=42.0.0
  Purpose: Encryption utilities
  Why: Secure data encryption for sensitive information
  
django-auditlog==3.4.1
  Purpose: Model change tracking
  Why: Audit trail for compliance and debugging
```

### Real-time & Async
```txt
channels==4.3.2
  Purpose: WebSocket support
  Why: Real-time bidirectional communication
  
channels-redis==4.3.0
  Purpose: Channel layer backend
  Why: Redis-backed channel layer for production
  
celery==5.6.2
  Purpose: Distributed task queue
  Why: Asynchronous task processing, scheduled jobs
  
django-celery-results==2.6.0
  Purpose: Store Celery results in Django DB
  Why: Query task results from Django ORM
  
django-celery-beat==2.8.1
  Purpose: Periodic task scheduler
  Why: Database-backed periodic tasks
  
daphne==4.2.1
  Purpose: ASGI server
  Why: Production-ready server for Django Channels
  
redis==7.1.0
  Purpose: Redis client
  Why: Caching, session storage, message broker
  
django-redis==5.4.0
  Purpose: Django cache backend for Redis
  Why: Seamless Redis integration with Django cache framework
  
uvicorn[standard]==0.30.1
  Purpose: ASGI server (alternative to Daphne)
  Why: High-performance async server
```

### Database & Storage
```txt
psycopg2-binary==2.9.11
  Purpose: PostgreSQL adapter
  Why: Connect Django to PostgreSQL database
  
whitenoise==6.11.0
  Purpose: Static file serving
  Why: Efficient static file serving in production
  
django-cleanup==9.0.0
  Purpose: Automatic file cleanup
  Why: Delete orphaned files when models are deleted
  
django-storages[google,s3]==1.14.2
  Purpose: Cloud storage backends
  Why: Store media files on S3/GCS in production
  
boto3>=1.34.0
  Purpose: AWS SDK
  Why: S3 integration for file storage
  
botocore>=1.34.0
  Purpose: AWS core library
  Why: Required by boto3
  
s3transfer>=0.10.0
  Purpose: S3 transfer manager
  Why: Efficient file uploads to S3
```

### API & Documentation
```txt
django-filter==25.2
  Purpose: Filtering for DRF
  Why: Advanced query filtering in API endpoints
  
drf-spectacular==0.29.0
  Purpose: OpenAPI schema generation
  Why: Auto-generate API documentation
```

### External Integrations
```txt
razorpay>=1.4.1
  Purpose: Payment gateway SDK
  Why: Process payments via Razorpay
  
googlemaps==4.10.0
  Purpose: Google Maps API client
  Why: Distance calculation, geocoding, routing
  
firebase-admin==7.1.0
  Purpose: Firebase Admin SDK
  Why: Send push notifications via FCM
  
requests>=2.31.0
  Purpose: HTTP library
  Why: Make HTTP requests to external APIs
```

### Utilities
```txt
python-dateutil>=2.8.2
  Purpose: Date/time utilities
  Why: Advanced date parsing and manipulation
  
pytz>=2023.3
  Purpose: Timezone support
  Why: Handle timezones correctly
  
setuptools>=68.0.0
  Purpose: Package management
  Why: Install and manage Python packages
  
ujson>=5.10.0
  Purpose: Fast JSON parser
  Why: Performance optimization for JSON operations
  
gunicorn==22.0.0
  Purpose: WSGI server
  Why: Production-ready Python web server
  
pydantic>=2.7.0
  Purpose: Data validation
  Why: Type-safe data validation
  
Pillow>=10.3.0
  Purpose: Image processing
  Why: Handle image uploads, thumbnails
```

### Admin & Debugging
```txt
django-jazzmin==3.0.1
  Purpose: Modern admin interface
  Why: Better UX for Django admin panel
  
django-debug-toolbar>=4.4.6
  Purpose: Debug toolbar
  Why: Performance profiling, SQL query analysis
  
django-extensions>=3.2.3
  Purpose: Django extensions
  Why: Additional management commands, utilities
```

### Multilingual Support
```txt
django-parler==2.3
  Purpose: Model translations
  Why: Multi-language support for content
```

---

## Node.js Dependencies

### Core Framework (Next.js)
```json
{
  "next": "15.1.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0"
}

Purpose: React framework with SSR, routing, optimization
Why: Industry-standard for production React apps
```

### TypeScript
```json
{
  "typescript": "^5.0.0",
  "@types/node": "^20.0.0",
  "@types/react": "^19.0.0",
  "@types/react-dom": "^19.0.0"
}

Purpose: Type safety
Why: Catch errors at compile time, better IDE support
```

### Styling
```json
{
  "tailwindcss": "^3.4.0",
  "postcss": "^8.4.0",
  "autoprefixer": "^10.4.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.2.0"
}

Purpose: Utility-first CSS framework
Why: Rapid UI development, consistent design
```

### UI Components
```json
{
  "@radix-ui/react-*": "^1.0.0",
  "lucide-react": "^0.300.0",
  "framer-motion": "^11.0.0"
}

Purpose: Accessible components, icons, animations
Why: Production-ready, accessible, customizable
```

### Forms & Validation
```json
{
  "react-hook-form": "^7.49.0",
  "zod": "^3.22.0",
  "@hookform/resolvers": "^3.3.0"
}

Purpose: Form management, validation
Why: Type-safe forms with minimal re-renders
```

### HTTP Client
```json
{
  "axios": "^1.6.0"
}

Purpose: HTTP requests
Why: Promise-based, interceptors, better error handling
```

### State Management
```json
{
  "zustand": "^4.4.0"
}

Purpose: Global state management
Why: Simple, lightweight, no boilerplate
```

### Mobile (React Native)
```json
{
  "expo": "~52.0.0",
  "react-native": "0.76.5",
  "@react-navigation/native": "^7.0.0",
  "@react-navigation/stack": "^7.0.0",
  "expo-location": "~18.0.0",
  "expo-notifications": "~0.29.0"
}

Purpose: Mobile app framework
Why: Cross-platform, native performance, rich ecosystem
```

---

## External API Requirements

### 1. Google Maps Platform

**Required APIs**:
- Distance Matrix API
- Geocoding API
- Maps JavaScript API (optional, for map display)

**Setup**:
```bash
1. Go to https://console.cloud.google.com
2. Create a new project or select existing
3. Enable APIs:
   - Distance Matrix API
   - Geocoding API
4. Create credentials (API Key)
5. Restrict key to your domain/IP
6. Add to .env: GOOGLE_MAPS_API_KEY=your_key_here
```

**Pricing**:
- Distance Matrix: $5 per 1000 requests
- Geocoding: $5 per 1000 requests
- Free tier: $200 credit per month

**Usage in VehicAid**:
- Calculate distance between provider and customer
- Estimate travel time
- Geocode addresses

### 2. Razorpay

**Required**:
- Razorpay Account
- API Key ID
- API Key Secret

**Setup**:
```bash
1. Sign up at https://razorpay.com
2. Complete KYC verification
3. Go to Settings > API Keys
4. Generate Test/Live keys
5. Add to .env:
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=xxxxx
```

**Pricing**:
- 2% + GST per transaction
- No setup fee
- No annual maintenance

**Usage in VehicAid**:
- Process subscription payments
- Handle service payments
- Manage refunds

### 3. Firebase Cloud Messaging

**Required**:
- Firebase Project
- Service Account JSON

**Setup**:
```bash
1. Go to https://console.firebase.google.com
2. Create new project
3. Add Android/iOS apps
4. Download google-services.json (Android)
5. Download GoogleService-Info.plist (iOS)
6. Generate service account key:
   - Project Settings > Service Accounts
   - Generate new private key
7. Add to .env:
   FIREBASE_CREDENTIALS_PATH=/path/to/serviceAccountKey.json
```

**Pricing**:
- Free for unlimited messages

**Usage in VehicAid**:
- Send push notifications to mobile apps
- Real-time alerts for job assignments
- Status update notifications

### 4. SMS Gateway - Fast2SMS (Implemented ✅)

**Current Implementation**: Fast2SMS

**Setup**:
```bash
1. Sign up at https://www.fast2sms.com
2. Verify your account
3. Get API key from dashboard
4. Add to .env:
   FAST2SMS_API_KEY=your_api_key_here
   SMS_PROVIDER=fast2sms
```

**Pricing**:
- **Free Tier**: 50 SMS/day
- **Paid Plans**: Starting from ₹0.10 per SMS
- No setup fee
- Pay-as-you-go model

**Features Used**:
- Quick Route (route='q') for transactional messages
- 160 character limit per SMS
- 10-digit Indian mobile numbers
- JSON API

**Implementation Details**:
```python
# Location: backend/apps/services/utils/sms_utils.py

class Fast2SMSService:
    """Free SMS service using Fast2SMS (50 SMS/day free)"""
    
    def send_sms(self, phone_number, message):
        """
        Send SMS via Fast2SMS API
        
        Features:
        - Automatic phone number cleaning (+91 removal)
        - 10-digit validation
        - 160 character truncation
        - Timeout handling (10 seconds)
        """
        headers = {
            'authorization': self.api_key,
            'Content-Type': 'application/json'
        }
        
        payload = {
            'route': 'q',  # Quick route for transactional
            'message': message[:160],
            'language': 'english',
            'flash': 0,
            'numbers': phone_number
        }
        
        response = requests.post(
            'https://www.fast2sms.com/dev/bulkV2',
            json=payload,
            headers=headers,
            timeout=10
        )
```

**Usage in VehicAid**:
1. **OTP Verification**: Send OTP codes for user authentication
2. **Service Request Confirmation**: Notify when booking is received
3. **Provider Assignment**: Alert when provider is assigned
4. **Service Completion**: Confirmation when service is done
5. **Subscription Alerts**: Expiry reminders, renewal confirmations

**Testing**:
```bash
# Test SMS sending
python manage.py test_sms 9876543210 --message "Test from VehicAid"
```

**Message Templates**:
```python
# Service Request
"VehicAid: Request #42 received. Service: Towing. We'll notify you when assigned."

# Provider Assigned
"VehicAid: Provider John Doe assigned to request #42. They'll contact you soon."

# Service Completed
"VehicAid: Service request #42 completed! Thank you for using VehicAid."

# OTP
"Your VehicAid OTP: 123456. Valid for 10 min. Don't share."
```

**Rate Limiting**:
- Free tier: 50 SMS/day
- Recommended: Implement caching to avoid duplicate sends
- Current implementation: No duplicate prevention (to be added)

**Error Handling**:
```python
# Returns structured response
{
    'success': True/False,
    'message_id': 'xxx',  # if successful
    'error': 'error message'  # if failed
}
```

---

## Environment Variables

### Backend (.env)

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================
DATABASE_URL=postgresql://user:password@host:5432/dbname
DB_NAME=vehicaid
DB_USER=vehicaid_user
DB_PASSWORD=your_secure_password_here
DB_HOST=localhost
DB_PORT=5432

# ============================================
# DJANGO SETTINGS
# ============================================
SECRET_KEY=your-secret-key-min-50-characters-long
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,.onrender.com
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3003

# ============================================
# REDIS CONFIGURATION
# ============================================
REDIS_URL=redis://localhost:6379/1
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# ============================================
# EXTERNAL APIS
# ============================================
# Google Maps
GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Razorpay
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX

# Firebase
FIREBASE_CREDENTIALS_PATH=/path/to/serviceAccountKey.json

# SMS Gateway (Fast2SMS)
SMS_PROVIDER=fast2sms
FAST2SMS_API_KEY=your_fast2sms_api_key_here

# ============================================
# STORAGE (Production)
# ============================================
# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_STORAGE_BUCKET_NAME=vehicaid-media
AWS_S3_REGION_NAME=ap-south-1

# Or Google Cloud Storage
GS_BUCKET_NAME=vehicaid-media
GS_PROJECT_ID=your-project-id

# ============================================
# EMAIL (Optional)
# ============================================
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# ============================================
# SECURITY (Production)
# ============================================
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
SECURE_HSTS_SECONDS=31536000
```

### Frontend (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1

# Razorpay (Public Key)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXX

# Google Maps (if using in frontend)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Firebase (if using in web)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=vehicaid.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=vehicaid
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:xxxxx

# Build Configuration
GH_PAGES=false  # Set to true for GitHub Pages deployment
```

---

## Development Tools

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "ms-python.python",
    "ms-python.vscode-pylance",
    "ms-python.black-formatter",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-azuretools.vscode-docker",
    "eamodio.gitlens",
    "christian-kohler.path-intellisense",
    "formulahendry.auto-rename-tag",
    "dsznajder.es7-react-js-snippets"
  ]
}
```

### Recommended Browser Extensions

- **React Developer Tools**: Debug React components
- **Redux DevTools**: Debug state management
- **JSON Formatter**: Pretty-print JSON responses
- **Wappalyzer**: Identify technologies used

---

## Testing Requirements

### Backend Testing
```txt
pytest==7.4.0
  Purpose: Testing framework
  
pytest-django==4.5.2
  Purpose: Django integration for pytest
  
pytest-cov==4.1.0
  Purpose: Code coverage reporting
  
factory-boy==3.3.0
  Purpose: Test data generation
  
faker==19.3.0
  Purpose: Fake data generation
```

### Frontend Testing
```json
{
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^6.1.0",
  "jest": "^29.7.0",
  "jest-environment-jsdom": "^29.7.0"
}
```

---

## Performance Requirements

### Response Time
- API endpoints: < 200ms (p95)
- Page load: < 2s (initial)
- WebSocket latency: < 100ms

### Throughput
- Concurrent users: 1000+
- Requests per second: 100+
- WebSocket connections: 500+

### Availability
- Uptime: 99.9% (8.76 hours downtime/year)
- Recovery time: < 1 hour

---

## Security Requirements

### Authentication
- JWT with 15-minute access token expiry
- Refresh token rotation
- Password minimum 8 characters
- Rate limiting on auth endpoints

### Data Protection
- HTTPS only in production
- Encrypted database backups
- PII encryption at rest
- Secure session management

### Compliance
- GDPR-ready (data export, deletion)
- PCI DSS Level 1 (via Razorpay)
- ISO 27001 aligned

---

**Last Updated**: January 19, 2026
