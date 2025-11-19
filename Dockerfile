# Build stage - Backend
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci

COPY backend/src ./src
COPY backend/tsconfig.json ./
COPY backend/prisma ./prisma
COPY backend/eslint.config.js ./

RUN npm run build

# Build stage - Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/src ./src
COPY frontend/public ./public
COPY frontend/index.html ./
COPY frontend/vite.config.ts ./
COPY frontend/tsconfig*.json ./
COPY frontend/tailwind.config.js ./
COPY frontend/postcss.config.js ./

RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copiar backend
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY backend/package*.json ./backend/
COPY backend/prisma ./backend/prisma

# Copiar frontend dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 3000

# Ejecutar migraciones y luego la app
CMD ["sh", "-c", "cd backend && npx prisma migrate deploy && npm start"]
