# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

For detailed release notes, see the `changelog/` directory.

---

## [5.3.1] - 2026-06-19

### Fixed
- Assets not loading in production due to Vite build configuration (fixed asset path handling and updated documentation)
- Backend not starting when email configuration is missing (added better error handling and documentation for required environment variables)

### Changed
- Dependency updates across frontend and backend

**Statistics**: 13 files changed, 9,057 insertions(+), 3,771 deletions(-)

**Full Release Notes**: [changelog-5.3.1.md](changelog/changelog-5.3.1.md)

---

## [5.3.0] - 2026-05-27

### Added
- New MeshForge project page with full feature documentation and router entry
- Dedicated SonarQube analysis GitHub workflow (`sonar.yml`) replacing the previous `Dockerfile-sonarscan` approach
- `EMAIL_REJECT_UNAUTHORIZED` environment variable for configurable email TLS certificate validation

### Fixed
- Email service failures caused by TLS certificate changes on the SMTP host
- Backend health endpoint version field now injected at build time (eliminates runtime `require` failure in Docker images and `ReferenceError` in tests)
- Health endpoint capped to a single SMTP attempt so Docker healthcheck timeout (~10 s) is never exceeded during SMTP outages
- `PostgreSQL` capitalization in `HomeView.vue`
- Work information text in `HomeView.vue`
- Contact form project autocomplete prepend icon (migrated to Vuetify 4 `:item-props` API)
- Stale `2.0.3` version examples in OpenAPI spec updated to match `2.1.1`

### Changed
- Refreshed Plex Organizer and Adlist Parser project pages (improved layout, simplified content)
- Refactored and updated all GitHub CI/CD workflows (`docker.yml`, `test-build.yml`, `codeql.yml`, `epic-manager.yml`)
- Updated `sonar-project.properties` to align with new workflow paths
- Major dependency upgrades: Vuetify 3→4, Vue Router 4→5, Vite 7→8, TypeScript 5→6, Nodemailer 7→8, and many others

**Statistics**: 26 files changed, 4,925 insertions(+), 6,112 deletions(-)

**Full Release Notes**: [changelog-5.3.0.md](changelog/changelog-5.3.0.md)

---

## [5.2.0] - 2026-01-16

### Added
- Backend Swagger/OpenAPI documentation with interactive Swagger UI
- Backend GitHub proxy endpoint (`/api/github`) for repo license/languages/latest release
- New frontend demo view (Homepage demo)
- New project page for Adlist Parser
- New reusable frontend components/helpers for icon lists and tree views

### Fixed
- Redirect and 404 handling for smoother SPA navigation
- PayPal icon rendering (moved away from Font Awesome icon usage)
- Styling and URL hash handling improvements

### Changed
- GitHub requests moved from frontend directly to the backend service
- Dependency updates across frontend and backend
- Refactoring and cleanup across codebase for maintainability

**Statistics**: ~107 files changed, 7,939 insertions(+), 4,118 deletions(-)

**Full Release Notes**: [changelog-5.2.0.md](changelog/changelog-5.2.0.md)

---

## [5.1.1] - 2025-12-05

### Fixed
- SonarQube code quality issues in backend environment configuration
- Styling issues in MinecraftView component
- Docker image build process optimization
- Enhanced test coverage with environment configuration tests

### Changed
- **Icon Organization**: Moved technology icons from `frontend/icons/` to `frontend/src/assets/icons/logos/`
  - Better integration with Vite's asset pipeline
  - Improved build-time asset handling
- **SEO Enhancements**: Comprehensive improvements to meta tags and route metadata
  - Enhanced Open Graph and Twitter Card support
  - Improved structured data markup
  - Better route-level SEO configuration
- **Docker Optimizations**: Improved multi-stage build process
  - Better layer caching for faster builds
  - Reduced image size
  - Enhanced environment variable handling
- **Documentation Updates**: Updated all documentation with current version references
  - API documentation with version 2.0.3
  - Deployment guide with esbuild references
  - README files across all modules
  - Copilot instruction files
- **Changelog Template**: Added standardized template for creating future release changelogs

**Statistics**: ~50 files changed, 570 insertions(+), 200 deletions(-)

**Full Release Notes**: [changelog-5.1.1.md](changelog/changelog-5.1.1.md)

---

## [5.1.0] - 2025-12-04

### Added
- Backend version display in UI with health endpoint version information
- Node.js brand icon asset for technology stack visualization
- **Hadolint Integration**: Comprehensive Docker linting for all three Dockerfiles (root, frontend, backend)
  - Dedicated `.hadolint.yaml` configurations for each module
  - GitHub Actions workflow for automated Docker linting
  - SonarQube integration for Docker quality analysis
