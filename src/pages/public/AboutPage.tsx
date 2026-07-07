import { ArrowRight, Check } from "lucide-react";
import { Lang, Role, PublicView } from "@/types";
import { useT, C } from "@/i18n/useT";
import { PublicPageShell } from "./PublicPageShell";

export function AboutPage({ lang, onNavigate, onOpenAuth, onLang, darkMode, onDarkToggle }: { lang: Lang; onNavigate: (view: PublicView) => void; onOpenAuth: (preRole?: Role, step?: "auth" | "login" | "register") => void; onLang: () => void; darkMode: boolean; onDarkToggle: () => void; }) {
  const t = useT(lang);
  const about = C(lang, "aboutPage") as any;

  const PILLAR_SECTIONS = [
    { key: "preparar", img: "/images/pillar-prepare.svg" },
    { key: "adaptar", img: "/images/pillar-adapt.svg" },
    { key: "acompanar", img: "/images/pillar-accompany.svg" },
    { key: "conectar", img: "/images/pillar-connect.svg" },
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
      <section className="mb-8 md:mb-12">
        <h2 className="mb-4 text-center text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">{about.pillarsEyebrow}</h2>
        <p className="mb-10 md:mb-16 text-center text-2xl md:text-4xl font-bold text-foreground">{about.pillarsTitle}</p>
      </section>

      {PILLAR_SECTIONS.map((pillar, i) => {
        const data = about[pillar.key] as { title: string; body: string; values?: string[] };
        const isEven = i % 2 === 0;
        return (
          <section key={pillar.key} className="mb-12 md:mb-20 last:mb-0">
            <div className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8 md:gap-16`}>
              {/* Image */}
              <div className="w-full md:w-1/2 shrink-0">
                <div className="rounded-3xl border-2 border-border overflow-hidden shadow-md" style={{ backgroundColor: "var(--card)" }}>
                  <img
                    src={pillar.img}
                    alt={data.title}
                    className="w-full h-auto object-contain"
                    style={{ aspectRatio: "4/3" }}
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
                <p className="text-base md:text-lg leading-relaxed text-muted-foreground mb-4">{data.body}</p>
                {data.values && data.values.length > 0 && (
                  <ul className="space-y-2">
                    {data.values.map((val: string, vi: number) => (
                      <li key={vi} className="flex items-start gap-3 text-sm font-medium text-foreground">
                        <Check size={14} className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }} aria-hidden="true" />
                        {val}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA Section */}
      <section className="mt-16 md:mt-24 rounded-3xl border-2 border-primary/20 p-8 md:p-16 text-center" style={{ backgroundColor: "var(--card)" }}>
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
