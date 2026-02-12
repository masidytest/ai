# Masidy SaaS Platform Documentation

## Introduction
Masidy is a modular, full-stack SaaS platform for rapid prototyping and scalable product development. It features a clean, enterprise-grade architecture, neon/dark UI, and a full suite of engines: authentication, billing, projects, notifications, audit, API gateway, webhooks, file storage, versioning, cloud, hosting, domains, database, workflow, UI builder, IDE, AI engines, integrations, templates, logs, deployment, and settings.

## Architecture Overview
- **Backend:** Node.js + Express, TypeScript, modular services/controllers/models, in-memory storage (stubbed for now)
- **Frontend:** Next.js, TypeScript, TailwindCSS, ShadCN UI, Framer Motion, modular pages/components/layouts
- **AI:** All AI modules are stubbed for rapid prototyping
- **Testing:** Jest + Supertest, with mocks for all external dependencies

## Module-by-Module Documentation
### Authentication Engine
- User, session, role, and API key management
- Providers: Clerk, Auth0, Firebase (stub)
- In-memory storage for users/sessions
- Permission checks via RoleService

### Billing Engine
- Customer, payment method, subscription, invoice management
- Stripe integration (stub)
- Plans: free, pro, enterprise
- BillingController exposes RESTful routes

### Projects Engine
- Project CRUD, settings, members, roles, activity log
- In-memory storage

### Notifications Engine
- Notification model/service/preferences/dispatcher
- Channels: email, in-app, webhook (stub)

### Audit Trail Engine
- AuditLog model/service
- Log types: auth, billing, workflow, etc.
- Query filters

### API Gateway Engine
- ApiRoute model/service
- Rate limiting, auth, proxy (stub)

### Webhooks Engine
- Webhook model/service/delivery/logs
- Signing secret, retry logic (stub)

### File Storage Engine
- File upload/download/delete (stub)
- Storage provider abstraction

### Versioning Engine
- Version model/service
- Snapshots, rollback (stub)

### Cloud, Hosting, Domain Engines
- CloudService, HostingService, DomainModel (stub)
- Provisioning, DNS, SSL, email (stub)

### Database Engine
- Instance, schema, query, backup, branching
- AI SQL assistant (stub)

### Workflow Engine
- Node, parameter, connection, trigger generators
- AI workflow generator/validator (stub)

### UI Builder Engine
- UiBuilderService: generate UI from prompt (stub)

### IDE & AI Engines
- Monaco-based IDE, code generation, refactor, explain, fix, complete, context, memory
- AI UI/Workflow/Code Generators (stub)
- AI Global Assistant (stub)

### Integrations Engine
- OAuth handler (stub)
- Supported: GitHub, GitLab, Bitbucket, Slack, Discord, Notion (stub)

### Templates Engine
- Template import/export/service (stub)

### Logs Engine
- LogService: log/query (stub)

### Deployment Engine
- DeploymentService: deploy/status (stub)

### Settings Engine
- Global, user, project settings (stub)

## Backend Architecture
- Modular folder structure: /src/modules/[engine]
- Each engine: models, services, controllers, routes
- In-memory storage for all data
- RESTful API design

## Frontend Architecture
- Modular folder structure: /frontend/pages, /frontend/components
- Neon/dark UI, responsive, modern
- All major flows: auth, billing, projects, admin, onboarding

## AI Engines Documentation
- All AI modules are stubbed for now
- Each exposes a service with methods for generation, explanation, or guidance

## Cloud, Hosting, Domain Engines
- CloudService, HostingService, DomainModel: stub logic for provisioning, DNS, SSL, email

## Database, Workflow, UI Builder, IDE
- See module docs above

## Authentication + Billing Documentation
- See module docs above

## API Reference
- All controllers expose RESTful routes (see BillingController, etc.)
- Example: `POST /billing/subscribe`, `GET /projects`, etc.

## Data Models Reference
- See each module's Model.ts file for interfaces

## Event System Reference
- Webhooks, notifications, audit logs, activity logs

## Security Model
- Role-based access control (stub)
- API key validation (stub)

## Performance Model
- In-memory for prototyping; swap for persistent storage in production

## Scalability Model
- Modular, stateless services; ready for distributed deployment

## Testing Documentation
- Jest + Supertest
- /tests/generalPlatform.test.ts ensures all modules exist

## Glossary
- **Engine:** A modular backend or frontend subsystem
- **Stub:** Placeholder logic for rapid prototyping

## FAQ
- **Q:** How do I add a new engine?
	**A:** Create a new folder in /src/modules, add model/service/controller as needed.
- **Q:** How do I run tests?
	**A:** `npm test` (ensure Jest is configured)
- **Q:** How do I swap to persistent storage?
	**A:** Replace in-memory arrays/maps with a database layer.

---

For more details, see the code in each module and the tests folder.
