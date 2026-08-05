# 🗄️ Ramu Database Package

The `@ramu/db` package serves as the single source of truth for database interactions across the entire Ramu Jamu monorepo. It centralizes all database models, ORM configurations, and access logic.

## 🌟 Overview

- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [Neon PostgreSQL](https://neon.tech/)
- **Centralized Schema**: Defines the data structures for Admins, Users, Orders, Machines, Ingredients, and Symptoms.

## 🛠️ Usage

### Importing Prisma Client

Applications within the monorepo (e.g., `admin`, `web`, `kiosk`) can import the instantiated Prisma Client directly from this package:

```typescript
import prisma from "@ramu/db";

// Example query
const admins = await prisma.admin.findMany();
```

### Prisma Commands

Because this monorepo uses `dotenv-cli` for centralized environment variable management, all Prisma commands are wrapped inside NPM scripts to automatically load the root `.env` file.

Run these commands from the `packages/database` directory:

- `pnpm db:generate`: Generates the Prisma Client after schema changes.
- `pnpm db:push`: Pushes schema changes directly to the database (useful for prototyping).
- `pnpm db:migrate`: Creates and applies a new migration file.
- `pnpm db:deploy`: Applies pending migrations to the database (used in CI/CD).

## 🗃️ Schema Structure

The schema (`prisma/schema.prisma`) includes critical business models:
- **Admin**: Staff accounts with Neon authentication logic.
- **Machine**: Physical brewing units installed at various locations.
- **Menu & Symptom**: Product catalog mapped to health benefits.
- **Order & Session**: Transaction history and user activity tracking.
- **Ingredient**: Raw material inventory tracking.
