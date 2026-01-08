from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Allows all hosts for local development
ALLOWED_HOSTS = ["*"]

# CORS settings for development
CORS_ALLOW_ALL_ORIGINS = True  # Allow all origins in development
CORS_ALLOW_CREDENTIALS = True

# Database configuration for local environment (typically Docker or local PostgreSQL)
# DATABASES is already configured via env.db() in base.py,
# ensuring local settings are read from the .env file.

# Optional: Add Django Debug Toolbar for development profiling
INSTALLED_APPS += [
    "debug_toolbar",
]

# Add WhiteNoise to serve static files
MIDDLEWARE.insert(1, "whitenoise.middleware.WhiteNoiseMiddleware")

# Debug Toolbar setup
MIDDLEWARE += [
    "debug_toolbar.middleware.DebugToolbarMiddleware",
]

INTERNAL_IPS = [
    "127.0.0.1",
]

# Set simple defaults for local broker/backend if not explicitly defined in .env
CELERY_BROKER_URL = env("CELERY_BROKER_URL", default="redis://localhost:6379/0")
CHANNEL_LAYERS["default"]["CONFIG"]["hosts"] = [
    env("CHANNEL_REDIS_URL", default="redis://localhost:6379/1")
]


# Static files configuration for development
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Fix for "Unable to configure handler 'mail_admins'"
ADMINS = [("Admin", "admin@localhost")]

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# Use SQLite for local debugging

# Use the env helper to read the database URL
# ensuring local settings are read from the .env file.
# DATABASES = {
#     "default": env.db_url("DATABASE_URL")
# }

