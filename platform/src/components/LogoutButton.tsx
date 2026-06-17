"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { logoutDemo } from "@/app/login/actions";

const DEMO = (() => {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !key || key === "replace-me";
})();

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    if (DEMO) { await logoutDemo(); return; }
    await createClient().auth.signOut();
    router.push("/login");
    router.refresh();
  }
  return (
    <button onClick={logout} className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-muted hover:bg-neutral-100">
      Uitloggen
    </button>
  );
}
