#!/bin/bash
# Vehic-Aid Production Deployment Script
# This script automates the deployment process

set -e  # Exit on error

echo "🚀 Starting Vehic-Aid Deployment..."

# Configuration
PROJECT_DIR="/var/www/vehic-aid"
VENV_DIR="$PROJECT_DIR/venv"
BACKUP_DIR="/var/backups/vehic-aid"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Backup current deployment
echo -e "${YELLOW}📦 Creating backup...${NC}"
mkdir -p $BACKUP_DIR
if [ -d "$PROJECT_DIR" ]; then
    tar -czf "$BACKUP_DIR/backup_$TIMESTAMP.tar.gz" -C "$PROJECT_DIR" .
    echo -e "${GREEN}✅ Backup created: backup_$TIMESTAMP.tar.gz${NC}"
fi

# Step 2: Pull latest code
echo -e "${YELLOW}📥 Pulling latest code...${NC}"
cd $PROJECT_DIR
git pull origin main
echo -e "${GREEN}✅ Code updated${NC}"

# Step 3: Activate virtual environment
echo -e "${YELLOW}🐍 Activating virtual environment...${NC}"
source $VENV_DIR/bin/activate

# Step 4: Install/Update dependencies
echo -e "${YELLOW}📚 Installing dependencies...${NC}"
pip install -r requirements.txt --upgrade
echo -e "${GREEN}✅ Dependencies installed${NC}"

# Step 5: Collect static files
echo -e "${YELLOW}🎨 Collecting static files...${NC}"
python manage.py collectstatic --noinput
echo -e "${GREEN}✅ Static files collected${NC}"

# Step 6: Run database migrations
echo -e "${YELLOW}🗄️  Running migrations...${NC}"
python manage.py migrate --noinput
echo -e "${GREEN}✅ Migrations completed${NC}"

# Step 7: Clear cache
echo -e "${YELLOW}🧹 Clearing cache...${NC}"
python manage.py shell << EOF
from django.core.cache import cache
cache.clear()
print("Cache cleared")
EOF
echo -e "${GREEN}✅ Cache cleared${NC}"

# Step 8: Restart services
echo -e "${YELLOW}🔄 Restarting services...${NC}"
sudo systemctl restart vehic-aid
sudo systemctl restart vehic-aid-celery
sudo systemctl restart nginx
echo -e "${GREEN}✅ Services restarted${NC}"

# Step 9: Health check
echo -e "${YELLOW}🏥 Running health check...${NC}"
sleep 5
if curl -f http://localhost:8000/api/v1/ > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${RED}❌ Health check failed${NC}"
    echo -e "${YELLOW}Rolling back...${NC}"
    tar -xzf "$BACKUP_DIR/backup_$TIMESTAMP.tar.gz" -C "$PROJECT_DIR"
    sudo systemctl restart vehic-aid
    exit 1
fi

# Step 10: Cleanup old backups (keep last 5)
echo -e "${YELLOW}🧹 Cleaning old backups...${NC}"
cd $BACKUP_DIR
ls -t backup_*.tar.gz | tail -n +6 | xargs -r rm
echo -e "${GREEN}✅ Old backups cleaned${NC}"

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${GREEN}📊 Deployment time: $(date)${NC}"
