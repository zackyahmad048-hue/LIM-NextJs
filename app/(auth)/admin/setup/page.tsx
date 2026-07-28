import { createAdmin } from "@/actions/create-admin";

export default function SetupPage() {
  return (
    <form
      action={createAdmin}
      className="flex min-h-screen items-center justify-center"
    >
      <button
        className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white"
      >
        Buat Admin Pertama
      </button>
    </form>
  );
}