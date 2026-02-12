# Masidy Platform — Complete Documentation

## Introduction
Masidy is a modular, full-stack SaaS platform for rapid prototyping and scalable product development. It features a clean, enterprise-grade architecture, neon/dark UI, and a full suite of engines: authentication, billing, projects, notifications, audit, API gateway, webhooks, file storage, versioning, cloud, hosting, domains, database, workflow, UI builder, IDE, AI engines, integrations, templates, logs, deployment, and settings.

---

## Architecture Overview

```
+-------------------+      +-------------------+
|   Frontend (FE)   | <--> |   Backend (BE)    |
+-------------------+      +-------------------+
         |                        |
         v                        v
   [UI/UX: Next.js]         [APIs: Express]
   [Tailwind, ShadCN]        [TypeScript]
   [Framer Motion]           [Modular Engines]
```

- **Backend:** Node.js + Express, TypeScript, modular services/controllers/models, in-memory storage (stubbed for now)
- **Frontend:** Next.js, TypeScript, TailwindCSS, ShadCN UI, Framer Motion, modular pages/components/layouts
- **AI:** All AI modules are stubbed for rapid prototyping
- **Testing:** Jest + Supertest, with mocks for all external dependencies

---

## Module-by-Module Documentation

### Authentication Engine
- User, session, role, and API key management
- Providers: Clerk, Auth0, Firebase (stub)
- In-memory storage for users/sessions
- Permission checks via RoleService

**Example:**
```ts
const user = authService.register('email', 'password');
const session = sessionService.createSession(user.id);
```

### Billing Engine
- Customer, payment method, subscription, invoice management
- Stripe integration (stub)
- Plans: free, pro, enterprise
- BillingController exposes RESTful routes

**Endpoints:**
- `POST /billing/subscribe`
- `GET /billing/invoices`

**Example:**
```ts
const sub = billingService.createSubscription(userId, 'pro');
```

### Projects Engine
- Project CRUD, settings, members, roles, activity log
- In-memory storage

**Example:**
```ts
const project = projectService.createProject('My Project', userId);
```

### Notifications Engine
- Notification model/service/preferences/dispatcher
- Channels: email, in-app, webhook (stub)

**Example:**
```ts
notificationService.sendNotification(userId, 'info', 'Welcome!', 'in-app');
```

### Audit Trail Engine
- AuditLog model/service
- Log types: auth, billing, workflow, etc.
- Query filters

**Example:**
```ts
auditLogService.log(userId, 'auth', 'login');
```

### API Gateway Engine
- ApiRoute model/service
- Rate limiting, auth, proxy (stub)

**Example:**
```ts
apiRouteService.createRoute('/api/data', 'GET', userId);
```

### Webhooks Engine
- Webhook model/service/delivery/logs
- Signing secret, retry logic (stub)

**Example:**
```ts
webhookService.createWebhook('https://myapp.com/webhook', 'secret', userId);
```

### File Storage Engine
- File upload/download/delete (stub)
- Storage provider abstraction

**Example:**
```ts
fileStorageService.uploadFile(file);
```

### Versioning Engine
- Version model/service
- Snapshots, rollback (stub)

**Example:**
```ts
versioningService.createVersion(resourceId);
```

### Cloud, Hosting, Domain Engines
- CloudService, HostingService, DomainModel (stub)
- Provisioning, DNS, SSL, email (stub)

**Example:**
```ts
cloudService.provisionResource('vm', config);
```

### Database Engine
- Instance, schema, query, backup, branching
- AI SQL assistant (stub)

**Example:**
```ts
databaseQueryService.query('SELECT * FROM users');
```

### Workflow Engine
- Node, parameter, connection, trigger generators
- AI workflow generator/validator (stub)

**Example:**
```ts
aiWorkflowGeneratorService.generateWorkflow('Automate onboarding');
```

### UI Builder Engine
- UiBuilderService: generate UI from prompt (stub)

**Example:**
```ts
uiBuilderService.generateUI('Dashboard for analytics');
```

### IDE & AI Engines
- Monaco-based IDE, code generation, refactor, explain, fix, complete, context, memory
- AI UI/Workflow/Code Generators (stub)
- AI Global Assistant (stub)

