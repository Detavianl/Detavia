"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_COOKIE } from "@/lib/admin-context";
import { PROF_COOKIE } from "@/lib/professional-context";

export async function loginDemo() {
  const jar = await cookies();
  jar.set(DEMO_COOKIE, "1", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
  redirect("/admin");
}

export async function loginDemoProfessional() {
  const jar = await cookies();
  jar.set(PROF_COOKIE, "1", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
  redirect("/portaal");
}

export async function logoutDemo() {
  const jar = await cookies();
  jar.delete(DEMO_COOKIE);
  jar.delete(PROF_COOKIE);
  redirect("/login");
}
