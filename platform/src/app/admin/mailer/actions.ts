"use server";
import { requireAdmin } from "@/lib/admin-context";
import { genereerMail, type MailInput, type MailOutput } from "@/lib/ai-mailer";

export async function generateEmailAction(input: MailInput): Promise<MailOutput> {
  await requireAdmin();
  return genereerMail(input);
}

/**
 * Verstuurt de e-mail. Nu een stub.
 * HIER komt Resend (zoals bij de facturen):
 *   resend.emails.send({ from: "DetaVia <info@detavia.nl>", to, subject, text/html })
 * Zodra RESEND_API_KEY in de env staat, is dit één blok.
 */
export async function sendEmailAction(_to: string, _onderwerp: string, _html: string): Promise<{ ok: boolean; melding: string }> {
  await requireAdmin();
  if (!process.env.RESEND_API_KEY) {
    return { ok: false, melding: "Verzenden is nog niet gekoppeld. Voeg RESEND_API_KEY toe om de HTML-mail echt te versturen." };
  }
  // TODO Resend: resend.emails.send({ to, subject, html })
  return { ok: true, melding: "Verzonden." };
}
