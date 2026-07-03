import { ArrowRight } from "lucide-react";
import { Lang, Role, PublicView } from "../../types";
import { useT } from "../../i18n/useT";
import { PublicPageShell } from "./PublicPageShell";
import genuineImg from "../../../imports/genuine.png";
import vibralatinaImg from "../../../imports/vibralatina.png";

export function SupportPage({ lang, onNavigate, onOpenAuth, onLang, darkMode, onDarkToggle }: { lang: Lang; onNavigate: (view: PublicView) => void; onOpenAuth: (preRole?: Role, step?: "auth" | "login" | "register") => void; onLang: () => void; darkMode: boolean; onDarkToggle: () => void; }) {
  const t = useT(lang);
  const orgs = [
    { name: "Vibra Latina", href: "https://www.vibralatinatx.com/", icon: <img src={vibralatinaImg} alt="Vibra Latina" className="h-16 w-16 object-contain" /> },
    { name: "Microsoft", href: "https://support.microsoft.com/es-us/contactus/", icon: <svg width="48" height="48" viewBox="0 0 21 21" aria-hidden="true" className="shrink-0"><rect x="1" y="1" width="9" height="9" fill="#F25022" /><rect x="11" y="1" width="9" height="9" fill="#7FBA00" /><rect x="1" y="11" width="9" height="9" fill="#00A4EF" /><rect x="11" y="11" width="9" height="9" fill="#FFB900" /></svg> },
    { name: "The Genuine Foundation", href: "https://genuinecup.org/", icon: <img src={genuineImg} alt="The Genuine Foundation" className="h-16 w-16 object-contain" /> },
  ];

  return (
    <PublicPageShell lang={lang} currentView="support" onNavigate={onNavigate} onOpenAuth={onOpenAuth} onLang={onLang} darkMode={darkMode} onDarkToggle={onDarkToggle} title={t("landing.nav.support")}>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3 max-w-5xl mx-auto py-8">
        {orgs.map((org) => (
          <div key={org.name} className="flex flex-col items-center justify-center text-center rounded-[2.5rem] border-2 border-border bg-card p-10 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-primary/10">
              {org.icon}
            </div>
            <h3 className="mb-6 text-2xl font-extrabold text-foreground">{org.name}</h3>
            <a href={org.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 text-base font-bold text-primary hover:bg-primary/20 transition-colors">
              Ver enlace <ArrowRight size={18} />
            </a>
          </div>
        ))}
      </div>
    </PublicPageShell>
  );
}
