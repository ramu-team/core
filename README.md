# shadcn/ui monorepo template

This is a Next.js monorepo template with shadcn/ui.

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@ramu/ui/components/button";
```

## Vercel Deployment

To deploy this monorepo to Vercel, follow these steps:

1. Connect your GitHub repository to Vercel.
2. During the project import, Vercel will automatically detect the Turborepo workspace.
3. Configure the following settings for the **admin** app:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/admin`
   - **Build Command**: `cd ../.. && npx turbo run build --filter=admin` (or leave default if Vercel detects Turborepo natively)
4. **Environment Variables**:
   Make sure to copy the variables from `.env.example` into Vercel's Environment Variables settings before deploying:
   - `NEON_AUTH_BASE_URL`
   - `NEON_AUTH_COOKIE_SECRET`
   - `DATABASE_URL`

If you create a separate project for `apps/web` later, follow the same steps but change the Root Directory and filter to `web`.
