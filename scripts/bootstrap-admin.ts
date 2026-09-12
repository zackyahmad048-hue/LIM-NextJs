import { auth } from "@/modules/authentication/infrastructure/better-auth";
import { ensureSuperAdminRole } from "@/modules/authorization/application/ensure-super-admin";

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error("ADMIN_EMAIL dan ADMIN_PASSWORD belum diatur di .env / env.");
  process.exit(1);
}

let created = false;

try {
  await auth.api.signUpEmail({ body: { name: "Super Admin", email, password } });
  created = true;
} catch (error) {
  const { code, statusCode } = error as { code?: string; statusCode?: number };
  if (
    code !== "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" &&
    code !== "USER_ALREADY_EXISTS" &&
    statusCode !== 422
  ) {
    console.error("Gagal membuat admin:", error);
    process.exit(1);
  }
}

const linked = await ensureSuperAdminRole(email);
if (!linked) {
  console.error("Akun admin tidak ditemukan setelah pendaftaran.");
  process.exit(1);
}

console.log(
  created
    ? `✓ Admin ${email} dibuat dan diberi role super-admin.`
    : `✓ Admin ${email} sudah terdaftar, role super-admin dipastikan.`,
);