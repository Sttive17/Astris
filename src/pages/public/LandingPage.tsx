import { useState } from "react";
import { User, Building2, Star, ArrowRight, Globe, X, Sun, Moon } from "lucide-react";
import { Lang, Role, PublicView } from "@/types";
import { useT, C } from "@/i18n/useT";
import astrisImg from "@/assets/astris.png";
import { CollaboratorCarousel } from "@/components/common/CollaboratorCarousel";

export function LandingPage({ lang, onOpenAuth, onLang, onNavigate, darkMode, onDarkToggle }: { lang: Lang; onOpenAuth: (preRole?: Role, step?: "auth" | "login" | "register") => void; onLang: () => void; onNavigate: (view: PublicView) => void; darkMode: boolean; onDarkToggle: () => void; }) {
  const t = useT(lang);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background">
      {/* Fixed header */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-border backdrop-blur-sm" style={{ backgroundColor: "var(--background)", opacity: 0.97 }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <button onClick={() => onNavigate("landing")} className="flex items-center gap-3 bg-transparent border-0 cursor-pointer p-0 text-left">
            <img src={astrisImg} alt="Astris Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
            <span className="text-lg md:text-xl font-bold text-foreground tracking-tight">Astris</span>
          </button>
          <nav className="hidden lg:flex items-center gap-6">
            {[
              { key: "about", label: t("landing.nav.about") },
              { key: "support", label: t("landing.nav.support") },
              { key: "partners", label: t("landing.nav.partners") },
            ].map((item) => (
              <button key={item.key} onClick={() => onNavigate(item.key as PublicView)} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground bg-transparent border-0 cursor-pointer p-0">{item.label}</button>
            ))}
          </nav>
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={onDarkToggle}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border border-border cursor-pointer hover:bg-secondary bg-transparent"
              aria-label={darkMode ? "Modo claro" : "Modo oscuro"}
              title={darkMode ? "Modo claro" : "Modo oscuro"}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={onLang} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border border-border cursor-pointer hover:bg-secondary bg-transparent" aria-label="Cambiar idioma">
              <Globe size={16} />{lang.toUpperCase()}
            </button>
            <button onClick={() => onOpenAuth(undefined, "login")} className="px-5 py-2.5 rounded-xl text-sm font-semibold border-2 border-border cursor-pointer" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>{t("landing.nav.login")}</button>
            <button onClick={() => onOpenAuth(undefined, "register")} className="px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer border-0" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>{t("landing.nav.register")}</button>
          </div>
          
          {/* Mobile menu toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button onClick={onDarkToggle} className="flex items-center justify-center p-2 rounded-lg border border-border hover:bg-secondary cursor-pointer bg-transparent">
               {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={onLang} className="flex items-center justify-center p-2 rounded-lg border border-border hover:bg-secondary cursor-pointer bg-transparent">
               <Globe size={18} />
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 -mr-2 text-foreground cursor-pointer bg-transparent border-0">
              {mobileMenuOpen ? <X size={24} /> : <div className="space-y-1.5"><div className="w-6 h-0.5 bg-foreground"></div><div className="w-6 h-0.5 bg-foreground"></div><div className="w-6 h-0.5 bg-foreground"></div></div>}
            </button>
          </div>
        </div>
        
        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background px-4 py-6 space-y-6 shadow-xl h-screen overflow-y-auto pb-24">
            <nav className="flex flex-col gap-4">
              {[
                { key: "about", label: t("landing.nav.about") },
                { key: "support", label: t("landing.nav.support") },
                { key: "partners", label: t("landing.nav.partners") },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => { onNavigate(item.key as PublicView); setMobileMenuOpen(false); }}
                  className="bg-transparent border-0 cursor-pointer p-0 text-lg text-left font-medium text-muted-foreground hover:text-foreground"
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <button onClick={() => { onOpenAuth(undefined, "login"); setMobileMenuOpen(false); }} className="w-full rounded-xl border-2 border-border px-5 py-3 text-center text-base font-semibold cursor-pointer" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>{t("landing.nav.login")}</button>
              <button onClick={() => { onOpenAuth(undefined, "register"); setMobileMenuOpen(false); }} className="w-full rounded-xl px-5 py-3 text-center text-base font-semibold cursor-pointer border-0" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>{t("landing.nav.register")}</button>
            </div>
          </div>
        )}
      </header>

      <div className="pt-16">
        {/* Hero */}
        <section style={{ background: "linear-gradient(135deg, var(--background) 0%, color-mix(in srgb, var(--primary) 6%, var(--background)) 100%)" }} className="relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -top-32 -right-32 h-[520px] w-[520px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }} />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-[340px] w-[340px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)" }} />

          <div className="relative max-w-7xl mx-auto px-5 md:px-10 py-14 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-[52px] font-bold text-foreground leading-[1.1] mb-5" style={{ letterSpacing: "-0.02em" }}>
                {t("landing.hero.t1")}<br />
                <span style={{ color: "var(--primary)" }}>{t("landing.hero.t2")}</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10 whitespace-pre-line italic max-w-xl">{t("landing.hero.sub")}</p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full sm:w-auto mt-8">
                <button onClick={() => onOpenAuth(undefined, "register")} className="flex items-center justify-center sm:justify-start gap-3 w-full sm:w-auto px-8 py-4 rounded-xl text-lg font-bold cursor-pointer transition-transform hover:scale-[1.02] border-0" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
                  {lang === "en" ? "Join Astris" : "Únete a Astris"}<ArrowRight size={20} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Logo side */}
            <div className="hidden lg:flex shrink-0 flex-col items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-3xl opacity-30" style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)", transform: "scale(1.2)" }} aria-hidden="true" />
                <img src={astrisImg} alt="Astris Logo" className="relative h-auto w-[340px] object-contain drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Collaborators carousel */}
        <section className="border-y border-border px-5 md:px-10" style={{ backgroundColor: "var(--card)", paddingTop: "clamp(2rem, 5vh, 4rem)", paddingBottom: "clamp(2rem, 5vh, 4rem)" }}>
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground mb-6 md:mb-8">
              {t("landing.supported")}
            </p>
            <CollaboratorCarousel lang={lang} />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border px-5 md:px-10 py-10" style={{ backgroundColor: "var(--background)" }}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-4 md:gap-8">
            <div>
              <div className="text-xl font-bold flex items-center gap-3 text-foreground mb-2">
                <img src={astrisImg} alt="Astris" className="w-9 h-9 object-contain" /> Astris
              </div>
              <div className="text-sm text-muted-foreground max-w-xs mb-3">{t("landing.footer.program")}</div>
              <div className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Astris. Todos los derechos reservados.</div>
            </div>

            <div className="flex gap-16">
              <div className="flex flex-col gap-4">
                <span className="font-bold text-foreground text-sm uppercase tracking-wider">Enlaces</span>
                <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                  {(C(lang, "footerLinks") as string[]).map((link) => (
                    <span key={link} className="cursor-pointer hover:text-primary transition-colors">{link}</span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <span className="font-bold text-foreground text-sm uppercase tracking-wider">Soporte y Contacto</span>
                <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                  <a href="https://www.vibralatinatx.com/contact-1" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight size={14} />Vibra Latina</a>
                  <a href="https://support.microsoft.com/es-us/contactus/" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight size={14} />Microsoft Support</a>
                  <a href="https://genuinecup.org/" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight size={14} />The Genuine Foundation</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
