# 🚀 Guía Rápida - Integración Backend

Esta guía te ayuda a implementar los endpoints del backend necesarios para que el sistema de autenticación frontend funcione completamente.

---

## 📋 Checklist de Endpoints Requeridos

- [ ] POST `/auth/login` - Login de cualquier usuario
- [ ] POST `/auth/register-cliente` - Registro de clientes
- [ ] GET `/auth/me` - Obtener usuario actual
- [ ] POST `/auth/logout` - Logout

---

## 1️⃣ POST `/auth/login`

### Propósito

Autentica usuarios (clientes o trabajadores) y retorna un JWT token.

### Request

```json
{
  "correo": "juan@example.com",
  "password": "password123",
  "userType": "CLIENTE"
}
```

### Response (200 OK)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "idUsuario": "1",
    "username": "juan_garcia",
    "correo": "juan@example.com",
    "userType": "CLIENTE",
    "role": "CLIENTE",
    "nombres": "Juan",
    "apePaterno": "García",
    "apeMaterno": "López",
    "telefono": "+51999999999",
    "dni": "12345678"
  }
}
```

### Response (401 Unauthorized)

```json
{
  "message": "Email o contraseña incorrectos"
}
```

### Lógica Backend

```typescript
1. Recibir correo, password y userType
2. Validar que ambos campos existan
3. Si userType === 'CLIENTE':
   - Buscar en tabla Cliente por correo
   - Comparar contraseña con hash
4. Si userType === 'TRABAJADOR':
   - Buscar en tabla Empleado + Usuario por correo
   - Comparar contraseña con hash
5. Si credenciales válidas:
   - Obtener rol del usuario
   - Generar JWT token
   - Retornar token + user data
6. Si fallan credenciales:
   - Retornar 401 con mensaje de error
```

### Estructura de Datos Requerida

**De tabla Usuario:**

```
idUsuario
username
correo
passwordHash
estado
```

**De tabla Cliente (si userType=CLIENTE):**

```
correo (PK/FK)
nombre
apePaterno
apeMaterno
telefono
```

**De tabla Empleado (si userType=TRABAJADOR):**

```
idEmpleado
idUsuario (FK)
dni
nombres
apePaterno
apeMaterno
telefono
especialidad
```

---

## 2️⃣ POST `/auth/register-cliente`

### Propósito

Registra un nuevo cliente en el sistema.

### Request

```json
{
  "nombre": "Juan",
  "apePaterno": "García",
  "apeMaterno": "López",
  "correo": "juan@example.com",
  "password": "password123",
  "telefono": "+51999999999",
  "dni": "12345678"
}
```

**Nota:** Los campos `correoConfirmacion` y `passwordConfirmacion` se validan en frontend, el backend solo recibe `correo` y `password`.

### Response (201 Created)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "idUsuario": "1",
    "username": "juan_garcia",
    "correo": "juan@example.com",
    "userType": "CLIENTE",
    "role": "CLIENTE",
    "nombres": "Juan",
    "apePaterno": "García",
    "apeMaterno": "López",
    "telefono": "+51999999999",
    "dni": "12345678"
  }
}
```

### Response (400 Bad Request)

```json
{
  "message": "El correo ya está registrado"
}
```

### Lógica Backend

```typescript
1. Validar que todos los campos requeridos existan
2. Validar formato de email
3. Validar que correo no exista en tabla Cliente
4. Hash de contraseña con bcrypt
5. Crear registro en tabla Usuario:
   - username: generar a partir de nombre + apellido
   - correo: del request
   - passwordHash: hash de password
   - estado: 'activo'
6. Crear registro en tabla Cliente:
   - nombre, apePaterno, apeMaterno, correo, telefono, dni
7. Asignar rol 'CLIENTE' al usuario (tabla EmpleadoRol)
8. Generar JWT token
9. Retornar token + user data
10. Si hay error:
    - Retornar 400 con mensaje específico
```

### Estructura de Datos a Insertar

**Tabla Usuario:**

```
idUsuario: UUID o autoincrement
username: "juan_garcia" (generado)
correo: "juan@example.com"
passwordHash: bcrypt("password123")
estado: "activo"
```

**Tabla Cliente:**

```
correo: "juan@example.com" (PK/FK a Usuario.correo)
nombre: "Juan"
apePaterno: "García"
apeMaterno: "López"
telefono: "+51999999999"
dni: "12345678"
```

**Tabla EmpleadoRol (solo crear si es necesario):**

```
idEmpleado: FK al empleado
idRol: FK a rol "CLIENTE"
```

---

## 3️⃣ GET `/auth/me`

### Propósito

Obtiene los datos del usuario autenticado (usado para validar sesión al recargar).

### Request Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response (200 OK)

```json
{
  "idUsuario": "1",
  "username": "juan_garcia",
  "correo": "juan@example.com",
  "userType": "CLIENTE",
  "role": "CLIENTE",
  "nombres": "Juan",
  "apePaterno": "García",
  "apeMaterno": "López",
  "telefono": "+51999999999",
  "dni": "12345678"
}
```

