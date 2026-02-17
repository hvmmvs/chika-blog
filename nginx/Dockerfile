FROM node:20-alpine AS frontend-build

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ .
RUN npm run build

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf.template /etc/nginx/nginx.conf.template
COPY nginx/nginx-ssl.conf.template /etc/nginx/nginx-ssl.conf.template
COPY nginx/docker-entrypoint.sh /docker-entrypoint.d/40-envsubst-custom.sh
RUN chmod +x /docker-entrypoint.d/40-envsubst-custom.sh
COPY --from=frontend-build /app/dist /usr/share/nginx/html

RUN mkdir -p /var/www/certbot

EXPOSE 80 443
