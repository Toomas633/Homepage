# Copilot Instructions for Toomas633

## Project Overview

- **Name:** "Toomas633's Dungeon" - Personal projects homepage
- **Versions:** Frontend v4.4.0, Backend v2.1.0
- This is a full-stack project with separate frontend and backend modules
- **Frontend:** Vue 3 + TypeScript + Vuetify 3 in `frontend/` directory
- **Backend:** Node.js Express server in `backend/` directory
- Multi-workspace VS Code setup with modular development
- Docker support and Nginx configuration for deployment
- SonarCloud integration for code quality analysis
- Comprehensive testing with Vitest for both modules

## Module-Specific Instructions

**CRITICAL:** Always consult the module-specific instruction files for detailed patterns, conventions, and implementation guidelines:

### Frontend Module (`frontend/`)
- **Detailed Instructions:** See `frontend/.github-copilot-instructions.md`
- **Stack:** Vue 3.5.26 + TypeScript 5.9.3 + Vuetify 3.11.6 + Vite 7.3.1
- **Architecture:** Component-based with strict TypeScript typing
- **Routing:** Modular Vue Router 4.6.4 with service layer organization
- **Build:** Modern Vite with extensive optimization plugins
- **Testing:** Vitest 4.0.16 with Vue Test Utils 2.4.6 and happy-dom 20.1.0 in `tests/` directory
- **When working in `frontend/`:** Always follow the patterns and conventions specified in the frontend instructions

### Backend Module (`backend/`)
- **Detailed Instructions:** See `backend/.github-copilot-instructions.md`
- **Stack:** Node.js 18+ (24+ recommended) with TypeScript 5.9.3 and Express.js 5.2.1 using ESM modules
- **Architecture:** Modular structure with TypeScript types, middleware, routes, and services
- **Features:** CORS 2.8.5, rate limiting 8.2.1, Nodemailer 7.0.12 email service, body-parser 2.2.2, GitHub API integration with Axios 1.13.2
- **Security:** Environment validation, non-root Docker user, health monitoring
- **Testing:** Vitest 4.0.16 with supertest 7.2.2 for API testing in `tests/` directory
- **Build:** esbuild 0.27.2 for fast production builds
- **API Docs:** Swagger UI 5.0.1 with OpenAPI 3.0 specification
- **When working in `backend/`:** Always follow the patterns and conventions specified in the backend instructions

## Project Page Generation (README → `projects/` view)

When asked to create or update a project page under the frontend Projects section from a GitHub repo or README:

- Use the prompt template at `.github/prompts/generate-project-view-from-readme.md` as the default standard.
- Prefer “auto-fill mode”: infer repo slug, display name, target view filename, and README raw URL from the GitHub repo link.
- Generate a Vue view in `frontend/src/views/projects/` that matches existing project pages (Vuetify layout + shared components + local Table of Contents component).
- If wiring is requested (or necessary), also update the router/navigation using the established patterns in `frontend/`.

## Workspace Structure

This is a multi-folder VS Code workspace with three main directories:
- **Root (`./`):** Project-wide configuration, Docker, Nginx, documentation
- **Frontend (`frontend/`):** Vue 3 application with complete frontend stack
- **Backend (`backend/`):** Express.js API server with modular architecture

## Key Directories & Files

### Root Level
- `Homepage.code-workspace` — Multi-folder workspace configuration
- `nginx.conf` — Nginx reverse proxy/static server config
- `ecosystem.config.cjs` — PM2 configuration for production deployment
- `sonar-project.properties` — SonarQube configuration for code quality analysis
- `Dockerfile` — Root-level container configuration
- `CONTRIBUTING.md` — Contribution guidelines and development workflow
- `CHANGELOG.md` — Version history and release notes
- `changelog/` — Detailed release notes for each version
- `changelog/changelog-template.md` — Template for creating new release changelogs
- `docs/` — Additional documentation (API, deployment, troubleshooting)

### Frontend (`frontend/`)
- `frontend/src/` — Vue 3 app source code (components, views, services, etc.)
- `frontend/vite.config.ts` — Vite build configuration with plugins
- `frontend/package.json` — Frontend dependencies and scripts
- `frontend/plugins/sitemap-plugin.ts` — Custom Vite plugin for SEO
- **See `frontend/.github-copilot-instructions.md` for detailed frontend patterns**

### Backend (`backend/`)
- `backend/src/app.ts` — Express application setup, configuration, and server entry point
- `backend/src/routes/` — API route handlers (email, health)
- `backend/src/middleware/` — CORS, rate limiting, etc.
- `backend/src/services/` — Business logic services
- `backend/src/types/` — TypeScript type definitions and interfaces
- `backend/tsconfig.json` — TypeScript compiler configuration
- **See `backend/.github-copilot-instructions.md` for detailed backend patterns**

## Build & Run

