docs/API.md

# 📡 Documentación de la API – Sistema de Gestión de Mantenimiento

> Versión: 1.0.0  
> Base URL: `http://localhost:3000/api`

---

## 🔐 Autenticación (`/auth`)

| Método | Endpoint         | Descripción                         |
| ------ | ---------------- | ----------------------------------- |
| `POST` | `/auth/login`    | Inicia sesión y devuelve token JWT. |
| `POST` | `/auth/register` | Registra un nuevo usuario.          |

---

## 👤 Usuarios (`/users`)

| Método   | Endpoint     | Descripción                        |
| -------- | ------------ | ---------------------------------- |
| `GET`    | `/users/:id` | Obtiene información de un usuario. |
| `PUT`    | `/users/:id` | Actualiza información del usuario. |
| `DELETE` | `/users/:id` | Elimina un usuario.                |

---

## 🚗 Vehículos (`/vehicles`)

| Método | Endpoint             | Descripción                        |
| ------ | -------------------- | ---------------------------------- |
| `POST` | `/vehicles`          | Registra un nuevo vehículo.        |
| `GET`  | `/vehicles/user/:id` | Lista los vehículos de un cliente. |

---

## 🔍 Diagnósticos (`/diagnostics`)

| Método | Endpoint           | Descripción                        |
| ------ | ------------------ | ---------------------------------- |
| `POST` | `/diagnostics`     | Crea una solicitud de diagnóstico. |
| `GET`  | `/diagnostics/:id` | Consulta el diagnóstico por ID.    |

---

## 🔧 Mantenimientos (`/maintenance`)

| Método | Endpoint           | Descripción                            |
| ------ | ------------------ | -------------------------------------- |
| `GET`  | `/maintenance`     | Lista los mantenimientos por cliente.  |
| `PUT`  | `/maintenance/:id` | Actualiza el estado del mantenimiento. |

---

## 👨‍🔧 Operarios (`/operator`)

| Método | Endpoint            | Descripción                            |
| ------ | ------------------- | -------------------------------------- |
| `GET`  | `/operator/tickets` | Muestra tickets asignados al operario. |
| `POST` | `/operator/report`  | Genera reporte correctivo.             |

---

## 🧾 Administración (`/admin`)

| Método | Endpoint            | Descripción                    |
| ------ | ------------------- | ------------------------------ |
| `POST` | `/admin/tickets`    | Crea y asigna un ticket.       |
| `GET`  | `/admin/components` | Lista componentes registrados. |
| `POST` | `/admin/components` | Agrega un nuevo componente.    |

---

> 🧠 Documentación interactiva disponible en  
> 👉 `http://localhost:3000/api/docs` (Swagger UI)
