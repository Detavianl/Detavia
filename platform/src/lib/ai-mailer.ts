import Anthropic from "@anthropic-ai/sdk";

// Detavia tone of voice (uit het brandbook): empathisch, positief, toegankelijk,
// mensgericht; professioneel maar laagdrempelig; betrouwbaar en enthousiasmerend.
const SYSTEM = `Je bent de e-mailassistent van DetaVia, dé detacheringspartner in het sociaal domein (Wmo, Jeugd, Participatie, Schuldhulpverlening).
Schrijf e-mails in het Nederlands in de DetaVia tone of voice: empathisch, positief, toegankelijk en mensgericht; professioneel maar laagdrempelig; betrouwbaar, persoonlijk en enthousiasmerend.
Richtlijnen:
- Naar kandidaten/professionals: tutoyeer (je/jij), warm en ondersteunend.
- Naar opdrachtgevers (gemeenten/organisaties): professioneel en to-the-point, je of u passend bij de context.
- Bondig, concreet, geen jargon of holle frasen. Geen em-dashes gebruiken.
- Sluit af namens DetaVia.
- Voeg waar zinvol een duidelijke call-to-action toe (bv. "Plan een afspraak", "Bekijk het profiel").
Geef je antwoord ALLEEN als JSON: {"onderwerp": "...", "body": "...", "cta_label": "...", "cta_url": "..."} met \\n voor regeleinden in de body. cta_label/cta_url mogen leeg zijn als een knop niet past.`;

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
export type MailOutput = { onderwerp: string; body: string; cta_label?: string; cta_url?: string; bron: "ai" | "sjabloon" };

export async function genereerMail(input: MailInput): Promise<MailOutput> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return { ...sjabloon(input), bron: "sjabloon" };

  try {
    const client = new Anthropic({ apiKey: key });
    const model = process.env.DETAVIA_AI_MODEL || "claude-haiku-4-5-20251001";
    const prompt = [
      `Type ontvanger: ${MAIL_TYPES[input.type] ?? input.type}`,
      input.ontvanger ? `Naam ontvanger: ${input.ontvanger}` : "",
      `Doel van de e-mail: ${MAIL_DOELEN[input.doel] ?? input.doel}`,
      input.context ? `Context / aanvullende info: ${input.context}` : "",
      input.afzender ? `Onderteken namens: ${input.afzender} (DetaVia)` : "Onderteken namens het DetaVia-team.",
    ].filter(Boolean).join("\n");

    const msg = await client.messages.create({
      model,
      max_tokens: 800,
      system: SYSTEM,
      messages: [{ role: "user", content: prompt }],
    });
    const txt = msg.content.map((b) => (b.type === "text" ? b.text : "")).join("").trim();
    const parsed = JSON.parse(txt.slice(txt.indexOf("{"), txt.lastIndexOf("}") + 1));
    return {
      onderwerp: String(parsed.onderwerp ?? ""),
      body: String(parsed.body ?? ""),
      cta_label: parsed.cta_label ? String(parsed.cta_label) : undefined,
      cta_url: parsed.cta_url ? String(parsed.cta_url) : undefined,
      bron: "ai",
    };
  } catch {
    return { ...sjabloon(input), bron: "sjabloon" };
  }
}

// Terugval zonder API-key: nette Detavia-sjablonen per doel.
function sjabloon(input: MailInput): { onderwerp: string; body: string; cta_label?: string } {
  const naam = input.ontvanger?.trim() || "daar";
  const ctx = input.context?.trim();
  const groet = input.type === "opdrachtgever" ? `Beste ${naam},` : `Hoi ${naam},`;
  const ondertekening = `Met vriendelijke groet,\n${input.afzender || "Het DetaVia-team"}\nDetaVia`;
  const C = ctx ? `\n\n${ctx}` : "";
  switch (input.doel) {
    case "uitnodiging":
      return { onderwerp: "Uitnodiging voor een kennismaking met DetaVia", cta_label: "Plan een afspraak",
        body: `${groet}\n\nLeuk dat we contact hebben. We zouden graag kennismaken om te ontdekken waar we elkaar kunnen versterken.${C}\n\nKun je laten weten wanneer het jou schikt? Dan plannen we het meteen in.\n\n${ondertekening}` };
    case "voorstellen":
      return { onderwerp: "Een sterke kandidaat voor jullie opdracht", cta_label: "Bekijk het profiel",
        body: `${groet}\n\nGraag stellen we een kandidaat voor die goed past bij jullie vraag in het sociaal domein.${C}\n\nWe lichten het profiel graag persoonlijk toe. Past een korte belafspraak deze week?\n\n${ondertekening}` };
    case "followup":
      return { onderwerp: "Even een korte opvolging",
        body: `${groet}\n\nIk wilde even bij je terugkomen op ons laatste contact.${C}\n\nLaat gerust weten hoe we kunnen helpen of wat de volgende stap is.\n\n${ondertekening}` };
    case "afwijzing":
      return { onderwerp: "Update over je sollicitatie bij DetaVia",
        body: `${groet}\n\nBedankt voor je interesse en de tijd die je hebt genomen. Voor deze opdracht gaan we helaas met een andere kandidaat verder.${C}\n\nWe houden je graag in beeld voor passende opdrachten in de toekomst. Je past namelijk goed bij het sociaal domein.\n\n${ondertekening}` };
    case "welkom":
      return { onderwerp: "Welkom bij DetaVia!",
        body: `${groet}\n\nWat fijn dat je via DetaVia aan de slag gaat. We kijken ernaar uit om samen het verschil te maken in het sociaal domein.${C}\n\nJe vaste contactpersoon neemt binnenkort contact op om alles vlot te regelen.\n\n${ondertekening}` };
    default:
      return { onderwerp: "Bericht van DetaVia",
        body: `${groet}\n${C || "\n[ schrijf hier je bericht ]"}\n\n${ondertekening}` };
  }
}
