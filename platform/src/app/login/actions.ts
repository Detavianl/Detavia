"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_COOKIE } from "@/lib/admin-context";
import { isDemo } from "@/lib/demo";

// Demo-login werkt alleen zonder Supabase. In productie (keys gezet) weigeren deze.
export async function loginDemo() {
  if (!isDemo()) redirect("/login");
  const jar = await cookies();
  jar.set(DEMO_COOKIE, "1", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
  redirect("/admin");
}

export async function logoutDemo() {
  const jar = await cookies();
  jar.delete(DEMO_COOKIE);
  redirect("/login");
}
