FROM node:22.14.0-bookworm-slim AS build

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

ARG APP_ENV=development
ARG APP_VERSION=0.0.0
ARG APP_API_SERVICE_BASEURL=
ENV APP_ENV=${APP_ENV}
ENV APP_VERSION=${APP_VERSION}
ENV APP_API_SERVICE_BASEURL=${APP_API_SERVICE_BASEURL}

RUN npm run build

FROM nginx:1.27.5-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
