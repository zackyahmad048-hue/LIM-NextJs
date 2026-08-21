"use server";

import { auth } from "@/modules/authentication/infrastructure/better-auth";
import { ensureSuperAdminRole } from "@/modules/authorization/application/ensure-super-admin";

export type CreateAdminResult = {
  ok: boolean;
  message: string;
};

export async function createAdmin(): Promise<CreateAdminResult> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return {
      ok: false,
      message:
        "ADMIN_EMAIL dan ADMIN_PASSWORD belum diatur di file .env.",
    };
  }

  let created = false;

  try {
    await auth.api.signUpEmail({
      body: {
        name: "Super Admin",
        email,
        password,
      },
    });
    created = true;
  } catch (error) {
    const { code, statusCode } = error as {
      code?: string;
      statusCode?: number;
    };
    if (
      code !== "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" &&
      code !== "USER_ALREADY_EXISTS" &&
      statusCode !== 422
    ) {
      return {
        ok: false,
        message: "Gagal membuat admin. Periksa kembali konfigurasi.",
      };
    }
  }

  try {
    const linked = await ensureSuperAdminRole(email);
    if (!linked) {
      return {
        ok: false,
        message: "Akun admin tidak ditemukan setelah pendaftaran.",
      };
    }
  } catch {
    return {
      ok: false,
      message: "Gagal memastikan role super-admin. Periksa kembali database.",
    };
  }

  return {
    ok: true,
    message: created
      ? `Admin ${email} berhasil dibuat. Silakan login di /admin/login.`
      : `Admin ${email} sudah terdaftar, role super-admin dipastikan. Silakan login di /admin/login.`,
  };
}
