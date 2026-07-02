import React, { useEffect, useState } from "react";
import { LayoutDashboard, Users, Briefcase, FileText, LogOut, Loader2, Shield, Search, MoreVertical, Ban, Trash2, RotateCcw } from "lucide-react";
import { getCurrentUser } from "../../lib/supabase";
import CompaniesView from "./views/CompaniesView";
import CandidatesView from "./views/CandidatesView";
import { getDashboardStats, getAdminUsers, softDeleteUser, updateUserRole } from "../../lib/supabase-admin";

type ViewType = "overview" | "users" | "jobs" | "companies" | "candidates";

export default function AdminDashboard({ onLogout, onBack }: { onLogout: () => void, onBack: () => void }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<ViewType>("overview");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Stats
  const [stats, setStats] = useState({ totalUsers: 0, totalCandidates: 0, totalCompanies: 0, totalJobs: 0 });
  
  // Users
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

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
    try {
      await updateUserRole(currentUser.id, userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert("Error updating role");
    }
  };

  const handleSoftDelete = async (userId: string, isDeleted: boolean) => {
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
          <button onClick={() => setView("jobs")} className={"w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors " + (view === "jobs" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted")}>
            <Briefcase className="w-4 h-4 mr-3" /> Vacantes
          </button>
        
          <button onClick={() => setView("companies")} className={"w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors " + (view === "companies" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted")}>
            <Building2 className="w-4 h-4 mr-3" /> Empresas
          </button>
          <button onClick={() => setView("candidates")} className={"w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors " + (view === "candidates" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted")}>
            <FileText className="w-4 h-4 mr-3" /> Candidatos
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
          
          {view === "overview" && (
            <div className="space-y-6 anim-fade-in">
              <h1 className="text-3xl font-bold text-foreground">Dashboard General</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Usuarios", val: stats.totalUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
                  { label: "Candidatos", val: stats.totalCandidates, icon: FileText, color: "text-green-500", bg: "bg-green-500/10" },
                  { label: "Empresas", val: stats.totalCompanies, icon: Building2, color: "text-purple-500", bg: "bg-purple-500/10" },
                  { label: "Vacantes", val: stats.totalJobs, icon: Briefcase, color: "text-orange-500", bg: "bg-orange-500/10" }
                ].map((s, i) => (
                  <div key={i} className={"p-6 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-4 "}>
                    <div className={"w-12 h-12 rounded-xl flex items-center justify-center " + s.bg + " " + s.color}>
                      <s.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">{s.label}</div>
                      <div className="text-2xl font-bold text-foreground">{s.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === "users" && (
            <div className="space-y-6 anim-fade-in flex flex-col h-full">
              <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Buscar por email o nombre..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-card text-sm"
                  />
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl overflow-hidden flex-1 flex flex-col shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                      <tr>
                        <th className="px-6 py-4">Usuario</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Rol</th>
                        <th className="px-6 py-4">Onboarding</th>
                        <th className="px-6 py-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {users.filter(u => u.full_name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())).map(u => (
                        <tr key={u.id} className={"hover:bg-muted/30 transition-colors " + (u.deleted_at ? "opacity-50" : "")}>
                          <td className="px-6 py-4 font-medium flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                              {u.full_name.charAt(0)}
                            </div>
                            {u.full_name}
                            {u.deleted_at && <span className="text-[10px] bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-bold">DELETED</span>}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">{u.email}</td>
                          <td className="px-6 py-4">
                            <select 
                              value={u.role} 
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              className="bg-background border border-border rounded-lg px-2 py-1 text-xs font-semibold cursor-pointer"
                            >
                              <option value="candidate">Candidato</option>
                              <option value="company">Empresa</option>
                              <option value="mentor">Mentor</option>
                              <option value="admin">Administrador</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            {u.completed_onboarding 
                              ? <span className="text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-1 rounded-full text-xs font-bold">Completado</span>
                              : <span className="text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 px-2.5 py-1 rounded-full text-xs font-bold">Pendiente</span>
                            }
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => handleSoftDelete(u.id, !u.deleted_at)}
                              className={"p-2 rounded-lg transition-colors " + (u.deleted_at ? "hover:bg-blue-500/10 text-blue-500" : "hover:bg-destructive/10 text-destructive")}
                              title={u.deleted_at ? "Restaurar usuario" : "Eliminar usuario (Soft Delete)"}
                            >
                              {u.deleted_at ? <RotateCcw className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          
          {view === "companies" && <CompaniesView />}
          {view === "candidates" && <CandidatesView />}

          {view === "jobs" && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-muted-foreground anim-fade-in">
              <Briefcase className="w-12 h-12 opacity-20" />
              <h2 className="text-xl font-bold">Gestión de Vacantes</h2>
              <p>El módulo avanzado de vacantes estará disponible en la Fase 2.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
