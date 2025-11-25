# Vehic-Aid Production Deployment Checklist

## Pre-Deployment ✅

### Server Setup
- [ ] Ubuntu 22.04 LTS server provisioned
- [ ] Domain configured (vehicaid.com)
- [ ] SSL certificate obtained (Let's Encrypt)
- [ ] Firewall configured (UFW)
  ```bash
  sudo ufw allow 22/tcp
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  sudo ufw enable
  ```

### Dependencies Installation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python 3.11
sudo apt install python3.11 python3.11-venv python3-pip -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Redis
sudo apt install redis-server -y

# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

## Deployment Steps ✅

### 1. Project Setup
```bash
# Create project directory
sudo mkdir -p /var/www/vehic-aid
sudo chown $USER:$USER /var/www/vehic-aid
cd /var/www/vehic-aid

# Clone repository
git clone <your-repo-url> .

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Environment Configuration
```bash
# Copy production environment
cp .env.prod.template .env.prod

# Edit with production values
nano .env.prod
```

**Required Environment Variables:**
- DJANGO_SECRET_KEY (generate new: `python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'`)
- DB_PASSWORD (PostgreSQL password)
- ALLOWED_HOSTS (your domain)
- GOOGLE_MAPS_API_KEY
- RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET
- SMS_API_KEY

### 3. Database Setup
```bash
# Create PostgreSQL database
sudo -u postgres psql << EOF
CREATE DATABASE vehic_aid_prod;
CREATE USER vehic_aid_user WITH PASSWORD 'your_secure_password';
ALTER ROLE vehic_aid_user SET client_encoding TO 'utf8';
ALTER ROLE vehic_aid_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE vehic_aid_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE vehic_aid_prod TO vehic_aid_user;
\q
EOF

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Seed subscription plans
python seed_plans.py

# Optimize database
python manage.py optimize_db
```

### 4. Static Files
```bash
# Create logs directory
mkdir -p logs

# Collect static files
python manage.py collectstatic --noinput
```

### 5. Gunicorn Service
```bash
# Create systemd service
sudo nano /etc/systemd/system/vehic-aid.service
```

Paste the following:
```ini
[Unit]
Description=Vehic-Aid Gunicorn Service
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/vehic-aid
Environment="PATH=/var/www/vehic-aid/venv/bin"
EnvironmentFile=/var/www/vehic-aid/.env.prod
ExecStart=/var/www/vehic-aid/venv/bin/gunicorn \
    --workers 4 \
    --bind unix:/var/www/vehic-aid/gunicorn.sock \
    --timeout 120 \
    --access-logfile /var/www/vehic-aid/logs/gunicorn-access.log \
    --error-logfile /var/www/vehic-aid/logs/gunicorn-error.log \
    vehic_aid_backend.wsgi:application

[Install]
WantedBy=multi-user.target
```

### 6. Celery Worker Service
```bash
sudo nano /etc/systemd/system/vehic-aid-celery.service
```

```ini
[Unit]
Description=Vehic-Aid Celery Worker
After=network.target redis.service

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/vehic-aid
Environment="PATH=/var/www/vehic-aid/venv/bin"
EnvironmentFile=/var/www/vehic-aid/.env.prod
ExecStart=/var/www/vehic-aid/venv/bin/celery -A vehic_aid_backend worker -l info

[Install]
WantedBy=multi-user.target
```

### 7. Celery Beat Service (Scheduled Tasks)
```bash
sudo nano /etc/systemd/system/vehic-aid-celery-beat.service
```

```ini
[Unit]
Description=Vehic-Aid Celery Beat
After=network.target redis.service

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/vehic-aid
Environment="PATH=/var/www/vehic-aid/venv/bin"
EnvironmentFile=/var/www/vehic-aid/.env.prod
ExecStart=/var/www/vehic-aid/venv/bin/celery -A vehic_aid_backend beat -l info

[Install]
WantedBy=multi-user.target
```

### 8. Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/vehic-aid
```

```nginx
server {
    listen 80;
    server_name vehicaid.com www.vehicaid.com api.vehicaid.com;
    
    client_max_body_size 5M;
    
    location /static/ {
        alias /var/www/vehic-aid/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    location /media/ {
        alias /var/www/vehic-aid/media/;
        expires 7d;
    }
    
    location / {
        proxy_pass http://unix:/var/www/vehic-aid/gunicorn.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 120s;
        proxy_read_timeout 120s;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/vehic-aid /etc/nginx/sites-enabled/
sudo nginx -t
```

### 9. SSL Certificate
```bash
# Obtain SSL certificate
sudo certbot --nginx -d vehicaid.com -d www.vehicaid.com -d api.vehicaid.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### 10. Set Permissions
```bash
# Set ownership
sudo chown -R www-data:www-data /var/www/vehic-aid

# Set permissions
sudo chmod -R 755 /var/www/vehic-aid
sudo chmod -R 775 /var/www/vehic-aid/logs
sudo chmod -R 775 /var/www/vehic-aid/media
```

### 11. Start Services
```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable services
sudo systemctl enable vehic-aid
sudo systemctl enable vehic-aid-celery
sudo systemctl enable vehic-aid-celery-beat
sudo systemctl enable nginx
sudo systemctl enable redis-server

# Start services
sudo systemctl start vehic-aid
sudo systemctl start vehic-aid-celery
sudo systemctl start vehic-aid-celery-beat
sudo systemctl restart nginx

# Check status
sudo systemctl status vehic-aid
sudo systemctl status vehic-aid-celery
sudo systemctl status nginx
```

## Post-Deployment ✅

### 1. Health Checks
```bash
# Test API
curl https://api.vehicaid.com/api/v1/

# Test admin
curl https://vehicaid.com/admin/

# Test dashboard
curl https://vehicaid.com/dashboard/
```

### 2. Monitoring Setup
```bash
# View logs
sudo journalctl -u vehic-aid -f
sudo journalctl -u vehic-aid-celery -f
tail -f /var/www/vehic-aid/logs/gunicorn-error.log
```

### 3. Database Backup
```bash
# Create backup script
sudo nano /usr/local/bin/backup-vehic-aid.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/vehic-aid"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup database
sudo -u postgres pg_dump vehic_aid_prod > "$BACKUP_DIR/db_$TIMESTAMP.sql"

# Backup media files
tar -czf "$BACKUP_DIR/media_$TIMESTAMP.tar.gz" /var/www/vehic-aid/media/

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $TIMESTAMP"
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-vehic-aid.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-vehic-aid.sh
```

### 4. Performance Tuning
```bash
# PostgreSQL tuning
sudo nano /etc/postgresql/14/main/postgresql.conf
```

Add:
```
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 4MB
min_wal_size = 1GB
max_wal_size = 4GB
```

```bash
# Restart PostgreSQL
sudo systemctl restart postgresql
```

## Maintenance Commands

### Update Deployment
```bash
cd /var/www/vehic-aid
./deploy.sh
```

### View Logs
```bash
# Application logs
sudo journalctl -u vehic-aid -n 100 --no-pager

# Celery logs
sudo journalctl -u vehic-aid-celery -n 100 --no-pager

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Restart Services
```bash
sudo systemctl restart vehic-aid
sudo systemctl restart vehic-aid-celery
sudo systemctl restart nginx
```

### Database Operations
```bash
# Create backup
sudo -u postgres pg_dump vehic_aid_prod > backup.sql

# Restore backup
sudo -u postgres psql vehic_aid_prod < backup.sql

# Optimize
python manage.py optimize_db
```

## Security Checklist ✅

- [ ] Changed default SECRET_KEY
- [ ] Set DEBUG=False
- [ ] Configured ALLOWED_HOSTS
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Database password secured
- [ ] API keys secured in environment
- [ ] File permissions set correctly
- [ ] Regular backups scheduled
- [ ] Monitoring enabled

## Performance Checklist ✅

- [ ] Database indexes created
- [ ] Redis caching enabled
- [ ] Static files compressed
- [ ] Gunicorn workers optimized
- [ ] PostgreSQL tuned
- [ ] Nginx caching configured
- [ ] CDN configured (optional)

---

**Deployment Status**: Ready ✅  
**Estimated Time**: 2-3 hours  
**Difficulty**: Intermediate
