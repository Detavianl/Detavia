"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_COOKIE } from "@/lib/admin-context";
import { PROF_COOKIE } from "@/lib/professional-context";
import { CLIENT_COOKIE } from "@/lib/client-context";
import { isDemo } from "@/lib/demo";

// Demo-login werkt alleen zonder Supabase. In productie (keys gezet) weigeren deze.
export async function loginDemo() {
  if (!isDemo()) redirect("/login");
  const jar = await cookies();
  jar.set(DEMO_COOKIE, "1", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
  redirect("/admin");
}

export async function loginDemoProfessional() {
  if (!isDemo()) redirect("/login");
  const jar = await cookies();
  jar.set(PROF_COOKIE, "1", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
  redirect("/portaal");
}

export async function loginDemoClient() {
  if (!isDemo()) redirect("/login");
  const jar = await cookies();
  jar.set(CLIENT_COOKIE, "1", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
  redirect("/opdrachtgever");
}

export async function logoutDemo() {
  const jar = await cookies();
  jar.delete(DEMO_COOKIE);
  jar.delete(PROF_COOKIE);
  jar.delete(CLIENT_COOKIE);
  redirect("/login");
}
