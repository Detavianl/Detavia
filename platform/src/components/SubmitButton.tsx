"use client";
import { useFormStatus } from "react-dom";

// Verzendknop die zichzelf uitschakelt tijdens het opslaan, zodat een dubbele
// klik niet twee keer dezelfde actie (en dus dubbele records) veroorzaakt.
export default function SubmitButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending} className={`${className} disabled:opacity-60`}>
      {pending ? "Bezig…" : children}
    </button>
  );
}
