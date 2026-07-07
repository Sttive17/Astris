import { ArrowRight, Check } from "lucide-react";
import { Lang, Role, PublicView } from "@/types";
import { useT, C } from "@/i18n/useT";
import { PublicPageShell } from "./PublicPageShell";

import prepararImg from '@/assets/preparar.jpg';
import adaptarImg from '@/assets/adaptar.jpg';
import acompanarImg from '@/assets/acompanar.jpg';
import conectarImg from '@/assets/conectar.jpg';

export function AboutPage({ lang, onNavigate, onOpenAuth, onLang, darkMode, onDarkToggle }: { lang: Lang; onNavigate: (view: PublicView) => void; onOpenAuth: (preRole?: Role, step?: "auth" | "login" | "register") => void; onLang: () => void; darkMode: boolean; onDarkToggle: () => void; }) {
  const t = useT(lang);
  const about = C(lang, "aboutPage") as any;

  const STATS = [
    {
      value: "85%",
      text: "Las personas neurodivergentes representan el 20% de la población, pero casi el 85% está en situación de desempleo.",
      source: "Fuente: Fundación Eurofirms"
    },
    {
      value: "90%",
      text: "Los programas de contratación inclusiva logran tasas de retención del 90% y una rotación tres veces menor.",
      source: "Fuente: HLB"
    },
    {
      value: "140%",
      text: "Los equipos neurodiversos pueden ser hasta un 140% más productivos.",
      source: "Fuente: HLB / JPMorgan Chase"
    },
    {
      value: "15%",
      text: "Las empresas que abrazan la neurodiversidad reportan un 15% más de innovación.",
      source: "Fuente: HLB"
    }
  ];

  const PILLAR_SECTIONS = [
    { key: "preparar", img: prepararImg, stat: STATS[0] },
    { key: "adaptar", img: adaptarImg, stat: STATS[1] },
    { key: "acompanar", img: acompanarImg, stat: STATS[2] },
    { key: "conectar", img: conectarImg, stat: STATS[3] },
  ];

  const VALUES_LIST = about.values as string[] ?? [];

  return (
    <PublicPageShell lang={lang} currentView="about" onNavigate={onNavigate} onOpenAuth={onOpenAuth} onLang={onLang} darkMode={darkMode} onDarkToggle={onDarkToggle}
      title={about.heroTitle ?? t("landing.nav.about")}
      subtitle={about.heroSub}>
      
      {/* Hero quote */}
      <section className="mb-16 md:mb-24 rounded-3xl border-2 border-primary/30 bg-primary/5 p-8 md:p-14 text-center">
        <p className="text-2xl md:text-4xl font-bold leading-tight text-foreground" style={{ fontFamily: "DM Mono, monospace" }}>
          “{about.heroQuote}”
        </p>
        <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {about.heroDesc}
        </p>
      </section>

      {/* Dramatic First Statistic (Placed just after the hero) */}
      <section className="mb-16 md:mb-24 flex justify-center">
        <div className="w-full md:w-10/12 lg:w-8/12 flex flex-col items-center text-center p-10 md:p-14 rounded-[2rem] border-2 border-primary/40 bg-gradient-to-br from-primary/10 to-transparent shadow-sm">
          <div className="font-bold text-primary mb-6 text-7xl md:text-9xl tracking-tighter" style={{ fontFamily: "DM Mono, monospace" }}>
            {STATS[0].value}
          </div>
          <p className="text-foreground font-semibold mb-4 text-xl md:text-3xl leading-snug max-w-2xl">
            {STATS[0].text}
          </p>
          <span className="text-sm md:text-base text-muted-foreground uppercase tracking-widest font-medium mt-2 opacity-80">{STATS[0].source}</span>
        </div>
      </section>

      {/* Purpose / Mission / Vision row */}
      <section className="mb-16 md:mb-24 grid gap-6 md:grid-cols-3">
        {(["purpose", "mission", "vision"] as const).map((key) => (
          <div key={key} className="rounded-3xl border border-border bg-card p-6 md:p-8 hover:shadow-lg transition-shadow">
            <h3 className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">{about[`${key}Label`]}</h3>
            <h4 className="mb-3 text-lg font-bold text-foreground">{about[`${key}Title`]}</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">{about[`${key}Body`]}</p>
          </div>
        ))}
      </section>

      {/* Section: Nuestra Filosofía */}
      <section className="mb-16 md:mb-24">
        <h2 className="mb-8 text-center text-2xl md:text-3xl font-bold text-foreground">{about.philosophyTitle}</h2>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg leading-relaxed text-muted-foreground mb-8">{about.philosophyDesc}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {VALUES_LIST.map((v: string, i: number) => (
              <span key={i} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground">
                <Check size={14} style={{ color: "var(--accent)" }} aria-hidden="true" />
                {v}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Pillars - Alternating sections */}
      <section className="mb-12 md:mb-16">
        <h2 className="mb-4 text-center text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">{about.pillarsEyebrow}</h2>
        <p className="text-center text-2xl md:text-4xl font-bold text-foreground">{about.pillarsTitle}</p>
      </section>

      {PILLAR_SECTIONS.map((pillar, i) => {
        const data = about[pillar.key] as { title: string; body: string; values?: string[] };
        const isEven = i % 2 === 0;
        
        // Skip rendering the first stat block here because it was already highlighted at the top.
        // Or render it here if needed, but since it's massive at the top, we just render the others.
        // The prompt says "Intercaladas entre las secciones". For the first section "PREPARAR", the stat is already above.
        // For the next ones, we put the stat right before the pillar.
        
        return (
          <div key={pillar.key}>
            {i > 0 && (
              <section className="mb-16 mt-8 flex justify-center">
                <div className="w-full md:w-8/12 lg:w-6/12 flex flex-col items-center text-center p-8 md:p-10 rounded-3xl border border-border bg-card shadow-sm">
                  <div className="font-bold text-primary mb-4 text-6xl md:text-7xl" style={{ fontFamily: "DM Mono, monospace" }}>
                    {pillar.stat.value}
                  </div>
                  <p className="text-foreground font-medium mb-3 text-lg md:text-xl leading-relaxed">
                    {pillar.stat.text}
                  </p>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider opacity-70 mt-1">{pillar.stat.source}</span>
                </div>
              </section>
            )}

            <section className="mb-16 md:mb-24 last:mb-0">
              <div className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8 md:gap-16`}>
                {/* Image */}
                <div className="w-full md:w-1/2 shrink-0">
                  <div className="rounded-[2rem] border-2 border-border overflow-hidden shadow-lg bg-card p-2 md:p-4">
                    <img
                      src={pillar.img}
                      alt={data.title}
                      className="w-full h-auto object-cover rounded-2xl"
                      style={{ aspectRatio: "4/3", maxHeight: "450px" }}
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  </div>
                </div>

                {/* Text */}
                <div className="w-full md:w-1/2">
                  <span className="mb-2 inline-block text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    {i + 1 < 10 ? `0${i + 1}` : i + 1}
                  </span>
                  <h3 className="mb-4 text-3xl md:text-4xl font-bold text-foreground" style={{ fontFamily: "DM Mono, monospace" }}>
                    {data.title}
                  </h3>
                  <p className="text-base md:text-lg leading-relaxed text-muted-foreground mb-6">{data.body}</p>
                  {data.values && data.values.length > 0 && (
                    <ul className="space-y-3">
                      {data.values.map((val: string, vi: number) => (
                        <li key={vi} className="flex items-start gap-3 text-sm font-medium text-foreground">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <Check size={12} className="text-primary" aria-hidden="true" />
                          </span>
                          {val}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </section>
          </div>
        );
      })}

      {/* CTA Section */}
      <section className="mt-16 md:mt-24 rounded-[2rem] border-2 border-primary/20 p-8 md:p-16 text-center bg-card shadow-sm">
        <h2 className="mb-4 text-2xl md:text-3xl font-bold text-foreground">{about.ctaTitle}</h2>
        <p className="mb-8 max-w-xl mx-auto text-base md:text-lg text-muted-foreground leading-relaxed">{about.ctaBody}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => onOpenAuth(undefined, "register")}
            className="inline-flex items-center justify-center gap-3 rounded-xl px-8 py-4 text-base font-bold cursor-pointer border-0 transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            {about.ctaCandidate}<ArrowRight size={18} aria-hidden="true" />
          </button>
          <button
            onClick={() => onOpenAuth("company", "register")}
            className="inline-flex items-center justify-center gap-3 rounded-xl border-2 px-8 py-4 text-base font-bold cursor-pointer transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: "var(--background)", color: "var(--foreground)", borderColor: "var(--border)" }}
          >
            {about.ctaCompany}<ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </section>

    </PublicPageShell>
  );
}
