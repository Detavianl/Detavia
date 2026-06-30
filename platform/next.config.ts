import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: "10mb" }, // cv-uploads
  },
  images: {
    // Lokale /img + eventuele covers uit Supabase Storage.
    remotePatterns: [{ protocol: "https", hostname: "kpizjwjtcwwovqgojzog.supabase.co" }],
  },
};

export default nextConfig;
