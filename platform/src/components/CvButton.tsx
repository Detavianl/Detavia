"use client";
import { useState } from "react";
import { cvSignedUrl } from "@/app/admin/kandidaten/actions";

export default function CvButton({ path, filename }: { path: string; filename: string }) {
  const [bezig, setBezig] = useState(false);
  async function open() {
    setBezig(true);
    const url = await cvSignedUrl(path);
    setBezig(false);
    if (url) window.open(url, "_blank");
  }
  return (
    <button onClick={open} disabled={bezig}
      className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold hover:border-cobalt disabled:opacity-60">
      📄 {filename}{bezig ? " …" : ""}
    </button>
  );
}
