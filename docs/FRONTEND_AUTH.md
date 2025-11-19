# Sistema de Autenticación Frontend - AutoSystem

## Descripción General

Se ha implementado un sistema completo de autenticación para el frontend que soporta dos tipos de usuarios:

1. **CLIENTE**: Usuarios finales que pueden auto-registrarse
2. **TRABAJADOR**: Empleados del sistema (creados solo por el administrador)

## Componentes Implementados

### 1. Página de Login (`frontend/src/modules/access/LoginPage.tsx`)

**Características:**

- Selector de tipo de usuario (Cliente / Trabajador)
- Campos: Correo electrónico y Contraseña
- Toggle para mostrar/ocultar contraseña
- Mensajes de error en tiempo real
- Loading state durante el login
- Enlaces hacia página de registro (solo para clientes)
- Botón para volver al inicio

**Flujo:**

1. Usuario selecciona su tipo (CLIENTE o TRABAJADOR)
2. Ingresa correo y contraseña
3. Al hacer clic en "Iniciar Sesión", se validan los campos
4. Se llama a `authApi.login()` con el correo, contraseña y tipo seleccionado
5. Si es exitoso, se redirige a `/dashboard`
6. Si hay error, se muestra el mensaje

**Notas especiales:**

- Los trabajadores ven texto "Solicita acceso al administrador" en lugar del link a registro
- Solo clientes pueden acceder a la página de registro

### 2. Página de Registro (`frontend/src/modules/access/RegisterPage.tsx`)

**Características:**

- Formulario de dos pasos (multi-step form)
- **Paso 1 - Información Personal:**
  - Nombre
  - Apellido Paterno
  - Apellido Materno
  - DNI (validación de longitud mínima)
  - Teléfono
- **Paso 2 - Credenciales:**
  - Correo Electrónico
  - Confirmación de Correo Electrónico (doble ingreso)
  - Contraseña
  - Confirmación de Contraseña (doble ingreso)
  - Toggles para mostrar/ocultar contraseñas
- Validación en tiempo real de coincidencia de emails y contraseñas
- Indicador visual del progreso (barra de dos pasos)
- Loading state durante el registro

**Validaciones:**

- Todos los campos requeridos
- DNI mínimo 8 caracteres
- Emails deben coincidir
- Contraseñas deben coincidir
- Contraseña mínimo 6 caracteres

**Flujo:**

1. Usuario ingresa información personal
2. Hace clic en "Continuar"
3. Se valida la información personal
4. Aparece el Paso 2 (Credenciales)
5. Usuario ingresa correo y contraseña (con confirmación)
6. Hace clic en "Crear Cuenta"
7. Se valida que emails y contraseñas coincidan
8. Se llama a `authApi.registerCliente()` con los datos
9. Si es exitoso, se hace login automático y redirige a `/dashboard`
10. Si hay error, se muestra el mensaje

### 3. Servicio de API (`frontend/src/api/auth.api.ts`)

**Métodos:**

```typescript
// Login - soporta ambos tipos de usuario
login(correo: string, password: string, userType: string): Promise<LoginResponse>
// POST /auth/login

// Registro de clientes únicamente
registerCliente(data: RegisterClienteDto): Promise<LoginResponse>
// POST /auth/register-cliente

// Obtener usuario actual (para validar sesión)
getCurrentUser(): Promise<User>
// GET /auth/me

// Logout
logout(): Promise<void>
// POST /auth/logout
```

**Características:**

- Utiliza `axiosInstance` configurado con interceptores
- Manejo automático de errores
- Incluye token JWT en headers automáticamente

### 4. Contexto de Autenticación (`frontend/src/context/AuthContext.tsx`)

**Actualizado con métodos reales:**

```typescript
// Login - requiere email, password y userType
login(correo: string, password: string, userType: UserType): Promise<void>

// Registro de clientes
registerCliente(data: RegisterClienteDto): Promise<void>

// Logout
logout(): Promise<void>

// Auto-login al recargar si hay token
getCurrentUser(): Promise<User>
```

**Estado:**