### Response (401 Unauthorized)

```json
{
  "message": "Token inválido o expirado"
}
```

### Lógica Backend

```typescript
1. Validar y decodificar JWT token del header
2. Si token inválido o expirado:
   - Retornar 401
3. Extraer userId del token
4. Buscar usuario en tabla Usuario
5. Determinar userType:
   - Si existe en Cliente: userType = 'CLIENTE'
   - Si existe en Empleado: userType = 'TRABAJADOR'
6. Obtener rol del usuario
7. Compilar objeto User con todos los datos
8. Retornar datos del usuario
```

---

## 4️⃣ POST `/auth/logout`

### Propósito

Invalida la sesión del usuario (opcional, frontend simplemente elimina token de localStorage).

### Request Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response (200 OK)

```json
{
  "message": "Logout exitoso"
}
```

### Lógica Backend

```typescript
1. Validar JWT token
2. Si es necesario invalidar token:
   - Agregar token a blacklist (base de datos o Redis)
   - O simplemente ignorar la solicitud (tokens con expiry)
3. Retornar mensaje de éxito

Nota: Con expiración de tokens, este endpoint puede ser simple
```

---

## 🔐 Seguridad - Implementación Recomendada

### 1. Hash de Contraseña

```typescript
// En backend (bcrypt)
const hashedPassword = await bcrypt.hash(password, 10);
// Guardar hashedPassword en base de datos

// En login
const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
```

### 2. JWT Token

```typescript
// Generar token
const token = jwt.sign(
  {
    idUsuario: user.idUsuario,
    correo: user.correo,
    role: user.role,
  },
  process.env.JWT_SECRET,
  { expiresIn: "24h" }
);

// Validar token en middleware
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### 3. Middleware de Autenticación

```typescript
export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Token requerido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
}
```

### 4. CORS Configuration

```typescript
// En main.ts (NestJS)
app.enableCors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
```

---

## 📊 Mapeo de Tipos Esperados

### UserType

- `CLIENTE`: Usuario final (Cliente)
- `TRABAJADOR`: Empleado del sistema

### UserRole

- `CLIENTE`: Cliente del sistema
- `ADMIN`: Administrador
- `OPERATOR`: Operario/Técnico
- `TECHNICIAN`: Técnico especializado
- `SUPERVISOR`: Supervisor

---

## ✅ Checklist de Implementación

- [ ] Endpoints creados en NestJS
- [ ] Validaciones de input implementadas
- [ ] Hash de contraseña con bcrypt
- [ ] JWT generation y validation
- [ ] CORS configurado correctamente
- [ ] Base de datos sincronizada con schema
- [ ] Pruebas manuales en Postman/Insomnia
- [ ] Pruebas con frontend funcionando
- [ ] Manejo de errores completado
- [ ] Logs de auditoría implementados

---

## 🧪 Pruebas Manuales (Postman/Insomnia)

### 1. Probar Login

```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "correo": "cliente@example.com",
  "password": "password123",
  "userType": "CLIENTE"
}
```

### 2. Probar Registro

```
POST http://localhost:3000/api/auth/register-cliente
Content-Type: application/json

{
  "nombre": "Juan",
  "apePaterno": "García",
  "apeMaterno": "López",
  "correo": "juan@example.com",
  "password": "password123",
  "telefono": "+51999999999",
  "dni": "12345678"
}
```

### 3. Probar /auth/me

```
GET http://localhost:3000/api/auth/me
Authorization: Bearer <token_from_login>
```

### 4. Probar Logout

```
POST http://localhost:3000/api/auth/logout
Authorization: Bearer <token_from_login>
```

---

## 🔄 Integración Frontend-Backend

Una vez implementados los endpoints, el frontend está **completamente listo**:

1. El frontend enviará requests a `http://localhost:3000/api/auth/*`
2. Los interceptores de Axios incluirán automáticamente el token JWT
3. Las validaciones del frontend NO reemplazan las del backend
4. El frontend está tipado con TypeScript strict mode

---

## 📞 Troubleshooting

### Frontend dice "Login no implementado"

- ❌ AuthContext aún usa TODO comments
- ✅ Ya fue actualizado, verifica que importes de `@/api/auth.api`

### CORS error

```
Access to XMLHttpRequest blocked by CORS policy
```

- ✅ Solución: Configurar `enableCors()` en main.ts

### Token JWT inválido

- ✅ Verifica que JWT_SECRET sea idéntico en generación y validación
- ✅ Valida formato del token

### Usuario no encontrado en login

- ✅ Verifica que la búsqueda sea por `correo` no `email` o `username`
- ✅ Valida que la tabla Cliente/Usuario tenga los datos

---

## 📚 Referencias

- JWT.io: https://jwt.io
- Bcrypt: https://www.npmjs.com/package/bcrypt
- NestJS Auth: https://docs.nestjs.com/recipes/authentication
- Prisma Docs: https://www.prisma.io/docs

---

> **Nota**: Esta guía asume NestJS + Prisma. Ajusta según tu stack específico.

¡Feliz codificación! 🚀
