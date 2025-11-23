FROM node:slim AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci --ignore-scripts

COPY frontend/ ./

RUN mkdir -p .reports
RUN npm run scan:lint
RUN npm run scan:stylelint
RUN npm run type-check
RUN npm run test:coverage
RUN npm run build

FROM node:slim AS backend-build

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci --ignore-scripts

COPY backend/ ./

RUN mkdir -p .reports
RUN npm run scan:lint
RUN npm run type-check
RUN npm run test:coverage
RUN npm run build

FROM node:slim AS production-stage

ENV NODE_ENV=production
ENV EMAIL_HOST=""
ENV EMAIL_USER=""
ENV EMAIL_PASS=""
ENV EMAIL_TO=""
ENV ALLOWED_ORIGINS=""
ENV PORT=3000
ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /app

RUN apt-get update && apt-get install --no-install-recommends -y \
    nginx \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && rm -f /etc/nginx/sites-enabled/default \
    && npm install -g pm2 \
    && sed -i 's/^user /#user /' /etc/nginx/nginx.conf

COPY nginx.conf /etc/nginx/sites-available/default
RUN ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

COPY --from=frontend-build /app/frontend/dist /app/dist

COPY --from=backend-build /app/backend/dist /app/backend/dist
COPY --from=backend-build /app/backend/node_modules /app/backend/node_modules
COPY --from=backend-build /app/backend/package.json /app/backend/package.json

COPY ecosystem.config.cjs /app/ecosystem.config.cjs

RUN mkdir -p /app/logs \
    && groupadd -r appuser && useradd -r -g appuser -m appuser \
    && chown -R appuser:appuser /app \
    && chown -R appuser:appuser /var/log/nginx \
    && chown -R appuser:appuser /var/lib/nginx \
    && touch /run/nginx.pid \
    && chown -R appuser:appuser /run/nginx.pid \
    && mkdir -p /home/appuser/.pm2 \
    && chown -R appuser:appuser /home/appuser

USER appuser

EXPOSE 80 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost/api/health || exit 1

CMD ["pm2-runtime", "start", "ecosystem.config.cjs"]

# SonarScanner stage - separate target for code quality analysis
# Build with: docker buildx build --target sonar-scan --platform linux/amd64 ...
# This stage only supports linux/amd64 due to SonarScanner limitations
FROM --platform=linux/amd64 sonarsource/sonar-scanner-cli:11 AS sonar-scan

WORKDIR /app

COPY --from=frontend-build /app/frontend /app/frontend
COPY --from=backend-build /app/backend /app/backend
COPY sonar-project.properties /app/
COPY .git /app/.git

ARG GITHUB_REF_NAME=main
ARG GITHUB_PR_NUMBER=""
ARG GITHUB_BASE_REF=""
ARG GITHUB_HEAD_REF=""

# Make secret optional - if not provided, skip the scan
RUN --mount=type=secret,id=sonar_token,mode=0444,required=false \
    if [ -f /run/secrets/sonar_token ]; then \
      SONAR_TOKEN=$(cat /run/secrets/sonar_token) && \
      if [ -n "$GITHUB_PR_NUMBER" ]; then \
        sonar-scanner \
          -Dsonar.token=${SONAR_TOKEN} \
          -Dsonar.pullrequest.key=${GITHUB_PR_NUMBER} \
          -Dsonar.pullrequest.branch=${GITHUB_HEAD_REF} \
          -Dsonar.pullrequest.base=${GITHUB_BASE_REF}; \
      else \
        sonar-scanner \
          -Dsonar.token=${SONAR_TOKEN} \
          -Dsonar.branch.name=${GITHUB_REF_NAME}; \
      fi; \
    else \
      echo "Sonar token not provided, skipping scan"; \
    fi
