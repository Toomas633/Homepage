# Production Deployment Guide

This guide covers deploying **Toomas633's Dungeon** to production environments.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Deployment Options](#deployment-options)
- [Docker Deployment](#docker-deployment)
- [VPS Deployment](#vps-deployment)
- [Environment Configuration](#environment-configuration)
- [Reverse Proxy Setup](#reverse-proxy-setup)
- [SSL/TLS Configuration](#ssltls-configuration)
- [Monitoring and Logging](#monitoring-and-logging)
- [Backup and Recovery](#backup-and-recovery)
- [Performance Optimization](#performance-optimization)

---

## Prerequisites

### Required

- **Server**: VPS or dedicated server with SSH access
- **OS**: Linux (Ubuntu 22.04 LTS recommended)
- **RAM**: Minimum 1GB, 2GB+ recommended
- **Storage**: Minimum 10GB free space
- **Domain**: Registered domain name with DNS access
- **Email**: SMTP server credentials for contact form

### Software Requirements

- Docker 24+ and Docker Compose 2.x
- OR Node.js 18+ (24+ recommended) with npm 8+
- Nginx or Traefik for reverse proxy
- SSL/TLS certificates (Let's Encrypt recommended)

---

## Deployment Options

### Option 1: Docker Deployment (Recommended)

**Pros**:
- ✅ Easy to deploy and manage
- ✅ Consistent environment across systems
- ✅ Built-in process management with PM2
- ✅ Automatic health checks
- ✅ Easy rollback and updates

**Cons**:
- ❌ Requires Docker knowledge
- ❌ Slightly higher resource usage

### Option 2: Direct Node.js Deployment

**Pros**:
- ✅ Lower resource usage
- ✅ Direct system access
- ✅ Easier to debug

**Cons**:
- ❌ Manual process management setup
- ❌ More complex configuration
- ❌ Environment consistency issues

---

## Docker Deployment

### 1. Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Add your user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker compose version
```

### 2. Clone and Configure

```bash
# Clone the repository
git clone https://github.com/Toomas633/homepage.git
cd homepage

# Create environment file
cp backend/.env.example backend/.env
nano backend/.env
```

**Edit `backend/.env`**:
```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_TLS=true
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_TO=contact@yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 3. Build the Docker Image

```bash
# Build multi-platform image
docker buildx create --use
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t toomas633-dungeon:latest \
  --load \
  .
```

### 4. Run with Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  app:
    image: toomas633-dungeon:latest
    container_name: toomas633-dungeon
    restart: unless-stopped
    ports:
      - "127.0.0.1:8080:80"  # Bind to localhost only
      - "127.0.0.1:3000:3000"
    env_file:
      - backend/.env
    volumes:
      - ./logs:/app/logs
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

**Start the application**:
```bash
docker compose -f docker-compose.prod.yml up -d

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Check health
curl http://localhost:8080/api/health
```

---

## VPS Deployment

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 24
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install build tools
sudo apt install -y build-essential
```

### 2. Application Setup

```bash
# Create app directory
sudo mkdir -p /var/www/toomas633
sudo chown $USER:$USER /var/www/toomas633

# Clone repository
cd /var/www/toomas633
git clone https://github.com/Toomas633/homepage.git .

# Setup Frontend
cd frontend
cp .env.example .env
nano .env  # Configure VITE_API_URL
npm ci --production
npm run build

# Setup Backend
cd ../backend
cp .env.example .env
nano .env  # Configure email settings
npm ci --production
npm run build
```

### 3. PM2 Process Management

```bash
# Start backend with PM2
cd /var/www/toomas633/backend
pm2 start dist/app.js --name "homepage-backend"

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
# Run the command it outputs

# Monitor processes
pm2 status
pm2 logs homepage-backend
```

---

## Environment Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `EMAIL_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP server port | `587` |
| `EMAIL_TLS` | Use TLS encryption | `true` |
| `EMAIL_USER` | SMTP username | `your-email@gmail.com` |
| `EMAIL_PASS` | SMTP password/app password | `your-app-password` |
| `EMAIL_TO` | Recipient email | `contact@yourdomain.com` |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | `https://yourdomain.com` |

### Gmail Setup

If using Gmail:

1. Enable 2-Factor Authentication
2. Generate App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Create app password for "Mail"
   - Use this password in `EMAIL_PASS`

### Environment Best Practices

- ✅ Use strong, unique passwords
- ✅ Never commit `.env` files to Git
- ✅ Use environment-specific configurations
- ✅ Rotate credentials regularly
- ✅ Store secrets securely (use vault services in production)

---

## Reverse Proxy Setup

### Nginx Configuration

Create `/etc/nginx/sites-available/toomas633.com`:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name toomas633.com www.toomas633.com;
    return 301 https://toomas633.com$request_uri;
}

# HTTPS Configuration
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name toomas633.com www.toomas633.com;

    # SSL Configuration (will be added by Certbot)
    ssl_certificate /etc/letsencrypt/live/toomas633.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/toomas633.com/privkey.pem;
    
    # SSL Security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Logging
    access_log /var/log/nginx/toomas633-access.log;
    error_log /var/log/nginx/toomas633-error.log;

    # Proxy to Docker container
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API proxy (if accessing backend directly)
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers handled by backend
        proxy_hide_header Access-Control-Allow-Origin;
    }
}
```

**Enable the configuration**:
```bash
sudo ln -s /etc/nginx/sites-available/toomas633.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Traefik Configuration (Alternative)

Create `docker-compose.traefik.yml`:

```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    container_name: traefik
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    command:
      - "--api.dashboard=true"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.tlschallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=your@email.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "./letsencrypt:/letsencrypt"
    networks:
      - web

  app:
    image: toomas633-dungeon:latest
    container_name: toomas633-dungeon
    restart: unless-stopped
    env_file:
      - backend/.env
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.app.rule=Host(`toomas633.com`)"
      - "traefik.http.routers.app.entrypoints=websecure"
      - "traefik.http.routers.app.tls.certresolver=letsencrypt"
      - "traefik.http.services.app.loadbalancer.server.port=80"
    networks:
      - web
      - app-network

networks:
  web:
    external: true
  app-network:
    driver: bridge
```

---

## SSL/TLS Configuration

### Using Let's Encrypt (Certbot)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate (with Nginx stopped or before Nginx config)
sudo certbot certonly --standalone -d toomas633.com -d www.toomas633.com

# Or with Nginx already running
sudo certbot --nginx -d toomas633.com -d www.toomas633.com

# Test automatic renewal
sudo certbot renew --dry-run

# Setup auto-renewal cron job (usually automatic)
sudo systemctl status certbot.timer
```

### Certificate Renewal

Certificates auto-renew. To manually renew:

```bash
sudo certbot renew
sudo systemctl reload nginx
```

---

## Monitoring and Logging

### Application Logs

**Docker Deployment**:
```bash
# View container logs
docker logs toomas633-dungeon -f

# View PM2 logs inside container
docker exec toomas633-dungeon pm2 logs

# Check specific process
docker exec toomas633-dungeon pm2 logs backend
```

**Direct Deployment**:
```bash
# PM2 logs
pm2 logs homepage-backend

# Nginx logs
sudo tail -f /var/log/nginx/toomas633-access.log
sudo tail -f /var/log/nginx/toomas633-error.log
```

### Health Monitoring

```bash
# Check health endpoint
curl https://toomas633.com/api/health

# Expected response:
# {
#   "status": "healthy",
#   "timestamp": "2025-12-02T12:00:00.000Z",
#   "email": {
#     "status": "connected",
#     "responseTime": "150ms"
#   }
# }
```

### Monitoring Tools (Optional)

- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry
- **Analytics**: Plausible, Umami (privacy-focused)
- **APM**: New Relic, Datadog

---

## Backup and Recovery

### Backup Strategy

```bash
#!/bin/bash
# backup.sh - Create application backup

BACKUP_DIR="/backups/toomas633"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/var/www/toomas633"

mkdir -p $BACKUP_DIR

# Backup application code
tar -czf $BACKUP_DIR/app-$DATE.tar.gz \
  -C $APP_DIR \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='dist' \
  .

# Backup environment files
cp $APP_DIR/backend/.env $BACKUP_DIR/env-$DATE.backup

# Keep only last 30 days of backups
find $BACKUP_DIR -name "app-*.tar.gz" -mtime +30 -delete
find $BACKUP_DIR -name "env-*.backup" -mtime +30 -delete

echo "Backup completed: $BACKUP_DIR/app-$DATE.tar.gz"
```

### Setup Automated Backups

```bash
# Make script executable
chmod +x backup.sh

# Add to crontab (daily at 2 AM)
crontab -e

# Add line:
0 2 * * * /path/to/backup.sh >> /var/log/backup.log 2>&1
```

### Recovery Process

```bash
# Stop application
docker compose down
# OR
pm2 stop homepage-backend

# Restore from backup
cd /var/www/toomas633
tar -xzf /backups/toomas633/app-YYYYMMDD_HHMMSS.tar.gz

# Restore environment
cp /backups/toomas633/env-YYYYMMDD_HHMMSS.backup backend/.env

# Reinstall dependencies and rebuild
cd frontend && npm ci && npm run build
cd ../backend && npm ci && npm run build

# Restart application
docker compose up -d
# OR
pm2 restart homepage-backend
```

---

## Performance Optimization

### Nginx Caching

Add to Nginx config:

```nginx
# Cache configuration
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m use_temp_path=off;

location / {
    proxy_cache my_cache;
    proxy_cache_valid 200 60m;
    proxy_cache_valid 404 10m;
    proxy_cache_bypass $http_cache_control;
    add_header X-Cache-Status $upstream_cache_status;
    
    proxy_pass http://localhost:8080;
}
```

### CDN Integration

For static assets, consider using a CDN:
- Cloudflare (free tier available)
- AWS CloudFront
- Fastly

### Database Connection Pooling

If adding a database later, implement connection pooling to reduce overhead.

### Compression

Ensure Brotli/Gzip compression is enabled (already configured in the application).

---

## Post-Deployment Checklist

- [ ] Application is accessible via domain
- [ ] HTTPS/SSL is working correctly
- [ ] Health endpoint returns healthy status
- [ ] Email functionality works (test contact form)
- [ ] Logs are being generated correctly
- [ ] Auto-renewal for SSL certificates is configured
- [ ] Firewall rules are properly configured
- [ ] Backups are scheduled and tested
- [ ] Monitoring/alerting is set up
- [ ] DNS records are properly configured
- [ ] Security headers are present (check with securityheaders.com)
- [ ] Performance is acceptable (check with PageSpeed Insights)

---

## Troubleshooting

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues and solutions.

---

## Support

For deployment issues:
- Check [Issues](https://github.com/Toomas633/homepage/issues)
- Email: info@toomas633.com
