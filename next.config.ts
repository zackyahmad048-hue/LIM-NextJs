import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
  serverExternalPackages: ["pdfjs-dist", "@napi-rs/canvas"],
  outputFileTracingIncludes: {
    "/api/v1/verifikasi/surat/[...kode]": [
      "./node_modules/pdfjs-dist/cmaps/**/*.bcmap",
      "./node_modules/pdfjs-dist/standard_fonts/**/*.pfb",
    ],
  },
};

export default nextConfig;
