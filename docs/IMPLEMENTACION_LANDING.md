# 🎨 Implementación del Landing Page y Sistema de Diseño

## ✅ Cambios Realizados

### 1. **Configuración de Tailwind CSS**

- ✅ Agregados colores personalizados (`primary`, `background-light`, `background-dark`)
- ✅ Configurada fuente `Space Grotesk` como familia por defecto
- ✅ Establecido modo oscuro como clase
- ✅ Agregado plugin `@tailwindcss/forms`

**Archivo**: `frontend/tailwind.config.js`

### 2. **Archivos de Configuración**

- ✅ `index.html`: Agregadas fuentes (Space Grotesk, Material Icons), modo oscuro habilitado
- ✅ `tsconfig.app.json`: Configurados path aliases (`@/*` → `./src/*`)
- ✅ `vite.config.ts`: Agregado soporte para path aliases
- ✅ `index.css`: Importadas directivas de Tailwind, estilos globales

### 3. **Estructura de Carpetas Creada**

```
frontend/src/
├── components/
│   ├── PublicNavbar.tsx              (Navbar para landing page)
│   ├── Navbar/
│   │   ├── Navbar.tsx                (Navbar dinámico por rol)
│   │   ├── NavbarAdmin.tsx           (Menú Admin)
│   │   ├── NavbarOperator.tsx        (Menú Operator)
│   │   ├── NavbarTechnician.tsx      (Menú Technician)
│   │   ├── NavbarSupervisor.tsx      (Menú Supervisor)
│   │   └── UserMenu.tsx              (Menú de usuario)
│   └── Layout/
│       └── ProtectedLayout.tsx       (Layout con Navbar)
├── context/
│   └── AuthContext.tsx               (Context de autenticación)
├── hooks/
│   ├── useAuth.ts                    (Hook para auth)
│   └── useRole.ts                    (Hook para roles)
├── modules/
│   ├── landing/
│   │   ├── LandingPage.tsx          (Página principal)
│   │   └── components/
│   │       ├── Hero.tsx             (Sección hero)
│   │       ├── Features.tsx         (Características)
│   │       └── Footer.tsx           (Pie de página)
│   └── dashboard/
│       └── DashboardPage.tsx        (Placeholder dashboard)
├── routes/
│   ├── index.tsx                    (Definición de rutas)
│   └── RoleBasedRoute.tsx           (Componente de protección por rol)
├── types/
│   └── auth.ts                      (Tipos de autenticación)
└── App.tsx                           (Actualizado con RouterProvider)
```

### 4. **Landing Page**

#### Componentes Implementados:

1. **Hero** (`Hero.tsx`)

   - Fondo con imagen de degradado
   - Título y descripción atractivos
   - CTAs (Registrarse / Iniciar Sesión)

2. **Features** (`Features.tsx`)

   - Grid de 3 características principales
   - Icons de Material Design
   - Descripciones detalladas

3. **Footer** (`Footer.tsx`)

   - Logo y nombre del sistema
   - Links de política/términos
   - Iconos de redes sociales

4. **PublicNavbar** (`PublicNavbar.tsx`)
   - Logo clickeable
   - Links de navegación (características, nosotros)
   - Botones de login/registro

#### Página Principal (`LandingPage.tsx`)

- Combina todos los componentes
- Layout responsive

### 5. **Sistema de Autenticación (Base)**

#### AuthContext (`context/AuthContext.tsx`)

```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email, password) => Promise<void>;
  register: (data) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}
```

#### Types (`types/auth.ts`)

- `User`: Interface de usuario
- `UserRole`: 'ADMIN' | 'OPERATOR' | 'TECHNICIAN' | 'SUPERVISOR'
- `AuthContextType`: Tipos de contexto
- `LoginDto`, `RegisterDto`: DTOs

#### Hooks Útiles

- **useAuth()**: Acceso al contexto de autenticación
- **useRole()**: Verificación de roles y permisos

### 6. **Sistema de Navegación por Rol**

#### Navbars Especializados:

| Rol        | Componente         | Menús                                                    |
| ---------- | ------------------ | -------------------------------------------------------- |
| ADMIN      | `NavbarAdmin`      | Dashboard, Gestión (Usuarios/Vehículos/Config), Reportes |
| OPERATOR   | `NavbarOperator`   | Dashboard, Mi Flota, Mantenimiento, Calendario           |
| TECHNICIAN | `NavbarTechnician` | Dashboard, Diagnósticos, Reparaciones, Reportes          |
| SUPERVISOR | `NavbarSupervisor` | Dashboard, Reportes, Estadísticas, Supervisión           |

#### Navbar Principal (`Navbar.tsx`)

- Se adapta automáticamente según `useRole()`
- UserMenu común para todos
- Sticky y con backdrop blur

#### UserMenu (`UserMenu.tsx`)

- Información del usuario actual
- Link a perfil y configuración
- Botón de logout

### 7. **Sistema de Rutas Protegidas**

#### RoleBasedRoute (`RoleBasedRoute.tsx`)

```typescript
<RoleBasedRoute allowedRoles={["ADMIN", "OPERATOR"]}>
  <AdminPage />
</RoleBasedRoute>
```

Features:

- Valida rol del usuario
- Redirige a login si no está autenticado
- Redirige a /unauthorized si rol no permitido
- Muestra loading mientras carga

#### Rutas Disponibles

- `/` - Landing page
- `/login` - Login (placeholder)
- `/register` - Registro (placeholder)
- `/dashboard` - Dashboard (protegido)
- `/admin/*` - Rutas de admin (protegidas)
- `/operator/*` - Rutas de operator (protegidas)
- `/technician/*` - Rutas de technician (protegidas)
- `/supervisor/*` - Rutas de supervisor (protegidas)
- `/unauthorized` - Página de acceso denegado
- `*` - 404

### 8. **Paleta de Colores**

```
Primary: #0d33f2 (Azul vibrante)
Background Dark: #101322 (Gris muy oscuro)
Background Light: #f5f6f8 (Gris claro - no usado por defecto)
Grises: gray-300, gray-400, gray-600, etc.
```

### 9. **Estilos Globales**

- Font: `Space Grotesk` (Google Fonts)
- Icons: Material Symbols Outlined
- Dark mode: Habilitado por defecto
- Scrollbar personalizado
- Transiciones suaves

## 📱 Responsive Design

- Mobile: Stacked layouts
- Tablet (sm): Navbar comprimido
- Desktop (md+): Navbar completo
- XL (lg): Menú de navegación visible

## 🎯 Próximos Pasos

1. **Backend Auth**: Implementar endpoints `/auth/login`, `/auth/register`
2. **Frontend Auth**: Conectar AuthContext con API backend
3. **Pages**: Crear las páginas para cada rol (Users, Vehicles, Maintenance, etc.)
4. **Forms**: Crear componentes de formularios reutilizables
5. **API Integration**: Integrar llamadas API en todos los módulos

## 🚀 Cómo Visualizar

```bash
# Navega a la carpeta frontend
cd frontend

# Instala dependencias (si no las tienes)
npm install

# Inicia servidor de desarrollo
npm run dev

# Abre http://localhost:5173
```

## 📝 Notas Importantes

- El AuthContext actualmente tiene TODO placeholders para login/register (necesita integración con backend)
- Las páginas de módulos son placeholders para demostración de rutas
- El diseño es totalmente responsive y mobile-first
- Los estilos siguen la paleta del HTML original (`landing_page.html`)
