FROM node:24-slim AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci --ignore-scripts

COPY frontend/ ./

RUN npm run build

FROM node:24-slim AS backend-build

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci --ignore-scripts

COPY backend/ ./

RUN npm run build

FROM node:24-slim AS production-stage

ENV NODE_ENV=production
ENV EMAIL_HOST=""
ENV EMAIL_USER=""
ENV EMAIL_PASS=""
ENV EMAIL_TO=""
ENV EMAIL_TLS="true"
ENV EMAIL_PORT="587"
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
