# Release Notes - v5.1.0

**Release Date:** December 4, 2025

## Overview

This minor release includes new features for backend version display, bug fixes, test improvements, extensive documentation additions, Docker linting with Hadolint, build optimizations with esbuild, and dependency upgrades across both frontend and backend modules. Key highlights include backend version display in the UI, navigation improvements, comprehensive Docker linting setup, esbuild integration for faster backend builds, and production-ready documentation suite.

## ✨ New Features

### UI Enhancements

- **Backend Version Display**: Added backend version information to the UI for better system transparency and monitoring
- **Navigation Improvements**: Reorganized navigation structure with headers moved to submenu for improved user experience
- **Node.js Branding**: Added Node.js brand icon asset for technology stack visualization

### Backend Improvements

- **Health Endpoint**: Enhanced health check endpoint with version information
- **Environment Configuration**: Improved environment variable handling and validation

### Docker & DevOps

- **Hadolint Integration**: Added comprehensive Docker linting with Hadolint for all three Dockerfiles (root, frontend, backend)
  - Dedicated `.hadolint.yaml` configurations for each module
  - GitHub Actions workflow for automated Docker linting
  - SonarQube integration for Docker quality analysis
- **Build Optimization**: Improved multi-stage Docker builds with better layer caching
- **Dockerfile Separation**: Created dedicated `Dockerfile-sonarscan` for SonarQube analysis
- **CodeQL Workflow**: Updated GitHub CodeQL analysis configuration

## 🐛 Bug Fixes

### Build & Deployment

- **Docker Build**: Fixed Docker image building process for reliable containerization
- **Test Suite**: Resolved failing tests across both frontend and backend modules
- **Styling**: Various styling fixes for improved visual consistency

### Code Quality

- **SonarQube**: Addressed code quality issues and technical debt identified by SonarQube analysis
- **Test Coverage**: Improved test reliability and coverage across all modules
- **Docker Linting**: Implemented Hadolint for enforcing Docker best practices and security standards
- **Build Optimization**: Enhanced multi-stage builds with better layer caching and reduced image sizes

## 🚀 Performance & Quality Improvements

### Build Optimizations

- **Multi-stage Builds**: Optimized Dockerfile stages for faster builds and smaller images
- **Layer Caching**: Improved build layer organization for better cache utilization
- **Context Reduction**: Enhanced `.dockerignore` to reduce build context size
- **Parallel Builds**: Better support for multi-platform builds (amd64, arm64)
- **esbuild Integration**: Backend now uses esbuild 0.27.1 for fast production builds instead of tsc, significantly improving build times

### Code Quality Tooling

- **Hadolint Integration**: Comprehensive Docker linting enforcing security and best practices
  - Automated CI/CD integration via GitHub Actions
  - Module-specific configurations for tailored linting
  - SonarQube integration for unified quality reporting
- **Security Scanning**: Updated CodeQL workflow for enhanced security analysis
- **Documentation Standards**: Established comprehensive documentation structure

## 📦 Dependency Updates

### Backend Dependencies

- TypeScript 5.9.3
- Express.js 5.2.1
- Nodemailer 7.0.11
- esbuild 0.27.1 (new fast bundler for production builds)
- Vitest 4.0.15
- Prettier 3.7.4
- CORS 2.8.5
- Rate Limiting 8.2.1
- Various security and maintenance updates

### Frontend Dependencies

- Vue 3.5.25
- Vuetify 3.11.2
- Vite 7.2.6
- Vitest 4.0.15
- Prettier 3.7.4
- Vue Router 4.6.3
- Axios 1.13.2
- Various tooling and plugin updates

## 🛠️ GitHub Workflows

### Updated Workflows

- **docker.yml**: Enhanced Docker build and deployment pipeline with multi-platform support
- **test-build.yml**: Improved build and test automation with better error handling
- **codeql.yml**: Updated CodeQL analysis for security scanning
- **docker-lint.yml**: New workflow for automated Hadolint Docker linting (added via Hadolint integration)
- **epic-manager.yml**: Updates to epic management workflow

## 📚 Documentation

### New Documentation Files

