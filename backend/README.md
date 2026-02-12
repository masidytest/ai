# Masidy Backend

This is the backend for the Masidy SaaS platform, built with Node.js, TypeScript, and Express.js.

## Project Structure

- **src/**: Source code
  - **modules/**: Feature modules (e.g., user, billing, etc.)
  - **routes/**: Express route definitions
  - **controllers/**: Request handlers
  - **services/**: Business logic
  - **integrations/**: Third-party integrations
  - **database/**: Database connection and models
  - **middleware/**: Express middleware (validation, error handling, etc.)
  - **utils/**: Utility functions

## Scripts
- `npm run dev` — Start in development mode (with ts-node-dev)
- `npm run build` — Compile TypeScript to JavaScript
- `npm start` — Run compiled app

## Middleware
- CORS
- Helmet
- Rate limiting
- Request validation
- Error handling

## Getting Started
1. `cd backend`
2. `npm install`
3. `npm run dev`

---

This backend is ready for modular expansion and integration with the Next.js frontend.
