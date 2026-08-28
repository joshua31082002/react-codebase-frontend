FROM node:22.20.0-bookworm-slim AS build

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

ARG APP_ENV=development
ARG APP_VERSION=0.0.0
ARG APP_API_SERVICE_BASEURL=/backend
ENV APP_ENV=${APP_ENV}
ENV APP_VERSION=${APP_VERSION}
ENV APP_API_SERVICE_BASEURL=${APP_API_SERVICE_BASEURL}

RUN npm run build

FROM nginx:1.29.2-alpine

COPY --from=build /app/dist /usr/share/nginx/html

RUN printf '%s\n' \
  'server {' \
  '  listen 8080;' \
  '  server_name _;' \
  '  root /usr/share/nginx/html;' \
  '  location /health {' \
  '    access_log off;' \
  '    add_header Content-Type text/plain;' \
  '    return 200 "ok\\n";' \
  '  }' \
  '  location / {' \
  '    try_files $uri $uri/ /index.html;' \
  '  }' \
  '}' \
  > /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
