# Release Notes - v5.2.0

**Release Date:** January 16, 2026

## Overview

This minor release adds a Swagger/OpenAPI documentation experience to the backend, introduces a backend GitHub proxy endpoint, and expands the frontend’s project/demo content. It also includes refactoring, dependency updates, and multiple UX fixes around routing and assets.

## ✨ New Features

### Backend API Documentation (Swagger)

- **Interactive Swagger UI**: Added interactive API docs at `/api/swagger-ui` and JSON spec at `/api/swagger-ui.json`
  - Added OpenAPI YAML sources and loader in the backend config
  - Added test coverage for Swagger setup and endpoints

### GitHub Integration via Backend

- **GitHub proxy endpoint**: Added `/api/github` endpoint that fetches repository info (license, languages, latest release)
  - Moves GitHub API token usage server-side for better security and rate-limit handling
  - Optional `GITHUB_TOKEN` support for higher API rate limits

### Frontend Pages & UI Components

- **New demo page**: Added a new homepage-related demo view under the Demos section
- **New project page**: Added a dedicated view for Adlist Parser
- **New reusable UI**: Added new components and helpers for rendering icon lists and tree views

## 🐛 Bug Fixes

### Routing & UX

- **Redirect/404 handling**: Improved redirect behavior and 404 handling to better support SPA navigation and refreshes
- **URL hash handling**: Expanded `#` usage in URLs where needed

### UI & Assets

- **PayPal icon rendering**: Fixed PayPal button icon rendering (migrated away from Font Awesome icon usage)
- **Styling fixes**: Multiple small visual consistency fixes across views and components

## 🚀 Performance & Quality Improvements

### Refactors & Cleanup

- **General refactor**: Codebase refactoring across frontend and backend for improved maintainability
- **Constants consolidation**: Reduced duplication by reorganizing project-related constants

## 📦 Dependency Updates

- Updated frontend and backend dependencies (see `frontend/package.json`, `backend/package.json`, and lockfiles for exact versions)

## 📚 Documentation

### Updated Documentation

- Updated API documentation to reflect new endpoints and Swagger usage
- Updated deployment/troubleshooting docs for the new backend capabilities and routing behavior

## 🔧 Configuration

- Updated Docker and Sonar-related configuration files as part of the release’s build/quality improvements

## 🧪 Testing Improvements

### Backend Tests

- Added test coverage for Swagger endpoints and GitHub proxy functionality

### Frontend Tests

- Added/updated tests for new helper logic and service behavior

## 📊 Statistics

- **~107 files changed**
- **7,939 insertions (+)**
- **4,118 deletions (-)**
- **15 commits** since v5.1.1

### Key File Changes

- **Backend**: 26 files (Swagger config, GitHub route/service, tests)
- **Frontend**: 67 files (new views, components, helpers, router updates)
- **Documentation**: 3 files
- **Docker**: 4 files
- **GitHub Metadata**: 2 files
- **Root Misc**: 5 files

## 🏷️ Version Information

- **Frontend**: v4.4.0
- **Backend**: v2.1.0
- **Overall Project**: v5.2.0

## ⚠️ Breaking Changes

None. This is a backward-compatible minor release.

## 📝 Migration Notes

### Upgrading from v5.1.1

This is a straightforward minor release with no breaking changes. Pull the latest code and rebuild:

```bash
# Pull latest changes
git pull origin main

# Frontend
cd frontend
npm install
npm run build

# Backend
cd ../backend
npm install
npm run build

# Docker (if using containerized deployment)
docker-compose down
docker-compose up -d --build
```

### Environment Variables

- **Optional**: Set `GITHUB_TOKEN` in `backend/.env` to increase GitHub API rate limits for `/api/github`.
- No other new environment variables are required.

## 🐛 Known Issues

None identified in this release.

## 🔐 Security Improvements

- Reduced client-side exposure by routing GitHub API calls through the backend
- Maintained existing CORS and rate limiting protections

## 🔗 Links

- **Repository**: [Toomas633/homepage](https://github.com/Toomas633/homepage)
- **Previous Release**: [v5.1.1](https://github.com/Toomas633/homepage/releases/tag/5.1.1)
- **Full Changelog**: [5.1.1...5.2.0](https://github.com/Toomas633/homepage/compare/5.1.1...5.2.0)
- **Live Site**: [toomas633.com](https://toomas633.com)
- **SonarCloud**: [Project Dashboard](https://sonarcloud.io/project/overview?id=Toomas633_Homepage)

## 🙏 Contributors

- @Toomas633

---
