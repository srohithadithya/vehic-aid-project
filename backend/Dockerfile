# Use official Python runtime as a parent image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt requirements.txt
# Add a cache buster timestamp to FORCE re-installation
ARG CACHEBUST=20240105_v4_py312
RUN pip install --upgrade pip setuptools && \
    pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Ensure entrypoint is executable
RUN chmod +x /app/entrypoint.sh

# Collect static files
RUN python manage.py collectstatic --noinput || true

# Expose port
EXPOSE 8000

# Run daphne for ASGI support (WebSockets)
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "vehic_aid_backend.asgi:application"]