- **Frontend dev:** `npm run dev` (Vite, hot reload) — See frontend instructions for detailed setup
- **Frontend build:** `npm run build` (outputs to `dist/`) — Uses Vite with optimization plugins
- **Frontend test:** `npm run test` (Vitest in watch mode)
- **Frontend coverage:** `npm run test:coverage` (generates coverage reports)
- **Backend dev:** `npm run dev` (tsx watch, hot reload) — See backend instructions for TypeScript patterns
- **Backend build:** `npm run build` (TypeScript compilation with esbuild to `dist/`) — Fast bundler
- **Backend test:** `npm run test` (Vitest in watch mode)
- **Backend coverage:** `npm run test:coverage` (generates coverage reports)
- **Backend prod:** `node backend/dist/app.js` (or use `ecosystem.config.cjs` for PM2)
- **Docker:** Use `Dockerfile` for containerized build/deploy with TypeScript compilation
  - **Security:** Uses BuildKit secrets for sensitive data (no ARG/ENV for tokens)
  - **Multi-platform:** Supports linux/amd64 and linux/arm64 via `TARGETPLATFORM` variable
  - **Build command:** `docker build --secret id=sonar_token,env=SONAR_TOKEN .`
- **Lint:** `npm run lint` (uses TypeScript ESLint) — Module-specific configurations
- **Style lint:** `npm run stylelint` (CSS/SCSS/Vue styles) — Frontend only
- **Format:** `npm run prettier` (code formatting) — Run in each module
- **Quality scans:** `npm run scan:lint` and `npm run scan:stylelint` (for SonarQube)

## Testing

- **Framework:** Vitest for both frontend and backend
- **Frontend:** Vue component testing with `@vue/test-utils`, happy-dom environment
- **Backend:** API/route testing with `supertest`, Node.js environment
- **Test location:** Test files (`*.spec.ts`, `*.test.ts`) in dedicated `tests/` directories
- **Coverage:** V8 coverage provider with LCOV reports for SonarCloud integration
- **Configuration:** 
  - `frontend/vitest.config.ts` — Frontend test config with Vue support
  - `backend/vitest.config.ts` — Backend test config with Node.js environment
  - `frontend/tests/setup.ts` — Global test setup with Vuetify stubs
  - `backend/tests/setup.ts` — Global test setup for backend
- **CI Integration:** Tests run automatically in GitHub Actions SonarCloud workflow

## Patterns & Conventions

**IMPORTANT:** The patterns below are high-level overviews. Always refer to the module-specific instruction files for detailed implementation patterns:

### Frontend Patterns (see `frontend/.github-copilot-instructions.md`)
- **Component structure:** Vue SFCs in `src/components/`, composables/helpers in `src/helpers/`
- **TypeScript:** Strict typing with interfaces in `src/types/`
- **Services:** API and utility services in `src/services/`
- **Routing:** Modular Vue Router config in `src/router/`
- **Styling:** SCSS with Vuetify 3 theming and custom styles

### Backend Patterns (see `backend/.github-copilot-instructions.md`)
- **TypeScript + ESM:** All files use `.ts` extension with TypeScript compilation and modern import/export
- **Architecture:** Modular Express with TypeScript types, middleware, routes, services, utilities
- **Configuration:** Environment validation with TypeScript interfaces and structured config exports
- **Security:** CORS protection, rate limiting, non-root Docker deployment with TypeScript build process

## External Integrations

- **Email, GitHub, Minecraft:** See `src/services/` for API integrations.
- **PayPal:** Payment button in `src/components/PayPalBtn.vue`.
- **Nginx/Docker:** For deployment, see `nginx.conf` and `Dockerfile`.
- **SonarCloud:** Quality scanning integrated in Docker build using BuildKit secrets

## Docker & Deployment

### Docker Security Best Practices
- **Secrets Management:** SONAR_TOKEN passed via BuildKit secrets (not ARG/ENV)
  - Dockerfile uses `RUN --mount=type=secret,id=sonar_token`
  - GitHub workflows use `secrets: sonar_token=${{ secrets.SONAR_TOKEN }}`
  - Never expose sensitive data in build args or environment variables
- **Multi-platform Support:** Uses `ARG TARGETPLATFORM` for dynamic platform selection
  - Supports both linux/amd64 and linux/arm64
  - Platform automatically set by BuildKit during multi-platform builds
- **Non-root User:** Production stage runs as `appuser` for security
- **Health Checks:** Built-in health monitoring via `/api/health` endpoint

### Docker Build Examples
```bash
# Local build with secrets
docker build --secret id=sonar_token,env=SONAR_TOKEN .

# Multi-platform build
docker buildx build --platform linux/amd64,linux/arm64 \
  --secret id=sonar_token,env=SONAR_TOKEN .
```

### GitHub Actions Integration
- **test-build.yml:** Automated builds on push/PR with multi-platform support
- **docker.yml:** Production builds with versioned tags
- Both workflows use `docker/build-push-action@v6` with secrets support
- Automatic cache management via registry cache

