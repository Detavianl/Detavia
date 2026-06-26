import Anthropic from "@anthropic-ai/sdk";
import { SITE_URL } from "@/lib/site";

export const MAIL_DOELEN: Record<string, string> = {
  uitnodiging: "Uitnodiging voor een (kennismakings)gesprek",
  voorstellen: "Een kandidaat voorstellen aan een opdrachtgever",
  followup: "Vriendelijke follow-up / opvolging",
  afwijzing: "Nette, respectvolle afwijzing",
  welkom: "Welkom / onboarding van een nieuwe professional",
  vrij: "Vrije e-mail (gebruik de context)",
};

export const MAIL_TYPES: Record<string, string> = {
  kandidaat: "Kandidaat / professional",
  opdrachtgever: "Opdrachtgever",
  vrij: "Vrij",
};

export type MailInput = { type: string; doel: string; ontvanger?: string; context?: string; afzender?: string };
export type MailOutput = { onderwerp: string; html: string; bron: "ai" | "sjabloon" };

const LOGO = `${SITE_URL}/img/logo.png`;

// Systeem-prompt: bouwt de volledige HTML-mail in DetaVia-huisstijl.
const SYSTEM = `Je bent de e-mailgenerator van DetaVia, dé detacheringspartner in het sociaal domein (Leerplicht, Werk en inkomen, Participatie, Schuldhulpverlening).
Je bouwt één-op-één e-mails in de DetaVia-huisstijl. Geef je output ALTIJD via het build_email-tool (subject + volledige HTML-body).

VISUEEL (DetaVia-huisstijl, licht thema met cobalt #0047FF en geel #FFEA4B):
- Wrapper: background:#f3f4f6; padding:32px 0; font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
- Card: max-width:560px; margin:0 auto; background:#ffffff; border:1px solid #e5e7eb; border-radius:22px; padding:32px;
- Logo bovenaan ALTIJD als img-tag (niet namaken met tekst):
  <img src="${LOGO}" alt="DetaVia" width="140" height="39" style="display:block;width:140px;height:auto;margin-bottom:24px;border:0;" />
- H1: font-size:22px; font-weight:800; color:#0a1733; margin:0 0 12px;
- Alinea's: font-size:15px; color:#454b57; line-height:1.65; margin:0 0 14px;
- Accent-tekst: color:#0047FF;
- Info-blok (optioneel): background:#f3f6ff; border:1px solid #dbe4ff; border-radius:14px; padding:16px;
- CTA-knop (alleen als er een duidelijke actie is): <a href="..." style="display:inline-block;background:#0047FF;color:#ffffff;border-radius:999px;padding:14px 30px;font-weight:700;font-size:14px;text-decoration:none;">Knoptekst</a>
- Afsluiting: "Met vriendelijke groet," (#454b57) op een eigen regel, daaronder "Team DetaVia" (#0a1733; font-weight:700). Geen persoonsnaam, telefoonnummer of e-mailadres.
- Footer buiten de card: text-align:center; color:#9aa1ad; font-size:11px; margin-top:18px; alleen "DetaVia · detavia.nl".

INHOUD / TONE OF VOICE:
- Schrijf in het Nederlands, in de DetaVia tone of voice: empathisch, positief, toegankelijk, mensgericht; professioneel maar laagdrempelig; betrouwbaar en enthousiasmerend.
- Naar kandidaten/professionals: tutoyeer (je/jij), warm en ondersteunend.
- Naar opdrachtgevers (gemeenten/organisaties): professioneel en to-the-point.
- Verwerk de meegegeven context (namen, plaats, opdracht, data, tijden) CONCREET in de mail.
- Korte alinea's (2-3 zinnen), bondig, geen jargon of holle marketingtaal.
- Gebruik NOOIT em-dashes (—); gebruik komma's of gewone streepjes.
- Subject: max 60 tekens, geen ALL CAPS, hoogstens één emoji.
- HTML met inline-styles (geen <style>-tag, geen externe css). Geen <html>/<head>/<body>-tags, alleen de body-content.
- Voeg alleen een CTA-knop toe als er een logische actie is. Als er een URL of actie in de context staat, bouw die in als knop én als gewone inline-link.`;

const BUILD_TOOL: Anthropic.Tool = {
  name: "build_email",
  description: "Bouwt het uiteindelijke onderwerp en de volledige HTML-body van de e-mail.",
  input_schema: {
    type: "object",
    properties: {
      subject: { type: "string", description: "Email-onderwerp, max 60 tekens." },
      html: { type: "string", description: "Volledige HTML-body inclusief DetaVia-styling (zie system prompt)." },
    },
    required: ["subject", "html"],
  },
};

