# Troubleshooting Guide

Common issues and solutions for Toomas633's Dungeon project.

## 📋 Table of Contents

- [Development Issues](#development-issues)
- [Docker Issues](#docker-issues)
- [Build and Deployment Issues](#build-and-deployment-issues)
- [Runtime Issues](#runtime-issues)
- [Email Service Issues](#email-service-issues)
- [Network and CORS Issues](#network-and-cors-issues)
- [Performance Issues](#performance-issues)

---

## Development Issues

### Frontend Development Server Won't Start

**Problem**: `npm run dev` fails or port 5173 is already in use

**Solutions**:

```bash
# Check if port 5173 is in use (Windows)
netstat -ano | findstr :5173

# Kill the process using the port
taskkill /PID <PID> /F

# Or use a different port
# Edit vite.config.ts and change the port:
server: {
  port: 5174
}
```

**Alternative**: Check for Node.js version mismatch
```bash
node --version  # Should be 18+
npm --version   # Should be 8+
```

### Backend Development Server Crashes on Start

**Problem**: Backend fails to start with module errors

**Solutions**:

```bash
# Clear node_modules and reinstall
cd backend
rm -rf node_modules package-lock.json
npm install

# Check TypeScript compilation
npm run type-check

# Check for missing environment variables
cat .env  # Ensure all required vars are set
```

### Hot Reload Not Working

**Problem**: Changes don't trigger auto-reload

**Solutions**:

**Frontend (Vite)**:
```bash
# Try clearing Vite cache
rm -rf frontend/node_modules/.vite

# Restart dev server
npm run dev
```

**Backend (tsx)**:
```bash
# Ensure tsx watch is being used
npm run dev  # Should use 'tsx watch src/app.ts'

# Check file watchers limit (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### TypeScript Errors

**Problem**: Type errors preventing compilation

**Solutions**:

```bash
# Run type check to see all errors
npm run type-check

# Common fixes:
# 1. Missing type definitions
npm install --save-dev @types/package-name

# 2. Outdated types
npm update @types/node @types/express

# 3. Module resolution issues (backend)
# Ensure imports use .js extension:
import { something } from './file.js'  // Correct
import { something } from './file'      // Wrong for ESM
```

---

## Docker Issues

### Docker Build Fails

**Problem**: `docker build` command fails

**Solutions**:

```bash
# Check Docker is running
docker ps

# Clear Docker build cache
docker builder prune -a

# Build with no cache
docker build --no-cache -t toomas633-dungeon .

# Check for platform issues
docker buildx build --platform linux/amd64 -t toomas633-dungeon .
```

### Container Won't Start

**Problem**: Container starts then immediately stops

**Solutions**:

```bash
# Check container logs
docker logs toomas633-dungeon

# Common issues:

# 1. Missing environment file
ls backend/.env  # Should exist
cp backend/.env.example backend/.env

# 2. Port conflicts
docker ps  # Check if ports 80/3000 are in use
# Change ports in docker run command:
docker run -p 8080:80 -p 3001:3000 ...

# 3. Permission issues
docker exec toomas633-dungeon ls -la /app
# Should be owned by appuser

# Run container in interactive mode for debugging
docker run -it --entrypoint /bin/bash toomas633-dungeon
```

### Health Check Failing

**Problem**: Docker health check reports unhealthy

**Solutions**:

```bash
# Check health endpoint manually
docker exec toomas633-dungeon curl http://localhost/api/health

# Check PM2 processes
docker exec toomas633-dungeon pm2 list

# Restart processes
docker exec toomas633-dungeon pm2 restart all

# Check nginx
docker exec toomas633-dungeon nginx -t
docker exec toomas633-dungeon ps aux | grep nginx
```

### Can't Access Container Ports

**Problem**: Can't access application on published ports

**Solutions**:

```bash
# Verify port mapping
docker port toomas633-dungeon

# Check if ports are actually listening
docker exec toomas633-dungeon netstat -tlnp

# Windows firewall check
# Open Windows Defender Firewall
# Ensure Docker Desktop has permissions

# Test from inside container
docker exec toomas633-dungeon curl http://localhost:80
docker exec toomas633-dungeon curl http://localhost:3000/health
```

---

## Build and Deployment Issues

### Frontend Build Fails

**Problem**: `npm run build` fails in frontend

**Solutions**:

```bash
cd frontend

# Clear cache and rebuild
rm -rf node_modules/.vite dist
npm ci
npm run build

# Check for TypeScript errors
npm run type-check

# Check for lint errors
npm run lint

# Memory issues (increase Node memory)
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### Backend Build Fails

**Problem**: TypeScript compilation fails

**Solutions**:

```bash
cd backend

# Check TypeScript configuration
cat tsconfig.json

# Verify all imports use .js extension
# Incorrect:
import { something } from './file'
# Correct:
import { something } from './file.js'

# Clean build
rm -rf dist
npm run build

# Check for missing dependencies
npm ci
```

### PM2 Won't Start Backend

**Problem**: PM2 fails to start backend process

**Solutions**:

```bash
# Check PM2 logs
pm2 logs backend

# Verify dist directory exists
ls backend/dist/app.js

# Check Node.js version
node --version  # Should be 18+

# Try starting manually
cd backend
node dist/app.js

# Reset PM2
pm2 delete all
pm2 start ecosystem.config.cjs
pm2 save
```

---

## Runtime Issues

### 404 Errors on Frontend Routes

**Problem**: Direct navigation to routes shows 404

**Solution**:

This is expected for SPAs. Ensure Nginx is configured correctly:

```nginx
# In nginx.conf
location / {
    try_files $uri $uri/ /index.html;
}
```

For Docker deployment, this is already configured.

### API Requests Failing

**Problem**: Frontend can't reach backend API

**Solutions**:

```bash
# Check API URL configuration
# Frontend .env should have:
VITE_API_URL=http://localhost:3000/api

# In production:
VITE_API_URL=https://yourdomain.com/api

# Verify backend is running
curl http://localhost:3000/health

# Check CORS configuration
# backend/.env should include frontend URL in ALLOWED_ORIGINS
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
```

### Environment Variables Not Loading

**Problem**: Application can't read environment variables

**Solutions**:

**Frontend**:
```bash
# Vite only exposes vars prefixed with VITE_
# .env file:
VITE_API_URL=http://localhost:3000/api  # ✅ Correct
API_URL=http://localhost:3000/api       # ❌ Won't work

# Rebuild after changing .env
npm run build
```

**Backend**:
```bash
# Check .env file exists
ls backend/.env

# Verify dotenv is loaded in app.ts
# Should have: import 'dotenv/config'

# Check environment in running process
docker exec toomas633-dungeon env | grep EMAIL
```

### Memory Leaks or High CPU Usage

**Problem**: Application consuming too much resources

**Solutions**:

```bash
# Monitor container resources
docker stats toomas633-dungeon

# Check PM2 process memory
docker exec toomas633-dungeon pm2 monit

# Restart processes
docker exec toomas633-dungeon pm2 restart all

# Check for infinite loops or memory leaks in code
# Use Node.js profiler or Chrome DevTools
```

---

## Email Service Issues

### Emails Not Sending

**Problem**: Contact form submits but emails don't arrive

**Solutions**:

```bash
# Test health endpoint
curl http://localhost:3000/health
# Should show email: { status: "connected" }

# Check SMTP credentials in backend/.env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_TLS=true
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password  # Not your regular password!
EMAIL_TO=recipient@domain.com

# Gmail specific:
# 1. Enable 2-Factor Authentication
# 2. Generate App Password at: https://myaccount.google.com/apppasswords
# 3. Use App Password in EMAIL_PASS

# Check backend logs
docker logs toomas633-dungeon | grep -i email
docker exec toomas633-dungeon pm2 logs backend | grep -i email
```

### SMTP Connection Timeout

**Problem**: Email service shows "disconnected" or timeout

**Solutions**:

```bash
# Test SMTP connection from server
telnet smtp.gmail.com 587

# Common ports:
# 587 - TLS/STARTTLS (recommended)
# 465 - SSL
# 25 - Unencrypted (not recommended)

# Check firewall rules
# Ensure outbound connections to SMTP port are allowed

# Verify EMAIL_TLS setting matches port:
# Port 587: EMAIL_TLS=true
# Port 465: EMAIL_TLS=false (uses SSL)
```

### Rate Limiting Errors

**Problem**: "Too many requests" error on email endpoint

**Solution**:

Rate limit is 10 requests per 15 minutes per IP (configured in backend).

```bash
# Wait 15 minutes, or:
# Temporarily increase limit in backend/src/middleware/rateLimiter.ts

# In production, this protects against spam
# For testing, use different IPs or wait
```

---

## Network and CORS Issues

### CORS Errors in Browser Console

**Problem**: "Access to XMLHttpRequest blocked by CORS policy"

**Solutions**:

```bash
# Check ALLOWED_ORIGINS in backend/.env
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com

# No trailing slashes!
# Correct: http://localhost:5173
# Wrong:   http://localhost:5173/

# Must match exactly what browser shows in address bar

# For production with www and non-www:
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Restart backend after changing
docker restart toomas633-dungeon
# OR
pm2 restart homepage-backend
```

### API Requests Return CORS Error

**Problem**: Preflight OPTIONS requests failing

**Solutions**:

```bash
# Verify CORS middleware is loaded
# backend/src/app.ts should have:
import { corsMiddleware } from './middleware/cors.js'
app.use(corsMiddleware)

# Check browser network tab:
# OPTIONS request should return 204
# Response should include Access-Control-Allow-Origin header

# Test with curl
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:3000/send-email
```

### Nginx Proxy Issues

**Problem**: Nginx can't reach backend

**Solutions**:

```bash
# Test backend directly
curl http://localhost:3000/health

# Check Nginx configuration
sudo nginx -t

# Verify proxy_pass URL
# In nginx.conf, should be:
proxy_pass http://localhost:3000;  # Direct deployment
# OR
proxy_pass http://localhost:8080;  # Docker deployment

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

---

## Performance Issues

### Slow Page Load Times

**Problem**: Application loads slowly

**Solutions**:

```bash
# Enable compression (already configured)
# Check if Brotli/Gzip is working:
curl -H "Accept-Encoding: br,gzip" -I https://yourdomain.com

# Should see: Content-Encoding: br (or gzip)

# Check bundle sizes
cd frontend
npm run build
# Look for large chunks in dist/

# Implement code splitting for large routes
# Use lazy loading:
const MyComponent = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

### High Memory Usage

**Problem**: Container using too much RAM

**Solutions**:

```bash
# Set memory limits in docker-compose.yml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 512M

# Monitor usage
docker stats toomas633-dungeon

# Reduce PM2 instances if needed
# Edit ecosystem.config.cjs:
instances: 1  # Instead of 'max'
```

### Slow API Responses

**Problem**: Backend endpoints are slow

**Solutions**:

```bash
# Check email service connection time
curl http://localhost:3000/health
# Look at email.responseTime

# If SMTP is slow, consider:
# 1. Using a faster SMTP provider
# 2. Implementing queue system for emails
# 3. Adding timeout to SMTP connection

# Monitor backend performance
docker exec toomas633-dungeon pm2 monit
```

---

## Getting Help

If you've tried these solutions and still have issues:

1. **Check existing issues**: [GitHub Issues](https://github.com/Toomas633/homepage/issues)
2. **Check logs**: Always include relevant log output when asking for help
3. **Provide details**: OS, Node version, Docker version, error messages
4. **Create an issue**: Open a detailed issue with reproduction steps
5. **Contact**: Email info@toomas633.com with detailed problem description

### Useful Debugging Commands

```bash
# System information
node --version
npm --version
docker --version
docker compose version

# Application logs
docker logs toomas633-dungeon
docker exec toomas633-dungeon pm2 logs
sudo journalctl -u nginx -f

# Process information
docker exec toomas633-dungeon ps aux
docker exec toomas633-dungeon pm2 list
docker exec toomas633-dungeon pm2 describe backend

# Network debugging
docker exec toomas633-dungeon netstat -tlnp
curl -v http://localhost:3000/health
nslookup yourdomain.com

# Docker debugging
docker inspect toomas633-dungeon
docker exec -it toomas633-dungeon /bin/bash
docker system df  # Check disk usage
docker system prune  # Clean up (careful!)
```

---

**Last Updated**: December 4, 2025