**Example:**
```ts
aiCodeGeneratorService.generateCode('CRUD for users');
aiGlobalAssistantService.answerQuestion('How do I deploy?');
```

### Integrations Engine
- OAuth handler (stub)
- Supported: GitHub, GitLab, Bitbucket, Slack, Discord, Notion (stub)

**Example:**
```ts
integrationsService.connectIntegration('github', config);
```

### Templates Engine
- Template import/export/service (stub)

**Example:**
```ts
templateService.importTemplate(data);
```

### Logs Engine
- LogService: log/query (stub)

**Example:**
```ts
logService.log('User created', 'info');
```

### Deployment Engine
- DeploymentService: deploy/status (stub)

**Example:**
```ts
deploymentService.deploy(projectId);
```

### Settings Engine
- Global, user, project settings (stub)

**Example:**
```ts
settingsService.getSettings('user', userId);
```

---

## Backend Architecture
- Modular folder structure: `/src/modules/[engine]`
- Each engine: models, services, controllers, routes
- In-memory storage for all data
- RESTful API design

**Diagram:**
```
[Client] <--> [Express API] <--> [Service Layer] <--> [In-Memory Store]
```

## Frontend Architecture
- Modular folder structure: `/frontend/pages`, `/frontend/components`
- Neon/dark UI, responsive, modern
- All major flows: auth, billing, projects, admin, onboarding

**Diagram:**
```
[Pages] <--> [Components] <--> [API Hooks] <--> [Backend API]
```

---

## AI Engines Documentation
- All AI modules are stubbed for now
- Each exposes a service with methods for generation, explanation, or guidance

**Example:**
```ts
aiUiGeneratorService.generateUi('Landing page');
aiWorkflowGeneratorService.generateWorkflow('User onboarding');
```

---

## Cloud Engine Documentation
- CloudService: provisionResource(type, config)

## Hosting Engine Documentation
- HostingService: stub for site provisioning, DNS, SSL

## Domain Engine Documentation
- DomainModel: domain registration, status

## Database Engine Documentation
- DatabaseQueryService: query, backup, branching

## Workflow Engine Documentation
- AiWorkflowGeneratorService: generateWorkflow(prompt)

## UI Builder Documentation
- UiBuilderService: generateUI(prompt)

## IDE Documentation
- Monaco-based, AI-powered code tools

## Authentication + Billing Documentation
- See module docs above

## API Gateway Documentation
- ApiRouteService: createRoute, listRoutes

## Webhooks Documentation
- WebhookService: createWebhook, listWebhooks

## File Storage Documentation
- FileStorageService: uploadFile, downloadFile, deleteFile

## Versioning Documentation
- VersioningService: createVersion, listVersions, rollbackVersion

## Integrations Documentation
- IntegrationsService: connectIntegration

## Templates Documentation
- TemplateService: importTemplate, exportTemplate

## Logs Documentation
- LogService: log, queryLogs

## Deployment Documentation
- DeploymentService: deploy, getDeploymentStatus

## Settings Documentation
- SettingsService: getSettings, updateSettings

---

## Testing Documentation
- Jest + Supertest
- `/tests/generalPlatform.test.ts` ensures all modules exist

**Example:**
```ts
import request from 'supertest';
// ...test code
```

---

## Security Model
- Role-based access control (stub)
- API key validation (stub)

## Performance Model
- In-memory for prototyping; swap for persistent storage in production

## Scalability Model
- Modular, stateless services; ready for distributed deployment

---

## API Reference (All Endpoints)
- See each controller for RESTful endpoints
- Example:
```
POST /auth/login
POST /auth/register
POST /billing/subscribe
GET /billing/invoices
GET /projects
POST /webhooks
...
```

## Data Models Reference
- See each module's `Model.ts` file for interfaces

## Event System Reference
- Webhooks, notifications, audit logs, activity logs

---

## Glossary
- **Engine:** A modular backend or frontend subsystem
- **Stub:** Placeholder logic for rapid prototyping

## FAQ
- **Q:** How do I add a new engine?
  **A:** Create a new folder in `/src/modules`, add model/service/controller as needed.
- **Q:** How do I run tests?
  **A:** `npm test` (ensure Jest is configured)
- **Q:** How do I swap to persistent storage?
  **A:** Replace in-memory arrays/maps with a database layer.

---

For more details, see the code in each module and the tests folder.
