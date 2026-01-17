FROM node:25-alpine AS frontend-build

ARG VITE_APP_ENV="production"

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci --ignore-scripts

COPY frontend/ ./

RUN VITE_APP_ENV="${VITE_APP_ENV}" npm run build

FROM node:25-alpine AS backend-build

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci --ignore-scripts

COPY backend/ ./

RUN npm run build

FROM nginx:alpine-slim AS production-stage

ENV NODE_ENV=production
ENV EMAIL_HOST=""
ENV EMAIL_USER=""
ENV EMAIL_PASS=""
ENV EMAIL_TO=""
ENV EMAIL_TLS="true"
ENV EMAIL_PORT="587"
ENV ALLOWED_ORIGINS=""
ENV PORT=3000

WORKDIR /app

RUN apk add --no-cache curl nodejs tini \
    && rm -rf /var/cache/apk/* \
    && rm -f /etc/nginx/conf.d/default.conf \
    && sed -i 's|/run/nginx.pid|/tmp/nginx.pid|g' /etc/nginx/nginx.conf \
    && sed -i '/^user /d' /etc/nginx/nginx.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=frontend-build /app/frontend/dist /app/frontend
COPY --from=backend-build /app/backend/dist /app/backend
COPY --from=backend-build /app/backend/node_modules/swagger-ui-dist /app/backend/node_modules/swagger-ui-dist

RUN addgroup -g 1000 appuser \
    && adduser -D -u 1000 -G appuser appuser \
    && mkdir -p /app/logs /tmp/nginx /var/cache/nginx /var/lib/nginx/logs \
    && chown -R appuser:appuser /app \
    && chown -R appuser:appuser /var/log/nginx \
    && chown -R appuser:appuser /var/cache/nginx \
    && chown -R appuser:appuser /var/lib/nginx \
    && chown -R appuser:appuser /tmp/nginx \
    && touch /tmp/nginx.pid \
    && chown appuser:appuser /tmp/nginx.pid

COPY <<'EOF' /app/entrypoint.sh
#!/bin/sh
set -e

nginx -g "daemon off;" &
NGINX_PID=$!

cd /app/backend && node app.cjs &
BACKEND_PID=$!

wait -n $NGINX_PID $BACKEND_PID

kill $NGINX_PID $BACKEND_PID 2>/dev/null || true
exit $?
EOF

RUN chmod 755 /app/entrypoint.sh

USER appuser

EXPOSE 80 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost/api/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["/bin/sh", "/app/entrypoint.sh"]
