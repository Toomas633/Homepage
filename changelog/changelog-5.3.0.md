# Release Notes - v5.3.0

**Release Date:** May 27, 2026

## Overview

This minor release adds a new MeshForge project page, refreshes existing project pages for Plex Organizer and Adlist Parser, and delivers significant bug fixes including email TLS resilience and backend version reporting. It also brings a complete CI/CD overhaul with a dedicated SonarQube workflow, and ships major dependency upgrades across both modules — including Vuetify 4, Vue Router 5, Vite 8, and TypeScript 6.

## ✨ New Features

### New Project Page

- **MeshForge**: Added a dedicated project page for the MeshForge project
  - Full project description, feature breakdown, and usage documentation
  - Wired into the projects router (`frontend/src/router/projects.ts`)
  - Follows the standard project view layout with Vuetify components

## 🐛 Bug Fixes

### Backend

- **Email TLS certificate errors**: Fixed email service failures caused by certificate changes on the SMTP host
  - Added `EMAIL_REJECT_UNAUTHORIZED` environment variable to control TLS certificate validation
  - Updated `emailService.ts` to pass the option to the Nodemailer transporter
  - Updated `backend/.env.example` and `types/index.ts` to document and type the new variable
  - Added test coverage in `emailService.spec.ts`

- **Backend version reporting**: Fixed health endpoint (`/api/health`) not returning the correct version string
  - Version is now injected at build time via esbuild `define` (`__APP_VERSION__`) instead of a runtime `require('../../package.json')`
  - Eliminates a module-load failure in Docker production images where `package.json` is not copied alongside `dist/`
  - Runtime falls back through `process.env.APP_VERSION → globalThis.__APP_VERSION__ → 'unknown'`, so `tsx` dev mode and tests never throw a `ReferenceError`
  - Vitest config updated with matching `define` block so test suites resolve the constant without esbuild
  - OpenAPI spec examples (`swagger.yaml`, `swagger-paths.yaml`) and the Swagger route test updated from `2.0.3` to `2.1.1`

- **Health endpoint SMTP timeout**: Fixed `/api/health` occasionally exceeding the Docker healthcheck timeout during SMTP outages
  - `verifyEmailConnection` now accepts a `maxRetries` parameter (default remains `2` for the email-sending path)
  - The health route passes `maxRetries: 0`, making one single attempt capped at 5 s — well within the 10 s Docker `HEALTHCHECK` timeout
  - Previously three attempts × 5 s plus two 1.5 s delays could take ~18 s, causing the container to be marked unhealthy

### Frontend

- **Work information**: Corrected text content in `HomeView.vue` relating to work/employment info, including `PostgreSQL` capitalization
- **Contact form autocomplete**: Migrated project selector in `ContactView.vue` to use Vuetify 4's `:item-props` API instead of the deprecated `#item` slot pattern, fixing the prepend icon rendering

## 🚀 Performance & Quality Improvements

### Project Page Refreshes

- **Plex Organizer page**: Significant refresh and restructuring of `PlexOrganizerView.vue`
  - Improved layout, content accuracy, and component usage (69 lines added, 35 removed)
- **Adlist Parser page**: Major cleanup and simplification of `AdlistParserView.vue`
  - Removed redundant content and tightened the layout (112 lines added, 464 lines removed; net −352 lines)

## 📦 Dependency Updates

Major version bumps in both modules. See `frontend/package.json` and `backend/package.json` for exact pinned versions.

### Frontend Dependencies (v4.5.0)

**Production**
- `vue` 3.5.26 → **3.5.34**
- `vuetify` 3.11.6 → **4.0.7** *(major)*
- `vue-router` 4.6.4 → **5.0.7** *(major)*
- `axios` 1.13.2 → **1.16.1**

**Development**
- `vite` 7.3.1 → **8.0.14** *(major)*
- `typescript` 5.9.3 → **6.0.3** *(major)*
- `@vitejs/plugin-vue` 6.0.3 → **6.0.7**
- `unplugin-vue-components` 31.0.0 → **32.1.0**
- `vite-plugin-vuetify` 2.1.2 → **2.1.3**
- `eslint` 9.39.2 → **10.4.0**
- `@typescript-eslint/*` 8.53.0 → **8.60.0**
- `stylelint` 16.26.1 → **17.12.0**
- `sass` 1.97.2 → **1.100.0**
- `vitest` / `@vitest/coverage-v8` 4.0.17 → **4.1.7**
- `@vue/test-utils` 2.4.6 → **2.4.10**
- `happy-dom` 20.3.0 → **20.9.0**
- `jsdom` 27.4.0 → **29.1.1**
- `vite-plugin-vue-devtools` 8.0.5 → **8.1.2**
- `vue-tsc` 3.2.2 → **3.3.2**
- `prettier` 3.8.0 → **3.8.3**
- `@types/node` 25.0.8 → **25.9.1**

### Backend Dependencies (v2.1.1)

**Production**
- `nodemailer` 7.0.12 → **8.0.9** *(major)*
- `express-rate-limit` 8.2.1 → **8.5.2**
- `axios` 1.13.2 → **1.16.1**
- `cors` 2.8.5 → **2.8.6**
- `dotenv` 17.2.3 → **17.4.2**
- `swagger-jsdoc` 6.2.8 → **6.3.0**

