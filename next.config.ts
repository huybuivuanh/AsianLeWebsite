import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets phones on the home Wi-Fi open the dev server by IP (any 192.168.x.x, since the
  // computer's IP changes). Dev only — has no effect on the deployed site.
  allowedDevOrigins: ["192.168.*.*", "169.254.83.107"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
