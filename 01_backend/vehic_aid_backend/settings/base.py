import os
from pathlib import Path

import environ  # Requires django-environ

# Initialize environment variables
env = environ.Env(
    # Set casting, default value
    DEBUG=(bool, False)
)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# ----------------------------------------------------------------------
# CRITICAL FIX: Load environment variables from the .env.dev file
# This must happen before SECRET_KEY is accessed.
# ----------------------------------------------------------------------
DOT_ENV_FILE = BASE_DIR / ".env.dev"

if os.path.exists(DOT_ENV_FILE):
    environ.Env.read_env(str(DOT_ENV_FILE))
else:
    # Optional: Log an error if the .env.dev file is missing in development
    print("WARNING: .env.dev file not found. Ensure it is configured.")

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env("SECRET_KEY")  # This will now successfully load from the .env.dev file

# Core Applications
INSTALLED_APPS = [
    # Django Defaults
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-Party Apps
    "rest_framework",  # Django REST Framework
    "rest_framework_simplejwt",  # JWT Authentication
    "channels",  # Real-time WebSockets
    "django_filters",  # Advanced filtering for DRF
    "django_cleanup.apps.CleanupConfig",  # Cleans old files on model delete
    "django_celery_results",  # New: To store and view task results
    "django_celery_beat",  # New: To manage and schedule periodic tasks (Beat)
    "django_extensions",
    "corsheaders",  # CORS headers for web apps
    "auditlog",  # New: For detailed audit logging
    # Custom Vehic-Aid Apps
    "apps.users",
    "apps.services",
    "apps.payments",
    "apps.iot_devices",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # CORS - must be before CommonMiddleware
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.locale.LocaleMiddleware",  # Added for Multi-language support
    "django.middleware.common.CommonMiddleware",
    "debug_toolbar.middleware.DebugToolbarMiddleware",  # Added for debugging
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "vehic_aid_backend.middleware.plan_access.PlanAccessMiddleware",
    "auditlog.middleware.AuditlogMiddleware",
]

ROOT_URLCONF = "vehic_aid_backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "web_admin" / "templates"],  # For Admin/Helpline UI
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "vehic_aid_backend.wsgi.application"
ASGI_APPLICATION = "vehic_aid_backend.asgi.application"  # For Channels/WebSockets

# --- Authentication & Database ---

AUTH_USER_MODEL = "users.CustomUser"

# Use the env helper to read the database URL
DATABASES = {
    "default": env.db_url(
        "DATABASE_URL",
        default="sqlite:///db.sqlite3",
    )
}
# --- Password Validation ---
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# --- Internationalization & Timezone (Indian Market) ---

# Multilingual Support - English, Hindi, and Regional Languages
LANGUAGE_CODE = "en"  # Default language
TIME_ZONE = "Asia/Kolkata"  # IST
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Supported languages for Indian market
LANGUAGES = [
    ('en', 'English'),
    ('hi', 'हिन्दी (Hindi)'),
    ('ta', 'தமிழ் (Tamil)'),
    ('te', 'తెలుగు (Telugu)'),
    ('mr', 'मराठी (Marathi)'),
    ('bn', 'বাংলা (Bengali)'),
    ('gu', 'ગુજરાતી (Gujarati)'),
    ('kn', 'ಕನ್ನಡ (Kannada)'),
]

# Path for translation files
LOCALE_PATHS = [
    BASE_DIR / 'locale',
]

# Middleware for language detection
MIDDLEWARE.insert(2, 'django.middleware.locale.LocaleMiddleware')


# --- Static and Media Files ---
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "mediafiles"


# --- REST Framework Settings ---
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.LimitOffsetPagination",
    "PAGE_SIZE": 25,
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
        "rest_framework.throttling.ScopedRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "100/day",
        "user": "1000/day",
        "booking": "20/hour",  # Custom scope for booking security
    },
}

# --- Celery & Channels (Real-Time/Asynchronous) ---
# Message broker URL
CELERY_BROKER_URL = env("CELERY_BROKER_URL")
CELERY_RESULT_BACKEND = env("CELERY_RESULT_BACKEND", default=CELERY_BROKER_URL)
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"

# Channels Layer configuration (using Redis locally/in prod)
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.pubsub.RedisChannelLayer",
        "CONFIG": {
            # Uses the ENV variable set in the .env.dev file
            "hosts": [env("CHANNEL_REDIS_URL", default="redis://localhost:6379/1")],
        },
    },
}

# --- Custom Constants ---
VEHIC_AID_COMMISSION_RATE = 0.20  # 20% commission rate

# Payment Gateway (Razorpay/Stripe) Keys
RAZORPAY_KEY_ID = env("RAZORPAY_KEY_ID", default="key_id_default")
RAZORPAY_KEY_SECRET = env("RAZORPAY_KEY_SECRET", default="key_secret_default")

# Configures all models to use a BigAutoField (64-bit) for the primary key by default.
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
