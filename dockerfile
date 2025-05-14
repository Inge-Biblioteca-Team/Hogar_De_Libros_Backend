# Etapa de construcción
FROM node:18 AS build

WORKDIR /app

# Instalar curl y wait-for-it
RUN apt-get update && apt-get install -y curl \
    && curl -o /usr/local/bin/wait-for-it https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh \
    && chmod +x /usr/local/bin/wait-for-it

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (usando npm ci si hay un package-lock.json)
RUN npm ci

# Copiar el código fuente
COPY . .

# Variables de entorno para configuraciones
ARG DB_HOST
ARG DB_POR
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_DATABASE
ARG BASE_URL
ARG EMAIL_PASS
ARG EMAIL_USER
ARG CLIENT_URL

# Etapa de producción
FROM node:18-slim AS production

WORKDIR /app

# Copiar los archivos de construcción
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# Copiar assets y uploads (necesario para servirlos)
COPY --from=build /app/assets ./assets
COPY --from=build /app/uploads ./uploads

# Copiar wait-for-it
COPY --from=build /usr/local/bin/wait-for-it /usr/local/bin/wait-for-it

ENV NODE_ENV=production

# Exponer el puerto 3000
EXPOSE 3000

# Comando para iniciar la aplicación NestJS
CMD ["node", "dist/main"]
