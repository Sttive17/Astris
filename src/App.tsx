import { useState, lazy, Suspense } from "react";
import { Lang, ModalStep, QuizAnswers, PublicView } from "@/types";
import { getInitialLang, getInitialModalStep } from "@/i18n/useT";
import { QUIZ_AXES } from "@/i18n/content";
import { saveCandidateProfile, getCurrentUser } from "@/services/supabase";
import { useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCanGoBack } from "@/hooks/useCanGoBack";


import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";

// Components
import { NavBar } from "@/components/common/NavBar";
import { LanguageModal } from "@/components/modals/LanguageModal";
import { LoginModal } from "@/components/modals/LoginModal";
import { RegisterModal } from "@/components/modals/RegisterModal";
import { UpdatePasswordModal } from "@/components/modals/UpdatePasswordModal";

// Lazy Loaded Pages
const LandingPage = lazy(() => import("@/pages/public/LandingPage").then(m => ({ default: m.LandingPage })));
const AboutPage = lazy(() => import("@/pages/public/AboutPage").then(m => ({ default: m.AboutPage })));
const SupportPage = lazy(() => import("@/pages/public/SupportPage").then(m => ({ default: m.SupportPage })));
const PartnersPage = lazy(() => import("@/pages/public/PartnersPage").then(m => ({ default: m.PartnersPage })));
const CandidateOnboarding = lazy(() => import("@/pages/candidate/CandidateOnboarding").then(m => ({ default: m.CandidateOnboarding })));
const CandidateQuiz = lazy(() => import("@/pages/candidate/CandidateQuiz").then(m => ({ default: m.CandidateQuiz })));
const CandidateProfile = lazy(() => import("@/pages/candidate/CandidateProfile").then(m => ({ default: m.CandidateProfile })));
const CandidateVacancies = lazy(() => import("@/pages/candidate/CandidateVacancies").then(m => ({ default: m.CandidateVacancies })));
const VacancyDetail = lazy(() => import("@/pages/candidate/VacancyDetail").then(m => ({ default: m.VacancyDetail })));
const MentorSelect = lazy(() => import("@/pages/candidate/MentorSelect").then(m => ({ default: m.MentorSelect })));
const CandidateAccompaniment = lazy(() => import("@/pages/candidate/CandidateAccompaniment").then(m => ({ default: m.CandidateAccompaniment })));
const CandidatePostHire = lazy(() => import("@/pages/candidate/CandidatePostHire").then(m => ({ default: m.CandidatePostHire })));
const SettingsPage = lazy(() => import("@/pages/shared/SettingsPage").then(m => ({ default: m.SettingsPage })));
const NotFoundPage = lazy(() => import("@/pages/shared/NotFoundPage").then(m => ({ default: m.NotFoundPage })));
const CompanyOrgProfile = lazy(() => import("@/pages/company/CompanyOrgProfile").then(m => ({ default: m.CompanyOrgProfile })));
const CompanyPostVacancy = lazy(() => import("@/pages/company/CompanyPostVacancy").then(m => ({ default: m.CompanyPostVacancy })));
const CompanyCandidates = lazy(() => import("@/pages/company/CompanyCandidates").then(m => ({ default: m.CompanyCandidates })));
const CompanyCandidateDetail = lazy(() => import("@/pages/company/CompanyCandidateDetail").then(m => ({ default: m.CompanyCandidateDetail })));
const CompanyPostHire = lazy(() => import("@/pages/company/CompanyPostHire").then(m => ({ default: m.CompanyPostHire })));
const MentorDashboard = lazy(() => import("@/pages/mentor/MentorDashboard").then(m => ({ default: m.MentorDashboard })));
const MentorCheckins = lazy(() => import("@/pages/mentor/MentorCheckins").then(m => ({ default: m.MentorCheckins })));
const MentorCompanies = lazy(() => import("@/pages/mentor/MentorCompanies").then(m => ({ default: m.MentorCompanies })));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));

