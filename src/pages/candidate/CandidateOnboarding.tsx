import { Sun, Moon, Check, Type, ArrowRight } from "lucide-react";
import { Lang, PaletteKey, FontKey } from "@/types";
import { useT, getPaletteName, getPaletteDesc, C } from "@/i18n/useT";
import { PALETTES } from "@/i18n/content";

export function CandidateOnboarding({ lang, palette, darkMode, font, onPalette, onDark, onFont, onContinue }: {
  lang: Lang; palette: PaletteKey; darkMode: boolean; font: FontKey;
  onPalette: (p: PaletteKey) => void; onDark: (d: boolean) => void; onFont: (f: FontKey) => void;
  onContinue: () => void;
}) {
  const t = useT(lang);
  const pal = PALETTES[palette];
  const bg = darkMode ? "#1A1A2E" : pal.bg;
  const fg = darkMode ? "#F0EFEA" : pal.fg;
  const card = darkMode ? "#252535" : pal.card;
  const accent = pal.accent;
  const border = darkMode ? "rgba(255,255,255,0.1)" : pal.border;
  const accentText = palette === "contraste" ? "#1A1A04" : "#fff";
  const fontFamily = font === "lexend" ? "'Lexend', Inter, sans-serif" : "'Atkinson Hyperlegible', Inter, sans-serif";

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
      <div className="px-4 lg:px-20 py-10 border-b border-border">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t("palette.title")}</h1>
        <p className="text-muted-foreground mt-2 text-base max-w-xl">{t("palette.sub")}</p>
      </div>
      <div className="flex flex-col lg:flex-row flex-1">
        {/* Controls */}
        <div className="w-full lg:w-[420px] shrink-0 border-r border-border px-5 md:px-10 py-10 flex flex-col gap-4 md:gap-8 overflow-y-auto">
          {/* Dark mode */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide flex items-center gap-2"><Sun size={14} aria-hidden="true" /> {t("palette.dark")}</h3>
            <button onClick={() => onDark(!darkMode)} className="w-full flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
              <div className="flex items-center gap-3">
                {darkMode ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
                <span className="font-semibold text-foreground">{darkMode ? (t("auto.modo_oscuro._15")) : (t("auto.modo_claro._16"))}</span>
              </div>
              <div className="w-12 h-6 rounded-full relative shrink-0" style={{ backgroundColor: darkMode ? "var(--primary)" : "var(--muted)" }} aria-hidden="true">
                <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white" style={{ left: darkMode ? "calc(100% - 22px)" : "2px", transition: "left 200ms ease" }} />
              </div>
            </button>
          </div>
          {/* Palettes */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-accent" aria-hidden="true" /> {t("auto.paleta_de_color._17")}</h3>
            <div className="flex flex-col gap-2.5">
              {(Object.keys(PALETTES) as PaletteKey[]).map((key) => {
                const p = PALETTES[key];
                const sel = palette === key;
                return (
                  <button key={key} onClick={() => onPalette(key)} className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer text-left transition-all hover:scale-[1.02]" style={{ borderColor: sel ? "var(--primary)" : "var(--border)", backgroundColor: sel ? "var(--card)" : "var(--background)", boxShadow: sel ? "0 4px 16px rgba(0,0,0,0.06)" : "none" }}>
                    <div className="w-10 h-10 rounded-xl shrink-0 border-2" style={{ backgroundColor: p.bg, borderColor: p.border }} aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground text-sm">{getPaletteName(key, lang)}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{getPaletteDesc(key, lang)}</div>
                    </div>
                    {sel && <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--primary)" }}><Check size={11} aria-hidden="true" style={{ color: "var(--primary-foreground)" }} /></div>}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Font Checkbox */}
          <div className="mt-4 p-4 rounded-2xl border-2 border-border bg-card">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={font === "lexend"}
                onChange={(e) => onFont(e.target.checked ? "lexend" : "inter")}
                className="mt-1 w-5 h-5 rounded border-2 border-primary text-primary focus:ring-primary"
              />
              <div className="flex-1">
                <div className="font-bold text-foreground text-sm">{t("onboarding.dyslexia_font_title", "¿Necesitas una fuente especial para facilitar la lectura?")}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{t("onboarding.dyslexia_font_desc", "(Recomendada para dislexia)")}</div>
              </div>
            </label>
          </div>
          <div className="mt-auto pt-6">
            <button onClick={onContinue} className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base cursor-pointer transition-all hover:scale-[1.02] hover:opacity-90 shadow-lg" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
              {t("continue")} <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
        {/* Preview */}
        <div className="w-full lg:flex-1 px-4 lg:px-14 py-10 bg-muted/20">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-2 h-2 rounded-full bg-accent" aria-hidden="true" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t("auto.vista_previa_en._18")}</span>
          </div>
          <div
            className="rounded-3xl border overflow-hidden"
            style={{
              backgroundColor: bg, borderColor: border, color: fg, fontFamily,
              boxShadow: darkMode ? "0 10px 40px rgba(0,0,0,0.3)" : "0 10px 40px rgba(27,75,122,0.12)",
              transition: "background-color 320ms ease, border-color 320ms ease, color 320ms ease, box-shadow 320ms ease",
            }}
          >
            <div
              className="px-4 md:px-8 py-4 border-b flex items-center justify-between"
              style={{
                borderColor: border, backgroundColor: card,
                transition: "background-color 320ms ease, border-color 320ms ease",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 16, color: fg }}>Astris</span>
              <div className="flex gap-5">{(C(lang, "previewNav") as string[]).map((item) => <span key={item} style={{ fontSize: 13, color: fg, opacity: 0.6 }}>{item}</span>)}</div>
            </div>
            <div className="p-4 md:p-8">
              <div style={{ fontWeight: 700, fontSize: 22, color: fg, marginBottom: 4 }}>{C(lang, "previewTitle")}</div>
              <div style={{ fontSize: 14, color: fg, opacity: 0.55, marginBottom: 20 }}>{C(lang, "previewSubtitle")}</div>
              {[{ title: "Analista de Datos Junior", co: "Veritas Analytics", pct: 94 }, { title: "Diseñadora UX", co: "Forma Studio", pct: 87 }, { title: "Redactor/a Técnico/a", co: "Kestrel Systems", pct: 81 }].map((v) => (
                <div
                  key={v.title}
                  className="mb-4 rounded-2xl p-5 border-2 flex items-center justify-between"
                  style={{
                    backgroundColor: card, borderColor: border,
                    transition: "background-color 320ms ease, border-color 320ms ease",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: fg }}>{v.title}</div>
                    <div style={{ fontSize: 12, color: fg, opacity: 0.55 }}>{v.co}</div>
                  </div>
                  <div
                    className="px-3 py-1.5 rounded-full text-sm font-bold"
                    style={{
                      backgroundColor: accent, color: accentText,
                      transition: "background-color 320ms ease, color 320ms ease",
                    }}
                  >
                    {v.pct}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
