import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@ramu/ui", "@ramu/db"],
}

export default nextConfig

