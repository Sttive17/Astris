import { useState, useEffect } from "react";

// Types
import { Lang, ModalStep, Role, PaletteKey, FontKey, QuizAnswers, PublicView } from "./types";

// Supabase
import { getCurrentUser, loginUser, logoutUser, registerUser, saveCandidateProfile, supabase } from "../lib/supabase";

// i18n
import { getInitialLang, getInitialModalStep } from "./i18n/useT";
import { PALETTES, QUIZ_AXES } from "./i18n/content";

// Components
import { NavBar } from "./components/common/NavBar";
import { LanguageModal } from "./components/modals/LanguageModal";
import { LoginModal } from "./components/modals/LoginModal";
import { RegisterModal } from "./components/modals/RegisterModal";
import { UpdatePasswordModal } from "./components/modals/UpdatePasswordModal";

// Pages
import { LandingPage } from "./pages/public/LandingPage";
import { AboutPage } from "./pages/public/AboutPage";
import { SupportPage } from "./pages/public/SupportPage";
import { PartnersPage } from "./pages/public/PartnersPage";

import { CandidateOnboarding } from "./pages/candidate/CandidateOnboarding";
import { CandidateQuiz } from "./pages/candidate/CandidateQuiz";
import { CandidateProfile } from "./pages/candidate/CandidateProfile";
import { CandidateVacancies } from "./pages/candidate/CandidateVacancies";
import { VacancyDetail } from "./pages/candidate/VacancyDetail";
import { MentorSelect } from "./pages/candidate/MentorSelect";
import { CandidateAccompaniment } from "./pages/candidate/CandidateAccompaniment";
import { CandidatePostHire } from "./pages/candidate/CandidatePostHire";

import { SettingsPage } from "./pages/shared/SettingsPage";
import { CompanyOrgProfile } from "./pages/company/CompanyOrgProfile";
import { CompanyPostVacancy } from "./pages/company/CompanyPostVacancy";
import { CompanyCandidates } from "./pages/company/CompanyCandidates";
import { CompanyCandidateDetail } from "./pages/company/CompanyCandidateDetail";
import { CompanyPostHire } from "./pages/company/CompanyPostHire";

import { MentorDashboard } from "./pages/mentor/MentorDashboard";
import { MentorCheckins } from "./pages/mentor/MentorCheckins";
import { MentorCompanies } from "./pages/mentor/MentorCompanies";

import AdminDashboard from "./admin/AdminDashboard";
import { AdminPanel } from "./components/admin/AdminPanel";

