FROM node:22.14.0-bookworm-slim AS build

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN NODE_OPTIONS=--max-old-space-size=512 npm run build

FROM nginx:1.27.5-bookworm

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
