import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Cảnh báo: điều này sẽ bỏ qua kiểm tra ESLint khi build (bao gồm cả khi deploy)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
