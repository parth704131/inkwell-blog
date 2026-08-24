# Inkwell

A production-structured sample blog built with Express, EJS, and PostgreSQL. The database schema is created and seeded automatically on first start.

## Requirements

- Node.js 22.5 or newer
- npm
- PostgreSQL

## Run locally

```bash
npm install
npm run db:create
npm run dev
```

Open <http://localhost:3000>.

## Project structure

```text
src/
  config/        Environment configuration
  controllers/   HTTP request handlers
  database/      PostgreSQL client, schema, and seed data
  middleware/    Shared Express middleware
  models/        Domain entities and their behavior
  repositories/  Database access
  routes/        Route definitions
  services/      Application use cases
  utils/         Reusable helpers
views/           EJS pages and partials
public/          Browser CSS and JavaScript
```

## Environment variables

Copy `.env.example` to `.env`, then update `DATABASE_URL` with your local PostgreSQL username, password, host, port, and database name. `DATABASE_SSL` should normally remain `false` locally and may need to be `true` for a hosted database.

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/inkwell
DATABASE_SSL=false
```

The `npm run db:create` command creates the local `inkwell` database. Tables and sample data are initialized when the app starts.
