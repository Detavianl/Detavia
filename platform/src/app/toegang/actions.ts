"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TOEGANG_COOKIE, TOEGANG_TOKEN } from "@/lib/toegang";

// De toegangscode (server-side; te overschrijven via env SITE_ACCESS_CODE).
const CODE = process.env.SITE_ACCESS_CODE || "0492";

export async function verifyToegang(formData: FormData) {
  const code = String(formData.get("code") ?? "").trim();
  let next = String(formData.get("next") ?? "/");
  if (!next.startsWith("/") || next.startsWith("/toegang")) next = "/";

  if (code === CODE) {
    const jar = await cookies();
    jar.set(TOEGANG_COOKIE, TOEGANG_TOKEN, {
      httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30,
    });
    redirect(next);
  }
  redirect(`/toegang?fout=1&next=${encodeURIComponent(next)}`);
}
