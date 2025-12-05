# Docker Linting with Hadolint

This project uses [Hadolint](https://github.com/hadolint/hadolint) for Docker linting to ensure Dockerfiles follow best practices and security guidelines.

## Configuration

The project has **three separate** Hadolint configurations:

- **Root**: `.hadolint.yaml` - For the main multi-stage production Dockerfile
- **Frontend**: `frontend/.hadolint.yaml` - For the frontend-specific Dockerfile (Node.js + nginx)
- **Backend**: `backend/.hadolint.yaml` - For the backend-specific Dockerfile (Node.js + Express)

Each configuration is tailored to the specific requirements and package managers used in each module:
- Root config handles multi-stage builds with npm, apt-get, and SonarScanner
- Frontend config ignores apk-specific rules (uses Alpine nginx)
- Backend config ignores apt-specific rules (uses Debian slim)

## Running Docker Linting Locally

### Using Docker (Recommended)

From the **frontend** directory:

```bash
# Interactive linting with colored output
npm run docker:lint

# Generate JSON report for SonarQube
npm run scan:docker
```

From the **backend** directory:

```bash
# Interactive linting with colored output
npm run docker:lint

# Generate JSON report for SonarQube
npm run scan:docker
```

### Using Hadolint CLI

If you have Hadolint installed locally:

```bash
# From project root
hadolint --config .hadolint.yaml Dockerfile

# From frontend directory
cd frontend
hadolint --config .hadolint.yaml Dockerfile

# From backend directory
cd backend
hadolint --config .hadolint.yaml Dockerfile

# Generate JSON reports for SonarQube
hadolint --config .hadolint.yaml --format json Dockerfile > .reports/hadolint-root.json
hadolint --config frontend/.hadolint.yaml --format json frontend/Dockerfile > frontend/.reports/hadolint-frontend.json
hadolint --config backend/.hadolint.yaml --format json backend/Dockerfile > backend/.reports/hadolint-backend.json
```

## CI/CD Integration

### GitHub Actions

The project includes a dedicated `docker-lint.yml` workflow that:

1. **Runs on every push/PR** that affects Dockerfiles
2. **Matrix strategy** - lints all three Dockerfiles in parallel
3. **Generates JSON reports** for SonarQube integration
4. **Uploads artifacts** - stores reports for 30 days

The workflow runs automatically when:
- Dockerfiles are modified
- `.hadolint.yaml` is changed
- The workflow file itself is updated

### SonarQube Integration

Docker linting is integrated with SonarQube via the `sonar-scan` build target in the root Dockerfile:

1. **Hadolint is installed** in the sonar-scan stage
2. **All Dockerfiles are scanned** using their respective configs
3. **Reports are consumed** by SonarQube via module-specific `sonar.externalIssuesReportPaths`

Configuration in `sonar-project.properties`:
```properties
# Root-level Dockerfile report
sonar.externalIssuesReportPaths=.reports/hadolint-root.json

# Frontend module Dockerfile report
frontend.sonar.externalIssuesReportPaths=.reports/hadolint-frontend.json

# Backend module Dockerfile report
backend.sonar.externalIssuesReportPaths=.reports/hadolint-backend.json
```

Each module's Hadolint report is associated with the correct SonarQube module for accurate issue tracking.

### Docker Build Integration

The SonarQube analysis runs as part of the Docker build process:

```bash
# Build with SonarQube analysis (includes Hadolint)
docker buildx build --target sonar-scan \
  --secret id=sonar_token,env=SONAR_TOKEN \
  --platform linux/amd64 .
```

## Ignored Rules

Each configuration file ignores rules specific to its use case:

### Root Configuration
- **DL3008**: Pin versions in apt-get (we clean cache after installation)
- **DL3009**: Delete apt-get lists (we already do this)
- **DL3015**: Use --no-install-recommends (we already use this flag)
- **DL3016**: Pin versions in npm (we use package-lock.json)
- **DL3029**: Do not use --platform flag (needed for multi-platform builds)
- **DL3059**: Multiple consecutive RUN (intentional for build caching)

### Frontend Configuration
- **DL3018**: Pin versions in apk (we use apk update && upgrade)
- **DL3059**: Multiple consecutive RUN (intentional for build caching)
- **DL3016**: Pin versions in npm (we use package-lock.json)

### Backend Configuration
- **DL3008**: Pin versions in apt-get (curl is minimal with no heavy deps)
- **DL3015**: Use --no-install-recommends (curl has minimal dependencies)
- **DL3059**: Multiple consecutive RUN (intentional for build caching)
- **DL3016**: Pin versions in npm (we use package-lock.json)

## Common Issues and Fixes

### DL3006: Always tag image versions
❌ **Bad**: `FROM node`  
✅ **Good**: `FROM node:18-slim`

### DL3020: Use COPY instead of ADD
❌ **Bad**: `ADD file.txt /app/`  
✅ **Good**: `COPY file.txt /app/`

### DL3002: Last USER should not be root
❌ **Bad**: Running container as root  
✅ **Good**: `USER nodeuser` (we use `appuser` in production)

### DL4006: Set pipefail option
❌ **Bad**: `RUN command1 | command2`  
✅ **Good**: `SHELL ["/bin/bash", "-o", "pipefail", "-c"]` then `RUN command1 | command2`

## Security Best Practices Enforced

- ✅ Non-root user in production containers
- ✅ Minimal base images (`node:slim`, `nginx:alpine`)
- ✅ Multi-stage builds to reduce final image size
- ✅ Layer caching optimization
- ✅ Secrets management via BuildKit
- ✅ Health checks for production containers

## Resources

- [Hadolint Rules](https://github.com/hadolint/hadolint#rules)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [SonarQube External Issues](https://docs.sonarqube.org/latest/analyzing-source-code/importing-external-issues/generic-issue-import-format/)