- **[API.md](../docs/API.md)**: Complete API reference with detailed endpoint documentation, request/response examples, error codes, and testing examples
- **[DEPLOYMENT.md](../docs/DEPLOYMENT.md)**: Comprehensive production deployment guide covering Docker, VPS, reverse proxy, SSL/TLS, monitoring, and backup strategies
- **[DOCKER_LINTING.md](../docs/DOCKER_LINTING.md)**: Docker linting documentation with Hadolint configuration, CI/CD integration, and best practices
- **[TROUBLESHOOTING.md](../docs/TROUBLESHOOTING.md)**: Extensive troubleshooting guide for development, Docker, deployment, runtime, email, network, and performance issues
- **[CONTRIBUTING.md](../CONTRIBUTING.md)**: Detailed contribution guidelines with workflow, coding standards, and testing requirements
- **Changelog Files**: Added versioned changelog files for v5.0.0, v5.0.1, and v5.1.0 in `changelog/` directory

### Copilot Instructions

- **Root Instructions**: Enhanced project overview with testing information and SonarQube MCP integration
- **Frontend Instructions**: Updated Vue 3 component and testing patterns with comprehensive examples
- **Backend Instructions**: Improved TypeScript and Express.js guidelines with ESM module patterns
- **SonarQube MCP**: Added new integration instructions for code quality tooling

### README Updates

- **Main README**: Major update with improved structure, comprehensive testing section, Docker deployment guide, and complete documentation index
- **Frontend README**: Enhanced module-specific documentation with test configuration, Vitest setup, and coverage reporting
- **Backend README**: Improved backend setup, testing, development guides, and API endpoint documentation

## 🔧 Configuration

### Backend Configuration

- Enhanced environment variable management
- Improved CORS and rate limiting configuration
- Updated test setup and coverage configuration
- Added Hadolint configuration for Docker best practices

### Frontend Configuration

- ESLint configuration improvements
- Updated Vite build configuration
- Enhanced test setup with Vuetify stubs
- Added Hadolint configuration for Docker linting

### Root Configuration

- **Hadolint**: Added comprehensive Docker linting configuration
- **SonarQube**: Enhanced `sonar-project.properties` with Hadolint report integration
- **.dockerignore**: Optimized to reduce build context size
- **Dockerfile-sonarscan**: New dedicated Dockerfile for SonarQube analysis

## 🧪 Testing Improvements

### Backend Tests

- Fixed test suite setup and configuration
- Improved test reliability for routes, middleware, and services
- Enhanced coverage reporting for SonarCloud integration

### Frontend Tests

- Updated component test patterns
- Improved helper and utility test coverage
- Fixed service and plugin tests

## 📊 Statistics

- **28 files changed** (major documentation and tooling update)
- **3,569 insertions (+)**
- **183 deletions (-)**
- **8 commits** since v5.0.1

### Key Additions

- 4 new comprehensive documentation files (API, Deployment, Docker Linting, Troubleshooting)
- 3 Hadolint configurations (root, frontend, backend)
- 3 versioned changelog files
- 1 new Dockerfile for SonarQube scanning
- CONTRIBUTING.md with detailed guidelines

## 🏷️ Version Information

- **Frontend**: v4.3.2
- **Backend**: v2.0.2
- **Overall Project**: v5.1.0

## ⚠️ Breaking Changes

None. This is a backward-compatible release.

## 📝 Migration Notes

No migration steps required. This release is fully backward-compatible with v5.0.1.

For new deployments, refer to:
- [DEPLOYMENT.md](../docs/DEPLOYMENT.md) for production setup
- [TROUBLESHOOTING.md](../docs/TROUBLESHOOTING.md) for common issues
- [API.md](../docs/API.md) for API reference

## 🔐 Security Improvements

- **Docker Best Practices**: Enforced via Hadolint linting
- **CodeQL Analysis**: Updated security scanning workflow
- **Documentation**: Added comprehensive security guidelines in deployment docs

## 🔗 Links

- **Repository**: [Toomas633/homepage](https://github.com/Toomas633/homepage)
- **Previous Release**: [v5.0.1](https://github.com/Toomas633/homepage/releases/tag/5.0.1)
- **Full Changelog**: [5.0.1...5.1.0](https://github.com/Toomas633/homepage/compare/5.0.1...5.1.0)

## 🙏 Contributors

- @Toomas633

---
