# 🌿 Ramu Jamu Workspace

Welcome to the **Ramu Jamu** monorepo! This repository contains the entire software ecosystem for Ramu Jamu, built with modern web technologies and managed via [Turborepo](https://turbo.build/repo).

## 🏗️ Architecture

This repository is structured as a monorepo containing multiple applications and shared packages.

### Applications

- **[`apps/admin`](./apps/admin)**: The administrative dashboard for managing the Ramu Jamu system (Machines, Menus, Orders, Ingredients, Symptoms, Admins).
- **[`apps/kiosk`](./apps/kiosk)**: The self-service physical kiosk application used by customers to order Jamu interactively.
- **[`apps/web`](./apps/web)**: The public-facing web application for online customer interactions.

### Packages

- **[`packages/database`](./packages/database)**: Centralized database configuration, ORM (Prisma), schemas, and database access logic.
- **[`packages/ui`](./packages/ui)**: A shared, highly customizable UI component library built on top of [Base UI](https://base-ui.com) and [Shadcn UI](https://ui.shadcn.com/).

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: Custom UI built with Shadcn & Base UI
- **Database**: [Neon Serverless Postgres](https://neon.tech/) + [Prisma](https://www.prisma.io/)
- **Monorepo Tooling**: [Turborepo](https://turbo.build/) + [pnpm](https://pnpm.io/) workspace

## 🛠️ Getting Started

### 1. Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)

### 2. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/ramu-team/core.git
cd core
pnpm install
```

### 3. Environment Variables
This monorepo uses a **centralized environment configuration** via `dotenv-cli`. 
1. Copy the example file at the root:
```bash
cp .env.example .env
```
2. Fill in the required variables inside `.env`:
   - `DATABASE_URL`: Your Neon Postgres connection string.
   - `NEON_AUTH_BASE_URL` & `NEON_AUTH_COOKIE_SECRET`: Authentication credentials.

### 4. Running the Development Server
You can start all applications simultaneously using Turborepo from the root directory:
```bash
pnpm dev
```
Alternatively, to run a specific app:
```bash
npx turbo run dev --filter=admin
```

## ☁️ Vercel Deployment

To deploy any of the applications to Vercel, follow these steps:

1. Connect your GitHub repository to Vercel.
2. During the project import, Vercel will automatically detect the Turborepo workspace.
3. Configure the **Root Directory** and **Build Command** depending on which app you are deploying:

### For the Admin App
- **Root Directory**: `apps/admin`
- **Build Command**: `cd ../.. && npx turbo run build --filter=admin`

### For the Kiosk App
- **Root Directory**: `apps/kiosk`
- **Build Command**: `cd ../.. && npx turbo run build --filter=kiosk`

### For the Web App
- **Root Directory**: `apps/web`
- **Build Command**: `cd ../.. && npx turbo run build --filter=web`

4. **Environment Variables**:
   Make sure to copy the variables from your local `.env` into Vercel's Environment Variables settings before deploying. These variables will automatically apply to all apps globally in production.
