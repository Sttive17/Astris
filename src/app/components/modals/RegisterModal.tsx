import { useState } from "react";
import { ChevronLeft, AlertCircle, User, Building2, Users, Shield, ArrowRight } from "lucide-react";
import { Lang, Role } from "../../types";
import { useT, C } from "../../i18n/useT";
import { Overlay } from "../common/Overlay";
import { signInWithGoogle } from "../../../lib/supabase";

export function RegisterModal({ lang, role, onRegister, onBack, error, loading, googleAuthUser, onCompleteGoogle }: {
  lang: Lang; role: Role | null;
  onRegister: (e: string, p: string, n: string, r: Role, v: string) => void;
  onBack: () => void;
  error?: string | null;
  loading?: boolean;
  googleAuthUser?: any;
  onCompleteGoogle?: () => void;
}) {
  const t = useT(lang);
  
  // Step management
  const [step, setStep] = useState<"select_role" | "credentials">(googleAuthUser ? "credentials" : (role ? "credentials" : "select_role"));
  const [selectedRole, setSelectedRole] = useState<Role | null>(googleAuthUser ? googleAuthUser.role : (role ?? null));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [vocation, setVocation] = useState("");

  const ROLE_ICON: Record<string, any> = { candidate: User, company: Building2, mentor: Users, admin: Shield };
  const RoleIcon = selectedRole ? ROLE_ICON[selectedRole] : User;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading && email && password && selectedRole) {
      onRegister(email, password, name, selectedRole, vocation);
    }
  };

  const handleRoleSelect = (r: Role) => {
    setSelectedRole(r);
    setStep("credentials");
  };

  const handleBack = () => {
    if (step === "credentials" && !role) {
      setStep("select_role");
      setSelectedRole(null);
    } else {
      onBack();
    }
  };

  if (googleAuthUser) {
    return (
      <Overlay>
        <div className="w-[95%] sm:w-full max-w-md rounded-2xl overflow-hidden mx-auto" style={{ backgroundColor: "var(--card)" }}>
          <div className="px-4 md:px-8 py-7 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--primary)" }}>
                <RoleIcon size={18} aria-hidden="true" style={{ color: "var(--primary-foreground)" } as React.CSSProperties} />
              </div>
              <div className="text-xl font-bold text-foreground">Completar Registro</div>
            </div>
          </div>
          <div className="p-4 md:p-8 flex flex-col gap-5 text-center">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center border border-border bg-secondary mb-2" style={{ backgroundColor: "var(--secondary)" }}>
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground">Hola, {googleAuthUser.name}</h3>
            <p className="text-muted-foreground text-sm">Tu cuenta de Google ha sido vinculada. Confirma para crear tu perfil como <b>{selectedRole === 'candidate' ? 'Candidato' : selectedRole === 'company' ? 'Empresa' : 'Mentor'}</b>.</p>
            <button
              onClick={onCompleteGoogle}
              className="w-full mt-4 py-4 rounded-xl font-bold text-base cursor-pointer hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              Completar Registro
            </button>
          </div>
        </div>
      </Overlay>
    );
  }

  if (step === "select_role") {
    return (
      <Overlay>
        <div className="w-[95%] sm:w-full max-w-lg rounded-2xl overflow-hidden mx-auto" style={{ backgroundColor: "var(--card)" }}>
          <div className="px-4 md:px-8 py-7 border-b border-border relative">
            <button onClick={onBack} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 flex items-center justify-center p-2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors bg-transparent border-0">
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <div className="text-xl font-bold text-foreground text-center px-12 md:px-16">
              {lang === "es" ? "¿Qué tipo de cuenta deseas crear?" : lang === "en" ? "What type of account do you want to create?" : lang === "pt" ? "Que tipo de conta você deseja criar?" : "Quel type de compte souhaitez-vous créer?"}
            </div>
          </div>
          <div className="p-4 md:p-8 flex flex-col gap-4">
            <button onClick={() => handleRoleSelect("candidate")} className="flex items-center gap-5 p-5 rounded-2xl border-2 border-border bg-background cursor-pointer text-left transition-all hover:border-primary hover:shadow-md group">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <User size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-1">{t("landing.hero.cand")}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{lang === "es" ? "Busco oportunidades laborales accesibles y libres de sesgos." : "I'm looking for accessible and bias-free job opportunities."}</p>
              </div>
              <ArrowRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </button>

            <button onClick={() => handleRoleSelect("company")} className="flex items-center gap-5 p-5 rounded-2xl border-2 border-border bg-background cursor-pointer text-left transition-all hover:border-primary hover:shadow-md group">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Building2 size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-1">{t("landing.hero.comp")}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{lang === "es" ? "Quiero publicar vacantes inclusivas y encontrar el mejor talento." : "I want to post inclusive vacancies and find the best talent."}</p>
              </div>
              <ArrowRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </button>

            <button onClick={() => handleRoleSelect("mentor")} className="flex items-center gap-5 p-5 rounded-2xl border-2 border-border bg-background cursor-pointer text-left transition-all hover:border-primary hover:shadow-md group">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Users size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-1">{t("role.mentor")}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{lang === "es" ? "Deseo acompañar y orientar a talentos y empresas." : "I want to guide and support talents and companies."}</p>
              </div>
              <ArrowRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </button>
          </div>
        </div>
      </Overlay>
    );
  }

  return (
    <Overlay>
      <div className="w-[95%] sm:w-full max-w-md rounded-2xl overflow-hidden mx-auto" style={{ backgroundColor: "var(--card)" }}>
        <div className="px-4 md:px-8 py-7 border-b border-border">
          <button onClick={handleBack} className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer mb-4">
            <ChevronLeft size={15} aria-hidden="true" />{t("back")}
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--primary)" }}>
              <RoleIcon size={18} aria-hidden="true" style={{ color: "var(--primary-foreground)" } as React.CSSProperties} />
            </div>
            <div className="text-xl font-bold text-foreground">{C(lang, "registerTitle" as any)}</div>
          </div>
        </div>
        <div className="p-4 md:p-8 flex flex-col gap-5">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: "#FEF2F2", color: "#C0392B" }}>
              <AlertCircle size={15} aria-hidden="true" />{error}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">{C(lang, "registerName")}</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={handleKeyDown} className="w-full px-4 py-3 rounded-xl border-2 border-border text-foreground text-base" style={{ backgroundColor: "var(--input-background)" }} placeholder="Jane Doe" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">{t("login.email")}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyDown} className="w-full px-4 py-3 rounded-xl border-2 border-border text-foreground text-base" style={{ backgroundColor: "var(--input-background)" }} placeholder="nombre@correo.com" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">{t("login.pass")}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown} className="w-full px-4 py-3 rounded-xl border-2 border-border text-foreground text-base" style={{ backgroundColor: "var(--input-background)" }} placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              {lang === "es" ? "Perfil Profesional / Área de Especialidad" : "Professional Profile / Specialty"}
            </label>
            <input type="text" value={vocation} onChange={(e) => setVocation(e.target.value)} onKeyDown={handleKeyDown} className="w-full px-4 py-3 rounded-xl border-2 border-border text-foreground text-base" style={{ backgroundColor: "var(--input-background)" }} placeholder={lang === "es" ? "Ej. Desarrollador Web, Psicóloga" : "e.g. Web Developer, Psychologist"} />
          </div>
          <button
            onClick={() => onRegister(email, password, name, selectedRole!, vocation)}
            disabled={loading || !email || !password || !selectedRole}
            className="w-full py-4 rounded-xl font-bold text-base"
            style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)", cursor: loading || !email || !password || !selectedRole ? "not-allowed" : "pointer", opacity: loading || !email || !password || !selectedRole ? 0.6 : 1 }}
          >
            {loading ? "..." : C(lang, "registerSubmit")}
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink-0 mx-4 text-muted-foreground text-sm font-medium">o</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <button
            onClick={async () => {
              try {
                await signInWithGoogle(selectedRole!, 'register');
              } catch (e) {
                console.error(e);
              }
            }}
            disabled={loading || !selectedRole}
            className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 border-2 border-border cursor-pointer hover:bg-secondary transition-colors"
            style={{ backgroundColor: "var(--card)", color: "var(--foreground)" }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuar con Google
          </button>
        </div>
      </div>
    </Overlay>
  );
}
