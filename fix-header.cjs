const fs = require('fs');
const file = 'src/app/AstrisApp.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add mobileMenuOpen state to PublicPageShell
content = content.replace(/function PublicPageShell\(\{[^}]+\}\s*:\s*\{[^}]+\}\)\s*\{\s*const t = useT\(lang\);/, 
  (match) => {
    return match + '\n  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);';
  }
);

// Replace the header inside PublicPageShell
const headerRegex = /<header className="sticky top-0 z-40 border-b border-border" style={{ backgroundColor: "var\(--background\)" }}>[\s\S]*?<\/header>/;

const newHeader = `<header className="sticky top-0 z-40 border-b border-border" style={{ backgroundColor: "var(--background)" }}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <button onClick={() => onNavigate("landing")} className="flex items-center gap-3">
            <img src={astrisImg} alt="Astris Logo" className="h-10 w-10 md:h-14 md:w-14 object-contain" />
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
                className={\`text-sm font-medium transition-colors \${currentView === item.key ? "text-foreground" : "text-muted-foreground hover:text-foreground"}\`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="hidden lg:flex items-center gap-3">
            <button onClick={onLang} className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-secondary" aria-label="Cambiar idioma">
              <Globe size={16} />{lang.toUpperCase()}
            </button>
            <button onClick={() => onOpenAuth(undefined, "login")} className="rounded-xl border-2 border-border px-5 py-2.5 text-sm font-semibold" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>{t("landing.nav.login")}</button>
            <button onClick={() => onOpenAuth(undefined, "register")} className="rounded-xl px-5 py-2.5 text-sm font-semibold" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>{t("landing.nav.register")}</button>
          </div>
          
          {/* Mobile menu toggle */}
          <div className="flex lg:hidden items-center gap-3">
            <button onClick={onLang} className="flex items-center justify-center p-2 rounded-lg border border-border hover:bg-secondary">
               <Globe size={18} />
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 -mr-2 text-foreground">
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
                  className={\`text-lg text-left font-medium \${currentView === item.key ? "text-foreground" : "text-muted-foreground"}\`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <button onClick={() => { onOpenAuth(undefined, "login"); setMobileMenuOpen(false); }} className="w-full rounded-xl border-2 border-border px-5 py-3 text-center text-base font-semibold" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>{t("landing.nav.login")}</button>
              <button onClick={() => { onOpenAuth(undefined, "register"); setMobileMenuOpen(false); }} className="w-full rounded-xl px-5 py-3 text-center text-base font-semibold" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>{t("landing.nav.register")}</button>
            </div>
          </div>
        )}
      </header>`;

content = content.replace(headerRegex, newHeader);

// Let's also fix the Hero section on landing page to be properly responsive
const heroRegex = /<section className="relative overflow-hidden pt-12 md:pt-24 pb-16 md:pb-32">[\s\S]*?<\/section>/;
const newHero = `<section className="relative overflow-hidden pt-12 md:pt-24 pb-16 md:pb-32">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="w-full lg:w-1/2 flex flex-col items-start z-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border mb-6" style={{ backgroundColor: "var(--card)" }}>
                <Star size={14} className="text-primary" />
                <span className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">{t("landing.footer.program")}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-bold tracking-tight text-foreground leading-[1.1] mb-6">
                {t("landing.hero.t1")}<br />
                <span className="text-primary">{t("landing.hero.t2")}</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0">
                {t("landing.hero.sub")}
              </p>
              <div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-4">
                <button onClick={() => onOpenAuth("candidate", "register")} className="group flex items-center justify-between sm:justify-center gap-4 px-6 py-4 rounded-xl text-base font-bold shadow-sm transition-all hover:scale-105 active:scale-95" style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}>
                  <span className="flex items-center gap-2"><User size={18} /> {t("landing.hero.cand")}</span>
                  <ArrowRight size={18} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
                <button onClick={() => onOpenAuth("company", "register")} className="group flex items-center justify-between sm:justify-center gap-4 px-6 py-4 rounded-xl text-base font-bold bg-card border-2 border-border transition-all hover:bg-secondary active:scale-95 text-foreground">
                  <span className="flex items-center gap-2"><Building2 size={18} /> {t("landing.hero.comp")}</span>
                  <ArrowRight size={18} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
                <button onClick={() => onOpenAuth("mentor", "register")} className="group hidden sm:flex items-center justify-center gap-4 px-6 py-4 rounded-xl text-base font-bold transition-all hover:bg-secondary text-foreground">
                  <span className="flex items-center gap-2"><Users size={18} /> {t("role.mentor")}</span>
                  <ArrowRight size={18} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              </div>
              <button onClick={() => onOpenAuth("mentor", "register")} className="group mt-4 sm:hidden flex w-full items-center justify-between gap-4 px-6 py-4 rounded-xl text-base font-bold transition-all hover:bg-secondary text-foreground">
                  <span className="flex items-center gap-2"><Users size={18} /> {t("role.mentor")}</span>
                  <ArrowRight size={18} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
            <div className="w-full lg:w-1/2 relative flex justify-center mt-8 lg:mt-0">
              <div className="relative w-full max-w-lg aspect-square">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl mix-blend-multiply"></div>
                <img src={astrisImg} alt="Astris Illustration" className="relative z-10 w-full h-full object-contain animate-float" style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.1))" }} />
              </div>
            </div>
          </div>
        </section>`;
        
content = content.replace(heroRegex, newHero);

// Also fix the forms / auth modales to be truly responsive
// E.g. LoginModal
content = content.replace(/<div className="w-full max-w-md rounded-2xl overflow-hidden"/g, '<div className="w-[95%] md:w-full max-w-md rounded-2xl overflow-hidden mx-4"');

fs.writeFileSync(file, content);
console.log("Header and Hero fixed");
