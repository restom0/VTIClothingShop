# syntax=docker/dockerfile:1.7

ARG NODE_IMAGE=node:24-alpine
ARG NGINX_IMAGE=nginx:1.27-alpine

# --------------------------------------------------------------------------
# Dependencies: cached until package.json / yarn.lock change.
# --ignore-scripts matches the CI install (.github/workflows/node.js.yml).
# --------------------------------------------------------------------------
FROM ${NODE_IMAGE} AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-scripts

# --------------------------------------------------------------------------
# Build
# --------------------------------------------------------------------------
FROM ${NODE_IMAGE} AS builder
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Vite inlines these at build time; pass with --build-arg.
ARG VITE_REACT_APP_CLOUD_NAME=""
ARG VITE_REACT_APP_APIKEY=""
ARG VITE_ENABLE_REACT_MONITOR=""
ENV VITE_REACT_APP_CLOUD_NAME=${VITE_REACT_APP_CLOUD_NAME} \
    VITE_REACT_APP_APIKEY=${VITE_REACT_APP_APIKEY} \
    VITE_ENABLE_REACT_MONITOR=${VITE_ENABLE_REACT_MONITOR}

RUN yarn build

# --------------------------------------------------------------------------
# Runtime: static assets only, served unprivileged on 8080.
# --------------------------------------------------------------------------
FROM ${NGINX_IMAGE} AS runtime

LABEL org.opencontainers.image.title="vti-clothing-shop-client" \
      org.opencontainers.image.licenses="Apache-2.0"

COPY <<'NGINX_CONF' /etc/nginx/conf.d/default.conf
server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;

    # Hashed build assets are immutable.
    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files $uri =404;
    }

    location /health {
        access_log off;
        return 200 "ok\n";
    }

    # SPA history fallback.
    location / {
        try_files $uri $uri/ /index.html;
    }
}
NGINX_CONF

COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Official nginx image needs a writable pid path to run as a non-root user;
# the "user" directive is meaningless (and warns) once the master is unprivileged.
RUN sed -i -e 's|^pid .*|pid /tmp/nginx.pid;|' -e '/^user /d' /etc/nginx/nginx.conf \
    && chown -R nginx:nginx /var/cache/nginx /etc/nginx/conf.d

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q -O- http://127.0.0.1:8080/health | grep -q ok || exit 1

CMD ["nginx", "-g", "daemon off;"]
