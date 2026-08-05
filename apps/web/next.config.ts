import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@ramu/ui", "@ramu/db"],
  serverExternalPackages: ["@prisma/client"],
}

export default nextConfig

