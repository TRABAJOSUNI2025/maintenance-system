# 🚗 Sistema de Gestión de Mantenimiento – Proyecto Universitario

> Proyecto académico desarrollado bajo buenas prácticas de ingeniería de software, con fines educativos para el curso **Sistemas de Calidad de Software**.  
> Se aplican principios de arquitectura limpia, modularidad, trazabilidad y aseguramiento de la calidad del software.

---

## 📘 Descripción General

El **Sistema de Gestión de Mantenimiento** permite la administración completa del ciclo de vida de los servicios de mantenimiento automotriz.  
Incluye funcionalidades para **clientes, operarios y administradores**, con trazabilidad completa desde la solicitud hasta la entrega del servicio.

---

## 🎯 Objetivos

- Aplicar **buenas prácticas de desarrollo de software** (Clean Architecture, SOLID, modularidad).
- Implementar una **arquitectura cliente-servidor** moderna basada en TypeScript.
- Asegurar **trazabilidad de requerimientos** desde las historias de usuario hasta el código.
- Desarrollar con **enfoque en la calidad del software** (ISO/IEC 25010).

---

## 🏗️ Arquitectura del Sistema

### 🔹 Estructura general

maintenance-system/

├── backend/ # API REST con NestJS + PostgreSQL

├── frontend/ # Aplicación web con React + TypeScript

├── docs/ # Documentación técnica y de calidad

└── .github/ # CI/CD (GitHub Actions)

### 🔹 Diagrama conceptual

**Frontend (React + Vite + TypeScript)**
→ Consume API REST mediante Axios
→ Separa módulos por roles (cliente, operario, administrador)

**Backend (NestJS + Prisma + PostgreSQL)**
→ Arquitectura modular y desacoplada
→ Controladores, servicios y DTOs por módulo funcional
→ Validaciones con `class-validator` y `class-transformer`

**Base de datos (PostgreSQL + Prisma ORM)**
→ Modelo relacional con entidades `User`, `Vehicle`, `Diagnostic`, `Maintenance`, `Ticket`, `Component`.

---

## ⚙️ Tecnologías Utilizadas

| Componente             | Tecnología                   | Descripción                                                         |
| ---------------------- | ---------------------------- | ------------------------------------------------------------------- |
| **Frontend**           | React + TypeScript + Vite    | Interfaz de usuario SPA con componentes reutilizables.              |
| **Backend**            | NestJS + TypeScript          | Framework modular orientado a microservicios y arquitectura limpia. |
| **Base de Datos**      | PostgreSQL                   | Base de datos relacional SQL.                                       |
| **ORM**                | Prisma                       | Mapeo objeto-relacional con migraciones automáticas.                |
| **Pruebas**            | Jest / React Testing Library | Pruebas unitarias y de integración.                                 |
| **CI/CD**              | GitHub Actions               | Integración continua para test, lint y build.                       |
| **Control de calidad** | ESLint + Prettier            | Alineado con Airbnb JavaScript Style Guide.                         |

---

## 🧩 Módulos del Sistema

| Módulo                              | Descripción                                     |
| ----------------------------------- | ----------------------------------------------- |
| 🔐 **Acceso y visibilidad general** | Inicio de sesión y control de roles.            |
| 👤 **Usuario / Cliente**            | Registro, vehículos, diagnósticos, solicitudes. |
| 👨‍🔧 **Operario**                     | Diagnóstico técnico, reportes correctivos.      |
| 🧾 **Administración / Supervisor**  | Tickets, componentes, reportes y métricas.      |
| 📊 **Estadísticas**                 | Visualización de desempeño y análisis de datos. |

---

## 🧠 Principios y Estándares Aplicados

| Categoría                | Estándar / Práctica                                       |
| ------------------------ | --------------------------------------------------------- |
| **Arquitectura**         | Clean Architecture + SOLID                                |
| **Estilo de Código**     | Airbnb TypeScript Style Guide                             |
| **Control de versiones** | GitHub Flow + Commits Semánticos                          |
| **Documentación**        | Swagger (backend), README, API.md                         |
| **Calidad del software** | ISO/IEC 25010 (funcionalidad, mantenibilidad, fiabilidad) |
| **Seguridad**            | JWT, roles, validación de entrada                         |
| **Testing**              | TDD básico con Jest y React Testing Library               |
| **CI/CD**                | GitHub Actions para build y test automático               |

---

