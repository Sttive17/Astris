import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { Lang, Role, PublicView } from "../../types";
import { useT } from "../../i18n/useT";
import { PublicPageShell } from "./PublicPageShell";

export function PartnersPage({ lang, onNavigate, onOpenAuth, onLang, darkMode, onDarkToggle }: { lang: Lang; onNavigate: (view: PublicView) => void; onOpenAuth: (preRole?: Role, step?: "auth" | "login" | "register") => void; onLang: () => void; darkMode: boolean; onDarkToggle: () => void; }) {
  const t = useT(lang);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ company: "", name: "", email: "", why: "" });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <PublicPageShell lang={lang} currentView="partners" onNavigate={onNavigate} onOpenAuth={onOpenAuth} onLang={onLang} darkMode={darkMode} onDarkToggle={onDarkToggle} title={t("landing.nav.partners")} subtitle="Si tu empresa quiere participar de Astris, completa este formulario y nos pondremos en contacto para conversar sobre colaboración.">
      <div className="max-w-2xl mx-auto w-full">
        <div className="rounded-3xl border border-border bg-background p-4 md:p-8 shadow-sm">
          {submitted ? (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
              <h3 className="mb-2 text-xl font-bold text-foreground">Gracias por tu interés</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">Hemos recibido tu propuesta. Nos pondremos en contacto pronto para explorar una colaboración con Astris.</p>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1 block text-sm font-semibold text-foreground">Nombre de la empresa</label>
                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary" style={{ color: "var(--foreground)" }} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-foreground">Tu nombre</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary" style={{ color: "var(--foreground)" }} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-foreground">Correo electrónico</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary" style={{ color: "var(--foreground)" }} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-foreground">¿Por qué quieren ser parte de Astris?</label>
                <textarea value={form.why} onChange={(e) => setForm({ ...form, why: e.target.value })} required rows={5} className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary resize-y" style={{ color: "var(--foreground)" }} />
              </div>
              <button type="submit" className="w-full rounded-xl px-5 py-3 text-sm font-semibold text-primary-foreground border-0 cursor-pointer" style={{ backgroundColor: "var(--primary)" }}>Enviar propuesta</button>
            </form>
          )}
        </div>
      </div>
    </PublicPageShell>
  );
}