export async function genereerMail(input: MailInput): Promise<MailOutput> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return { ...sjabloon(input), bron: "sjabloon" };

  const prompt = [
    `Type ontvanger: ${MAIL_TYPES[input.type] ?? input.type}`,
    input.ontvanger ? `Naam ontvanger: ${input.ontvanger}` : "",
    `Doel van de e-mail: ${MAIL_DOELEN[input.doel] ?? input.doel}`,
    input.context ? `Context / aanvullende info (verwerk dit concreet): ${input.context}` : "",
    "Onderteken namens Team DetaVia.",
  ].filter(Boolean).join("\n");

  try {
    const client = new Anthropic({ apiKey: key });
    const model = process.env.DETAVIA_AI_MODEL || "claude-sonnet-4-6";
    const res = await client.messages.create({
      model,
      max_tokens: 4096,
      system: SYSTEM,
      tools: [BUILD_TOOL],
      tool_choice: { type: "tool", name: "build_email" },
      messages: [{ role: "user", content: prompt }],
    });
    const toolUse = res.content.find((b) => b.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") return { ...sjabloon(input), bron: "sjabloon" };
    const args = toolUse.input as { subject?: string; html?: string };
    if (typeof args.subject !== "string" || typeof args.html !== "string" || args.html.length < 30) {
      return { ...sjabloon(input), bron: "sjabloon" };
    }
    return { onderwerp: args.subject.trim(), html: args.html, bron: "ai" };
  } catch {
    return { ...sjabloon(input), bron: "sjabloon" };
  }
}

// Terugval zonder API-key of bij een fout: nette DetaVia-mail in dezelfde stijl.
function sjabloon(input: MailInput): { onderwerp: string; html: string } {
  const naam = input.ontvanger?.trim() || "daar";
  const tut = input.type !== "opdrachtgever";
  const groet = tut ? `Hoi ${naam},` : `Beste ${naam},`;
  const teksten: Record<string, { onderwerp: string; body: string; cta?: [string, string] }> = {
    uitnodiging: { onderwerp: "Uitnodiging voor een kennismaking met DetaVia", body: "Wat leuk dat we in contact zijn. We maken graag kennis om te horen wat je zoekt en waar we je mee kunnen helpen.", cta: ["Plan een afspraak", `${SITE_URL}/contact`] },
    voorstellen: { onderwerp: "Een sterke kandidaat voor jullie opdracht", body: "We hebben een professional in het sociaal domein die goed past bij jullie opdracht. We stellen diegene graag aan jullie voor.", cta: ["Neem contact op", `${SITE_URL}/contact`] },
    followup: { onderwerp: "Even een korte opvolging", body: "We wachten nog even op je reactie en horen graag of we een vervolgstap kunnen zetten." },
    afwijzing: { onderwerp: "Update over je sollicitatie bij DetaVia", body: "Bedankt voor je interesse en de tijd die je hebt genomen. Voor deze opdracht gaan we helaas met een andere kandidaat verder. We houden je graag in beeld voor passende opdrachten." },
    welkom: { onderwerp: "Welkom bij DetaVia!", body: "Wat fijn dat je via DetaVia aan de slag gaat. We kijken ernaar uit om samen het verschil te maken in het sociaal domein." },
    vrij: { onderwerp: "Een bericht van DetaVia", body: input.context?.trim() || "We nemen graag contact met je op." },
  };
  const t = teksten[input.doel] ?? teksten.vrij;
  const cta = t.cta ? `<p style="margin:22px 0 14px;"><a href="${t.cta[1]}" style="display:inline-block;background:#0047FF;color:#ffffff;border-radius:999px;padding:14px 30px;font-weight:700;font-size:14px;text-decoration:none;">${t.cta[0]}</a></p>` : "";
  const html = `<div style="background:#f3f4f6;padding:32px 0;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:22px;padding:32px;">
    <img src="${LOGO}" alt="DetaVia" width="140" height="39" style="display:block;width:140px;height:auto;margin-bottom:24px;border:0;" />
    <p style="font-size:15px;color:#454b57;line-height:1.65;margin:0 0 14px;">${groet}</p>
    <p style="font-size:15px;color:#454b57;line-height:1.65;margin:0 0 14px;">${t.body}</p>
    ${cta}
    <p style="font-size:15px;color:#454b57;line-height:1.65;margin:18px 0 0;">Met vriendelijke groet,</p>
    <p style="font-size:15px;color:#0a1733;font-weight:700;margin:2px 0 0;">Team DetaVia</p>
  </div>
  <p style="text-align:center;color:#9aa1ad;font-size:11px;margin-top:18px;">DetaVia · detavia.nl</p>
</div>`;
  return { onderwerp: t.onderwerp, html };
}
