import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@ramu/ui", "@ramu/db"],
  serverExternalPackages: ["@prisma/client"],
  experimental: {
    serverActions: {
      allowedOrigins: [
        "admin.ramuproject.com",
        "machine.ramuproject.com",
        "ramuproject.com",
        "www.ramuproject.com",
        "localhost:3000",
        "localhost:3001",
        "localhost:3002"
      ],
    },
  },
}

export default nextConfig