- `user`: Datos del usuario autenticado
- `userType`: Tipo de usuario (CLIENTE o TRABAJADOR)
- `isAuthenticated`: Booleano que indica si está autenticado
- `loading`: Estado de carga durante operaciones
- `error`: Mensaje de error si existe

**Funcionalidad:**

- Recupera y almacena token JWT en localStorage
- Restaura sesión al recargar la página (si hay token válido)
- Limpia sesión al logout

### 5. Rutas Actualizadas (`frontend/src/routes/index.tsx`)

```typescript
{
  path: '/login',
  element: <LoginPage />,
},
{
  path: '/register',
  element: <RegisterPage />,
},
```

Ambas rutas son públicas (accesibles sin autenticación).

### 6. Tipos de Datos (`frontend/src/types/auth.ts`)

```typescript
type UserType = "CLIENTE" | "TRABAJADOR";
type UserRole = "ADMIN" | "OPERATOR" | "TECHNICIAN" | "SUPERVISOR" | "CLIENTE";

interface User {
  idUsuario: string;
  username: string;
  correo: string;
  userType: UserType;
  role: UserRole;
  nombres?: string;
  apePaterno?: string;
  apeMaterno?: string;
  telefono?: string;
  dni?: string;
  especialidad?: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterClienteDto {
  nombre: string;
  apePaterno: string;
  apeMaterno: string;
  correo: string;
  correoConfirmacion: string;
  password: string;
  passwordConfirmacion: string;
  telefono: string;
  dni: string;
}

interface AuthContextType {
  user: User | null;
  userType: UserType | null;
  isAuthenticated: boolean;
  login: (correo, password, userType) => Promise<void>;
  registerCliente: (data) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}
```

## Flujos de Autenticación

### Flujo de Login

```
Landing Page / Navbar
        ↓
   [Click en "Iniciar Sesión"]
        ↓
   LoginPage
   - Seleccionar tipo (CLIENTE/TRABAJADOR)
   - Ingreso de correo y contraseña
        ↓
   [Click en "Iniciar Sesión"]
        ↓
   authApi.login(correo, password, userType)
        ↓
   Backend valida credenciales
        ↓
   [Éxito] → Token guardado en localStorage
         → Usuario guardado en Context
         → Redirige a /dashboard
        ↓
   RoleBasedRoute verifica rol
        ↓
   Dashboard y componentes de navbar específicos
```

### Flujo de Registro (Solo Clientes)

```
Landing Page / LoginPage
        ↓
   [Click en "Registrarse"]
        ↓
   RegisterPage - Paso 1
   - Ingreso de información personal
        ↓
   [Click en "Continuar"]
        ↓
   Validación de Paso 1
        ↓
   RegisterPage - Paso 2
   - Ingreso de credenciales con confirmación
        ↓
   [Click en "Crear Cuenta"]
        ↓
   Validación de Paso 2
   - Emails coinciden
   - Contraseñas coinciden
        ↓
   authApi.registerCliente(data)
        ↓
   Backend crea Usuario + Cliente
        ↓
   [Éxito] → Login automático
         → Token guardado en localStorage
         → Redirige a /dashboard
        ↓
   Componentes específicos para CLIENTE
```

### Flujo de Recuperación de Sesión (al recargar)

```
Aplicación se monta
        ↓
AuthProvider se inicializa
        ↓
useEffect verifica localStorage.token
        ↓
[Token existe]
        ↓
authApi.getCurrentUser()
        ↓
Backend valida token y retorna usuario
        ↓
Usuario guardado en Context
        ↓
App renderiza con estado autenticado
```

## Integración con Backend

### Endpoints Requeridos

#### 1. POST `/auth/login`

**Request:**

```json
{
  "correo": "user@example.com",
  "password": "password123",
  "userType": "CLIENTE" | "TRABAJADOR"
}
```

**Response (Success):**

```json
{
  "token": "jwt_token_here",
  "user": {
    "idUsuario": "1",
    "username": "john_doe",
    "correo": "john@example.com",
    "userType": "CLIENTE",
    "role": "CLIENTE",
    "nombres": "John",
    "apePaterno": "Doe",
    "apeMaterno": "Smith",
    "telefono": "999999999",
    "dni": "12345678"
  }
}
```