**Development**
- `typescript` 5.9.3 → **6.0.3** *(major)*
- `esbuild` 0.27.2 → **0.28.0**
- `tsx` 4.21.0 → **4.22.3**
- `eslint` 9.39.2 → **10.4.0**
- `@typescript-eslint/*` 8.53.0 → **8.60.0**
- `vitest` / `@vitest/coverage-v8` 4.0.17 → **4.1.7**
- `@types/supertest` 6.0.3 → **7.2.0**
- `@types/nodemailer` 7.0.5 → **8.0.0**
- `@types/node` 25.0.8 → **25.9.1**
- `globals` 17.0.0 → **17.6.0**
- `@eslint/js` 9.39.2 → **10.0.1**
- `prettier` 3.8.0 → **3.8.3**

## 🛠️ GitHub Workflows

### New Workflows

- **`sonar.yml`**: Dedicated SonarQube analysis workflow (163 lines)
  - Runs on push to `main` / `develop` and on pull requests
  - Replaces the previous `Dockerfile-sonarscan` approach
  - Runs tests with coverage in both modules before submitting analysis
  - Removed `Dockerfile-sonarscan` (87 lines deleted) as it is no longer needed

### Updated Workflows

- **`docker.yml`**: Refactored build and push workflow
  - Improved job structure and caching strategy
  - 96 lines changed
- **`test-build.yml`**: Updated to match new dependency and build requirements
  - 96 lines changed
- **`codeql.yml`**: Minor updates for updated runner/action versions
  - 12 lines changed
- **`epic-manager.yml`**: Minor configuration updates
  - 6 lines changed

### Configuration

- **`sonar-project.properties`**: Updated source/test paths and coverage report locations to align with the new workflow (8 lines changed)

## 📚 Documentation

### Updated Documentation

- **`backend/README.md`**: Added documentation for the new `EMAIL_REJECT_UNAUTHORIZED` environment variable and updated configuration section
- **`docs/DEPLOYMENT.md`**: Added note about the TLS certificate rejection option
- **`docs/TROUBLESHOOTING.md`**: Added troubleshooting entry for email TLS certificate errors
- **`backend/.env.example`**: Added `EMAIL_REJECT_UNAUTHORIZED` example entry

## 🧪 Testing Improvements

### Backend Tests

- **`emailService.spec.ts`**: Added test cases covering the new `EMAIL_REJECT_UNAUTHORIZED` configuration option
- **`vitest.config.ts`**: Added `define` block (`__APP_VERSION__`) so test suites resolve the build-time constant without esbuild, fixing `ReferenceError` in `tests/app.spec.ts` and `tests/routes/health.spec.ts`

## 📊 Statistics

- **26 files changed**
- **4,925 insertions (+)**
- **6,112 deletions (-)**
- **9 commits** since v5.2.0

### Key File Changes

- **Frontend**: 7 files (new MeshForge view, updated Adlist Parser, Plex Organizer, Contact, router)
- **Backend**: 9 files (health route, email service, env config, types, tests, .env.example, esbuild config, vitest config, swagger yamls)
- **GitHub Workflows**: 6 files (new sonar.yml, updated docker/test-build/codeql/epic-manager, removed Dockerfile-sonarscan)
- **Dependencies**: 4 files (package.json + lockfiles for both modules)
- **Documentation/Config**: 3 files

## 🏷️ Version Information

- **Frontend**: v4.5.0
- **Backend**: v2.1.1
- **Overall Project**: v5.3.0

## ⚠️ Breaking Changes

None. This is a backward-compatible minor release.

> **Note on major dependency bumps**: Vuetify 4, Vue Router 5, Vite 8, TypeScript 6, and Nodemailer 8 are major version upgrades in their respective packages. Internal code has been updated to accommodate their APIs. No changes are required from end users or API consumers.

## 📝 Migration Notes

### Upgrading from v5.2.0

No breaking changes. Pull the latest code and rebuild:

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

### New Environment Variable (Optional)

If you experience email delivery issues due to self-signed or recently rotated TLS certificates, add the following to `backend/.env`:

```bash
# Set to "false" to disable TLS certificate validation (use with caution)
EMAIL_REJECT_UNAUTHORIZED=true
```

The default is `true` (strict validation). Set to `false` only in trusted environments where the SMTP certificate cannot be verified.

## 🐛 Known Issues

None identified in this release.

## 🔐 Security Improvements

- Email TLS enforcement is now configurable rather than silently failing, giving operators explicit control over certificate validation behaviour

## 🔗 Links

- **Repository**: [Toomas633/homepage](https://github.com/Toomas633/homepage)
- **Previous Release**: [v5.2.0](https://github.com/Toomas633/homepage/releases/tag/5.2.0)
- **Full Changelog**: [5.2.0...5.3.0](https://github.com/Toomas633/homepage/compare/5.2.0...5.3.0)
- **Live Site**: [toomas633.com](https://toomas633.com)
- **SonarCloud**: [Project Dashboard](https://sonarcloud.io/project/overview?id=Toomas633_Homepage)

## 🙏 Contributors

- @Toomas633

---
