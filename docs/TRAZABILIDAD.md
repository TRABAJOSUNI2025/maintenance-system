# 🔗 Matriz de Trazabilidad – Sistema de Gestión de Mantenimiento

## 1. Propósito

Este documento garantiza la **trazabilidad de los requisitos funcionales**, relacionando cada historia de usuario con:

- Su **módulo funcional** correspondiente.
- Los **componentes de código** implementados.
- Los **casos de prueba** diseñados para su validación.
- Los **criterios de aceptación** cubiertos.

Esto permite asegurar la **completitud, consistencia y verificabilidad** del sistema desarrollado.

---

## 2. Leyenda

| Código | Significado                          |
| ------ | ------------------------------------ |
| HU-XX  | Historia de Usuario                  |
| MÓD    | Módulo funcional                     |
| CÓDIGO | Archivos / componentes implementados |
| TEST   | Prueba automatizada asociada         |

---

## 3. Matriz de Trazabilidad General

| ID        | Historia de Usuario                                                                          | Módulo                                | Archivos Principales                                                                                                                | Casos de Prueba                                               | Criterios de Aceptación Cubiertos                                |
| --------- | -------------------------------------------------------------------------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------- |
| **HU-01** | Como usuario, quiero iniciar sesión con mis credenciales para acceder a mis funcionalidades. | **Módulo de Acceso y Visibilidad**    | `/backend/src/modules/auth/auth.controller.ts`<br>`/frontend/src/modules/auth/pages/LoginPage.tsx`                                  | `auth.service.spec.ts`, `login.test.tsx`                      | Validación de usuario/contraseña, errores claros, acceso por rol |
| **HU-02** | Como nuevo usuario, quiero registrarme para poder solicitar servicios.                       | **Módulo de Usuario/Cliente**         | `/backend/src/modules/users/users.controller.ts`<br>`/frontend/src/modules/users/pages/RegisterPage.tsx`                            | `users.service.spec.ts`, `register.test.tsx`                  | Validación de campos, formato de correo/teléfono, confirmación   |
| **HU-03** | Como cliente, quiero registrar los datos de mi vehículo.                                     | **Módulo Vehículo**                   | `/backend/src/modules/vehicles/vehicles.controller.ts`<br>`/frontend/src/modules/vehicles/pages/AddVehiclePage.tsx`                 | `vehicles.service.spec.ts`, `vehicle-form.test.tsx`           | Registro de placa, marca, modelo, año, asociación con usuario    |
| **HU-04** | Como cliente, quiero solicitar un diagnóstico general.                                       | **Módulo Diagnóstico**                | `/backend/src/modules/diagnostics/diagnostics.controller.ts`<br>`/frontend/src/modules/diagnostics/pages/RequestDiagnosticPage.tsx` | `diagnostics.service.spec.ts`, `diagnostic-request.test.tsx`  | Creación de solicitud, ticket automático, confirmación           |
| **HU-05** | Como cliente, quiero solicitar un servicio correctivo basado en diagnóstico.                 | **Módulo Mantenimiento**              | `/backend/src/modules/maintenance/maintenance.controller.ts`<br>`/frontend/src/modules/maintenance/pages/RequestServicePage.tsx`    | `maintenance.service.spec.ts`, `maintenance-request.test.tsx` | Selección de diagnóstico previo, ticket generado, confirmación   |
| **HU-06** | Como cliente, quiero hacer seguimiento del avance del mantenimiento.                         | **Módulo Seguimiento**                | `/backend/src/modules/maintenance/maintenance.controller.ts`<br>`/frontend/src/modules/maintenance/pages/TrackMaintenancePage.tsx`  | `maintenance-tracking.spec.ts`, `track.test.tsx`              | Visualización de etapas y actualización en tiempo real           |
| **HU-07** | Como cliente, quiero consultar el historial de mantenimiento.                                | **Módulo Historial**                  | `/backend/src/modules/maintenance/maintenance.controller.ts`<br>`/frontend/src/modules/maintenance/pages/HistoryPage.tsx`           | `maintenance-history.spec.ts`, `history.test.tsx`             | Filtro por tipo/fecha, datos coherentes                          |
| **HU-08** | Como operario, quiero ver los tickets de diagnóstico asignados.                              | **Módulo Operario**                   | `/backend/src/modules/operator/operator.controller.ts`<br>`/frontend/src/modules/operator/pages/AssignedTicketsPage.tsx`            | `operator-tickets.spec.ts`, `tickets.test.tsx`                | Filtrado por estado y asignación                                 |
| **HU-09** | Como operario, quiero registrar resultados del diagnóstico.                                  | **Módulo Operario / Diagnóstico**     | `/backend/src/modules/operator/operator.controller.ts`<br>`/frontend/src/modules/operator/pages/RegisterDiagnosticPage.tsx`         | `operator-diagnostic.spec.ts`, `diagnostic-form.test.tsx`     | Registro de observaciones y resultados                           |
| **HU-10** | Como operario, quiero generar el reporte correctivo del motor.                               | **Módulo Reporte Correctivo**         | `/backend/src/modules/operator/operator.controller.ts`<br>`/frontend/src/modules/operator/pages/GenerateReportPage.tsx`             | `operator-report.spec.ts`, `report.test.tsx`                  | Campos obligatorios, validación, firma digital                   |
| **HU-11** | Como administrador, quiero visualizar estadísticas de servicios y desempeño.                 | **Módulo Administración / Dashboard** | `/backend/src/modules/admin/admin.controller.ts`<br>`/frontend/src/modules/admin/pages/DashboardPage.tsx`                           | `admin-stats.spec.ts`, `dashboard.test.tsx`                   | Gráficos actualizados, filtros dinámicos                         |
| **HU-12** | Como administrador, quiero generar y asignar tickets de mantenimiento.                       | **Módulo Tickets**                    | `/backend/src/modules/admin/admin.controller.ts`<br>`/frontend/src/modules/admin/pages/AssignTicketPage.tsx`                        | `admin-tickets.spec.ts`, `assign-ticket.test.tsx`             | Creación, notificación y estado inicial                          |
| **HU-13** | Como administrador, quiero registrar y actualizar el catálogo de componentes.                | **Módulo Componentes**                | `/backend/src/modules/admin/admin.controller.ts`<br>`/frontend/src/modules/admin/pages/ComponentsPage.tsx`                          | `admin-components.spec.ts`, `components.test.tsx`             | Agregar, editar, eliminar, validación de duplicados              |
| **HU-14** | Como administrador, quiero generar reportes de tickets asignados.                            | **Módulo Reportes**                   | `/backend/src/modules/admin/admin.controller.ts`<br>`/frontend/src/modules/admin/pages/ReportsPage.tsx`                             | `admin-reports.spec.ts`, `reports.test.tsx`                   | Filtros y exportación a PDF/Excel                                |
| **HU-15** | Como administrador, quiero consultar todos los registros de mantenimiento.                   | **Módulo Administración / Consultas** | `/backend/src/modules/admin/admin.controller.ts`<br>`/frontend/src/modules/admin/pages/MaintenanceRecordsPage.tsx`                  | `admin-maintenance.spec.ts`, `records.test.tsx`               | Búsqueda por vehículo, cliente o fecha                           |

