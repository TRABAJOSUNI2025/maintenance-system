# ✅ Estándares de Calidad y Buenas Prácticas

## 1. Normativas de referencia

- **ISO/IEC 25010**: Modelo de calidad del software.
- **ISO/IEC 12207**: Procesos de ciclo de vida del software.
- **CMMI Nivel 2-3**: Prácticas de gestión de calidad y procesos.

---

## 2. Principios de desarrollo

| Categoría        | Práctica                                            |
| ---------------- | --------------------------------------------------- |
| Arquitectura     | Clean Architecture + Modularidad                    |
| Estilo de código | Airbnb TypeScript Style Guide                       |
| Versionamiento   | GitHub Flow + Commits Semánticos                    |
| Documentación    | README, Swagger, comentarios JSDoc                  |
| Testing          | TDD básico + Cobertura mínima 70%                   |
| Seguridad        | JWT + validación de roles + sanitización de entrada |
| CI/CD            | Integración continua con GitHub Actions             |
| Mantenibilidad   | Código tipado y desacoplado                         |

---

## 3. Estilo de código

- `eslint` con configuración Airbnb extendida.
- `prettier` para formato automático.
- Reglas clave:
  - Uso obligatorio de **TypeScript**.
  - Nombres de variables en **camelCase**.
  - Componentes React con **PascalCase**.
  - Evitar lógica compleja en controladores.

---

## 4. Revisión de calidad

- **Code Review** obligatorio para merges a `main`.
- **SonarLint / ESLint** para detección temprana de defectos.
- **Análisis de métricas**:
  - Cobertura de pruebas.
  - Complejidad ciclomática.
  - Duplicación de código.

---

## 5. Mantenibilidad

- Cada módulo debe ser **independiente y desacoplado**.
- No se permite lógica duplicada.
- DTOs reutilizables entre controladores y servicios.

---

## 6. Entregables de calidad

| Entregable            | Estándar                             |
| --------------------- | ------------------------------------ |
| Código fuente         | Documentado y tipado                 |
| Documentación técnica | Actualizada y trazable               |
| Pruebas automatizadas | Al menos 1 por módulo                |
| Pipeline CI           | Ejecuta tests y lint automáticamente |