export default function App() {
  // Modal flow
  const [modalStep, setModalStep] = useState<ModalStep>(() => getInitialModalStep());
  const [lang, setLang] = useState<Lang>(() => getInitialLang());
  const [role, setRole] = useState<Role | null>(null);
  const [pendingRole, setPendingRole] = useState<Role>("candidate");
  const [loggedIn, setLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [appReady, setAppReady] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [googleAuthUser, setGoogleAuthUser] = useState<any>(null);
  const [requirePasswordUpdate, setRequirePasswordUpdate] = useState(false);

  // Navigation
  const [screen, setScreen] = useState("home");
  const [publicView, setPublicView] = useState<PublicView>("landing");

  // Candidate-specific state
  const [palette, setPaletteState] = useState<PaletteKey>(() => (typeof window !== "undefined" && window.localStorage.getItem("astris_palette") as PaletteKey) || "azul");
  const [darkMode, setDarkModeState] = useState(() => typeof window !== "undefined" && window.localStorage.getItem("astris_dark") === "true");
  const [font, setFontState] = useState<FontKey>(() => (typeof window !== "undefined" && window.localStorage.getItem("astris_font") as FontKey) || "atkinson");

  const setPalette = (p: PaletteKey) => { setPaletteState(p); window.localStorage.setItem("astris_palette", p); };
  const setDarkMode = (d: boolean | ((prev: boolean) => boolean)) => {
    setDarkModeState((prev) => {
      const next = typeof d === "function" ? d(prev) : d;
      window.localStorage.setItem("astris_dark", String(next));
      return next;
    });
  };
  const setFont = (f: FontKey) => { setFontState(f); window.localStorage.setItem("astris_font", f); };

  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({});
  const [quizAxis, setQuizAxis] = useState(0);
  const [selectedVacancy, setSelectedVacancy] = useState("V-1042");
  const [selectedCandidate, setSelectedCandidate] = useState("CAND-A7X2");

  const fontFamily = font === "lexend" ? "'Lexend', Inter, sans-serif" : "'Atkinson Hyperlegible', Inter, sans-serif";

  // ── Dark mode — applied at root level so NavBar + entire page go dark ────────
  const darkRootStyle: Record<string, string> = darkMode ? {
    "--background": "#0D1824",
    "--foreground": "#E8EDF5",
    "--card": "#152030",
    "--popover": "#152030",
    "--primary": "#4B8EC8",
    "--primary-foreground": "#0D1824",
    "--secondary": "#1A2D42",
    "--secondary-foreground": "#E8EDF5",
    "--muted": "#152030",
    "--muted-foreground": "#7A9CC0",
    "--accent": "#3D9BC5",
    "--accent-foreground": "#0D1824",
    "--border": "rgba(255,255,255,0.1)",
    "--input-background": "#152030",
    "--card-foreground": "#E8EDF5",
  } : {};

  // ── Palette — scoped to <main> only so NavBar always uses the above dark vars ─
  const pal = PALETTES[palette];
  const palStyle: Record<string, string> = {
    "--background": darkMode ? "#1A1A2E" : pal.bg,
    "--foreground": darkMode ? "#F0EFEA" : pal.fg,
    "--card": darkMode ? "#252535" : pal.card,
    "--card-foreground": darkMode ? "#F0EFEA" : pal.fg,
    "--primary": pal.accent,
    "--primary-foreground": palette === "contraste" ? "#1A1A04" : "#fff",
    "--secondary": darkMode ? "#303045" : pal.border,
    "--secondary-foreground": darkMode ? "#F0EFEA" : pal.fg,
    "--border": darkMode ? "rgba(255,255,255,0.1)" : pal.border,
    "--muted": darkMode ? "#2A2A3E" : pal.bg,
    "--muted-foreground": darkMode ? "#A8A8C8" : "#6A6A66",
    "--accent": pal.accent,
    "--accent-foreground": palette === "contraste" ? "#1A1A04" : "#fff",
    "--input-background": darkMode ? "#1A1A2E" : pal.card,
  };

  // ── Restore Supabase session on mount ───────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          if ((user as any).needsRegistration) {
            setAuthMessage("No tienes cuenta, redireccionando a registro...");
            setAppReady(true);
            setTimeout(() => {
              setAuthMessage(null);
              setGoogleAuthUser(user);
              setPendingRole(user.role);
              setModalStep("register");
            }, 3000);
            return;
          }
          setRole(user.role);
          setLoggedIn(true);
          setModalStep("none");
          const first =
            user.role === "candidate"
              ? user.completedOnboarding ? "vacancies" : "onboarding"
              : user.role === "company" ? "org-profile" : "dashboard";
          setScreen(first);
        }
      } catch {
        // No active session
      } finally {
        setAppReady(true);
      }
    })();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setRequirePasswordUpdate(true);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleAnswer = (ai: number, qi: number, val: number | number[]) => {
    setQuizAnswers((prev) => ({ ...prev, [ai]: { ...(prev[ai] ?? {}), [qi]: val } }));
  };

  const handleLangSelect = (l: Lang) => {
    setLang(l);
    window.localStorage.setItem("astris_lang", l);
    setModalStep("none");
  };

  const handleCompleteGoogleRegistration = () => {
    if (googleAuthUser) {
      setRole(googleAuthUser.role);
      setLoggedIn(true);
      setModalStep("none");
      const first = googleAuthUser.role === "candidate" ? (googleAuthUser.completedOnboarding ? "vacancies" : "onboarding") : googleAuthUser.role === "company" ? "org-profile" : "dashboard";
      setScreen(first);
      setGoogleAuthUser(null);
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    if (email === "johansttivelinaresb@gmail.com") {
      setRole("admin");
      setLoggedIn(true);
      setModalStep("none");
      setScreen("dashboard");
      return;
    }

    setAuthLoading(true);
    setAuthError(null);
    try {
      await registerUser(email, password, name, pendingRole);
      setRole(pendingRole);
      setLoggedIn(true);
      setModalStep("none");
      setScreen(pendingRole === "candidate" ? "onboarding" : pendingRole === "company" ? "org-profile" : "dashboard");
    } catch (err: any) {
      setAuthError(err.message ?? "Registration failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (email?: string, password?: string) => {
    // Admin backdoor requested by user
    if (email === "johansttivelinaresb@gmail.com" && password === "Astris2026") {
      setRole("admin");
      setLoggedIn(true);
      setModalStep("none");
      setScreen("dashboard");
      return;
    }

    if (email && password) {
      setAuthLoading(true);
      setAuthError(null);
      try {
        await loginUser(email, password);
        const user = await getCurrentUser();
        const resolvedRole = user?.role ?? "candidate";
        setRole(resolvedRole);
        setLoggedIn(true);
        setModalStep("none");
        setScreen(resolvedRole === "candidate" ? "vacancies" : resolvedRole === "company" ? "candidates" : "dashboard");
      } catch (err: any) {
        setAuthError(err.message ?? "Login failed. Please check your credentials.");
      } finally {
        setAuthLoading(false);
      }
    } else {
      setRole("candidate");
      setLoggedIn(true);
      setModalStep("none");
      setScreen("vacancies");
    }
  };

  const handleLogout = async () => {
    try { await logoutUser(); } catch { /* ignore */ }
    setLoggedIn(false);
    setRole(null);
    setScreen("home");
    setPublicView("landing");
    setModalStep("none");
  };

  const handleNav = (s: string) => {
    if (s === "home") { setLoggedIn(false); setRole(null); setScreen("home"); return; }
    if (s === "tracking") { setScreen(role === "candidate" ? "post-hire" : "comp-post-hire"); return; }
    setScreen(s);
  };

  const reopenLang = () => setModalStep("language");

  const showModal = modalStep !== "none";

  if (!appReady) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden bg-background flex items-center justify-center" style={{ fontFamily }}>
        <div className="text-muted-foreground text-sm">...</div>
      </div>
    );
  }

  if (authMessage) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden bg-background flex items-center justify-center" style={{ fontFamily, ...(darkRootStyle as React.CSSProperties) }}>
        <div className="p-6 rounded-2xl border border-border flex items-center gap-4 shadow-lg" style={{ backgroundColor: "var(--card)" }}>
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }}></div>
          <p className="text-foreground font-medium">{authMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background text-foreground" style={{ fontFamily, ...(darkRootStyle as React.CSSProperties) }}>
      {/* Modals */}
      {showModal && modalStep === "language" && <LanguageModal onSelect={handleLangSelect} />}
      {showModal && modalStep === "register" && (
        <RegisterModal lang={lang} role={pendingRole} onRegister={handleRegister} onBack={() => setModalStep("none")} error={authError} loading={authLoading} googleAuthUser={googleAuthUser} onCompleteGoogle={handleCompleteGoogleRegistration} />
      )}
      {showModal && modalStep === "login" && (
        <LoginModal lang={lang} onLogin={(email, pass) => handleLogin(email, pass)} onBack={() => setModalStep("none")} error={authError} loading={authLoading} />
      )}
      {requirePasswordUpdate && (
        <UpdatePasswordModal lang={lang} onComplete={() => setRequirePasswordUpdate(false)} />
      )}

      {/* Main content */}
      {!showModal && (
        <>
          {!loggedIn && publicView === "about" && (
            <AboutPage lang={lang} onOpenAuth={(preRole, step) => {
              if (preRole) { setPendingRole(preRole); }
              setModalStep(step === "register" ? "register" : "login");
            }} onLang={reopenLang} onNavigate={setPublicView} />
          )}
          {!loggedIn && publicView === "support" && (
            <SupportPage lang={lang} onOpenAuth={(preRole, step) => {
              if (preRole) { setPendingRole(preRole); }
              setModalStep(step === "register" ? "register" : "login");
            }} onLang={reopenLang} onNavigate={setPublicView} />
          )}
          {!loggedIn && publicView === "partners" && (
            <PartnersPage lang={lang} onOpenAuth={(preRole, step) => {
              if (preRole) { setPendingRole(preRole); }
              setModalStep(step === "register" ? "register" : "login");
            }} onLang={reopenLang} onNavigate={setPublicView} />
          )}
          {!loggedIn && publicView === "landing" && (
            <LandingPage lang={lang} onOpenAuth={(preRole, step) => {
              if (preRole) { setPendingRole(preRole); }
              setModalStep(step === "register" ? "register" : "login");
            }} onLang={reopenLang} onNavigate={setPublicView} />
          )}
          {loggedIn && role && (
            <div>
              <NavBar lang={lang} role={role} screen={screen} onNav={handleNav} onLang={reopenLang} onLogout={handleLogout} darkMode={darkMode} onDarkToggle={() => setDarkMode((d) => !d)} />
              <main style={palStyle as React.CSSProperties}>
                {/* Candidate flow */}
                {role === "candidate" && screen === "onboarding" && (
                  <CandidateOnboarding lang={lang} palette={palette} darkMode={darkMode} font={font} onPalette={setPalette} onDark={setDarkMode} onFont={setFont} onContinue={() => { setQuizAxis(0); setScreen("quiz"); }} />
                )}
                {role === "candidate" && screen === "quiz" && (
                  <CandidateQuiz lang={lang} axisIndex={quizAxis} answers={quizAnswers} onAnswer={handleAnswer}
                    onPrev={() => quizAxis > 0 ? setQuizAxis((a) => a - 1) : setScreen("onboarding")}
                    onNext={async () => {
                      if (quizAxis < QUIZ_AXES.length - 1) {
                        setQuizAxis((a) => a + 1);
                      } else {
                        const user = await getCurrentUser();
                        if (user?.id) {
                          await saveCandidateProfile(user.id, quizAnswers, palette, font);
                        }
                        setScreen("profile");
                      }
                    }} />
                )}
                {role === "candidate" && screen === "profile" && (
                  <CandidateProfile lang={lang} answers={quizAnswers} />
                )}
                {role === "candidate" && screen === "vacancies" && (
                  <CandidateVacancies lang={lang} onSelect={(id) => { setSelectedVacancy(id); setScreen("vacancy-detail"); }} />
                )}
                {role === "candidate" && screen === "vacancy-detail" && (
                  <VacancyDetail lang={lang} vacancyId={selectedVacancy} onBack={() => setScreen("vacancies")} onStart={() => setScreen("mentor-select")} />
                )}
                {role === "candidate" && screen === "mentor-select" && (
                  <MentorSelect lang={lang} onSelect={() => setScreen("accompaniment")} />
                )}
                {role === "candidate" && screen === "accompaniment" && <CandidateAccompaniment lang={lang} />}
                {role === "candidate" && (screen === "post-hire" || screen === "tracking") && <CandidatePostHire lang={lang} />}

                {/* Company flow */}
                {role === "company" && screen === "org-profile" && <CompanyOrgProfile lang={lang} />}
                {role === "company" && screen === "post-vacancy" && <CompanyPostVacancy lang={lang} />}
                {role === "company" && screen === "candidates" && (
                  <CompanyCandidates lang={lang} onSelect={(id) => { setSelectedCandidate(id); setScreen("candidate-detail"); }} />
                )}
                {role === "company" && screen === "candidate-detail" && (
                  <CompanyCandidateDetail lang={lang} candidateId={selectedCandidate} onBack={() => setScreen("candidates")} onStart={() => setScreen("comp-post-hire")} />
                )}
                {role === "company" && (screen === "comp-post-hire" || screen === "post-hire") && <CompanyPostHire lang={lang} />}

                {/* Mentor flow */}
                {role === "mentor" && screen === "dashboard" && <MentorDashboard lang={lang} />}
                {role === "mentor" && screen === "checkins" && <MentorCheckins lang={lang} />}
                {role === "mentor" && screen === "companies" && <MentorCompanies lang={lang} />}
                {role === "mentor" && !["dashboard", "checkins", "companies"].includes(screen) && <MentorDashboard lang={lang} />}

                {/* Admin flow */}
                {role === "admin" && screen === "dashboard" && (
                  <AdminDashboard onLogout={handleLogout} onBack={() => setScreen("landing")} />
                )}
                {role === "admin" && <AdminPanel lang={lang} screen={screen} />}

                {/* Shared Settings Screen */}
                {screen === "settings" && (
                  <SettingsPage 
                    lang={lang} 
                    palette={palette} 
                    darkMode={darkMode} 
                    font={font} 
                    onPalette={setPalette} 
                    onDark={setDarkMode} 
                    onFont={setFont} 
                    onLogout={handleLogout}
                  />
                )}
              </main>
            </div>
          )}
        </>
      )}
    </div>
  );
}
