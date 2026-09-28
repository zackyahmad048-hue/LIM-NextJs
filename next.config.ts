import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);

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
  // Turbopack is the default bundler in Next 16. Declaring the root keeps the
  // config self-consistent when the workspace is not the filesystem root.
  turbopack: {
    root: path.resolve(dirname),
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

export default withPayload(nextConfig);
