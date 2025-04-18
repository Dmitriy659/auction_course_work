# === СТАДИЯ 1: Сборка фронтенда ===
FROM node:18 AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# === СТАДИЯ 2: Nginx с фронтом ===
FROM nginx
COPY nginx.conf /etc/nginx/templates/default.conf.template
RUN mkdir -p /mediafiles
RUN mkdir -p /staticfiles

# Копируем собранный фронт
COPY --from=build /app/build/ /staticfiles/

EXPOSE 8080
