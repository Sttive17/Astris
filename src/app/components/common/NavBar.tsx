import {
  BarChart2, Briefcase, Users, Activity, Building2, FileText, Calendar, Star, Sun, Moon, Globe, LogOut, Settings, User
} from "lucide-react";
import { Lang, Role } from "../../types";
import { useT } from "../../i18n/useT";
import astrisImg from "../../../imports/astris.png";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

export function NavBar({ lang, role, screen, onNav, onLang, onLogout, darkMode, onDarkToggle, userName, userAvatar }: {
  lang: Lang; role: Role; screen: string;
  onNav: (s: string) => void; onLang: () => void; onLogout: () => void;
  darkMode: boolean; onDarkToggle: () => void;
  userName?: string; userAvatar?: string;
}) {
  const t = useT(lang);
  const CANDIDATE_NAV = [
    { id: "profile", label: t("nav.profile"), Icon: BarChart2 },
    { id: "vacancies", label: t("nav.vacancies"), Icon: Briefcase },
    { id: "mentor-select", label: t("nav.mentor"), Icon: Users },
    { id: "tracking", label: t("nav.tracking"), Icon: Activity },
  ];
  const COMPANY_NAV = [
    { id: "org-profile", label: t("nav.org"), Icon: Building2 },
    { id: "post-vacancy", label: t("nav.post"), Icon: FileText },
    { id: "candidates", label: t("nav.candidates"), Icon: Users },
    { id: "post-hire", label: t("nav.tracking"), Icon: Activity },
  ];
  const MENTOR_NAV = [
    { id: "dashboard", label: t("nav.dashboard"), Icon: BarChart2 },
    { id: "checkins", label: t("nav.checkins"), Icon: Calendar },
    { id: "companies", label: t("nav.companies"), Icon: Building2 },
  ];
  const ADMIN_NAV = [
    { id: "dashboard", label: "Dashboard", Icon: BarChart2 },
    { id: "companies", label: "Empresas", Icon: Building2 },
    { id: "candidates", label: "Candidatos", Icon: Users },
    { id: "mentors", label: "Mentores", Icon: Star },
    { id: "mentorships", label: "Mentorías", Icon: Briefcase },
    { id: "activity", label: "Actividad", Icon: Activity },
  ];
  const navItems = role === "candidate" ? CANDIDATE_NAV : role === "company" ? COMPANY_NAV : role === "mentor" ? MENTOR_NAV : ADMIN_NAV;
  const ROLE_LABELS: Record<Role, string> = { candidate: t("role.candidate"), company: t("role.company"), mentor: t("role.mentor"), admin: t("role.admin") };

  const darkLabel = darkMode
    ? (lang === "es" ? "Modo claro" : lang === "pt" ? "Modo claro" : lang === "fr" ? "Mode clair" : "Light mode")
    : (lang === "es" ? "Modo oscuro" : lang === "pt" ? "Modo escuro" : lang === "fr" ? "Mode sombre" : "Dark mode");

  return (
    <header className="sticky top-0 z-40 border-b border-border" style={{ backgroundColor: "var(--background)" }}>
      <div className="px-4 md:px-8 h-16 flex items-center gap-2">
        <button onClick={() => onNav("home")} className="flex items-center gap-2 text-lg font-bold text-foreground tracking-tight mr-6 cursor-pointer">
          <img src={astrisImg} alt="Astris Logo" className="w-10 h-10 object-contain" />
          <span>Astris</span>
        </button>

        {navItems.map((item) => {
          const active = screen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
              style={{ backgroundColor: active ? "var(--secondary)" : "transparent", color: active ? "var(--foreground)" : "var(--muted-foreground)" }}
              aria-current={active ? "page" : undefined}
            >
              <item.Icon size={14} aria-hidden="true" />{item.label}
            </button>
          );
        })}

        <div className="ml-auto flex items-center gap-2">
          {/* ── Dark / Light mode toggle ── */}
          <button
            onClick={onDarkToggle}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold cursor-pointer border-2"
            style={{
              borderColor: darkMode ? "rgba(245,196,66,0.55)" : "var(--border)",
              backgroundColor: darkMode ? "rgba(245,196,66,0.12)" : "var(--card)",
              color: darkMode ? "#F5C442" : "var(--muted-foreground)",
            }}
            aria-label={darkLabel}
            title={darkLabel}
          >
            {darkMode
              ? <Sun size={15} aria-hidden="true" />
              : <Moon size={15} aria-hidden="true" />
            }
            <span className="hidden sm:inline">{darkLabel}</span>
          </button>

          {/* Language */}
          <button
            onClick={onLang}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-muted-foreground cursor-pointer border border-border"
            style={{ backgroundColor: "var(--background)" }}
          >
            <Globe size={14} aria-hidden="true" />{lang.toUpperCase()}
          </button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border cursor-pointer transition-colors hover:bg-secondary" style={{ backgroundColor: "var(--card)" }}>
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <User size={15} aria-hidden="true" style={{ color: "var(--primary)" }} />
                )}
                <span className="text-xs font-semibold text-foreground hidden sm:inline max-w-[120px] truncate" title={userName || ROLE_LABELS[role]}>
                  {userName || ROLE_LABELS[role]}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-1" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}>
              <DropdownMenuLabel>{lang === "es" ? "Mi Cuenta" : "My Account"}</DropdownMenuLabel>
              <DropdownMenuSeparator style={{ backgroundColor: "var(--border)" }} />
              
              <DropdownMenuItem className="cursor-pointer" onClick={() => onNav("settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>{lang === "es" ? "Configuración" : "Settings"}</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator style={{ backgroundColor: "var(--border)" }} />
              <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10" onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("nav.logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
