# 🎨 Ramu UI Package

The `@ramu/ui` package is the shared component library for the Ramu Jamu ecosystem. It provides a consistent design system and reusable interface elements across all applications (`admin`, `kiosk`, and `web`).

## 🌟 Overview

- **Design System**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Component Base**: [Base UI](https://base-ui.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: `tailwindcss-animate`

## 🛠️ Usage

This package exports a highly curated set of React components. Applications within the monorepo can import these components directly:

```tsx
import { Button } from "@ramu/ui/components/button";
import { Card, CardHeader, CardTitle, CardContent } from "@ramu/ui/components/card";

export default function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click Me</Button>
      </CardContent>
    </Card>
  );
}
```

## 🎨 Styling Architecture

- **Global Variables**: Defined in `src/styles/globals.css`. It sets the core theme (colors, radius scales) using `oklch` color spaces for both light and dark modes.
- **Consistent Radius**: All components adhere to a unified `--radius` system, ensuring that structural elements (like Cards) and interactive elements (like Buttons and Inputs) share a cohesive visual shape.
- **Tailwind V4**: This package utilizes the new Tailwind CSS v4 engine. The `globals.css` acts as the single source of truth for the theme.

## ➕ Adding New Components

To add a new Shadcn UI component to the library, you can run the following command from the root of the workspace (or the specific app):

```bash
pnpm dlx shadcn@latest add [component-name] -c packages/ui
```
