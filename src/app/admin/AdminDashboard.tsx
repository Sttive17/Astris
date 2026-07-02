import React, { useEffect, useState } from "react";
import { LayoutDashboard, Users, Briefcase, FileText, LogOut, Loader2, Shield, Building2 } from "lucide-react";
import { getCurrentUser } from "../../lib/supabase";
import { getDashboardStats, getAdminUsers, softDeleteUser, updateUserRole } from "../../lib/supabase-admin";

import CompaniesView from "./views/CompaniesView";
import CandidatesView from "./views/CandidatesView";
import OverviewView from "./views/OverviewView";
import UsersView from "./views/UsersView";
import JobsView from "./views/JobsView";

type ViewType = "overview" | "users" | "jobs" | "companies" | "candidates";

interface AdminDashboardProps {
  onLogout: () => void;
  onBack: () => void;
}

export default function AdminDashboard({ onLogout, onBack }: AdminDashboardProps) {
  interface CurrentUser {
    id: string;
    role: string;
    name?: string;
  }

  interface UserProfile {
    id: string;
    full_name: string;
    email: string;
    role: string;
    completed_onboarding: boolean;
    deleted_at: string | null;
  }

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<ViewType>("overview");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // Stats
  const [stats, setStats] = useState({ totalUsers: 0, totalCandidates: 0, totalCompanies: 0, totalJobs: 0 });
  
  // Users
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    async function init() {
      try {
        let user = await getCurrentUser();
        // Allow backdoor login without real supabase session
        if (!user) {
          user = { id: "00000000-0000-0000-0000-000000000000", role: "admin", name: "Administrador (Backdoor)" };
        }
        
        if (user.role !== "admin") {
          onBack(); // Kick out non-admins
          return;
        }
        setCurrentUser(user);
        
        // Load initial data
        const [dashStats, allUsers] = await Promise.all([
          getDashboardStats(),
          getAdminUsers()
        ]);
        setStats(dashStats);
        setUsers(allUsers);
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [onBack]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!currentUser) return;
    try {
      await updateUserRole(currentUser.id, userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert("Error updating role");
    }
  };

  const handleSoftDelete = async (userId: string, isDeleted: boolean) => {
    if (!currentUser) return;
    try {
      await softDeleteUser(currentUser.id, userId, isDeleted);
      setUsers(users.map(u => u.id === userId ? { ...u, deleted_at: isDeleted ? new Date().toISOString() : null } : u));
    } catch (err) {
      alert("Error updating status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Validando permisos administrativos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <p className="text-destructive font-medium">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col hidden md:flex shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Shield className="w-5 h-5 text-primary mr-2" />
          <span className="font-bold text-lg text-foreground tracking-tight">Astris Admin</span>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-1">
          <button onClick={() => setView("overview")} className={"w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors " + (view === "overview" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted")}>
            <LayoutDashboard className="w-4 h-4 mr-3" /> Dashboard
          </button>
          <button onClick={() => setView("users")} className={"w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors " + (view === "users" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted")}>
            <Users className="w-4 h-4 mr-3" /> Usuarios & Perfiles
          </button>
          <button onClick={() => setView("companies")} className={"w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors " + (view === "companies" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted")}>
            <Building2 className="w-4 h-4 mr-3" /> Empresas
          </button>
          <button onClick={() => setView("candidates")} className={"w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors " + (view === "candidates" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted")}>
            <FileText className="w-4 h-4 mr-3" /> Candidatos
          </button>
          <button onClick={() => setView("jobs")} className={"w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors " + (view === "jobs" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted")}>
            <Briefcase className="w-4 h-4 mr-3" /> Vacantes
          </button>
        </nav>
        <div className="p-4 border-t border-border">
          <button onClick={onLogout} className="w-full flex items-center justify-center px-4 py-2 bg-destructive/10 text-destructive rounded-lg text-sm font-semibold hover:bg-destructive/20 transition-colors">
            <LogOut className="w-4 h-4 mr-2" /> Salir
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
          <div className="font-semibold text-foreground md:hidden">Astris Admin</div>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              {currentUser?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium hidden sm:block">{currentUser?.name}</span>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6 lg:p-10">
          {view === "overview" && <OverviewView stats={stats} />}
          {view === "users" && <UsersView users={users} onRoleChange={handleRoleChange} onSoftDelete={handleSoftDelete} />}
          {view === "companies" && <CompaniesView />}
          {view === "candidates" && <CandidatesView />}
          {view === "jobs" && <JobsView />}
        </div>
      </main>
    </div>
  );
}