export default function App() {
  const { i18n } = useTranslation();
  const [modalStep, setModalStep] = useState<ModalStep>(() => getInitialModalStep());
  const [lang, setLang] = useState<Lang>(() => {
    const init = getInitialLang();
    i18n.changeLanguage(init);
    return init;
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();

  const screen = searchParams.get("screen") || "home";
  const publicView = (searchParams.get("view") || "landing") as PublicView;

  const setScreen = (s: string) => {
    setSearchParams(prev => { prev.set("screen", s); return prev; });
  };
  const setPublicView = (v: PublicView) => {
    setSearchParams(prev => { prev.set("view", v); return prev; });
  };


  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({});
  const [quizAxis, setQuizAxis] = useState(0);
  const [selectedVacancy, setSelectedVacancy] = useState("V-1042");
  const [selectedCandidate, setSelectedCandidate] = useState("CAND-A7X2");

  const {
    palette, darkMode, font, fontFamily, darkRootStyle, palStyle,
    setPalette, setDarkMode, setFont
  } = useTheme();

  const {
    role, pendingRole, loggedIn, authLoading, authError, appReady, authMessage,
    googleAuthUser, requirePasswordUpdate, userName, userAvatar, userVocation,
    setPendingRole, setRequirePasswordUpdate, handleCompleteGoogleRegistration,
    handleRegister, handleLogin, handleLogout
  } = useAuth(setScreen, setModalStep);

  const handleAnswer = (ai: number, qi: number, val: number | number[]) => {
    setQuizAnswers((prev) => ({ ...prev, [ai]: { ...(prev[ai] ?? {}), [qi]: val } }));
  };

  const handleLangSelect = (l: Lang) => {
    setLang(l);
    i18n.changeLanguage(l);
    window.localStorage.setItem("astris_lang", l);
    setModalStep("none");
  };

  const handleNav = (s: string) => {
    if (s === "home") {
      if (loggedIn && role) {
        const first = role === "candidate" ? "profile" : role === "company" ? "candidates" : "dashboard";
        setScreen(first);
      } else {
        setScreen("home");
      }
      return;
    }
    if (s === "tracking") { setScreen(role === "candidate" ? "post-hire" : "comp-post-hire"); return; }
    setScreen(s);
  };

  const handleBackTo = (fallbackScreen: string) => {
    if (canGoBack) {
      navigate(-1);
    } else {
      setScreen(fallbackScreen);
    }
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
      {showModal && modalStep === "language" && <LanguageModal onSelect={handleLangSelect} />}
      {showModal && modalStep === "register" && (
        <RegisterModal lang={lang} role={pendingRole} onRegister={handleRegister} onBack={() => setModalStep("none")} error={authError} loading={authLoading} googleAuthUser={googleAuthUser} onCompleteGoogle={handleCompleteGoogleRegistration} />
      )}
      {showModal && modalStep === "login" && (
        <LoginModal lang={lang} onLogin={handleLogin} onBack={() => setModalStep("none")} error={authError} loading={authLoading} />
      )}
      {requirePasswordUpdate && (
        <UpdatePasswordModal lang={lang} onComplete={() => setRequirePasswordUpdate(false)} />
      )}

      {!showModal && (
        <Suspense fallback={
          <div className="flex h-screen w-full items-center justify-center bg-background text-foreground" style={palStyle as React.CSSProperties}>
            <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }}></div>
          </div>
        }>
          {!loggedIn && publicView === "about" && (
            <AboutPage lang={lang} onOpenAuth={(preRole, step) => { setPendingRole(preRole ?? null); setModalStep(step === "register" ? "register" : "login"); }} onLang={reopenLang} onNavigate={setPublicView} darkMode={darkMode} onDarkToggle={() => setDarkMode((d) => !d)} font={font} onFontToggle={() => setFont(font === "lexend" ? "inter" : "lexend")} />
          )}
          {!loggedIn && publicView === "support" && (
            <SupportPage lang={lang} onOpenAuth={(preRole, step) => { setPendingRole(preRole ?? null); setModalStep(step === "register" ? "register" : "login"); }} onLang={reopenLang} onNavigate={setPublicView} darkMode={darkMode} onDarkToggle={() => setDarkMode((d) => !d)} font={font} onFontToggle={() => setFont(font === "lexend" ? "inter" : "lexend")} />
          )}
          {!loggedIn && publicView === "partners" && (
            <PartnersPage lang={lang} onOpenAuth={(preRole, step) => { setPendingRole(preRole ?? null); setModalStep(step === "register" ? "register" : "login"); }} onLang={reopenLang} onNavigate={setPublicView} darkMode={darkMode} onDarkToggle={() => setDarkMode((d) => !d)} font={font} onFontToggle={() => setFont(font === "lexend" ? "inter" : "lexend")} />
          )}
          {!loggedIn && publicView === "landing" && (
            <LandingPage lang={lang} onOpenAuth={(preRole, step) => { setPendingRole(preRole ?? null); setModalStep(step === "register" ? "register" : "login"); }} onLang={reopenLang} onNavigate={setPublicView} darkMode={darkMode} onDarkToggle={() => setDarkMode((d) => !d)} font={font} onFontToggle={() => setFont(font === "lexend" ? "inter" : "lexend")} />
          )}
          {!loggedIn && !["about", "support", "partners", "landing"].includes(publicView) && (
            <NotFoundPage lang={lang} onGoHome={() => setPublicView("landing")} />
          )}
          {loggedIn && role && (
            <div>
              <NavBar lang={lang} role={role} screen={screen} onNav={handleNav} onLang={reopenLang} onLogout={() => handleLogout(setPublicView)} darkMode={darkMode} onDarkToggle={() => setDarkMode((d) => !d)} font={font} onFontToggle={() => setFont(font === "lexend" ? "inter" : "lexend")} userName={userName} userAvatar={userAvatar} />
              <main style={palStyle as React.CSSProperties}>
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
                {role === "candidate" && screen === "profile" && <CandidateProfile lang={lang} answers={quizAnswers} vocation={userVocation} userName={userName} userAvatar={userAvatar} />}
                {role === "candidate" && screen === "vacancies" && <CandidateVacancies lang={lang} onSelect={(id) => { setSelectedVacancy(id); setScreen("vacancy-detail"); }} />}
                {role === "candidate" && screen === "vacancy-detail" && <VacancyDetail lang={lang} vacancyId={selectedVacancy} onBack={() => handleBackTo("vacancies")} onStart={() => setScreen("mentor-select")} />}
                {role === "candidate" && screen === "mentor-select" && <MentorSelect lang={lang} onSelect={() => setScreen("accompaniment")} />}
                {role === "candidate" && screen === "accompaniment" && <CandidateAccompaniment lang={lang} />}
                {role === "candidate" && (screen === "post-hire" || screen === "tracking") && <CandidatePostHire lang={lang} />}

                {role === "company" && screen === "org-profile" && <CompanyOrgProfile lang={lang} />}
                {role === "company" && screen === "post-vacancy" && <CompanyPostVacancy lang={lang} />}
                {role === "company" && screen === "candidates" && <CompanyCandidates lang={lang} onSelect={(id) => { setSelectedCandidate(id); setScreen("candidate-detail"); }} />}
                {role === "company" && screen === "candidate-detail" && <CompanyCandidateDetail lang={lang} candidateId={selectedCandidate} onBack={() => handleBackTo("candidates")} onStart={() => setScreen("comp-post-hire")} />}
                {role === "company" && (screen === "comp-post-hire" || screen === "post-hire") && <CompanyPostHire lang={lang} />}

                {role === "mentor" && screen === "dashboard" && <MentorDashboard lang={lang} />}
                {role === "mentor" && screen === "checkins" && <MentorCheckins lang={lang} />}
                {role === "mentor" && screen === "companies" && <MentorCompanies lang={lang} />}
                {role === "mentor" && !["dashboard", "checkins", "companies"].includes(screen) && <MentorDashboard lang={lang} />}

                {role === "admin" && <AdminDashboard onLogout={() => handleLogout(setPublicView)} onBack={() => handleBackTo("home")} />}

                {screen === "settings" && <SettingsPage lang={lang} palette={palette} darkMode={darkMode} font={font} onPalette={setPalette} onDark={setDarkMode} onFont={setFont} onLogout={() => handleLogout(setPublicView)} />}
                
                {screen !== "settings" && 
                 !(role === "candidate" && ["onboarding", "quiz", "profile", "vacancies", "vacancy-detail", "mentor-select", "accompaniment", "post-hire", "tracking"].includes(screen)) &&
                 !(role === "company" && ["org-profile", "post-vacancy", "candidates", "candidate-detail", "comp-post-hire", "post-hire"].includes(screen)) &&
                 !(role === "mentor" && ["dashboard", "checkins", "companies"].includes(screen)) &&
                 !(role === "admin" && ["dashboard", "companies", "candidates", "mentors", "mentorships", "activity"].includes(screen)) && (
                  <NotFoundPage lang={lang} onGoHome={() => handleNav("home")} />
                )}
              </main>
            </div>
          )}
        </Suspense>
      )}
    </div>
  );
}
