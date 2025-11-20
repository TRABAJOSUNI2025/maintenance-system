# Estándares de Calidad y Seguridad - Sistema de Mantenimiento

## 📋 Índice

1. [Refactorización de Seguridad](#refactorización-de-seguridad)
2. [Programación en Parejas](#programación-en-parejas)
3. [Estándar de Codificación (ESLint)](#estándar-de-codificación-eslint)
4. [Pipeline de Integración Continua](#pipeline-de-integración-continua)
5. [Pruebas de Cobertura](#pruebas-de-cobertura)

---

## 🔒 Refactorización de Seguridad

### Objetivos

- Mejorar la protección de datos sensibles
- Implementar validación robusta de entradas
- Fortalecer la autenticación y autorización
- Auditar y registrar operaciones críticas
- Implementar encriptación en datos en tránsito y en reposo

### Áreas Críticas

#### 1. Autenticación y Autorización

```typescript
// ✅ CORRECTO: Validación de tokens con expiración
@UseGuards(JwtAuthGuard)
@Controller("admin")
export class AdminController {
  // Las rutas están protegidas con JWT
}

// ❌ INCORRECTO: Contraseñas en texto plano
const password = "admin123"; // NUNCA
```

#### 2. Validación de Entrada

```typescript
// ✅ CORRECTO: DTOs con validación
import { IsEmail, IsStrongPassword } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}

// ❌ INCORRECTO: Sin validación
function createUser(email, password) {
  // Falta validación
}
```

#### 3. Protección contra CSRF

- Implementar tokens CSRF en formularios
- Validar origen de solicitudes
- Usar cookies SameSite

#### 4. Inyección SQL

```typescript
// ✅ CORRECTO: Usar Prisma ORM
const user = await prisma.usuario.findUnique({
  where: { email: userEmail },
});

// ❌ INCORRECTO: Consultas concatenadas
const query = `SELECT * FROM usuarios WHERE email = '${email}'`;
```

#### 5. Encriptación

- Encriptar datos sensibles en base de datos
- Usar HTTPS en todas las comunicaciones
- Implementar key rotation periódicamente

#### 6. Logging y Auditoría

```typescript
// Registrar todas las operaciones críticas
logger.info("Usuario autenticado", { userId, timestamp, ip });
logger.warn("Intento fallido de acceso", { userId, attempts });
logger.error("Error crítico", { error, stackTrace });
```

### Checklist de Seguridad

- [ ] Todas las contraseñas hasheadas con bcrypt (12 rondas mínimo)
- [ ] Tokens JWT con expiración corta
- [ ] Validación en cliente y servidor
- [ ] Autenticación en todos los endpoints protegidos
- [ ] Autorización por rol verificada
- [ ] Datos sensibles no expuestos en logs
- [ ] CORS correctamente configurado
- [ ] Rate limiting implementado
- [ ] Actualizaciones de dependencias al día

---

## 👥 Programación en Parejas

### Beneficios

- Reducción de bugs en 50%
- Mejor transferencia de conocimiento
- Código más mantenible
- Mejora de la calidad general

### Proceso

#### 1. Preparación

- Seleccionar dos desarrolladores con habilidades complementarias
- Preparar el ambiente de trabajo (una computadora o screen sharing)
- Definir tareas claras y estimaciones

#### 2. Rotación de Roles

**Driver (Escritor)**

- Escribe el código
- Se enfoca en la sintaxis y detalles
- Sigue las indicaciones del Navigator

**Navigator (Observador)**

- Revisa el código en tiempo real
- Piensa en la estrategia general
- Anticipa problemas
- Consulta documentación

```
⏱️ Rotar cada 15-30 minutos
```

#### 3. Mejores Prácticas

✅ **Hacer**

- Comunicarse claramente
- Hacer pausas regulares
- Mantener conversaciones constructivas
- Documentar decisiones
- Celebrar logros

❌ **Evitar**

- Sesiones muy largas (máximo 2 horas)
- Interrupciones frecuentes
- Crítica destructiva
- Distracciones (redes sociales)
- Trabajo solitario en partes críticas

#### 4. Herramientas Recomendadas

- **VS Code Live Share**: Colaboración en tiempo real
- **Tuple**: Pair programming especializado
- **Zoom/Google Meet**: Para comunicación
- **Git**: Para compartir código

#### 5. Tipos de Sesiones

| Tipo           | Duración  | Objetivo                     |
| -------------- | --------- | ---------------------------- |
| Arquitectura   | 1-2 horas | Diseñar soluciones complejas |
| Implementación | 1-2 horas | Escribir características     |
| Code Review    | 30-60 min | Revisar y mejorar código     |
| Bug Hunt       | 1 hora    | Depuración en equipo         |

---

## 📝 Estándar de Codificación (ESLint)

### Configuración

**Archivo: `eslint.config.js`**

```javascript
export default [
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      // Mejores prácticas
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-console": "warn",
      "prefer-const": "error",
      "no-var": "error",

      // Estilo
      semi: ["error", "always"],
      quotes: ["error", "single"],
      indent: ["error", 2],
      "comma-dangle": ["error", "always-multiline"],

      // Async/Await
      "no-async-promise-executor": "error",
      "require-await": "error",
    },
  },
];
```

### Comandos

```bash
# Verificar todo el código
npm run lint

# Corregir automáticamente
npm run lint:fix

# Verificar un archivo específico
npm run lint src/app.module.ts
```

### Reglas Clave Implementadas

#### 1. Nomenclatura

```typescript
// ✅ CORRECTO
const MAX_USERS = 100;
function calculateTotalPrice() {}
class UserRepository {}

// ❌ INCORRECTO
const max_users = 100;
function CalculateTotalPrice() {}
class userrepository {}
```

#### 2. Imports

```typescript
// ✅ CORRECTO
import { Module } from "@nestjs/common";
import { UserService } from "./services/user.service";

// ❌ INCORRECTO
import * as everything from "@nestjs/common";
const UserService = require("./services/user.service");
```

#### 3. Funciones

```typescript
// ✅ CORRECTO
const calculateSum = (a: number, b: number): number => a + b;

// ❌ INCORRECTO
function CalculateSum(a, b) {
  return a + b;
}
```

#### 4. Async/Await

```typescript
// ✅ CORRECTO
async function fetchUser(id: string) {
  try {
    const user = await userService.findById(id);
    return user;
  } catch (error) {
    logger.error("Error fetching user", error);
    throw error;
  }
}

// ❌ INCORRECTO
function fetchUser(id) {
  return userService.findById(id).then((user) => user);
}
```

### Configuración en Editor

**VS Code: `.vscode/settings.json`**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.enable": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### Pre-commit Hooks

Usar `lint-staged` para ejecutar ESLint antes de commits:

```bash
npm run prepare
```

---

## 🔄 Pipeline de Integración Continua

### Arquitectura CI/CD

```
┌─────────────────┐
│  Git Push       │
└────────┬────────┘
         │
┌────────▼────────┐
│  GitHub Actions │
└────────┬────────┘
         │
    ┌────┴────────────────┬────────────────┬─────────────┐
    │                     │                │             │
┌───▼────┐      ┌────────▼─────┐  ┌──────▼──────┐  ┌────▼───┐
│  Lint  │      │   Build      │  │   Tests     │  │Security│
└───┬────┘      └────────┬─────┘  └──────┬──────┘  └────┬───┘
    │                    │               │             │
    └────────┬───────────┴───────────────┴─────────────┘
             │
        ┌────▼────────┐
        │   Deploy    │
        └─────────────┘
```

### Etapas del Pipeline

#### 1. **Lint & Format**

```yaml
name: Lint Check
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run lint
      - run: npm run format:check
```

#### 2. **Build**

```yaml
build:
  runs-on: ubuntu-latest
  needs: lint
  steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
    - run: npm install
    - run: npm run build
    - run: npm run build:backend
```

#### 3. **Tests**

```yaml
test:
  runs-on: ubuntu-latest
  needs: build
  steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
    - run: npm install
    - run: npm run test:unit
    - run: npm run test:e2e
    - run: npm run test:coverage
```

#### 4. **Security Scan**

```yaml
security:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - run: npm audit
    - run: npm install -g snyk
    - run: snyk test
```

#### 5. **Deploy**

```yaml
deploy:
  runs-on: ubuntu-latest
  needs: [test, security]
  if: github.ref == 'refs/heads/main'
  steps:
    - uses: actions/checkout@v3
    - name: Deploy to Railway
      env:
        RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
      run: npm run deploy
```

### Archivos de Configuración

**`.github/workflows/ci.yml`** - Pipeline principal

**`railway.json`** - Configuración de despliegue

**`Procfile`** - Instrucciones para Railway

### Requisitos de Merge

- ✅ Todos los tests deben pasar
- ✅ Cobertura mínima de 80%
- ✅ Lint sin errores
- ✅ Code review aprobada
- ✅ Rama actualizada con main
- ✅ Sin conflictos

### Monitoreo

- **Logs centralizados**: Papertrail o ELK Stack
- **Alertas**: Slack, Email
- **Métricas**: GitHub Actions Dashboard
- **Performance**: New Relic o DataDog

---

## 🧪 Pruebas de Cobertura

### Objetivo

Mantener cobertura mínima de **80%** del código

### Tipos de Pruebas

#### 1. Pruebas Unitarias

```typescript
// src/services/user.service.spec.ts
describe("UserService", () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe("findById", () => {
    it("debe retornar un usuario por ID", async () => {
      const userId = "123";
      const mockUser = { id: userId, email: "test@example.com" };

      jest.spyOn(prisma.usuario, "findUnique").mockResolvedValue(mockUser);

      const result = await service.findById(userId);

      expect(result).toEqual(mockUser);
      expect(prisma.usuario.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it("debe lanzar excepción si usuario no existe", async () => {
      jest.spyOn(prisma.usuario, "findUnique").mockResolvedValue(null);

      await expect(service.findById("999")).rejects.toThrow();
    });
  });
});
```

#### 2. Pruebas de Integración

```typescript
// test/e2e/auth.e2e.spec.ts
describe("Authentication (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe("POST /auth/login", () => {
    it("debe autenticar usuario correctamente", () => {
      return request(app.getHttpServer())
        .post("/auth/login")
        .send({
          email: "user@example.com",
          password: "Password123!",
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty("accessToken");
          expect(res.body).toHaveProperty("refreshToken");
        });
    });

    it("debe rechazar credenciales inválidas", () => {
      return request(app.getHttpServer())
        .post("/auth/login")
        .send({
          email: "user@example.com",
          password: "wrongPassword",
        })
        .expect(401);
    });
  });
});
```

#### 3. Pruebas de Cobertura

```bash
# Ejecutar con cobertura
npm run test:coverage

# Generar reporte HTML
npm run test:coverage -- --coverage-reporters=html

# Ver reporte
start coverage/index.html  # Windows
open coverage/index.html   # macOS
```

### Estructura de Archivos

```
backend/
├── src/
│   ├── modules/
│   │   ├── users/
│   │   │   ├── user.service.ts
│   │   │   ├── user.service.spec.ts    ← Pruebas unitarias
│   │   │   ├── user.controller.ts
│   │   │   └── user.controller.spec.ts
├── test/
│   ├── e2e/
│   │   ├── auth.e2e.spec.ts            ← Pruebas E2E
│   │   └── users.e2e.spec.ts
│   └── unit/
```

### Comandos

```bash
# Pruebas unitarias
npm run test:unit

# Pruebas E2E
npm run test:e2e

# Cobertura completa
npm run test:coverage

# Modo watch (desarrollo)
npm run test:watch

# Pruebas con verbose
npm run test:debug
```

### Cobertura Esperada por Módulo

| Módulo      | Cobertura Mínima |
| ----------- | ---------------- |
| Auth        | 90%              |
| Users       | 85%              |
| Maintenance | 80%              |
| Admin       | 80%              |
| Operators   | 85%              |
| Vehicles    | 80%              |
| Health      | 75%              |

### Métricas de Cobertura

```
Statements   : 82.5% ( 330/400 )
Branches     : 78.3% ( 225/287 )
Functions    : 85.1% ( 102/120 )
Lines        : 84.2% ( 315/374 )
```

### Herramientas

- **Jest**: Framework de testing
- **Supertest**: Testing HTTP
- **@nestjs/testing**: Módulo de testing NestJS
- **Istanbul**: Medición de cobertura

### Mejora Continua

1. **Revisar cobertura regularmente**
2. **Establecer objetivos increméntales**
3. **Priorizar cobertura de rutas críticas**
4. **Automatizar métricas en CI/CD**
5. **Documentar casos de borde**

---

## 📊 Dashboard de Calidad

### Métricas Principales

| Métrica             | Meta       | Actual | Estado |
| ------------------- | ---------- | ------ | ------ |
| Cobertura de Tests  | 80%        | -      | ⏳     |
| Errores ESLint      | 0          | -      | ⏳     |
| Vulnerabilidades    | 0 críticas | -      | ⏳     |
| Tiempo de Build     | < 5 min    | -      | ⏳     |
| Deploy Success Rate | 99%        | -      | ⏳     |

### Revisión de Calidad

```
Frecuencia: Semanal (Viernes)
Duración: 30 minutos
Participantes: Equipo de desarrollo
Agenda:
  1. Métricas de cobertura (5 min)
  2. Vulnerabilidades de seguridad (5 min)
  3. Errores y warnings (10 min)
  4. Mejoras propuestas (10 min)
```

---

## 🔗 Referencias

- [ESLint Documentation](https://eslint.org/docs/)
- [Jest Testing](https://jestjs.io/docs/getting-started)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [OWASP Security](https://owasp.org/www-project-top-ten/)
- [Pair Programming Best Practices](https://martinfowler.com/articles/on-pair-programming.html)

---

**Última actualización**: 19 de noviembre de 2025

**Versión**: 1.0

**Responsable**: Equipo de Calidad y Seguridad
