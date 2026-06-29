import Link from "next/link";

export const metadata = {
  title: "Disclaimer, privacy- en gebruikersvoorwaarden | DetaVia",
  description: "Disclaimer, privacyverklaring en gebruikersvoorwaarden van DetaVia B.V.",
  alternates: { canonical: "/disclaimer-privacy-en-gebruikersvoorwaarden" },
};

export default function DisclaimerPrivacy() {
  return (
    <article className="mx-auto max-w-[820px] px-5 py-16 sm:px-10">
      <h1 className="display text-4xl sm:text-5xl">Disclaimer, privacy- en gebruikersvoorwaarden</h1>
      <p className="mt-3 text-sm text-muted">Laatst geüpdatet op 22-08-2025</p>

      <div className="prose-detavia mt-8">
        <h2>Disclaimer</h2>
        <p>DetaVia B.V. heeft de inhoud van deze website met grote zorg samengesteld, maar kan de juistheid en volledigheid niet garanderen. DetaVia B.V. aanvaardt geen enkele aansprakelijkheid die zou kunnen voortvloeien uit de inhoud van deze website. Op deze pagina vind je alle informatie en voorwaarden die op onze dienstverlening van toepassing zijn.</p>

        <h2>Algemene voorwaarden</h2>
        <p>Op onze dienstverlening zijn de <Link href="/algemene-voorwaarden">algemene voorwaarden van DetaVia B.V.</Link> van toepassing.</p>

        <h2>Links naar externe websites</h2>
        <p>DetaVia B.V. is niet verantwoordelijk voor de inhoud, de privacybescherming of de diensten van websites van derden waarnaar op deze website wordt verwezen.</p>

        <h2>Intellectuele eigendomsrechten</h2>
        <p>De auteursrechten en overige intellectuele eigendomsrechten op de inhoud van deze website, waaronder logo's en merknamen, berusten bij DetaVia B.V. Niets van deze website mag worden verveelvoudigd, opgeslagen in een geautomatiseerd gegevensbestand of openbaar gemaakt in enige vorm zonder voorafgaande schriftelijke toestemming.</p>

        <h2>Privacyverklaring</h2>
        <p>DetaVia B.V. hecht veel waarde aan de bescherming van jouw privacy. In deze privacyverklaring leggen we uit hoe gegevens worden verzameld en gebruikt op de websites van DetaVia. Door de website te bezoeken en te gebruiken, ga je akkoord met het verzamelen en gebruiken van gegevens zoals hier beschreven.</p>

        <h2>Gelijke kansen en diversiteit</h2>
        <p>DetaVia B.V. staat voor een eerlijke behandeling zonder discriminatie. We hebben onze inzet voor gelijke kansen en diversiteit vastgelegd om bij te dragen aan een inclusieve arbeidsmarkt.</p>

        <h2>Toegang tot jouw persoonlijke gegevens</h2>
        <p>Je kunt inzage in of verwijdering van je persoonsgegevens aanvragen via de webmaster of de centrale contactpersoon van DetaVia B.V.</p>

        <h2>Bescherming van jouw persoonlijke gegevens</h2>
        <p>DetaVia B.V. zet verschillende beveiligingstechnologieën in, waaronder systemen met beperkte toegang en SSL-encryptie voor gevoelige gegevens die online worden verzonden.</p>

        <h2>Klachtenprocedure</h2>
        <p>Heb je een klacht? Neem contact op met je vaste contactpersoon of stuur je feedback per e-mail via onze <Link href="/contact">contactpagina</Link>. Onze klachtenprocedure beschrijft hoe wij met klachten omgaan.</p>
      </div>
    </article>
  );
}
