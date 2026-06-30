"use client";
import { useState } from "react";

export default function CopyButton({ text, label = "Kopieer HTML" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard.writeText(text).then(() => { setDone(true); setTimeout(() => setDone(false), 1500); })}
      className="rounded-full border-2 border-neutral-200 px-4 py-2 text-sm font-bold transition hover:border-cobalt hover:text-cobalt"
    >
      {done ? "Gekopieerd ✓" : label}
    </button>
  );
}