---

## 4. Cobertura de Trazabilidad

| Elemento                | Total | Cubiertos | % Cobertura |
| ----------------------- | ----- | --------- | ----------- |
| Historias de Usuario    | 15    | 15        | **100%**    |
| Criterios de Aceptación | 45    | 42        | **93%**     |
| Casos de Prueba         | 30    | 28        | **93%**     |

---

## 5. Relación con las pruebas automatizadas

Los test están implementados según el siguiente patrón:

- **Backend (NestJS)**: `*.spec.ts` con Jest y Supertest
  - Ejemplo: `auth.service.spec.ts`
- **Frontend (React)**: `*.test.tsx` con React Testing Library
  - Ejemplo: `login.test.tsx`
- **CI/CD (GitHub Actions)**: Ejecuta todas las pruebas en cada `push` y `pull request`.

---

## 6. Conclusiones

- Todas las **historias de usuario** tienen correspondencia con módulos funcionales y casos de prueba.
- La **trazabilidad bidireccional** está garantizada (Requisito ↔ Código ↔ Prueba).
- El sistema cumple con los criterios de **verificabilidad, mantenibilidad y control de calidad** requeridos por las normas ISO/IEC.

---

📅 **Última actualización:** 11 de noviembre de 2025  
👨‍💻 **Autor:** Equipo de Desarrollo – Proyecto Universitario de Sistemas de Calidad
