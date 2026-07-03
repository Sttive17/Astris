import { useState, useEffect } from "react";
import { Save, AlertTriangle, Moon, Sun, Type, Check, Trash2 } from "lucide-react";
import { Lang, PaletteKey, FontKey } from "../../types";
import { useT, getPaletteName } from "../../i18n/useT";
import { PALETTES } from "../../i18n/content";
import { getCurrentUser, updateProfile, deleteAccount } from "../../../lib/supabase";

export function SettingsPage({ lang, palette, darkMode, font, onPalette, onDark, onFont, onLogout }: {
  lang: Lang;
  palette: PaletteKey;
  darkMode: boolean;
  font: FontKey;
  onPalette: (p: PaletteKey) => void;
  onDark: (d: boolean) => void;
  onFont: (f: FontKey) => void;
  onLogout: () => void;
}) {
  const t = useT(lang);
  const [name, setName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success'|'error'}|null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const user = await getCurrentUser();
      if (user) {
        setUserId(user.id);
        setName(user.name);
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const handleSaveProfile = async () => {
    if (!userId || !name.trim()) return;
    setSaving(true);
    setMessage(null);
    try {
      await updateProfile(userId, name);
      setMessage({ text: lang === "es" ? "Perfil actualizado correctamente." : "Profile updated successfully.", type: "success" });
    } catch (e: any) {
      setMessage({ text: e.message || "Error al actualizar perfil.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      await deleteAccount();
      onLogout(); // Forzar cierre
    } catch (e: any) {
      console.error(e);
      setMessage({ text: lang === "es" ? "Error al eliminar cuenta. Asegúrate de haber ejecutado el script SQL en Supabase." : "Error deleting account. Make sure you ran the SQL script in Supabase.", type: "error" });
      setShowDeleteConfirm(false);
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-muted-foreground">...</div>;

  return (
    <div className="max-w-4xl mx-auto w-full px-4 lg:px-8 py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">{lang === "es" ? "Configuración de Cuenta" : "Account Settings"}</h1>

      {message && (
        <div className="mb-6 p-4 rounded-xl flex items-center gap-2 font-medium" style={{ backgroundColor: message.type === 'success' ? '#F0FDF4' : '#FEF2F2', color: message.type === 'success' ? '#166534' : '#C0392B' }}>
          {message.text}
        </div>
      )}

      <div className="space-y-8">
        {/* Profile Info */}
        <section className="p-6 md:p-8 rounded-[2rem] border border-border" style={{ backgroundColor: "var(--card)", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
          <h2 className="text-lg font-bold text-foreground mb-5">{lang === "es" ? "Información Personal" : "Personal Information"}</h2>
          <div className="max-w-md">
            <label className="block text-sm font-semibold text-foreground mb-2">{lang === "es" ? "Nombre Completo" : "Full Name"}</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border-2 border-border text-foreground text-base mb-4" 
              style={{ backgroundColor: "var(--input-background)" }} 
            />
            <button onClick={handleSaveProfile} disabled={saving} className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm cursor-pointer transition-all hover:scale-[1.02]" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
              <Save size={16} /> {saving ? "..." : (lang === "es" ? "Guardar Cambios" : "Save Changes")}
            </button>
          </div>
        </section>

        {/* Visual Preferences */}
        <section className="p-6 md:p-8 rounded-[2rem] border border-border" style={{ backgroundColor: "var(--card)", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
          <h2 className="text-lg font-bold text-foreground mb-5">{lang === "es" ? "Preferencias Visuales" : "Visual Preferences"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Dark Mode */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide flex items-center gap-2"><Sun size={14} aria-hidden="true" /> {t("palette.dark")}</h3>
              <button onClick={() => onDark(!darkMode)} className="w-full flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all hover:scale-[1.02]" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
                  <span className="font-semibold text-foreground">{darkMode ? (lang === "es" ? "Modo oscuro" : "Dark mode") : (lang === "es" ? "Modo claro" : "Light mode")}</span>
                </div>
                <div className="w-12 h-6 rounded-full relative shrink-0" style={{ backgroundColor: darkMode ? "var(--primary)" : "var(--muted)" }}>
                  <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white" style={{ left: darkMode ? "calc(100% - 22px)" : "2px", transition: "left 200ms ease" }} />
                </div>
              </button>
            </div>

            {/* Typography */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide flex items-center gap-2"><Type size={14} aria-hidden="true" /> {t("palette.font")}</h3>
              {([["atkinson", "Atkinson Hyperlegible"], ["lexend", "Lexend"]] as const).map(([fk, fname]) => {
                const sel = font === fk;
                return (
                  <button key={fk} onClick={() => onFont(fk)} className="w-full flex items-center gap-3 p-3 rounded-2xl border-2 cursor-pointer text-left mb-2 transition-all hover:scale-[1.02]" style={{ borderColor: sel ? "var(--primary)" : "var(--border)", backgroundColor: sel ? "var(--background)" : "transparent" }}>
                    <div className="flex-1 font-semibold text-sm" style={{ fontFamily: fk === "lexend" ? "'Lexend', sans-serif" : "'Atkinson Hyperlegible', sans-serif" }}>{fname}</div>
                    {sel && <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--primary)" }}><Check size={10} style={{ color: "var(--primary-foreground)" }} /></div>}
                  </button>
                );
              })}
            </div>

            {/* Palettes */}
            <div className="md:col-span-2">
              <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-accent" /> {lang === "es" ? "Paleta de colores" : "Color Palette"}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {(Object.keys(PALETTES) as PaletteKey[]).map((key) => {
                  const p = PALETTES[key];
                  const sel = palette === key;
                  return (
                    <button key={key} onClick={() => onPalette(key)} className="w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer text-left transition-all hover:scale-[1.02]" style={{ borderColor: sel ? "var(--primary)" : "var(--border)", backgroundColor: sel ? "var(--background)" : "transparent" }}>
                      <div className="w-8 h-8 rounded-lg shrink-0 border" style={{ backgroundColor: p.bg, borderColor: p.border }} />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-foreground text-sm leading-tight">{getPaletteName(key, lang)}</div>
                      </div>
                      {sel && <Check size={14} style={{ color: "var(--primary)" }} />}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </section>

        {/* Danger Zone */}
        <section className="p-6 md:p-8 rounded-[2rem] border-2 border-red-500/20 bg-red-500/5">
          <h2 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2"><AlertTriangle size={20} /> {lang === "es" ? "Zona de Peligro" : "Danger Zone"}</h2>
          <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-5 max-w-xl">
            {lang === "es" 
              ? "Una vez que elimines tu cuenta, no hay vuelta atrás. Toda tu información y procesos se perderán permanentemente." 
              : "Once you delete your account, there is no going back. All your information and processes will be permanently lost."}
          </p>
          
          {!showDeleteConfirm ? (
            <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm cursor-pointer transition-all bg-red-500 text-white hover:bg-red-600">
              <Trash2 size={16} /> {lang === "es" ? "Eliminar Cuenta" : "Delete Account"}
            </button>
          ) : (
            <div className="p-5 rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 flex flex-col gap-4 max-w-md">
              <p className="font-bold text-red-600 dark:text-red-400 text-sm">
                {lang === "es" ? "¿Estás absolutamente seguro de esto?" : "Are you absolutely sure about this?"}
              </p>
              <div className="flex gap-3">
                <button onClick={handleDeleteAccount} disabled={saving} className="flex-1 py-2.5 rounded-lg font-bold text-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">
                  {saving ? "..." : (lang === "es" ? "Sí, eliminar mi cuenta" : "Yes, delete my account")}
                </button>
                <button onClick={() => setShowDeleteConfirm(false)} disabled={saving} className="flex-1 py-2.5 rounded-lg font-bold text-sm bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                  {lang === "es" ? "Cancelar" : "Cancel"}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
