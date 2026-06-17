"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfessional } from "@/lib/professional-context";
import { isDemo } from "@/lib/demo";
import { addDemoDocument } from "@/lib/demo-store";

export async function uploadOwnDocument(formData: FormData) {
  const prof = await requireProfessional();
  const soort = String(formData.get("soort") ?? "cv");
  const file = formData.get("bestand");
  if (!(file instanceof File) || file.size === 0) return;
  const buf = Buffer.from(await file.arrayBuffer());

  if (isDemo()) {
    const url = `data:${file.type || "application/octet-stream"};base64,${buf.toString("base64")}`;
    addDemoDocument(prof.id, { id: "doc-" + Math.random().toString(36).slice(2, 8), filename: file.name, soort, uploaded_at: new Date().toISOString().slice(0, 10), url });
    revalidatePath("/portaal/profiel");
    return;
  }
  const supabase = await createClient();
  const ext = file.name.split(".").pop() ?? "pdf";
  const path = `${prof.id}/${Date.now()}.${ext}`;
  const up = await supabase.storage.from("cvs").upload(path, buf, { contentType: file.type || "application/octet-stream" });
  if (up.error) throw new Error(up.error.message);
  await supabase.from("cvs").insert({ candidate_id: prof.id, storage_path: path, filename: file.name, soort });
  revalidatePath("/portaal/profiel");
}

export async function submitHours(formData: FormData) {
  await requireProfessional();
  if (isDemo()) return;
  const supabase = await createClient();
  const placement_id = String(formData.get("placement_id") ?? "");
  const datum = String(formData.get("datum") ?? "");
  const uren = Number(formData.get("uren") ?? 0);
  if (!placement_id || !datum || !uren) return;
  await supabase.from("hours").insert({
    placement_id, datum, uren,
    omschrijving: String(formData.get("omschrijving") ?? "").trim(),
    status: "ingediend",
  });
  revalidatePath("/portaal");
}

export async function deleteHours(id: string) {
  await requireProfessional();
  if (isDemo()) return;
  const supabase = await createClient();
  await supabase.from("hours").delete().eq("id", id).eq("status", "ingediend");
  revalidatePath("/portaal");
}

export async function updateOwnProfile(formData: FormData) {
  const prof = await requireProfessional();
  if (isDemo()) return;
  const supabase = await createClient();
  const s = (k: string) => String(formData.get(k) ?? "").trim();
  await supabase.from("candidates").update({
    telefoon: s("telefoon"),
    woonplaats: s("woonplaats"),
    linkedin: s("linkedin"),
    talen: s("talen"),
    beschikbaar_per: s("beschikbaar_per") || null,
  }).eq("id", prof.id);
  revalidatePath("/portaal/profiel");
}
