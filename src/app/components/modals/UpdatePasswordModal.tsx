import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Lang } from "../../types";
import { useT } from "../../i18n/useT";
import { Overlay } from "../common/Overlay";
import { updatePassword } from "../../../lib/supabase";

export function UpdatePasswordModal({ lang, onComplete }: {
  lang: Lang;
  onComplete: () => void;
}) {
  const t = useT(lang);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!password || password.length < 6) {
      setError(lang === "es" ? "La contraseña debe tener al menos 6 caracteres." : "Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await updatePassword(password);
      onComplete();
    } catch (e: any) {
      setError(e.message ?? "Error updating password.");
      setLoading(false);
    }
  };

  return (
    <Overlay>
      <div className="w-[95%] sm:w-full max-w-md rounded-2xl overflow-hidden mx-auto" style={{ backgroundColor: "var(--card)" }}>
        <div className="px-4 md:px-8 py-7 border-b border-border">
          <div className="text-xl font-bold text-foreground">{lang === "es" ? "Nueva Contraseña" : "New Password"}</div>
          <p className="text-sm text-muted-foreground mt-2">{lang === "es" ? "Ingresa tu nueva contraseña para acceder a tu cuenta." : "Enter your new password to access your account."}</p>
        </div>
        <div className="p-4 md:p-8 flex flex-col gap-5">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: "#FEF2F2", color: "#C0392B" }}>
              <AlertCircle size={15} aria-hidden="true" />{error}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">{t("login.pass")}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown} className="w-full px-4 py-3 rounded-xl border-2 border-border text-foreground text-base" style={{ backgroundColor: "var(--input-background)" }} placeholder="••••••••" />
          </div>
          <button onClick={handleSubmit} disabled={loading} className="w-full py-4 rounded-xl font-bold text-base cursor-pointer" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)", opacity: loading ? 0.6 : 1 }}>
            {loading ? "..." : (lang === "es" ? "Guardar y continuar" : "Save and continue")}
          </button>
        </div>
      </div>
    </Overlay>
  );
}
