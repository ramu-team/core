# 🛡️ Ramu Jamu Admin

The Admin application for the Ramu Jamu ecosystem. This is a secure, internal-facing Next.js application used by staff and administrators to manage the entire business logic and inventory.

## 🌟 Key Features

- **Admins Management**: Create and manage staff access.
- **Machines Control**: Monitor and control physical Jamu brewing machines.
- **Menu & Symptoms**: Configure the product menu and link Jamu products to specific health symptoms.
- **Ingredients & Inventory**: Track raw materials and stock levels.
- **Orders & Sessions**: View transaction history and active user sessions.
- **Profile Settings**: Manage personal account configurations.

## 🛠️ Development

This app is part of the Ramu Jamu Turborepo workspace.

To run this app locally:
```bash
# From the root of the monorepo:
npx turbo run dev --filter=admin
```

## 🏗️ Architecture
- Built with **Next.js App Router**.
- Uses shared components from `@ramu/ui`.
- Interfaces with the database via `@ramu/db`.
- Authenticated via Neon Auth.
