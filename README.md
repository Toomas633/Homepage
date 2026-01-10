# Toomas633's Dungeon

<div align="center">

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Toomas633_Homepage&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Toomas633_Homepage)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.5.26-4FC08D?style=flat&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vuetify](https://img.shields.io/badge/Vuetify-3.11.6-1867C0?style=flat&logo=vuetify&logoColor=white)](https://vuetifyjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-24+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](LICENCE)
[![Test Build](https://github.com/Toomas633/homepage/actions/workflows/test-build.yml/badge.svg)](https://github.com/Toomas633/homepage/actions/workflows/test-build.yml)

**A modern full-stack personal projects homepage built with Vue 3, TypeScript, and Node.js**

[Live](https://toomas633.com) • [Frontend Docs](frontend/README.md) • [Backend Docs](backend/README.md)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Testing](#-testing)
- [Docker Deployment](#-docker-deployment)
- [Configuration](#-configuration)
- [Contributing](#-contributing)
- [Documentation](#-additional-resources)
- [License](#-license)

---

## 🌟 Overview

Toomas633's Dungeon is a full-stack web application showcasing personal projects, technical skills, and interactive features. The application combines a modern Vue 3 frontend with a robust Node.js backend, designed for performance, maintainability, and scalability.

### Key Features

- **🎨 Modern UI**: Responsive design with Vuetify 3 Material Design components
- **📧 Contact System**: Integrated email service with rate limiting and validation
- **🗺️ Interactive Maps**: Leaflet integration for location visualization
- **📊 Project Showcase**: Dynamic galleries with GitHub integration
- **🔒 Security**: CORS protection, rate limiting, and security headers
- **🐳 Containerized**: Full Docker support with multi-stage builds
- **✅ Tested**: Comprehensive test coverage with Vitest
- **📈 Quality**: SonarCloud integration for code quality analysis
- **📚 API Documentation**: Interactive Swagger UI for API exploration

### Tech Stack

#### Frontend (v4.4.0)
- **Framework**: Vue 3.5.26 with Composition API
- **Language**: TypeScript 5.9.3
- **UI Library**: Vuetify 3.11.6
- **Build Tool**: Vite 7.3.1
- **Router**: Vue Router 4.6.4
- **HTTP Client**: Axios 1.13.2
- **Maps**: Leaflet 1.9.4
- **Testing**: Vitest 4.0.16

#### Backend (v2.1.0)
- **Runtime**: Node.js 18+ (24+ recommended)
- **Framework**: Express.js 5.2.1
- **Language**: TypeScript 5.9.3 with ESM modules
- **Build Tool**: esbuild 0.27.2
- **Email**: Nodemailer 7.0.12
- **HTTP Client**: Axios 1.13.2
- **Security**: CORS 2.8.5, Rate Limiting 8.2.1
- **API Docs**: Swagger UI 5.0.1 with OpenAPI 3.0
- **Testing**: Vitest 4.0.16

---

## 🏗️ Architecture

This is a multi-workspace project with separate frontend and backend modules, designed for independent development and deployment.

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Production Docker Container                 │
│  ┌────────────────────────────────────────────────────┐ │
│  │              Nginx (Port 80)                       │ │
│  │  ┌──────────────────┐    ┌──────────────────────┐ │ │
│  │  │  Static Files    │    │   API Proxy          │ │ │
│  │  │  (Vue 3 dist/)   │    │   /api/* → backend:3000 │ │ │
│  │  └──────────────────┘    └──────────┬───────────┘ │ │
│  └───────────────────────────────────────┼────────────┘ │
│                                          │               │
│  ┌──────────────────────────────────────▼────────────┐  │
│  │         Backend API (Port 3000)                   │  │
│  │  • Express.js 5 with TypeScript                   │  │
│  │  • Email Service (Nodemailer)                     │  │
│  │  • Health Monitoring                              │  │
│  │  • CORS & Rate Limiting                           │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│              PM2 Process Manager                         │
│         (nginx + backend with auto-restart)              │
└─────────────────────────────────────────────────────────┘
```

### Project Structure

```
homepage/
├── frontend/                    # Vue 3 application
│   ├── src/
│   │   ├── components/         # Reusable Vue components
│   │   ├── views/              # Page components
│   │   ├── router/             # Vue Router configuration
│   │   ├── services/           # API service layer
│   │   ├── helpers/            # Utility functions & composables
│   │   ├── types/              # TypeScript type definitions
│   │   └── assets/             # Static assets (images, styles)
│   ├── tests/                  # Vitest tests
│   ├── vite.config.ts          # Vite build configuration
│   └── package.json            # Frontend dependencies
│
├── backend/                     # Express.js API
│   ├── src/
│   │   ├── routes/             # API route handlers
│   │   ├── services/           # Business logic
│   │   ├── middleware/         # Express middleware
│   │   ├── types/              # TypeScript interfaces
│   │   ├── config/             # Environment configuration
│   │   └── app.ts              # Application entry point
│   ├── tests/                  # Vitest + Supertest tests
│   ├── tsconfig.json           # TypeScript configuration
│   └── package.json            # Backend dependencies
│
├── Dockerfile                   # Multi-stage production build
├── docker-compose.yml          # Container orchestration
├── nginx.conf                  # Nginx web server config
├── ecosystem.config.cjs        # PM2 process management
├── sonar-project.properties    # SonarCloud configuration
└── Homepage.code-workspace     # VS Code workspace

```

---

## 🚀 Quick Start

### Prerequisites

| Technology | Version  | Required |
|------------|----------|----------|
| Node.js    | 18+      | ✅       |
| npm        | 8+       | ✅       |
| Docker     | 20+      | 🔧 Optional |

### Local Development

#### 1. Clone the Repository

```bash
git clone https://github.com/Toomas633/homepage.git
cd homepage
```

#### 2. Setup Frontend

```bash
cd frontend
cp .env.example .env
# Edit .env with your configuration
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

#### 3. Setup Backend

```bash
cd backend
cp .env.example .env
# Edit .env with SMTP credentials
npm install
npm run dev
# Backend runs on http://localhost:3000
```

#### 4. Open in Browser

Visit `http://localhost:5173` to see the application.

### Docker Deployment

For containerized deployment with both frontend and backend:

```bash
# Using docker-compose (recommended)
docker-compose up -d

# Or manual build
docker build -t toomas633-dungeon .
docker run -d -p 80:80 --env-file backend/.env toomas633-dungeon
```

See [Docker Deployment](#-docker-deployment) section below for detailed instructions, or [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for production deployment guide.

---

## 📂 Project Structure

---

## 💻 Development

### Workspace Setup

This project uses a multi-folder VS Code workspace. Open `Homepage.code-workspace` in VS Code for optimal development experience with module-specific settings.

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Development server with hot reload (port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run serve

# Linting & formatting
npm run lint
npm run stylelint
npm run prettier
npm run type-check
```

**Key Files:**
- `vite.config.ts` - Build configuration with plugins
- `src/main.ts` - Application entry point
- `src/router/` - Vue Router configuration
- `src/plugins/vuetify.ts` - Vuetify setup

See [Frontend Documentation](frontend/README.md) for detailed patterns and conventions, or [frontend/.github-copilot-instructions.md](frontend/.github-copilot-instructions.md) for AI-assisted development patterns.

### Backend Development

```bash
cd backend

# Install dependencies
npm install

# Development with hot reload (tsx watch)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Linting & formatting
npm run lint
npm run prettier
npm run type-check
```

**Key Files:**
- `src/app.ts` - Express application setup
- `src/routes/` - API endpoint handlers
- `src/middleware/` - CORS, rate limiting, etc.
- `src/services/` - Business logic services

See [Backend Documentation](backend/README.md) for detailed patterns and conventions, or [backend/.github-copilot-instructions.md](backend/.github-copilot-instructions.md) for AI-assisted development patterns.

### Development Workflow

1. **Start backend**: `cd backend && npm run dev`
2. **Start frontend**: `cd frontend && npm run dev`
3. **Make changes** with hot reload
4. **Run tests**: `npm run test` in respective directory
5. **Check quality**: `npm run lint` and `npm run type-check`
6. **Build**: `npm run build` before committing

---

## 🧪 Testing

Both frontend and backend use [Vitest](https://vitest.dev/) for unit and integration testing with comprehensive coverage reporting.

### Running Tests

#### Frontend Tests

```bash
cd frontend

# Run tests in watch mode (interactive)
npm run test

# Run with coverage report
npm run test:coverage
```

#### Backend Tests

```bash
cd backend

# Run tests in watch mode (interactive)
npm run test

# Run with coverage report
npm run test:coverage
```

### Test Structure

#### Frontend Testing

- **Framework**: Vitest + Vue Test Utils + happy-dom
- **Location**: `frontend/tests/` directory
- **Setup**: `tests/setup.ts` with Vuetify stubs
- **Config**: `vitest.config.ts` with Vue plugin support

**Example Test Files:**
- `tests/helpers/isBot.spec.ts` - Utility function tests
- `tests/App.spec.ts` - Component testing example
- `tests/services/` - Service layer tests

#### Backend Testing

- **Framework**: Vitest + Supertest for API testing
- **Location**: `backend/tests/` directory
- **Setup**: `tests/setup.ts` for global configuration
- **Config**: `vitest.config.ts` for Node.js environment

**Example Test Files:**
- `tests/routes/health.spec.ts` - API endpoint tests with supertest
- `tests/services/emailService.spec.ts` - Service tests with mocking
- `tests/middleware/` - Middleware unit tests

### Writing Tests

#### Frontend Component Test

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent', () => {
  it('renders with props', () => {
    const wrapper = mount(MyComponent, {
      props: { title: 'Test Title' }
    })
    expect(wrapper.text()).toContain('Test Title')
  })
})
```

#### Backend API Route Test

```typescript
import { describe, it, expect } from 'vitest'
import request from 'supertest'
import express from 'express'
import healthRouter from '@/routes/health'

describe('Health Route', () => {
  it('returns health status', async () => {
    const app = express()
    app.use('/health', healthRouter)
    
    const response = await request(app).get('/health')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('healthy')
  })
})
```

### Coverage Reports

Coverage reports are generated in `coverage/` with multiple formats:

- **Console**: Summary output after test run
- **HTML**: Interactive report at `coverage/index.html`
- **LCOV**: `coverage/lcov.info` for SonarCloud integration
- **JSON**: Programmatic access via `coverage/coverage-final.json`

**Coverage Exclusions:**
- Test files (`**/*.spec.ts`, `**/*.test.ts`)
- Type definitions (`**/*.d.ts`)
- Configuration and setup files

### CI/CD Integration

Tests run automatically in GitHub Actions:
- **SonarCloud Workflow**: Runs tests with coverage on push/PR
- **Quality Gates**: Coverage thresholds enforced by SonarCloud
- **Multi-module**: Separate coverage reports for frontend and backend

---

## 🐳 Docker Deployment

The application supports containerized deployment with a multi-stage Docker build that combines both frontend and backend services.

### Architecture

The Docker container runs:
- **Nginx** (Port 80) - Serves frontend static files and proxies API requests
- **Backend API** (Port 3000) - Express.js server
- **PM2** - Process manager for both services with auto-restart

### Quick Start

#### Using Docker Compose (Recommended)

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Manual Docker Build

```bash
# Build the image
docker build -t toomas633-dungeon .

# Run the container
docker run -d \
  --name toomas633-dungeon \
  -p 80:80 \
  -p 3000:3000 \
  --env-file backend/.env \
  --restart unless-stopped \
  toomas633-dungeon

# View logs
docker logs -f toomas633-dungeon
```

### Configuration

#### Environment Variables

Create a `.env` file in the root directory (or use `backend/.env`):

```bash
# Email service configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_TO=recipient@example.com

# CORS configuration
ALLOWED_ORIGINS=https://yourdomain.com,http://localhost:5173
```

#### Port Configuration

Default ports:
- **80**: Frontend (Nginx) and API proxy
- **3000**: Backend API direct access

Custom ports:
```bash
docker run -p 8080:80 -p 3001:3000 ...
```

### Multi-Stage Build

The Dockerfile uses multi-stage builds for optimization:

1. **Frontend Build**: Compiles Vue 3 app with Vite
2. **Backend Build**: Compiles TypeScript to JavaScript
3. **Production**: Combines both with Nginx and PM2

**Features:**
- Uses `node:24-slim` for minimal image size
- Non-root user (`appuser`) for security
- Health checks built-in
- Optimized layer caching

### Health Monitoring

#### Health Check Endpoint

```bash
# Via Nginx proxy
curl http://localhost/api/health

# Direct backend access
curl http://localhost:3000/health
```

**Healthy Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-23T12:00:00.000Z",
  "email": {
    "status": "connected",
    "responseTime": "150ms"
  }
}
```

#### Docker Health Checks

Built-in Docker health monitoring:

```bash
# Check container health status
docker inspect --format='{{.State.Health.Status}}' toomas633-dungeon

# View health check logs
docker inspect --format='{{range .State.Health.Log}}{{.Output}}{{end}}' toomas633-dungeon
```

Health check configuration:
- **Interval**: 30 seconds
- **Timeout**: 10 seconds
- **Retries**: 3
- **Start Period**: 40 seconds

### Container Management

#### Basic Operations

```bash
# Start/stop/restart
docker start toomas633-dungeon
docker stop toomas633-dungeon
docker restart toomas633-dungeon

# Remove container
docker rm toomas633-dungeon

# View logs (follow mode)
docker logs -f toomas633-dungeon

# Shell access
docker exec -it toomas633-dungeon /bin/bash
```

#### PM2 Process Management

```bash
# List running processes
docker exec toomas633-dungeon pm2 list

# View process logs
docker exec toomas633-dungeon pm2 logs

# Process details
docker exec toomas633-dungeon pm2 show backend
docker exec toomas633-dungeon pm2 show nginx

# Restart individual process
docker exec toomas633-dungeon pm2 restart backend
docker exec toomas633-dungeon pm2 restart nginx
```

#### Logs and Debugging

```bash
# Container logs
docker logs toomas633-dungeon

# Nginx logs (inside container)
docker exec toomas633-dungeon cat /var/log/nginx/access.log
docker exec toomas633-dungeon cat /var/log/nginx/error.log

# Running processes
docker exec toomas633-dungeon ps aux
```

### Troubleshooting

#### Container Issues

```bash
# Check container logs
docker logs toomas633-dungeon

# Inspect container details
docker inspect toomas633-dungeon

# Check port conflicts (PowerShell)
netstat -ano | findstr :80
netstat -ano | findstr :3000
```

#### Health Check Failures

```bash
# Test health endpoint
curl http://localhost/api/health
curl http://localhost:3000/health

# Verify processes
docker exec toomas633-dungeon pm2 list

# Check nginx configuration
docker exec toomas633-dungeon nginx -t
```

#### Backend Not Responding

```bash
# View backend logs
docker exec toomas633-dungeon pm2 logs backend

# Check environment variables
docker exec toomas633-dungeon env | findstr EMAIL
```

#### Email Service Issues

Verify SMTP credentials are correct in your `.env` file. Common issues:
- Incorrect SMTP host or port
- Invalid authentication credentials
- Firewall blocking SMTP traffic (port 587)
- 2FA requiring app-specific password

### Updates and Maintenance

#### Rebuild After Changes

```bash
# Using docker-compose
docker-compose down
docker-compose up -d --build

# Manual rebuild
docker stop toomas633-dungeon
docker rm toomas633-dungeon
docker build -t toomas633-dungeon .
docker run -d --name toomas633-dungeon -p 80:80 --env-file backend/.env toomas633-dungeon
```

#### Clean Up

```bash
# Remove unused images
docker image prune

# Remove all stopped containers
docker container prune

# Full cleanup (careful!)
docker system prune -a
```

### Production Deployment

#### Recommended Setup

- ✅ Use reverse proxy (Traefik, Caddy, Nginx Proxy Manager) for HTTPS
- ✅ Configure proper logging and log rotation
- ✅ Use Docker secrets or vault for sensitive credentials
- ✅ Set up automated backups
- ✅ Configure container restart policies
- ✅ Monitor health checks and set up alerts
- ✅ Use specific version tags instead of `latest`

#### Example with Traefik

```yaml
version: '3.8'
services:
  app:
    image: toomas633-dungeon:latest
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.app.rule=Host(`toomas633.com`)"
      - "traefik.http.routers.app.entrypoints=websecure"
      - "traefik.http.routers.app.tls.certresolver=letsencrypt"
    env_file: backend/.env
    restart: unless-stopped
    networks:
      - traefik
```

---

## ⚙️ Configuration

### Frontend Environment Variables

Located in `frontend/.env`:

| Variable            | Description                  | Required | Example                      |
|---------------------|------------------------------|----------|------------------------------|
| `VITE_API_URL`      | Backend API endpoint         | ✅       | `http://localhost:3000/api`  |
| `VITE_GITHUB_TOKEN` | GitHub API token (optional)  | ❌       | `ghp_xxxxxxxxxxxxxxxxxxxx`   |

### Backend Environment Variables

Located in `backend/.env`:

| Variable          | Description                      | Required | Example                                      |
|-------------------|----------------------------------|----------|----------------------------------------------|
| `EMAIL_HOST`      | SMTP server hostname             | ✅       | `smtp.gmail.com`                             |
| `EMAIL_USER`      | SMTP username                    | ✅       | `info@example.com`                           |
| `EMAIL_PASS`      | SMTP password/app password       | ✅       | `your-app-password`                          |
| `EMAIL_TO`        | Recipient email                  | ✅       | `admin@example.com`                          |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-sep) | ✅       | `http://localhost:5173,https://example.com`  |

### API Endpoints

| Endpoint          | Method | Description                  | Rate Limit          |
|-------------------|--------|------------------------------|--------------------- |
| `/health`         | GET    | Server health status         | 60 req / 1 min      |
| `/api/health`     | GET    | Health check (via Nginx)     | 60 req / 1 min      |
| `/api/send-email` | POST   | Send contact form email      | 10 req / 15 min     |
| `/api/github`     | POST   | Get GitHub repository info   | 60 req / 1 min      |

For detailed API documentation with request/response examples, see [docs/API.md](docs/API.md).

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Install** dependencies in both modules
4. **Make** changes following project conventions
5. **Test** thoroughly: `npm run test` and `npm run test:coverage`
6. **Lint** your code: `npm run lint` and `npm run prettier`
7. **Type check**: `npm run type-check`
8. **Build** to verify: `npm run build`
9. **Commit** with clear messages
10. **Push** and create a Pull Request

For detailed contribution guidelines, coding standards, and development workflow, see [CONTRIBUTING.md](CONTRIBUTING.md).

### Code Quality Standards

- ✅ TypeScript strict mode enabled
- ✅ ESLint for code linting
- ✅ Prettier for code formatting
- ✅ Vitest for testing (maintain >80% coverage)
- ✅ SonarCloud quality gates must pass
- ✅ Follow existing patterns and conventions

### Module-Specific Guidelines

- **Frontend**: See [frontend/.github-copilot-instructions.md](frontend/.github-copilot-instructions.md)
- **Backend**: See [backend/.github-copilot-instructions.md](backend/.github-copilot-instructions.md)

---

## 📚 Additional Resources

### Documentation

- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines and development workflow
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and release notes
- **[Frontend Documentation](frontend/README.md)** - Vue 3 setup, components, and patterns
- **[Backend Documentation](backend/README.md)** - Express.js API, services, and middleware
- **[API Documentation](docs/API.md)** - Complete API reference with code examples
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment (Docker, VPS, SSL/TLS)
- **[Troubleshooting Guide](docs/TROUBLESHOOTING.md)** - Common issues and solutions
- **[Docker Linting](docs/DOCKER_LINTING.md)** - Docker best practices and linting

### Configuration Files

- **[Nginx Configuration](nginx.conf)** - Web server and proxy settings
- **[PM2 Configuration](ecosystem.config.cjs)** - Process management setup
- **[Docker Compose](docker-compose.yml)** - Container orchestration
- **[SonarCloud Project](https://sonarcloud.io/project/overview?id=Toomas633_Homepage)** - Code quality dashboard

### External Links

- **Live Site**: [toomas633.com](https://toomas633.com)
- **GitHub Repository**: [Toomas633/homepage](https://github.com/Toomas633/homepage)
- **Vue.js Documentation**: [vuejs.org](https://vuejs.org/)
- **Vuetify Documentation**: [vuetifyjs.com](https://vuetifyjs.com/)
- **Express.js Documentation**: [expressjs.com](https://expressjs.com/)
- **Vitest Documentation**: [vitest.dev](https://vitest.dev/)

---

## 📄 License

This project is licensed under the **GPL-3.0-only** License - see the [LICENCE](LICENCE) file for details.


## 🙏 Acknowledgments

Built with modern web technologies:
- Vue.js 3 & Vuetify 3 for the frontend
- Node.js & Express.js for the backend
- TypeScript for type safety
- Vitest for testing
- Docker for containerization
- Nginx for web serving
- PM2 for process management

---

<div align="center">

**[⬆ Back to Top](#toomas633s-dungeon)**

Made with ❤️ by [Toomas633](https://github.com/Toomas633)

</div>
