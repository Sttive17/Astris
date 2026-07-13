import React, { useState } from "react";
import { Globe, X, Sun, Moon, Type } from "lucide-react";
import { Lang, Role, PublicView, FontKey } from "@/types";
import { useT } from "@/i18n/useT";
import astrisImg from "@/assets/astris.png";

export function PublicPageShell({ lang, currentView, onNavigate, onOpenAuth, onLang, title, subtitle, children, darkMode, onDarkToggle, font, onFontToggle }: {
  lang: Lang;
  currentView: PublicView;
  onNavigate: (view: PublicView) => void;
  onOpenAuth: (preRole?: Role, step?: "auth" | "login" | "register") => void;
  onLang: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  darkMode: boolean;
  onDarkToggle: () => void;
  font: FontKey;
  onFontToggle: () => void;
}) {
  const t = useT(lang);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border" style={{ backgroundColor: "var(--background)" }}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <button onClick={() => onNavigate("landing")} className="flex items-center gap-3 bg-transparent border-0 cursor-pointer p-0 text-left">
            <img src={astrisImg} alt="Astris Logo" className="w-12 h-12 md:h-14 md:w-14 object-contain" />
            <span className="text-lg md:text-xl font-bold tracking-tight text-foreground">Astris</span>
          </button>
          <nav className="hidden lg:flex items-center gap-6">
            {[
              { key: "about", label: t("landing.nav.about") },
              { key: "support", label: t("landing.nav.support") },
              { key: "partners", label: t("landing.nav.partners") },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key as PublicView)}
                className={`bg-transparent border-0 cursor-pointer p-0 text-sm font-medium transition-colors ${currentView === item.key ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={onFontToggle}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border border-border cursor-pointer transition-colors"
              style={{
                borderColor: font === "lexend" ? "var(--primary)" : "var(--border)",
                backgroundColor: font === "lexend" ? "color-mix(in srgb, var(--primary) 12%, transparent)" : "transparent",
                color: font === "lexend" ? "var(--primary)" : "var(--foreground)",
              }}
              aria-label={t("onboarding.dyslexia_font_title", "Modo Dislexia")}
              title={t("onboarding.dyslexia_font_title", "Modo Dislexia")}
            >
              <Type size={16} />
            </button>
            <button
              onClick={onDarkToggle}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border border-border cursor-pointer hover:bg-secondary bg-transparent"
              aria-label={darkMode ? "Modo claro" : "Modo oscuro"}
              title={darkMode ? "Modo claro" : "Modo oscuro"}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={onLang} className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-secondary cursor-pointer bg-transparent" aria-label="Cambiar idioma">
              <Globe size={16} />{lang.toUpperCase()}
            </button>
            <button onClick={() => onOpenAuth(undefined, "login")} className="rounded-xl border-2 border-border px-5 py-2.5 text-sm font-semibold cursor-pointer" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>{t("landing.nav.login")}</button>
            <button onClick={() => onOpenAuth(undefined, "register")} className="rounded-xl px-5 py-2.5 text-sm font-semibold cursor-pointer border-0" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>{t("landing.nav.register")}</button>
          </div>
          
          {/* Mobile menu toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onFontToggle}
              className="flex items-center justify-center p-2 rounded-lg border border-border cursor-pointer transition-colors"
              style={{
                borderColor: font === "lexend" ? "var(--primary)" : "var(--border)",
                backgroundColor: font === "lexend" ? "color-mix(in srgb, var(--primary) 12%, transparent)" : "transparent",
                color: font === "lexend" ? "var(--primary)" : "var(--foreground)",
              }}
            >
               <Type size={18} />
            </button>
            <button onClick={onDarkToggle} className="flex items-center justify-center rounded-lg border border-border p-2 hover:bg-secondary cursor-pointer bg-transparent">
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
          <div className="lg:hidden border-t border-border bg-background px-4 py-6 space-y-6">
            <nav className="flex flex-col gap-4">
              {[
                { key: "about", label: t("landing.nav.about") },
                { key: "support", label: t("landing.nav.support") },
                { key: "partners", label: t("landing.nav.partners") },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => { onNavigate(item.key as PublicView); setMobileMenuOpen(false); }}
                  className={`bg-transparent border-0 cursor-pointer p-0 text-lg text-left font-medium ${currentView === item.key ? "text-foreground" : "text-muted-foreground"}`}
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

      <main className="mx-auto max-w-7xl px-4 md:px-8 py-10 md:py-16">

        {children}
      </main>
    </div>
  );
}
