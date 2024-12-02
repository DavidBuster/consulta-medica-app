# Usa la imagen oficial de Node.js v22.11.0 en Alpine (más ligera)
FROM node:22.11.0-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias al contenedor (esto ayuda a aprovechar la cache de Docker)
COPY package*.json ./

# Instala las dependencias (en producción)
# RUN npm ci --only=production --verbose
RUN npm install --verbose

# Copia todo el código fuente al contenedor
COPY . .

# Expone el puerto 3000 para la aplicación
EXPOSE 3001

# # Configura la variable de entorno (opcional, se puede personalizar en docker-compose). Ya está definida en los scripts del package.json
# ENV NODE_ENV=production

# Comando para ejecutar la aplicación en producción
CMD ["npm", "run", "start-backend"]
