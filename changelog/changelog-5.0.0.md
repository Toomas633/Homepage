# Release Notes - v5.0.0

**Release Date:** November 23, 2025

We're excited to announce the initial release of **Toomas633's Dungeon** v5.0.0 - a modern, full-stack personal projects homepage built with Vue 3 and Node.js!

## 🎉 What's New

This is the first official release of the platform, featuring a complete rewrite with modern technologies and best practices.

### 🏗️ Architecture

**Multi-Workspace Modular Design**

- Separate frontend and backend modules with independent development workflows
- Clean separation of concerns with dedicated build processes
- Docker support for containerized deployment
- Nginx reverse proxy configuration for production-ready hosting

### 🎨 Frontend (v4.3.0)

**Modern Vue 3 Stack**

- Vue 3 with Composition API and `<script setup>` syntax
- TypeScript for type-safe development
- Vuetify 3 for Material Design components
- Vite for lightning-fast development and optimized builds

**Features**

- Responsive, mobile-first design with device detection
- Dynamic routing with Vue Router 4
- Interactive component library including:
  - Code blocks with syntax highlighting
  - Image carousels
  - Interactive maps with Leaflet integration
  - GitHub stats and release information
  - Language statistics visualization
  - Table of contents navigation
  - Cookie consent management
  - PayPal integration for donations

**Views & Pages**

- Home page with personal introduction
- Project showcase pages
- Contact form with backend integration
- Server status displays
- Demo galleries
- Archive sections
- Privacy Policy and Terms of Service
- Custom 404 error page

**SEO & Performance**

- Custom sitemap generation plugin
- Meta tag management with `@vueuse/head`
- Optimized build with code splitting and compression
- PWA manifest support
- robots.txt and ads.txt configuration

### 🔧 Backend (v2.0.0)

**Node.js Express Server**

- TypeScript-based Express.js API
- ESM module support for modern JavaScript
- Modular architecture with clear separation of concerns

**API Endpoints**

- `/api/send-email` - Contact form email service with rate limiting
- `/api/health` - Health check endpoint with email service verification

**Security & Performance**

- CORS protection with configurable origins
- Rate limiting on all endpoints
- Email service with nodemailer integration
- Environment variable validation
- Non-root Docker deployment
- Request body parsing with body-parser

**Middleware**

- Custom CORS configuration
- Route-specific rate limiters (email and health checks)
- Error handling and logging
- TypeScript type definitions throughout

### 🧪 Testing

**Comprehensive Test Coverage**

- Vitest testing framework for both frontend and backend
- Vue component testing with `@vue/test-utils`
- API testing with `supertest`
- Coverage reporting with V8 provider
- LCOV reports for SonarCloud integration
- CI/CD integration with GitHub Actions

**Test Structure**

- Unit tests for components, services, and utilities
- Integration tests for API routes
- Test files placed alongside source code
- Global test setup configurations
- Happy-dom environment for frontend
- Node.js environment for backend

### 🐳 DevOps

**Docker Support**

- Multi-stage Docker builds for optimized images
- Docker Compose configurations for both modules
- Development and production configurations
- Health check endpoints for monitoring

**Deployment**

- PM2 ecosystem configuration for process management
- Nginx configuration for reverse proxy and static serving
- Environment-based configuration management
- Production-ready security settings

**Code Quality**

- ESLint for code linting (both modules)
- Stylelint for CSS/SCSS/Vue styles (frontend)
- Prettier for consistent formatting
- SonarQube integration for code quality analysis
- TypeScript strict mode enabled
- Pre-configured VS Code workspace settings

### 📦 Dependencies

**Frontend Core**

- Vue 3.5.24
- Vuetify 3.10.11
- Vue Router 4.6.3
- TypeScript 5.9.3
- Vite 6.2.1
- Axios 1.13.2
- Leaflet 1.9.4

**Backend Core**

- Express 5.1.0
- TypeScript 5.9.3
- Nodemailer 7.0.10
- CORS 2.8.5
- Express Rate Limit 8.2.1
- Dotenv 17.2.3

**Development Tools**

- Vitest 4.0.13 for testing
- ESLint 9.39.1 with TypeScript support
- Prettier 3.6.2
- tsx 4.20.6 for TypeScript execution
- @vitest/coverage-v8 for coverage reports

### 📝 Documentation

- Comprehensive README with project overview
- Development guide (DEVELOPMENT.md)
- Security policy (SECURITY.md)
- Module-specific README files
- GitHub Copilot instruction files for AI-assisted development
- Code comments and TypeScript interfaces throughout

### 🔐 Security

- Environment variable validation
- Rate limiting on all API endpoints
- CORS configuration with origin whitelisting
- Non-root Docker user execution
- Security policy documentation
- Input validation and sanitization
- Error handling without information leakage

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Docker (optional, for containerized deployment)

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Backend Development

```bash
cd backend
npm install
npm run dev
```

### Production Build

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
npm start
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📊 Project Statistics

- **Total Modules:** 2 (Frontend + Backend)
- **Total Dependencies:** 50+ packages
- **Test Coverage:** Comprehensive unit and integration tests
- **Supported Browsers:** Modern browsers (Chrome, Firefox, Safari, Edge)
- **Node Version:** 18.0.0+
- **License:** GPL-3.0-only

## 🔗 Links

- **Homepage:** [toomas633.com](https://toomas633.com)
- **GitHub:** [@Toomas633](https://github.com/Toomas633)
- **Discord:** 8140
- **Twitter:** [@Toomas633](https://twitter.com/Toomas633)
- **Email:** toomas@toomas633.com

## 🙏 Acknowledgments

Built with ❤️ using modern web technologies and best practices.

Special thanks to the open-source community for the amazing tools and libraries that made this project possible.

---

**Full Changelog:** This is the initial release.

For issues, feature requests, or contributions, please visit the GitHub repository.
