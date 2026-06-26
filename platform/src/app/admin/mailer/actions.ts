"use server";
import { requireAdmin } from "@/lib/admin-context";
import { genereerMail, type MailInput, type MailOutput } from "@/lib/ai-mailer";
import { sendMail } from "@/lib/email";

export async function generateEmailAction(input: MailInput): Promise<MailOutput> {
  await requireAdmin();
  return genereerMail(input);
}

// Verstuurt de gegenereerde HTML-mail via Resend.
export async function sendEmailAction(to: string, onderwerp: string, html: string): Promise<{ ok: boolean; melding: string }> {
  await requireAdmin();
  const adres = to.trim().toLowerCase();
  if (!/.+@.+\..+/.test(adres)) return { ok: false, melding: "Vul een geldig e-mailadres in." };
  if (!onderwerp.trim()) return { ok: false, melding: "Onderwerp mag niet leeg zijn." };
  if (!html || html.length < 30) return { ok: false, melding: "Genereer eerst een mail." };
  if (!process.env.RESEND_API_KEY) {
    return { ok: false, melding: "Verzenden niet gekoppeld: voeg RESEND_API_KEY toe in Vercel." };
  }
  const r = await sendMail({ to: adres, subject: onderwerp.trim(), html });
  return r.ok ? { ok: true, melding: "Verzonden ✓" } : { ok: false, melding: `Niet verzonden: ${r.error}` };
}
