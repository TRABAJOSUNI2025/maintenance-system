# 🚀 Guía de Despliegue en Railway.app

## Requisitos previos

- Cuenta en [Railway.app](https://railway.app)
- Repositorio en GitHub conectado

---

## Pasos para desplegar

### 1. Conectar repositorio en Railway

1. Inicia sesión en Railway.app
2. Click en "New Project"
3. Selecciona "Deploy from GitHub"
4. Autoriza y selecciona el repositorio `maintenance-system`

### 2. Configurar variables de entorno

Railway automáticamente detectará las siguientes variables. Agrega estas en el panel:

```
# Base de datos (Railway crea una automáticamente)
DATABASE_URL=postgresql://user:password@host:5432/railway

# JWT
JWT_SECRET=tu_secreto_super_seguro_aqui

# Variables de app
NODE_ENV=production
CORS_ORIGIN=https://tu-dominio.up.railway.app
```

### 3. Verificar Dockerfile

Railway automáticamente detectará el `Dockerfile` en la raíz y lo usará para construir la aplicación.

**Características del build:**

- ✅ Compila frontend (React + Vite)
- ✅ Compila backend (NestJS)
- ✅ Ejecuta migraciones Prisma
- ✅ Sirve frontend desde el backend

### 4. Deploy automático

Una vez configuradas las variables de entorno:

1. Click en "Deploy"
2. Railway construirá la imagen Docker
3. Ejecutará `npx prisma migrate deploy`
4. Iniciará la aplicación en puerto 3000

**Tiempo de build:** ~5-10 minutos (primera vez)

---

## Verificar que funcionó

```bash
# Acceder a la aplicación
https://tu-dominio.up.railway.app

# Acceder a Swagger (API docs)
https://tu-dominio.up.railway.app/api/docs

# Login
- Usuario: cliente@example.com
- Contraseña: cliente123
```

---

## Monitoreo

En el dashboard de Railway puedes ver:

- ✅ Logs en tiempo real
- ✅ Métricas de CPU/Memory
- ✅ Historial de deployments
- ✅ Estado de la base de datos

---

## Troubleshooting

### Error: "No se encontró ningún comando de inicio"

✅ **Solucionado** - Ahora tenemos `Procfile` + `Dockerfile`

### Error: "DATABASE_URL no definido"

→ Agrega `DATABASE_URL` en las variables de entorno de Railway

### Error: "Migraciones fallaron"

→ Ejecuta manualmente en railway:

```bash
npx prisma migrate deploy
```

### Frontend no carga (404)

→ Verifica que `frontend/dist` existe localmente:

```bash
cd frontend && npm run build
```

---

## Dominio personalizado

1. En Railway → Settings → Domains
2. Agrega tu dominio personalizado
3. Apunta tu DNS a Railway (instrucciones en el panel)

---

## Precios estimados

- **Apps**: $5-7 USD/mes
- **Database PostgreSQL**: $5-15 USD/mes
- **Total**: ~$10-22 USD/mes

---

## Siguiente paso

Una vez en producción:

- ✅ Tests end-to-end
- ✅ Monitoreo con Sentry
- ✅ Backups automáticos
- ✅ CI/CD improvements