## 🚀 Instalación y Configuración

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/usuario/maintenance-system.git
cd maintenance-system
```

### 2️⃣ Configurar variables de entorno

Copia los archivos `.env.example` en ambos proyectos:

```bash
cd backend
cp .env.example .env
cd ../frontend
cp .env.example .env
```

Ejemplo `.env` del backend:

```
DATABASE_URL="postgresql://user:password@localhost:5432/maintenance_db"
JWT_SECRET="supersecretkey"
PORT=3000
```

Ejemplo `.env` del frontend:

```
VITE_API_URL="http://localhost:3000/api"
```

### 3️⃣ Instalar dependencias

Desde la raíz del proyecto:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4️⃣ Configurar la base de datos

```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```

### 5️⃣ Ejecutar los servidores

#### Backend (NestJS)

```bash
npm run start:dev
```

#### Frontend (React)

```bash
npm run dev
```

---

## 🧪 Pruebas y Calidad de Código

### 🔹 Ejecutar pruebas unitarias

```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test
```

### 🔹 Lint y formato de código

```bash
npm run lint
npm run format
```

### 🔹 Verificar cobertura

```bash
npm run test:cov
```

---

## 🔁 Integración Continua (GitHub Actions)

Archivo: `.github/workflows/ci.yml`

Ejecuta automáticamente:

1. Instalación de dependencias
2. Linter y formateo
3. Pruebas unitarias
4. Compilación de frontend y backend

```yaml
name: CI - Maintenance System

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20.x]

    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install backend dependencies
        run: cd backend && npm ci

      - name: Run backend tests
        run: cd backend && npm run test

      - name: Install frontend dependencies
        run: cd frontend && npm ci

      - name: Run frontend tests
        run: cd frontend && npm run test
```

---

## 🔐 Sistema de Autenticación y Dashboards

### ✅ Reciente implementación (v1.0.0)

**Backend Authentication** con JWT:

- ✅ Registro de usuarios (`POST /auth/register`)
- ✅ Login con credenciales (`POST /auth/login`)
- ✅ Refresh automático de tokens (`POST /auth/refresh`)
- ✅ Obtener perfil de usuario (`GET /auth/profile`)
- ✅ Cambio de contraseña (`POST /auth/change-password`)

**Frontend Dashboards** por rol:

- ✅ **ClientDashboard** - Vehículos, mantenimientos, servicios
- ✅ **OperatorDashboard** - Tickets, performance, tareas
- ✅ **AdminDashboard** - Menús expandibles, parámetros, catálogos
- ✅ **SupervisorDashboard** - Reportes, estadísticas, validación

**Usuarios de prueba incluidos:**

```
cliente@maintenance.local           password123  → ClientDashboard
operario@maintenance.local          password123  → OperatorDashboard
admin@maintenance.local             password123  → AdminDashboard
supervisor@maintenance.local        password123  → SupervisorDashboard
```

### 📚 Documentación de Autenticación

- `docs/SETUP_RAPIDO.md` - Setup en 5 minutos ⚡
- `docs/BACKEND_AUTH_SETUP.md` - Detalles técnicos backend
- `docs/BACKEND_AUTH_INTEGRATION.md` - Cómo integrar frontend
- `docs/DASHBOARDS_POR_ROL.md` - Detalles de UIs
- `docs/RESUMEN_EJECUTIVO_AUTH.md` - Resumen completo
- `docs/VERIFICACION_BACKEND.md` - Checklist de verificación
- `docs/INDICE_DOCUMENTACION_AUTH.md` - Índice de toda la documentación

---

### 🚀 Setup Rápido (5 minutos)

```bash
# Backend
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev

# Frontend (otra terminal)
cd frontend
npm run dev
```

Luego: Ir a `http://localhost:5173/login` y usa `cliente@maintenance.local / password123`

---

Cada historia de usuario tiene correspondencia directa con un módulo funcional.
Consulta `docs/TRAZABILIDAD.md` para la relación completa entre **requerimientos ↔ código ↔ pruebas**.

---

## 📘 Documentación adicional

| Archivo                     | Contenido                                         |
| --------------------------- | ------------------------------------------------- |
| `docs/ARCHITECTURE.md`      | Detalle de la arquitectura y decisiones técnicas. |
| `docs/API.md`               | Endpoints documentados con Swagger.               |
| `docs/QUALITY_STANDARDS.md` | Estándares de codificación, estilo y calidad.     |
| `docs/TEST_PLAN.md`         | Plan y estrategia de pruebas.                     |
| `docs/CHANGELOG.md`         | Historial de cambios y versiones.                 |
| `docs/FRONTEND_AUTH.md`     | Documentación del sistema de autenticación.       |

---

## 👨‍💻 Autores y Créditos

Proyecto desarrollado por estudiantes del curso **Sistemas de Calidad de Software**, bajo el enfoque de **desarrollo ágil y aseguramiento de la calidad**.

**Equipo académico:**

- Líder técnico: CristhianMaylle
- Desarrolladores: [Nombres]
- Docente asesor: [Nombre del docente]

---

## 🧾 Licencia

Este proyecto se distribuye con fines **educativos** bajo licencia **MIT License**.
El código puede ser reutilizado con fines de aprendizaje o demostración.

---

## 💡 Notas finales

✔ Arquitectura modular

✔ Separación por capas

✔ Cumplimiento de estándares de calidad

✔ Documentación técnica y trazabilidad completa

---

> _“La calidad del software no se inspecciona al final; se construye desde el principio.”_
> — W. Edwards Deming