- **Extensive Documentation Suite**:
  - [API.md](docs/API.md) - Complete API reference with examples
  - [DEPLOYMENT.md](docs/DEPLOYMENT.md) - Production deployment guide
  - [DOCKER_LINTING.md](docs/DOCKER_LINTING.md) - Docker linting documentation
  - [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) - Comprehensive troubleshooting guide
  - [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines and workflow
  - Versioned changelog files (v5.0.0, v5.0.1, v5.1.0)
- Dedicated `Dockerfile-sonarscan` for SonarQube analysis
- Improved navigation structure with submenu reorganization
- **esbuild Integration**: Fast JavaScript bundler for backend production builds

### Fixed
- Docker image building process for reliable containerization
- Failing tests across frontend and backend modules
- Various styling issues for improved visual consistency
- SonarQube code quality issues and technical debt

### Changed
- **Dependencies Updated**:
  - TypeScript 5.9.3
  - Vitest 4.0.15
  - Express.js 5.2.1
  - Vue 3.5.25
  - Vuetify 3.11.2
  - Vite 7.2.6
  - Prettier 3.7.4
  - esbuild 0.27.1 (backend build tool)
  - Axios 1.13.2
  - Nodemailer 7.0.11
- **Build Optimizations**:
  - Backend now uses esbuild for fast production builds (replacing tsc)
  - Enhanced multi-stage Docker builds with better layer caching
  - Improved `.dockerignore` for reduced build context
  - Better support for multi-platform builds (amd64, arm64)
- **Documentation Updates**:
  - All READMEs updated with current dependency versions
  - Copilot instructions updated for frontend, backend, and root
  - API documentation updated with latest endpoint information
  - Deployment guide enhanced with esbuild references
- **GitHub Workflows**:
  - Enhanced docker.yml with multi-platform support
  - Updated test-build.yml with better error handling
  - Updated codeql.yml for security scanning
  - Updated epic-manager.yml workflow
- **Configuration**:
  - Enhanced SonarQube properties with Hadolint integration
  - Improved environment variable management
  - Updated CORS and rate limiting configuration

### Security
- Docker best practices enforced via Hadolint
- Updated CodeQL security scanning workflow
- Comprehensive security guidelines in deployment documentation

**Statistics**: 28 files changed, 3,569 insertions(+), 183 deletions(-)

**Full Release Notes**: [changelog-5.1.0.md](changelog/changelog-5.1.0.md)

---

## [5.0.1] - 2025-11-23

### Changed
- Repository migrated to dedicated homepage repository
- Renamed workspace from `Toomas633.code-workspace` to `Homepage.code-workspace`
- Updated all documentation for new repository structure
- Fixed PM2 ecosystem configuration
- Updated SonarCloud project configuration

### Removed
- `DEVELOPMENT.md` in favor of module-specific README files

**Full Release Notes**: [changelog-5.0.1.md](changelog/changelog-5.0.1.md)

---

## [5.0.0] - 2025-11-22

### Added
- **Complete Project Restructure**: Migrated from monolithic to multi-module architecture
- **Backend Module**: New Express.js TypeScript backend with email service
- **Frontend Module**: Refactored Vue 3 application with improved structure
- **Testing**: Comprehensive test suites with Vitest for both modules
- **Docker Support**: Multi-stage Docker builds with docker-compose
- **Code Quality**: ESLint, Prettier, Stylelint, and SonarCloud integration
- **Documentation**: Extensive README files and development guides

### Frontend (v4.3.0)
- Vue 3.5.24 with Composition API
- Vuetify 3 for Material Design
- Vite 7.0.5 build system
- TypeScript 5.7.2
- Comprehensive testing with Vitest

### Backend (v2.0.0)
- Express.js 5.1.0 with TypeScript
- Nodemailer email service
- CORS and rate limiting
- Health monitoring endpoints
- ESM modules with strict TypeScript

### DevOps
- Multi-stage Docker builds
- PM2 process management
- Nginx configuration
- GitHub Actions workflows
- SonarCloud quality gates

**Full Release Notes**: [changelog-5.0.0.md](changelog/changelog-5.0.0.md)

---

## Version History

| Version | Date | Type | Description |
|---------|------|------|-------------|
| **5.1.1** | 2025-12-05 | Patch | SonarQube fixes, SEO enhancements, Docker optimizations, icon reorganization, documentation updates |
| **5.1.0** | 2025-12-04 | Minor | Backend version display, navigation improvements, Hadolint integration, esbuild build tool, extensive documentation, dependency updates |
| **5.0.1** | 2025-11-23 | Patch | Repository migration, documentation updates |
| **5.0.0** | 2025-11-22 | Major | Complete restructure to multi-module architecture |

---

## Versioning Scheme

This project uses **semantic versioning** (SemVer):

- **Major version** (X.0.0): Breaking changes, major architectural changes
- **Minor version** (X.Y.0): New features, non-breaking changes
- **Patch version** (X.Y.Z): Bug fixes, small improvements

### Module Versions

The project consists of two main modules with independent versioning:

- **Frontend**: Currently v4.5.0
- **Backend**: Currently v2.1.1

The overall project version (5.x.x) represents the combined release version.

---

## Links

- **Repository**: [https://github.com/Toomas633/homepage](https://github.com/Toomas633/homepage)
- **Live Site**: [https://toomas633.com](https://toomas633.com)
- **Issues**: [https://github.com/Toomas633/homepage/issues](https://github.com/Toomas633/homepage/issues)
- **SonarCloud**: [https://sonarcloud.io/project/overview?id=Toomas633_Homepage](https://sonarcloud.io/project/overview?id=Toomas633_Homepage)

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

---

**Note**: Detailed release notes for each version are available in the `changelog/` directory.
