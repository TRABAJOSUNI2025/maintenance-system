# 🧪 Plan de Pruebas – Sistema de Gestión de Mantenimiento

## 1. Objetivo

Garantizar la calidad funcional, fiabilidad y mantenibilidad del sistema, verificando que cada historia de usuario cumpla los criterios de aceptación definidos.

---

## 2. Estrategia de pruebas

| Tipo de prueba       | Descripción                                           | Herramienta                 |
| -------------------- | ----------------------------------------------------- | --------------------------- |
| **Unitarias**        | Validan la lógica interna de servicios y componentes. | Jest, React Testing Library |
| **Integración**      | Validan la comunicación entre módulos o capas.        | Supertest (NestJS)          |
| **End-to-End (E2E)** | Simulan escenarios completos de usuario.              | Playwright o Cypress        |
| **Estilo / Linter**  | Verifica la consistencia de código.                   | ESLint, Prettier            |
| **CI/CD Tests**      | Ejecutadas automáticamente en GitHub Actions.         | Jest CLI                    |

---

## 3. Cobertura mínima esperada

- Cobertura global: **≥70%**
- Cobertura por módulo: **≥60%**
- Linter: **sin errores críticos**

---

## 4. Casos de prueba (resumen)

| Módulo          | Caso                                  | Resultado Esperado                |
| --------------- | ------------------------------------- | --------------------------------- |
| **Auth**        | Login con credenciales válidas        | Token JWT válido                  |
| **Users**       | Registro con correo duplicado         | Error HTTP 409                    |
| **Vehicles**    | Crear vehículo con datos válidos      | HTTP 201 Created                  |
| **Diagnostics** | Solicitar diagnóstico sin descripción | HTTP 400 Bad Request              |
| **Maintenance** | Cambiar estado a “completado”         | Actualización exitosa             |
| **Operator**    | Ver tickets asignados                 | Solo los del operario autenticado |
| **Admin**       | Crear componente duplicado            | Error 409 “Duplicado”             |

---

## 5. Automatización (CI/CD)

Pipeline de pruebas (`.github/workflows/ci.yml`):

- Ejecuta `npm run test` en frontend y backend.
- Falla si:
  - Alguna prueba no pasa.
  - El linter detecta errores.
  - No se puede compilar el código.

---

## 6. Resultados esperados

- Reporte de cobertura generado en `/coverage`.
- Estado de CI “✔ Passing”.
- Documentación actualizada (`CHANGELOG.md`).

---

## 7. Aprobación

La entrega final del sistema se considera **aprobada** si:

- Todas las pruebas unitarias e integrales pasan.
- Cobertura ≥70%.
- Sin defectos críticos abiertos.
