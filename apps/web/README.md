# 🌐 Ramu Jamu Web

The public-facing customer web application for the Ramu Jamu ecosystem. This Next.js application serves as the online storefront and customer portal where users can browse products, manage their accounts, and order their favorite Jamu remotely.

## 🌟 Key Features

- **Public Storefront**: Browse the complete Ramu Jamu catalog and discover health benefits.
- **Customer Accounts**: Users can sign up, log in, and manage their personal profiles.
- **Online Ordering**: Seamlessly place orders for pickup or delivery.
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile viewing.

## 🛠️ Development

This app is part of the Ramu Jamu Turborepo workspace.

To run this app locally:
```bash
# From the root of the monorepo:
npx turbo run dev --filter=web
```

## 🏗️ Architecture
- Built with **Next.js App Router**.
- Uses shared UI components from `@ramu/ui`.
- Interfaces with the database via `@ramu/db`.
