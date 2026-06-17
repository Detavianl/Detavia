"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-context";
import { slugify } from "@/lib/blog";

export async function saveVacature(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "").trim();
  const titel = String(formData.get("titel") ?? "").trim();
  if (!titel) throw new Error("Titel is verplicht");

  const num = (k: string) => {
    const v = formData.get(k);
    return v === null || v === "" ? null : Number(v);
  };
  const fields = {
    titel,
    vakgebied: String(formData.get("vakgebied") ?? "wmo"),
    plaats: String(formData.get("plaats") ?? "").trim(),
    uren_min: num("uren_min") ?? 32,
    uren_max: num("uren_max") ?? 36,
    salaris_min: num("salaris_min"),
    salaris_max: num("salaris_max"),
    type: String(formData.get("type") ?? "Detachering"),
    top: formData.get("top") === "on",
    omschrijving: String(formData.get("omschrijving") ?? "").trim(),
    status: String(formData.get("status") ?? "open"),
  };

  if (id) {
    const { error } = await supabase.from("vacatures").update(fields).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const slug = `${slugify(titel)}-${Math.random().toString(36).slice(2, 6)}`;
    const { error } = await supabase.from("vacatures").insert({ ...fields, slug });
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin/vacatures");
  revalidatePath("/vacatures");
  redirect("/admin/vacatures");
}

export async function deleteVacature(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("vacatures").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/vacatures");
  revalidatePath("/vacatures");
}
