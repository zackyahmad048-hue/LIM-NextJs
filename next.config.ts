import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    qualities: [75],
  },
  turbopack: {
    // Prisma's generated client resolves paths at runtime; the tracing warning is expected and harmless here.
    ignoreIssue: [{ path: /generated[\\/]client[\\/]/, title: /Dynamic filesystem access/ }],
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
