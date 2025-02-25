import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/dashboard/:path*", 
        destination: "/new-dashboard/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/dashboard/:path*", 
        destination: "/new-dashboard/:path*",
      },
    ];
  },
};

export default nextConfig;