**Response (Error):**

```json
{
  "message": "Email o contraseña incorrectos"
}
```

#### 2. POST `/auth/register-cliente`

**Request:**

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

**Response (Success):**

```json
{
  "token": "jwt_token_here",
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

#### 3. GET `/auth/me`

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "idUsuario": "1",
  "username": "john_doe",
  "correo": "john@example.com",
  "userType": "CLIENTE",
  "role": "CLIENTE",
  "nombres": "John",
  "apePaterno": "Doe",
  "apeMaterno": "Smith",
  "telefono": "999999999",
  "dni": "12345678"
}
```

#### 4. POST `/auth/logout`

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "message": "Logout exitoso"
}
```

## Estilos y Diseño

- **Tema:** Modo oscuro (#101322 background)
- **Color Primario:** Azul #0d33f2
- **Fuente:** Space Grotesk
- **Iconos:** Material Symbols Outlined
- **Diseño Responsivo:** Optimizado para móvil y desktop
- **Validación Visual:** Mensajes de error en rojo, campos con focus en azul primario

## Seguridad

- ✅ Contraseñas no se validan en el cliente más que coincidencia
- ✅ JWT tokens almacenados en localStorage (considerar sessionStorage para mayor seguridad)
- ✅ Interceptores de Axios incluyen token en headers automáticamente
- ⚠️ **TODO Backend:** Hash de contraseñas con bcrypt
- ⚠️ **TODO Backend:** Validación de tokens expirados
- ⚠️ **TODO Backend:** Refresh tokens para renovación automática

## Proximos Pasos

### Frontend

- [ ] Implementar recuperación de contraseña
- [ ] Agregar validación de email verificado
- [ ] Implementar componente de avatar/perfil de usuario
- [ ] Agregar breadcrumbs de navegación
- [ ] Notificaciones toast para confirmaciones

### Backend

- [ ] Crear endpoints de autenticación completos
- [ ] Hash de contraseñas con bcrypt
- [ ] Validación de tokens JWT
- [ ] Refresh token mechanism
- [ ] Rate limiting en endpoints de login/registro
- [ ] Validación de email único en registro
- [ ] Envío de emails de confirmación

## Testing

### Flujo de prueba recomendado

1. **Login Cliente:**

   - Navegar a `/login`
   - Seleccionar "Cliente"
   - Ingresar credenciales válidas
   - Verificar redirección a `/dashboard`

2. **Login Trabajador:**

   - Navegar a `/login`
   - Seleccionar "Trabajador"
   - Ingresar credenciales válidas
   - Verificar aparición del navbar específico del rol

3. **Registro Cliente:**

   - Navegar a `/register`
   - Llenar información personal
   - Hacer clic en "Continuar"
   - Llenar credenciales con confirmación
   - Hacer clic en "Crear Cuenta"
   - Verificar login automático y redirección

4. **Recuperación de Sesión:**

   - Hacer login
   - Recargar la página
   - Verificar que se mantiene la sesión

5. **Logout:**
   - Hacer login
   - Hacer clic en UserMenu → Cerrar Sesión
   - Verificar redirección a `/login`
   - Verificar que localStorage está vacío

## Archivos Creados/Modificados

### Creados

- `frontend/src/modules/access/LoginPage.tsx` - Página de login
- `frontend/src/modules/access/RegisterPage.tsx` - Página de registro

### Modificados

- `frontend/src/routes/index.tsx` - Actualizadas rutas de login/register
- `frontend/src/context/AuthContext.tsx` - Integración con API
- `frontend/src/types/auth.ts` - Limpieza de tipos no usados
- `frontend/src/components/Navbar/UserMenu.tsx` - Actualización de campos de usuario
- `frontend/src/api/auth.api.ts` - Creado previamente (sin cambios en esta sesión)

### Existentes (sin cambios requeridos)

- `frontend/src/hooks/useAuth.ts` - Hook de contexto
- `frontend/src/api/axiosInstance.ts` - Cliente HTTP configurado
- `frontend/tailwind.config.js` - Estilos ya configurados
