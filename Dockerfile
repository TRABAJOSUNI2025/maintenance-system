# Build stage - Backend
FROM node:20-alpine AS backend-builder

WORKDIR /app

COPY backend/package*.json ./backend/
RUN cd backend && npm ci

COPY backend/src ./backend/src
COPY backend/tsconfig.json ./backend/
COPY backend/prisma ./backend/prisma
COPY backend/eslint.config.js ./backend/

RUN cd backend && npm run build

# Build stage - Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

COPY frontend/src ./frontend/src
COPY frontend/public ./frontend/public
COPY frontend/index.html ./frontend/
COPY frontend/vite.config.ts ./frontend/
COPY frontend/tsconfig*.json ./frontend/
COPY frontend/tailwind.config.js ./frontend/
COPY frontend/postcss.config.js ./frontend/

RUN cd frontend && npm run build

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
