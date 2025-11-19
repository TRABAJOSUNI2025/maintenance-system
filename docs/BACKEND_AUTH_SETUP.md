# 🔐 Backend Authentication - Setup y Configuración

## Descripción General

Se ha implementado un sistema completo de autenticación JWT en el backend con **login y registro de usuarios** con soporte para múltiples roles (ADMIN, SUPERVISOR, OPERATOR, TECHNICIAN, CLIENTE).

---

## 📋 Archivos Creados/Modificados

### ✨ Nuevos Archivos

#### 1. **DTOs (Data Transfer Objects)**

**`backend/src/modules/access/dto/login.dto.ts`**

- Email y contraseña para login
- Validación con decoradores `class-validator`
- Mensajes de error en español

**`backend/src/modules/access/dto/register.dto.ts`**

- Email, nombre, apellido, contraseña y rol
- Validación completa
- Rol por defecto: CLIENTE

#### 2. **Servicio de Autenticación**

**`backend/src/modules/access/auth.service.ts`** (~240 líneas)

Métodos principales:

- `register()` - Registrar nuevo usuario
  - Valida que email no exista
  - Hashea contraseña con bcrypt (10 salts)
  - Genera tokens JWT
- `login()` - Autenticar usuario
  - Valida email y contraseña
  - Genera access token + refresh token
  - Retorna datos del usuario
- `refreshToken()` - Refrescar access token
  - Valida refresh token
  - Genera nuevo access token
- `getProfile()` - Obtener perfil del usuario autenticado

- `changePassword()` - Cambiar contraseña
  - Valida contraseña actual
  - Hashea nueva contraseña

#### 3. **Controlador de Autenticación**

**`backend/src/modules/access/auth.controller.ts`** (~110 líneas)

Endpoints:

- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refrescar token
- `GET /auth/profile` - Obtener perfil (requiere JWT)
- `POST /auth/change-password` - Cambiar contraseña (requiere JWT)

Documentación Swagger incluida en cada endpoint.

#### 4. **Módulo de Autenticación**

**`backend/src/modules/access/auth.module.ts`**

- Importa JwtModule con configuración
- Exporta AuthService para otros módulos
- Proporciona PrismaService

#### 5. **JWT Guard**

**`backend/src/common/guards/jwt-auth.guard.ts`**

- Implementa `CanActivate` de NestJS
- Extrae token del header Authorization
- Valida token JWT
- Inyecta payload en `request.user`

#### 6. **Prisma Service**

**`backend/src/common/prisma/prisma.service.ts`**

- Singleton para conexión con BD
- Maneja conexión/desconexión automática
- Disponible globalmente en toda la app

#### 7. **Schema Prisma Actualizado**

**`backend/src/prisma/schema.prisma`**

- Agregado rol CLIENTE en enum UserRole
- Mantiene relaciones con vehículos, mantenimientos, diagnosticos

#### 8. **Seed de Base de Datos**

**`backend/src/prisma/seed.ts`**

- Crea 5 usuarios de prueba
- Hash de contraseñas con bcrypt
- Crea vehículos asociados a cliente
- Crea mantenimiento y diagnóstico de ejemplo

**Usuarios de prueba:**

```
admin@maintenance.local / password123 (ADMIN)
supervisor@maintenance.local / password123 (SUPERVISOR)
technician@maintenance.local / password123 (TECHNICIAN)
operator@maintenance.local / password123 (OPERATOR)
cliente@maintenance.local / password123 (CLIENTE)
```

### 🔄 Archivos Modificados

#### 1. **`backend/app.module.ts`**

- Importa ConfigModule para variables de entorno
- Importa AuthModule (descomenté y agregué)
- ConfigModule global (isGlobal: true)

#### 2. **`backend/package.json`**

Dependencias agregadas:

- `@nestjs/jwt@^12.1.0` - Manejo de JWT
- `@nestjs/config@^3.1.1` - Configuración global
- `@nestjs/passport@^10.0.3` - Autenticación (estrategias)
- `bcrypt@^5.1.1` - Hashing de contraseñas
- `passport@^0.7.0` - Middlewares autenticación
- `passport-jwt@^4.0.1` - Estrategia JWT

