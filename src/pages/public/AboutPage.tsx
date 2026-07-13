import { ArrowRight } from "lucide-react";
import { Lang, Role, PublicView } from "@/types";
import { useT, C } from "@/i18n/useT";
import { PublicPageShell } from "./PublicPageShell";
import { HeroStatsSection } from "./about/HeroStatsSection";
import { MissionCards } from "./about/MissionCards";
import { PhilosophySlogan } from "./about/PhilosophySlogan";
import { PillarsSection } from "./about/PillarsSection";

import prepararImg from '@/assets/preparar.webp';
import adaptarImg from '@/assets/adaptar.webp';
import acompanarImg from '@/assets/acompanar.webp';
import conectarImg from '@/assets/conectar.webp';

export function AboutPage({ lang, onNavigate, onOpenAuth, onLang, darkMode, onDarkToggle, font, onFontToggle }: {
  lang: Lang;
  onNavigate: (view: PublicView) => void;
  onOpenAuth: (preRole?: Role, step?: "auth" | "login" | "register") => void;
  onLang: () => void;
  darkMode: boolean;
  onDarkToggle: () => void;
  font: any;
  onFontToggle: () => void;
}) {
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

  return (
    <PublicPageShell lang={lang} currentView="about" onNavigate={onNavigate} onOpenAuth={onOpenAuth} onLang={onLang} darkMode={darkMode} onDarkToggle={onDarkToggle} font={font} onFontToggle={onFontToggle}
      title={about.heroTitle ?? t("landing.nav.about")}
      subtitle={about.heroSub}>
      
      <HeroStatsSection stat={STATS[0]} quote={about.heroQuote} />
      <MissionCards about={about} />
      <PhilosophySlogan quote={about.philosophyDesc} />
      <PillarsSection about={about} pillars={PILLAR_SECTIONS} />

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
