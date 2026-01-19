import os
from pathlib import Path
import environ

# Initialize environment variables
env = environ.Env(
    DEBUG=(bool, False)
)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Load .env.dev if it exists, but don't fail if it doesn't (we'll override critical settings)
DOT_ENV_FILE = BASE_DIR / ".env.dev"
if os.path.exists(DOT_ENV_FILE):
    environ.Env.read_env(str(DOT_ENV_FILE))

from .base import *

# Override Database to use SQLite
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# Override Cache to use Local Memory (avoid Redis in tests)
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "unique-snowflake",
    }
}

# Disable Celery for tests
CELERY_BROKER_URL = "memory://"
CELERY_RESULT_BACKEND = "db+sqlite:///results.sqlite"

# Use in-memory channel layer for tests
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer",
    },
}

# Ensure SECRET_KEY is set if not loaded from env
if not hasattr(locals(), "SECRET_KEY") or not SECRET_KEY:
    SECRET_KEY = "test-secret-key"
