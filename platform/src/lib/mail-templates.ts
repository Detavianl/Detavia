import { SITE_URL } from "@/lib/site";

// Vaste, voorgemaakte mailsjablonen (preview in de backend). Placeholders blijven
// als {{...}} staan; die worden bij verzenden ingevuld.
const LOGO = `${SITE_URL}/img/logo.png`;

export type MailTemplate = {
  key: string;
  naam: string;
  wanneer: string;
  onderwerp: string;
  html: string;
  placeholders: { code: string; uitleg: string }[];
};

const P = "font-size:15px;color:#454b57;line-height:1.65;margin:0 0 14px;";

function shell(body: string): string {
  return `<div style="background:#f3f4f6;padding:32px 0;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:22px;padding:32px;">
    <img src="${LOGO}" alt="DetaVia" width="140" height="39" style="display:block;width:140px;height:auto;margin-bottom:24px;border:0;" />
    ${body}
  </div>
  <p style="text-align:center;color:#9aa1ad;font-size:11px;margin-top:18px;">DetaVia &middot; detavia.nl</p>
</div>`;
}

export const MAIL_TEMPLATES: MailTemplate[] = [
  {
    key: "sollicitatie-bevestiging",
    naam: "Sollicitatiebevestiging",
    wanneer: "Voor de sollicitant, nadat iemand via de site heeft gesolliciteerd.",
    onderwerp: "We hebben je sollicitatie ontvangen",
    placeholders: [
      { code: "{{voornaam}}", uitleg: "Voornaam van de sollicitant" },
      { code: "{{recruiter}}", uitleg: "De recruiter die aan de vacature gekoppeld is" },
    ],
    html: shell(`
    <p style="${P}">Beste {{voornaam}},</p>
    <p style="${P}">Wat leuk dat je hebt gesolliciteerd bij DetaVia. We hebben je sollicitatie in goede orde ontvangen, en daar zijn we blij mee.</p>
    <p style="${P}">We bekijken je gegevens met aandacht en nemen binnen een paar werkdagen persoonlijk contact met je op. Dan maken we rustig kennis en kijken we samen welke opdracht in het sociaal domein echt bij jou past, bij wie je bent en bij wat je wilt.</p>
    <p style="${P}">Heb je in de tussentijd een vraag? Reageer gerust op deze mail, we denken graag met je mee.</p>
    <p style="font-size:15px;color:#454b57;line-height:1.65;margin:18px 0 0;">Met vriendelijke groet,</p>
    <p style="font-size:15px;color:#0a1733;font-weight:700;margin:2px 0 0;">{{recruiter}}</p>
    <p style="font-size:13px;color:#9aa1ad;margin:2px 0 0;">DetaVia</p>
    `),
  },
];