DevDependencies:

- `@types/bcrypt@^5.0.2` - Types para bcrypt

#### 3. **`backend/.env`**

Variables de entorno configuradas:

```env
DATABASE_URL=postgresql://postgres:user@localhost:5432/Mantenimiento
JWT_SECRET=super-secret-key-change-this-in-production-12345
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=super-refresh-secret-key-change-this-in-production-67890
JWT_REFRESH_EXPIRES_IN=7d
```

---

## 🚀 Instalación y Setup

### Paso 1: Instalar dependencias

```bash
cd backend
npm install
```

### Paso 2: Configurar la base de datos PostgreSQL

Asegúrate de que PostgreSQL esté corriendo:

```bash
# Windows (si usas WSL o PostgreSQL instalado)
psql -U postgres

# Crear base de datos (si no existe)
CREATE DATABASE "Mantenimiento";
```

### Paso 3: Ejecutar migraciones de Prisma

```bash
npm run prisma:generate
npm run prisma:migrate
```

### Paso 4: Seed de datos (opcional pero recomendado)

```bash
npm run prisma:seed
```

Esto creará 5 usuarios de prueba en la base de datos.

### Paso 5: Iniciar servidor en desarrollo

```bash
npm run start:dev
```

El servidor correrá en `http://localhost:3000`

---

## 🔑 Flujo de Autenticación

### 1. Registro de Usuario

