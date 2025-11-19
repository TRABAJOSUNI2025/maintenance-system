# Build stage - Backend
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install

COPY backend/src ./src
COPY backend/tsconfig.json ./
COPY backend/prisma ./prisma
COPY backend/eslint.config.js ./

# Generar cliente de Prisma antes de compilar
RUN npx prisma generate

RUN npm run build

# Build stage - Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/src ./src
COPY frontend/public ./public
COPY frontend/index.html ./
COPY frontend/vite.config.ts ./
COPY frontend/tsconfig*.json ./
COPY frontend/tailwind.config.js ./
COPY frontend/postcss.config.js ./
COPY frontend/dist ./dist

# Si dist ya existe, no compilar. Si no, compilar.
RUN if [ -d "dist" ] && [ -f "dist/index.html" ]; then \
      echo "Frontend dist found, skipping build"; \
    else \
      echo "Building frontend..." && npm run build || (echo "Frontend build failed" && exit 1); \
    fi

# Production stage
FROM node:20-alpine

# Instalar OpenSSL necesario para Prisma
RUN apk add --no-cache openssl

WORKDIR /app/backend

# Copiar backend
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/dist ./dist
COPY backend/package*.json ./
COPY backend/prisma ./prisma
COPY backend/docker-entrypoint.sh ./
COPY backend/.env.production ./.env

# Hacer script ejecutable
RUN chmod +x ./docker-entrypoint.sh

# Copiar frontend dist
COPY --from=frontend-builder /app/frontend/dist ../frontend/dist

EXPOSE 3000

# Ejecutar app con script de entrada
ENTRYPOINT ["./docker-entrypoint.sh"]
