import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DetaVia, specialist in het sociaal domein",
  description:
    "DetaVia is dé detacheringspartner in het sociaal domein. Wmo, Jeugd, Participatie en Schuldhulpverlening.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl-NL">
      <body>{children}</body>
    </html>
  );
}
