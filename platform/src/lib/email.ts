import { Resend } from "resend";

export type SendResult = { ok: true; id?: string } | { ok: false; error: string };

// Verstuurt een e-mail via Resend. Het from-adres komt uit RESEND_FROM
// (vereist een geverifieerd domein in Resend voor echte ontvangers).
export async function sendMail(input: { to: string; subject: string; html: string; bcc?: string[] }): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "RESEND_API_KEY niet gezet." };
  const from = process.env.RESEND_FROM || "DetaVia <info@detavia.nl>";
  try {
    const resend = new Resend(key);
    const { data, error } = await resend.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      ...(input.bcc?.length ? { bcc: input.bcc } : {}),
    });
    if (error) return { ok: false, error: error.message ?? "Verzenden mislukt." };
    return { ok: true, id: data?.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Onbekende fout bij verzenden." };
  }
}
