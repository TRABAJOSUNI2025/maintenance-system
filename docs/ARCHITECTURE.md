# 🏗️ Arquitectura del Sistema de Gestión de Mantenimiento

## 1. Introducción

Este documento describe la arquitectura del sistema **Sistema de Gestión de Mantenimiento**, incluyendo sus capas, componentes principales y decisiones técnicas.  
El objetivo es garantizar una estructura modular, mantenible y trazable conforme a las buenas prácticas de calidad del software (ISO/IEC 25010, Clean Architecture).

---

## 2. Visión general

El sistema adopta una **arquitectura cliente-servidor** compuesta por:

- **Frontend:** Aplicación SPA (Single Page Application) desarrollada con **React + TypeScript**.
- **Backend:** API REST desarrollada con **NestJS** bajo principios de modularidad y separación de responsabilidades.
- **Base de datos:** **PostgreSQL** administrada mediante **Prisma ORM**.
- **Comunicación:** HTTP/HTTPS con JSON.

---

## 3. Diagrama de arquitectura (simplificado)

[Frontend (React)]

↓ REST API

[Backend (NestJS)]

↓ Prisma ORM

[PostgreSQL Database]

---

## 4. Estructura por capas (backend)

| Capa                             | Descripción                                                | Ejemplo              |
| -------------------------------- | ---------------------------------------------------------- | -------------------- |
| **Controller**                   | Gestiona las peticiones HTTP y respuestas JSON.            | `auth.controller.ts` |
| **Service**                      | Contiene la lógica de negocio.                             | `auth.service.ts`    |
| **Repository / ORM**             | Interactúa con la base de datos a través de Prisma.        | `prisma.service.ts`  |
| **DTOs (Data Transfer Objects)** | Definen los esquemas de datos de entrada/salida.           | `create-user.dto.ts` |
| **Modules**                      | Agrupan controladores, servicios y entidades relacionadas. | `users.module.ts`    |

---

## 5. Estructura del frontend

| Carpeta       | Descripción                                                               |
| ------------- | ------------------------------------------------------------------------- |
| `modules/`    | Páginas organizadas por rol funcional (cliente, operario, administrador). |
| `components/` | Componentes reutilizables (botones, inputs, tarjetas).                    |
| `api/`        | Llamadas HTTP a la API del backend (Axios).                               |
| `context/`    | Contextos globales como autenticación.                                    |
| `hooks/`      | Hooks personalizados (`useAuth`, `useFetch`).                             |
| `routes/`     | Sistema de navegación protegido.                                          |

---

## 6. Base de datos (modelo simplificado)

User (id, name, email, role)

Vehicle (id, userId, plate, model, year)

Diagnostic (id, vehicleId, description, status)

Maintenance (id, diagnosticId, status, startDate, endDate)

Component (id, name, price)

Ticket (id, type, status, assignedTo)

---

## 7. Principios aplicados

- **Modularidad** (cada módulo independiente y escalable).
- **Inyección de dependencias** (NestJS IoC Container).
- **Principios SOLID** en servicios y controladores.
- **Separación de responsabilidades** entre capas.
- **Validaciones tipadas** con DTOs y `class-validator`.

---

## 8. Decisiones técnicas relevantes

- Framework backend: **NestJS** por su estructura limpia y soporte TypeScript.
- ORM: **Prisma**, por su tipado estático y migraciones seguras.
- Frontend: **React con Vite** por su rapidez y modularidad.
- Control de estilos: **TailwindCSS**.
- Seguridad: **JWT** + **Guards de NestJS**.
- Testing: **Jest** (backend) y **React Testing Library** (frontend).

---

## 9. Escalabilidad y mantenibilidad

- Soporte para nuevos roles o módulos agregando carpetas en `/modules/`.
- CI/CD mediante **GitHub Actions**.
- Documentación automática con **Swagger**.

---