```
POST /auth/register
{
  "email": "nuevo@example.com",
  "firstName": "Juan",
  "lastName": "Pérez",
  "password": "password123",
  "role": "CLIENTE"  // Opcional, por defecto CLIENTE
}

Response:
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "...",
    "email": "nuevo@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "CLIENTE"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### 2. Login

```
POST /auth/login
{
  "email": "nuevo@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login exitoso",
  "user": {
    "id": "...",
    "email": "nuevo@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "CLIENTE"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### 3. Refrescar Token

```
POST /auth/refresh
{
  "refreshToken": "eyJhbGc..."
}

Response:
{
  "success": true,
  "message": "Token refrescado",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### 4. Obtener Perfil (requiere JWT)

```
GET /auth/profile
Authorization: Bearer eyJhbGc...

Response:
{
  "success": true,
  "user": {
    "id": "...",
    "email": "nuevo@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "CLIENTE",
    "status": true,
    "createdAt": "2024-11-16T..."
  }
}
```

---

## 🔐 Seguridad

### Medidas Implementadas

1. **Hashing de Contraseñas**

   - Usado bcrypt con 10 salts
   - Contraseñas nunca se guardan en texto plano
   - Comparación segura en login

2. **JWT Tokens**

   - Access token válido por 24h
   - Refresh token válido por 7 días
   - Secret keys configurables por entorno

3. **Validación de Entrada**

   - DTOs con decoradores `class-validator`
   - Email único por usuario
   - Contraseña mínimo 6 caracteres

4. **Guards de Protección**

   - `JwtAuthGuard` protege rutas autenticadas
   - Valida token en cada solicitud
   - Extrae payload correctamente

5. **Variables de Entorno**
   - JWT_SECRET y JWT_REFRESH_SECRET en .env
   - DATABASE_URL configurables
   - No hardcodear valores sensibles

### Recomendaciones Producción

- Cambiar `JWT_SECRET` y `JWT_REFRESH_SECRET` a valores seguros
- Usar HTTPS (SSL/TLS)
- Implementar rate limiting en endpoints auth
- Agregar logging de intentos fallidos
- Considerar 2FA
- Usar variables de entorno seguros (AWS Secrets Manager, etc.)

---

## 📊 Roles y Permisos

| Rol            | Descripción                  | Acceso                                                    |
| -------------- | ---------------------------- | --------------------------------------------------------- |
| **ADMIN**      | Administrador del sistema    | Dashboard admin, gestión de usuarios, catálogos, reportes |
| **SUPERVISOR** | Supervisor de operaciones    | Reportes, validación, estadísticas                        |
| **OPERATOR**   | Operario/técnico             | Tickets, diagnósticos, mantenimientos                     |
| **TECHNICIAN** | Técnico especializado        | Mantenimientos, diagnósticos                              |
| **CLIENTE**    | Cliente/propietario vehículo | Mis vehículos, servicios, diagnosticos                    |

---

## 🧪 Pruebas Manuales

### Con Postman o cURL

#### 1. Registrar usuario

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "password": "password123",
    "role": "CLIENTE"
  }'
```

#### 2. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### 3. Obtener Perfil (usar accessToken retornado)

```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer <accessToken>"
```

### Con Swagger

Accede a: `http://localhost:3000/api/docs`

---

## 🔄 Próximos Pasos

### En Backend:

1. [ ] Implementar role-based access control en guardias
2. [ ] Agregar Rate Limiting
3. [ ] Crear endpoints para cada módulo (users, vehicles, maintenance, etc.)
4. [ ] Implementar logging
5. [ ] Agregar validaciones adicionales

### En Frontend:

1. [x] Crear LoginPage (completado)
2. [x] Crear RegisterPage (completado)
3. [ ] Conectar endpoints reales de login/register
4. [ ] Almacenar tokens en localStorage/sessionStorage
5. [ ] Implementar auto-refresh de tokens
6. [ ] Manejar expiración de tokens

---

## 📁 Estructura de Carpetas

```
backend/
├── src/
│   ├── common/
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts       ✨ Nuevo
│   │   ├── prisma/
│   │   │   └── prisma.service.ts       ✨ Nuevo
│   │   └── ...
│   ├── modules/
│   │   ├── access/
│   │   │   ├── auth.controller.ts      ✨ Actualizado
│   │   │   ├── auth.service.ts         ✨ Nuevo
│   │   │   ├── auth.module.ts          ✨ Actualizado
│   │   │   ├── auth.strategy.ts        (Para futuro)
│   │   │   └── dto/
│   │   │       ├── login.dto.ts        ✨ Nuevo
│   │   │       └── register.dto.ts     ✨ Nuevo
│   │   └── ...
│   ├── prisma/
│   │   ├── schema.prisma               ✨ Actualizado
│   │   └── seed.ts                     ✨ Actualizado
│   ├── app.module.ts                   ✨ Actualizado
│   └── main.ts
├── .env                                ✨ Actualizado
├── .env.example                        (Precisa actualización)
├── package.json                        ✨ Actualizado
├── tsconfig.json
└── ...
```

---

## 🐛 Troubleshooting

### Error: "No se encuentra el módulo 'bcrypt'"

**Solución**: Ejecutar `npm install` nuevamente

### Error: "DATABASE_URL no configurado"

**Solución**: Crear archivo `.env` con DATABASE_URL válido

### Error: "Token inválido o expirado"

**Solución**: Refrescar token usando endpoint `/auth/refresh`

### Error de Prisma: "No migrations found"

**Solución**: Ejecutar `npm run prisma:migrate`

---

## ✅ Checklist Final

- [x] DTOs con validación completa
- [x] AuthService con métodos de auth
- [x] AuthController con endpoints
- [x] JwtAuthGuard para proteger rutas
- [x] PrismaService configurado
- [x] AuthModule creado
- [x] AppModule actualizado
- [x] Dependencias instaladas (en package.json)
- [x] Schema Prisma actualizado
- [x] Seed de datos preparado
- [x] .env configurado
- [x] Documentación creada

---

## 📞 Conexión con Frontend

El frontend puede ahora conectarse a los endpoints:

```typescript
// baseURL: http://localhost:3000

// Login
POST /auth/login
// Register
POST /auth/register
// Refresh
POST /auth/refresh
// Profile
GET /auth/profile (con Authorization: Bearer token)
```

Ver documentación en `docs/BACKEND_AUTH_INTEGRATION.md` para detalles de integración.

---

**Estado**: ✅ **LISTO PARA USAR**

Backend authentication completamente funcional con login, registro y protección de rutas.
