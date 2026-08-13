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

  async redirects() {
    const port = process.env.PORT || "3000";
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "127.0.0.1" }],
        permanent: false,
        destination: `http://localhost:${port}/:path*`,
      },
    ];
  },
};

export default nextConfig;
