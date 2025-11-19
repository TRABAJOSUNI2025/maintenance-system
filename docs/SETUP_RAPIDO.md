# ⚡ SETUP RÁPIDO - 5 Minutos

**Objetivo**: Tener backend + frontend corriendo con autenticación funcional

---

## 📦 Requisitos Previos

- Node.js v18+
- PostgreSQL corriendo
- npm o yarn

---

## 🚀 Backend Setup (3 minutos)

### Paso 1: Instalar dependencias

```bash
cd backend
npm install
```

### Paso 2: Configurar BD

Asegúrate que PostgreSQL esté corriendo:

```bash
# En PostgreSQL CLI
CREATE DATABASE "Mantenimiento";
```

### Paso 3: Migraciones

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### Paso 4: Iniciar servidor

```bash
npm run start:dev
```

✅ Backend corriendo en `http://localhost:3000`

---

## 🎨 Frontend Setup (2 minutos)

### Paso 1: Instalar dependencias

```bash
cd frontend
npm install
```

### Paso 2: Crear .env

Crear archivo `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

### Paso 3: Iniciar servidor

```bash
npm run dev
```

✅ Frontend corriendo en `http://localhost:5173`

---

## 🧪 Probar Login

### Opción 1: Navegador

1. Ir a `http://localhost:5173/login`
2. Ingresar: `cliente@maintenance.local` / `password123`
3. Debería redirigir a `/dashboard`

### Opción 2: cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"cliente@maintenance.local",
    "password":"password123"
  }'

# Respuesta
{
  "success": true,
  "user": { "id": "...", "role": "CLIENTE", ... },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

---

## 👥 Usuarios Disponibles

```
cliente@maintenance.local          password123   → ClientDashboard
operario@maintenance.local         password123   → OperatorDashboard
admin@maintenance.local            password123   → AdminDashboard
supervisor@maintenance.local       password123   → SupervisorDashboard
```

---

## 🔍 Verificación Rápida

### Backend está corriendo si:

```bash
curl http://localhost:3000/api/auth/profile
# Response: 401 (expected, no token)
```

### Frontend está corriendo si:

- Puedes acceder a `http://localhost:5173`
- El page se carga sin errores

### Autenticación funciona si:

- Login redirige a dashboard
- Dashboard muestra datos del usuario
- Sidebar muestra opciones según rol

---

## 🐛 Troubleshooting Rápido

### Error: "Cannot find module 'bcrypt'"

```bash
cd backend
npm install
```

### Error: "DATABASE_URL not found"

Verificar `.env` en backend:

```env
DATABASE_URL=postgresql://postgres:user@localhost:5432/Mantenimiento
```

### Error: "ECONNREFUSED" en BD

PostgreSQL no está corriendo:

```bash
# Windows
pg_ctl -D "C:\Program Files\PostgreSQL\16\data" start

# macOS (homebrew)
brew services start postgresql

# Linux
sudo service postgresql start
```

### Error: "Token inválido"

```bash
# Generar nuevo en login:
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"cliente@maintenance.local","password":"password123"}'
```

---

## 📚 Documentación Completa

Después de setup rápido, leer en orden:

1. `RESUMEN_EJECUTIVO_AUTH.md` - Arquitectura
2. `BACKEND_AUTH_SETUP.md` - Detalles técnicos
3. `BACKEND_AUTH_INTEGRATION.md` - Cómo conectar
4. `DASHBOARDS_POR_ROL.md` - UI detalles

---

## ✅ Checklist

- [ ] Backend: `npm install` completado
- [ ] Backend: BD creada en PostgreSQL
- [ ] Backend: Migraciones ejecutadas
- [ ] Backend: `npm run start:dev` corriendo
- [ ] Frontend: `npm install` completado
- [ ] Frontend: `.env` creado
- [ ] Frontend: `npm run dev` corriendo
- [ ] Test: Login funciona
- [ ] Test: Dashboard se carga
- [ ] Test: Logout funciona

---

## 📊 Status Visual

```
┌─────────────────────────────────────────┐
│                                         │
│  Backend:   ✅ http://localhost:3000   │
│  Frontend:  ✅ http://localhost:5173   │
│  DB:        ✅ PostgreSQL               │
│  Auth:      ✅ JWT Funcional           │
│                                         │
│  Listo para usar! 🎉                   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎯 Próximo Paso

Una vez que esté funcionando, actualizar:

1. `frontend/src/api/axiosInstance.ts` - Interceptores JWT
2. `frontend/src/context/AuthContext.tsx` - Métodos reales
3. Probar end-to-end login → dashboard

Ver `BACKEND_AUTH_INTEGRATION.md` para código exacto.

---

**⏱️ Tiempo total**: ~5 minutos  
**Dificultad**: ⭐ Muy Fácil  
**Status**: ✅ Listo para Desarrollo
