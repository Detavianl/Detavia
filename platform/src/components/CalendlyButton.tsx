"use client";
import { useEffect } from "react";
import { CALENDLY_URL } from "@/lib/site";

// Knop die de Calendly-popup opent (de kalender verschijnt pas na een klik).
export default function CalendlyButton({
  className,
  children,
  url = CALENDLY_URL,
}: {
  className?: string;
  children: React.ReactNode;
  url?: string;
}) {
  useEffect(() => {
    if (!document.getElementById("calendly-widget-js")) {
      const s = document.createElement("script");
      s.id = "calendly-widget-js";
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

  function open() {
    const c = (window as unknown as { Calendly?: { initPopupWidget: (o: { url: string }) => void } }).Calendly;
    if (c) c.initPopupWidget({ url });
    else window.open(url, "_blank", "noopener");
  }

  return (
    <button type="button" onClick={open} className={className}>
      {children}
    </button>
  );
}
