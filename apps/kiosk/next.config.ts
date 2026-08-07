import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@ramu/ui", "@ramu/db"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-17ba6356739b45dcb92e277a83e152cc.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig

