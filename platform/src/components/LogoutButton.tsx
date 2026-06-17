"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
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
