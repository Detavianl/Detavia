// Pure marge-berekening (client- en serverveilig, geen server-imports).

export type MargeConfig = {
  ziekteverzuim_pct: number;
  administratie_pct: number;
  juridisch_pct: number;
  verzekeringen_pct: number;
  nettowinst_pct: number;
};

export const DEFAULT_CONFIG: MargeConfig = {
  ziekteverzuim_pct: 4.0,
  administratie_pct: 3.3,
  juridisch_pct: 2.0,
  verzekeringen_pct: 1.3,
  nettowinst_pct: 33.0,
};

const r2 = (n: number) => Math.round(n * 100) / 100;

// Nettowinst heeft voorrang; recruiter krijgt wat daarna overblijft, minimaal 0.
export function berekenMarge(verkoop: number | null, inkoop: number | null, c: MargeConfig) {
  const v = Number(verkoop) || 0;
  const ink = Number(inkoop) || 0;
  const overheadPct = c.ziekteverzuim_pct + c.administratie_pct + c.juridisch_pct + c.verzekeringen_pct;
  const overhead = r2((v * overheadPct) / 100);
  const nettowinst = r2((v * c.nettowinst_pct) / 100);
  const recruiterRaw = v - ink - overhead - nettowinst;
  return {
    verkoop: v,
    inkoop: ink,
    brutoMarge: r2(v - ink),
    overheadPct: r2(overheadPct),
    overhead,
    nettowinst,
    recruiter: r2(Math.max(0, recruiterRaw)),
    teLaag: recruiterRaw < -0.001,
    posten: {
      ziekteverzuim: r2((v * c.ziekteverzuim_pct) / 100),
      administratie: r2((v * c.administratie_pct) / 100),
      juridisch: r2((v * c.juridisch_pct) / 100),
      verzekeringen: r2((v * c.verzekeringen_pct) / 100),
    },
  };
}

export const euro2 = (n: number) =>
  "€ " + n.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
