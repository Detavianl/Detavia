"use client";
import { useEffect } from "react";
import { CALENDLY_URL } from "@/lib/site";

// Inline Calendly-boekwidget. Laadt het Calendly-script eenmalig; dat
// initialiseert automatisch elke .calendly-inline-widget op de pagina.
export default function CalendlyWidget({ url = CALENDLY_URL, height = 700 }: { url?: string; height?: number }) {
  useEffect(() => {
    const id = "calendly-widget-js";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id = id;
      s.src = "https://assets.calendly.com/assets/external/widget.js";
      s.async = true;
      document.body.appendChild(s);
    }
    if (!document.getElementById("calendly-widget-css")) {
      const l = document.createElement("link");
      l.id = "calendly-widget-css";
      l.rel = "stylesheet";
      l.href = "https://assets.calendly.com/assets/external/widget.css";
      document.head.appendChild(l);
    }
  }, []);

  return (
    <div
      className="calendly-inline-widget overflow-hidden rounded-[22px] border-[1.5px] border-neutral-200 bg-white"
      data-url={url}
      style={{ minWidth: 320, height }}
    />
  );
}
