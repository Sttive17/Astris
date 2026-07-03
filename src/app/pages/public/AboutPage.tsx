import { Check } from "lucide-react";
import { Lang, Role, PublicView } from "../../types";
import { useT, C } from "../../i18n/useT";
import { PublicPageShell } from "./PublicPageShell";
import genuineImg from "../../../imports/genuine.png";
import vibralatinaImg from "../../../imports/vibralatina.png";
import closerImg from "../../../imports/closertothestars.png";

export function AboutPage({ lang, onNavigate, onOpenAuth, onLang, darkMode, onDarkToggle }: { lang: Lang; onNavigate: (view: PublicView) => void; onOpenAuth: (preRole?: Role, step?: "auth" | "login" | "register") => void; onLang: () => void; darkMode: boolean; onDarkToggle: () => void; }) {
  const t = useT(lang);
  const PILLARS = C(lang, "pillars") as Array<{ num: string; title: string; body: string }>;
  const PROBLEMS = C(lang, "problems") as string[];
  const HOW = C(lang, "how") as Array<{ phase: string; desc: string }>;
  const COMPARE = C(lang, "compare") as Array<{ aspect: string; trad: string; astris: string }>;
  const IMPACT_CAND = C(lang, "impactCand") as string[];
  const IMPACT_COMP = C(lang, "impactComp") as string[];

  return (
    <PublicPageShell lang={lang} currentView="about" onNavigate={onNavigate} onOpenAuth={onOpenAuth} onLang={onLang} darkMode={darkMode} onDarkToggle={onDarkToggle} title={t("landing.nav.about")} subtitle="Astris nace para transformar la inserción laboral. Diseñamos un camino donde las características de las personas y las condiciones de los entornos se encuentran de forma transparente y humana.">
      <div className="flex flex-col gap-10 md:gap-20">
        
        {/* Pilar Section */}
        <section>
          <h2 className="mb-6 md:mb-10 text-center text-2xl md:text-3xl font-bold text-foreground">{t("landing.pillars.title")}</h2>
          <div className="grid gap-3 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p) => (
              <div key={p.num} className="rounded-3xl border border-border bg-card p-6 md:p-8">
                <div className="mb-4 text-3xl font-bold text-primary opacity-60" style={{ fontFamily: "DM Mono, monospace" }}>{p.num}</div>
                <h3 className="mb-2 text-lg font-bold text-foreground">{p.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Problem Section */}
        <section className="rounded-3xl border border-border bg-card p-6 md:p-12">
          <div className="grid gap-6 md:gap-12 lg:grid-cols-[0.8fr_1.2fr] items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">{t("landing.prob.title")}</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">Los modelos tradicionales de contratación a menudo pasan por alto las necesidades del entorno de trabajo, lo que genera exclusión y rotación temprana.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {PROBLEMS.map((prob, i) => (
                <div key={i} className="rounded-2xl border border-border bg-background p-5 text-sm leading-relaxed text-foreground">{prob}</div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works Section */}
        <section>
          <h2 className="mb-6 md:mb-10 text-center text-2xl md:text-3xl font-bold text-foreground">{t("landing.how.title")}</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {HOW.map((step) => (
              <div key={step.phase} className="relative rounded-3xl border border-border bg-card p-6 md:p-8">
                <h3 className="mb-2 text-base font-bold text-foreground">{step.phase}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Traditional vs Astris Table */}
        <section>
          <h2 className="mb-6 md:mb-10 text-center text-2xl md:text-3xl font-bold text-foreground">{t("landing.compare.title")}</h2>
          <div className="overflow-x-auto rounded-2xl border border-border shadow-sm">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50 font-semibold text-foreground">
                  <th className="px-6 py-4">Aspecto</th>
                  <th className="px-6 py-4">Modelo Tradicional</th>
                  <th className="px-6 py-4" style={{ color: "var(--primary)" }}>Modelo Astris</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {COMPARE.map((row) => (
                  <tr key={row.aspect} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground">{row.aspect}</td>
                    <td className="px-6 py-4 text-muted-foreground">{row.trad}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{row.astris}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Privacy Section */}
        <section className="rounded-3xl bg-secondary/40 p-6 md:p-12 border border-border">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">{C(lang, "privacyTitle")}</h2>
            <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground">{C(lang, "privacyBody")}</p>
          </div>
        </section>

        {/* Impact Section */}
        <section>
          <h2 className="mb-6 md:mb-10 text-center text-2xl md:text-3xl font-bold text-foreground">{t("landing.impact.title")}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-7">
              <h3 className="mb-5 text-lg font-bold text-foreground">{t("landing.impact.cand")}</h3>
              <ul className="space-y-3">
                {IMPACT_CAND.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-foreground"><Check size={16} aria-hidden="true" className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }} />{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-7">
              <h3 className="mb-5 text-lg font-bold text-foreground">{t("landing.impact.comp")}</h3>
              <ul className="space-y-3">
                {IMPACT_COMP.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-foreground"><Check size={16} aria-hidden="true" className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }} />{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Partners section */}
        <section className="rounded-3xl border border-primary/20 bg-primary/5 p-4 md:p-8">
          <h2 className="mb-3 text-2xl font-bold text-foreground">{t("about.orgsTitle")}</h2>
          <p className="mb-6 max-w-2xl text-muted-foreground">{t("about.orgsSub")}</p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 rounded-full border border-border bg-background px-4 py-2">
              <img src={closerImg} alt="Closer To The Stars Foundation" className="h-8 w-8 object-contain" />
              <span className="font-semibold text-foreground">Closer To The Stars Fundation</span>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-border bg-background px-4 py-2">
              <img src={vibralatinaImg} alt="Vibra Latina" className="h-8 w-8 object-contain" />
              <span className="font-semibold text-foreground">Vibra Latina</span>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-border bg-background px-4 py-2">
              <svg width="20" height="20" viewBox="0 0 21 21" aria-hidden="true" className="shrink-0">
                <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
              </svg>
              <span className="font-semibold text-foreground">Microsoft</span>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-border bg-background px-4 py-2">
              <img src={genuineImg} alt="The Genuine Foundation" className="h-7 w-7 object-contain" />
              <span className="font-semibold text-foreground">The Genuine Foundation</span>
            </div>
          </div>
        </section>
      </div>
    </PublicPageShell>
  );
}
