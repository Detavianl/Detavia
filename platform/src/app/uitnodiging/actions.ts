"use server";
import { cookies } from "next/headers";
import { TOEGANG_COOKIE, TOEGANG_TOKEN } from "@/lib/toegang";
import { getAdmin } from "@/lib/admin-context";

// Zet de toegangscode-cookie voor een net geactiveerde beheerder, zodat die
// niet ook nog eens de pre-launch code hoeft in te voeren. Alleen als er
// daadwerkelijk een ingelogde admin-sessie is.
export async function grantToegangAlsAdmin(): Promise<{ ok: boolean }> {
  const admin = await getAdmin();
  if (!admin) return { ok: false };
  const jar = await cookies();
  jar.set(TOEGANG_COOKIE, TOEGANG_TOKEN, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return { ok: true };
}
