# 🏪 Ramu Jamu Kiosk

The interactive self-service Kiosk application for Ramu Jamu physical stations. This Next.js application is designed for touch-screen interfaces, allowing walk-in customers to seamlessly order their custom Jamu directly from the physical machines.

## 🌟 Key Features

- **Touch-Optimized UI**: Large buttons and highly legible text designed for interactive kiosk displays.
- **Symptom-Based Ordering**: Customers can select their current symptoms to receive personalized Jamu recommendations.
- **Direct Machine Integration**: Communicates with the brewing hardware to dispense the ordered Jamu.
- **Streamlined Checkout**: Fast and simple ordering flow tailored for public use.

## 🛠️ Development

This app is part of the Ramu Jamu Turborepo workspace.

To run this app locally:
```bash
# From the root of the monorepo:
npx turbo run dev --filter=kiosk
```

## 🏗️ Architecture
- Built with **Next.js App Router**.
- Uses shared UI components from `@ramu/ui` specifically styled for touch screens.
- Interacts with the backend via `@ramu/db`.
