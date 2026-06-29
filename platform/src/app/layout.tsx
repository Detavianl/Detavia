import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL, SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}, ${SITE_TAGLINE.toLowerCase()}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "detachering sociaal domein", "leerplichtambtenaar", "klantmanager werk", "consulent inkomen", "inburgeringsconsulent", "klantmanager participatie",
    "schuldhulpverlening", "interim sociaal domein", "professionals gemeente", "DetaVia",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME}, ${SITE_TAGLINE.toLowerCase()}`,
    description: SITE_DESCRIPTION,
    images: [{ url: "/img/office-worker-960x640.jpg", width: 960, height: 640, alt: `${SITE_NAME}, sociaal domein` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME}, ${SITE_TAGLINE.toLowerCase()}`,
    description: SITE_DESCRIPTION,
    images: ["/img/office-worker-960x640.jpg"],
  },
  icons: { icon: "/img/logo_blue.svg", apple: "/img/logo_blue.svg" },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/img/logo_blue.svg`,
  image: `${SITE_URL}/img/office-worker-960x640.jpg`,
  description: SITE_DESCRIPTION,
  email: "info@detavia.nl",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Argonweg 72",
    postalCode: "1362 AD",
    addressLocality: "Almere",
    addressCountry: "NL",
  },
  knowsAbout: ["Leerplicht", "Werk", "Inkomen", "Participatiewet", "Schuldhulpverlening", "Inburgering", "Sociaal domein"],
  areaServed: { "@type": "Country", name: "Nederland" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl-NL">
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