## Special Notes

- **Multi-workspace setup:** Frontend and backend are separate npm projects with their own dependencies
- **Testing:** Vitest configured for both modules with coverage reporting
- **CI/CD:** GitHub Actions workflows updated for multi-workspace structure
- **No monorepo tools** (e.g., Lerna, Turborepo) in use - each module is independent
- **SonarCloud:** Integrated with coverage reporting from both modules

## Examples

### Frontend Development (detailed patterns in `frontend/.github-copilot-instructions.md`)
- To add a new Vue component: place `.vue` file in `src/components/`, register in parent or router as needed
- To add a new API service: add to `src/services/` (see `emailService.ts`, `githubService.ts`, `minecraftService.ts`), use TypeScript types from `src/types/`
- To update environment/config: edit `src/constants/env.ts`
- For cookie consent: main component is `src/components/CookieConsent.vue` with supporting components in `src/components/cookies/`
- To add tests: create `*.spec.ts` file in `tests/` directory, use `@vue/test-utils` for component tests

### Backend Development (detailed patterns in `backend/.github-copilot-instructions.md`)
- To add a new API route: create in `src/routes/` with TypeScript types and Router pattern, import to `src/app.ts`
- To add middleware: create in `src/middleware/` with TypeScript types, export configured function
- To add business logic: create service in `src/services/` with TypeScript interfaces and proper error handling
- To add utilities: create helpers in `src/utils/` with TypeScript types and named exports
- To add types: define interfaces in `src/types/index.ts` for shared type definitions
- To add tests: create `*.spec.ts` file in `tests/` directory, use `supertest` for API tests

---

## Release & Changelog Management

### Creating a New Release Changelog

When creating a new release changelog, follow these steps:

1. **Use the Template**: Start with `changelog/changelog-template.md` as the base
2. **Naming Convention**: Create file as `changelog/changelog-X.Y.Z.md`
3. **Gather Changes**: Review commits since last release using `git log --stat PREVIOUS_TAG..HEAD`
4. **Fill Sections**: 
   - Include all relevant sections from the template
   - Remove sections that don't apply (e.g., "New Features" for patch releases)
   - Keep "Known Issues" section even if none (state "None identified")
5. **Update Main Changelog**: Add entry to `CHANGELOG.md` with summary and link to detailed changelog
6. **Version Consistency**: Ensure version numbers match across:
   - `frontend/package.json`
   - `backend/package.json`
   - Changelog files
   - Documentation references

### Changelog Section Order

The standard section order (based on v5.1.0/v5.1.1 format):
1. Overview
2. New Features (major/minor) OR Bug Fixes (patch)
3. Performance & Quality Improvements
4. Dependency Updates (if applicable)
5. GitHub Workflows
6. Documentation
7. Configuration
8. Testing Improvements
9. Statistics
10. Version Information
11. Breaking Changes
12. Migration Notes
13. Known Issues
14. Security Improvements
15. Links
16. Contributors

### Release Types

- **Major (X.0.0)**: Breaking changes, architectural changes
- **Minor (X.Y.0)**: New features, non-breaking enhancements
- **Patch (X.Y.Z)**: Bug fixes, optimizations, documentation

### Example References

- **Major Release**: `changelog/changelog-5.0.0.md`
- **Minor Release**: `changelog/changelog-5.1.0.md`
- **Patch Release**: `changelog/changelog-5.1.1.md`

---

## Documentation References

For comprehensive information, consult these documentation files:

### Getting Started
- **[README.md](../README.md)** - Project overview, quick start, architecture
- **[CONTRIBUTING.md](../CONTRIBUTING.md)** - Contribution guidelines, coding standards, PR process
- **[CHANGELOG.md](../CHANGELOG.md)** - Version history and release notes

### Module Documentation
- **[frontend/README.md](../frontend/README.md)** - Frontend architecture, dependencies, patterns
- **[frontend/.github-copilot-instructions.md](../frontend/.github-copilot-instructions.md)** - Frontend development patterns
- **[backend/README.md](../backend/README.md)** - Backend architecture, API endpoints, configuration
- **[backend/.github-copilot-instructions.md](../backend/.github-copilot-instructions.md)** - Backend development patterns

### Technical Documentation
- **[docs/API.md](../docs/API.md)** - Complete API reference with examples
- **[docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md)** - Production deployment guide (Docker, VPS, SSL)
- **[docs/TROUBLESHOOTING.md](../docs/TROUBLESHOOTING.md)** - Common issues and solutions
- **[docs/DOCKER_LINTING.md](../docs/DOCKER_LINTING.md)** - Docker linting configuration

### Configuration Files
- `vite.config.ts` - Frontend build configuration
- `tsconfig.json` - TypeScript compiler settings (both modules)
- `vitest.config.ts` - Test configuration (both modules)
