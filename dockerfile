# Etapa de construcción
FROM node:18 AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:18

WORKDIR /app

# Copiar archivos construidos desde la etapa de build
COPY --from=build /app/dist ./dist
COPY package.json package-lock.json ./

# Instalar solo dependencias de producción
RUN npm install --only=production

# Exponer el puerto del backend
EXPOSE 3000

# Comando para ejecutar NestJS
CMD ["node", "dist/main"]
