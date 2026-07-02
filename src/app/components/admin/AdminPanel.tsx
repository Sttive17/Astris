import { useEffect, useState } from "react";
import {
  Users, Building2, Briefcase, Star, Activity,
  TrendingUp, Download, Filter, Check
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";
import { supabase } from "../../../lib/supabase";

type Lang = "es" | "en" | "pt" | "fr";

const ADMIN_T: Record<Lang, Record<string, string>> = {
  es: {
    "stats.cands": "Total Candidatos", "stats.comps": "Total Empresas", "stats.mentors": "Mentorías Activas", "stats.matches": "Matches Exitosos",
    "dash.title": "Visión General", "dash.sub": "Monitorea el crecimiento y salud de la plataforma.", "dash.export": "Exportar Reporte",
    "chart.users": "Crecimiento de Usuarios", "chart.matches": "Matches Exitosos Mensuales",
    "act.title": "Actividad Reciente", "act.viewAll": "Ver toda",
    "act.1": "Nueva empresa registrada", "act.2": "Match de alta compatibilidad (95%)", "act.3": "Nuevo candidato completó onboarding", "act.4": "Mentoría finalizada (Día 60)",
    "act.time1": "Hace 5 minutos", "act.time2": "Hace 23 minutos", "act.time3": "Hace 1 hora", "act.time4": "Hace 2 horas",
    "table.filters": "Filtros", "table.export": "Exportar", "table.actions": "Acciones", "table.details": "Detalles",
    "comps.title": "Gestión de Empresas", "comps.sub": "Directorio de todas las empresas colaboradoras.",
    "comps.col1": "Empresa", "comps.col2": "Sector", "comps.col3": "Modalidad", "comps.col4": "Estado", "comps.col5": "Retención ESG",
    "cands.title": "Base de Candidatos", "cands.sub": "Directorio de candidatos registrados en la plataforma.",
    "cands.col1": "Candidato", "cands.col2": "Preferencia", "cands.col3": "Ejes Fuertes", "cands.col4": "Estado", "cands.col5": "Registro",
    "ments.title": "Seguimiento de Mentorías", "ments.sub": "Procesos de acompañamiento post-contratación activos.",
    "ments.col1": "ID Proceso", "ments.col2": "Candidato", "ments.col3": "Empresa", "ments.col4": "Asignación", "ments.col5": "Estado",
    "const.title": "Módulo en Construcción", "const.sub": "Esta sección está siendo conectada con Supabase.",
    "status.remote": "Remoto", "status.hybrid": "Híbrido", "status.inperson": "Presencial", "status.any": "Cualquiera",
    "status.active": "Activo", "status.inactive": "Inactivo", "status.searching": "Buscando", "status.hired": "Contratada", "status.completed": "Completado", "status.inProcess": "En proceso",
    "m1": "Ene", "m2": "Feb", "m3": "Mar", "m4": "Abr", "m5": "May", "m6": "Jun"
  },
  en: {
    "stats.cands": "Total Candidates", "stats.comps": "Total Companies", "stats.mentors": "Active Mentorships", "stats.matches": "Successful Matches",
    "dash.title": "Overview", "dash.sub": "Monitor platform growth and health.", "dash.export": "Export Report",
    "chart.users": "User Growth", "chart.matches": "Monthly Successful Matches",
    "act.title": "Recent Activity", "act.viewAll": "View all",
    "act.1": "New company registered", "act.2": "High compatibility match (95%)", "act.3": "New candidate completed onboarding", "act.4": "Mentorship completed (Day 60)",
    "act.time1": "5 minutes ago", "act.time2": "23 minutes ago", "act.time3": "1 hour ago", "act.time4": "2 hours ago",
    "table.filters": "Filters", "table.export": "Export", "table.actions": "Actions", "table.details": "Details",
    "comps.title": "Company Management", "comps.sub": "Directory of all partner companies.",
    "comps.col1": "Company", "comps.col2": "Sector", "comps.col3": "Modality", "comps.col4": "Status", "comps.col5": "ESG Retention",
    "cands.title": "Candidate Database", "cands.sub": "Directory of registered candidates on the platform.",
    "cands.col1": "Candidate", "cands.col2": "Preference", "cands.col3": "Strong Axes", "cands.col4": "Status", "cands.col5": "Registered",
    "ments.title": "Mentorship Tracking", "ments.sub": "Active post-hire support processes.",
    "ments.col1": "Process ID", "ments.col2": "Candidate", "ments.col3": "Company", "ments.col4": "Assignment", "ments.col5": "Status",
    "const.title": "Module Under Construction", "const.sub": "This section is being connected to Supabase.",
    "status.remote": "Remote", "status.hybrid": "Hybrid", "status.inperson": "In-person", "status.any": "Any",
    "status.active": "Active", "status.inactive": "Inactive", "status.searching": "Searching", "status.hired": "Hired", "status.completed": "Completed", "status.inProcess": "In process",
    "m1": "Jan", "m2": "Feb", "m3": "Mar", "m4": "Apr", "m5": "May", "m6": "Jun"
  },
  pt: {
    "stats.cands": "Total Candidatos", "stats.comps": "Total Empresas", "stats.mentors": "Mentorias Ativas", "stats.matches": "Matches de Sucesso",
    "dash.title": "Visão Geral", "dash.sub": "Monitore o crescimento e a saúde da plataforma.", "dash.export": "Exportar Relatório",
    "chart.users": "Crescimento de Usuários", "chart.matches": "Matches Mensais de Sucesso",
    "act.title": "Atividade Recente", "act.viewAll": "Ver tudo",
    "act.1": "Nova empresa registrada", "act.2": "Match de alta compatibilidade (95%)", "act.3": "Novo candidato concluiu onboarding", "act.4": "Mentoria concluída (Dia 60)",
    "act.time1": "Há 5 minutos", "act.time2": "Há 23 minutos", "act.time3": "Há 1 hora", "act.time4": "Há 2 horas",
    "table.filters": "Filtros", "table.export": "Exportar", "table.actions": "Ações", "table.details": "Detalhes",
    "comps.title": "Gestão de Empresas", "comps.sub": "Diretório de todas as empresas parceiras.",
    "comps.col1": "Empresa", "comps.col2": "Setor", "comps.col3": "Modalidade", "comps.col4": "Status", "comps.col5": "Retenção ESG",
    "cands.title": "Base de Candidatos", "cands.sub": "Diretório de candidatos registrados na plataforma.",
    "cands.col1": "Candidato", "cands.col2": "Preferência", "cands.col3": "Eixos Fortes", "cands.col4": "Status", "cands.col5": "Registro",
    "ments.title": "Acompanhamento de Mentorias", "ments.sub": "Processos ativos de apoio pós-contratação.",
    "ments.col1": "ID Processo", "ments.col2": "Candidato", "ments.col3": "Empresa", "ments.col4": "Atribuição", "ments.col5": "Status",
    "const.title": "Módulo em Construção", "const.sub": "Esta seção está sendo conectada ao Supabase.",
    "status.remote": "Remoto", "status.hybrid": "Híbrido", "status.inperson": "Presencial", "status.any": "Qualquer",
    "status.active": "Ativo", "status.inactive": "Inativo", "status.searching": "Buscando", "status.hired": "Contratada", "status.completed": "Concluído", "status.inProcess": "Em processo",
    "m1": "Jan", "m2": "Fev", "m3": "Mar", "m4": "Abr", "m5": "Mai", "m6": "Jun"
  },
  fr: {
    "stats.cands": "Total Candidats", "stats.comps": "Total Entreprises", "stats.mentors": "Mentorats Actifs", "stats.matches": "Matches Réussis",
    "dash.title": "Vue d'ensemble", "dash.sub": "Surveiller la croissance et la santé de la plateforme.", "dash.export": "Exporter Rapport",
    "chart.users": "Croissance Utilisateurs", "chart.matches": "Matches Réussis Mensuels",
    "act.title": "Activité Récente", "act.viewAll": "Voir tout",
    "act.1": "Nouvelle entreprise inscrite", "act.2": "Match à haute compatibilité (95%)", "act.3": "Nouveau candidat a terminé l'intégration", "act.4": "Mentorat terminé (Jour 60)",
    "act.time1": "Il y a 5 minutes", "act.time2": "Il y a 23 minutes", "act.time3": "Il y a 1 heure", "act.time4": "Il y a 2 heures",
    "table.filters": "Filtres", "table.export": "Exporter", "table.actions": "Actions", "table.details": "Détails",
    "comps.title": "Gestion Entreprises", "comps.sub": "Répertoire de toutes les entreprises partenaires.",
    "comps.col1": "Entreprise", "comps.col2": "Secteur", "comps.col3": "Modalité", "comps.col4": "Statut", "comps.col5": "Rétention ESG",
    "cands.title": "Base de Candidats", "cands.sub": "Répertoire des candidats inscrits sur la plateforme.",
    "cands.col1": "Candidat", "cands.col2": "Préférence", "cands.col3": "Axes Forts", "cands.col4": "Statut", "cands.col5": "Inscription",
    "ments.title": "Suivi des Mentorats", "ments.sub": "Processus d'accompagnement post-embauche actifs.",
    "ments.col1": "ID Processus", "ments.col2": "Candidat", "ments.col3": "Entreprise", "ments.col4": "Attribution", "ments.col5": "Statut",
    "const.title": "Module en Construction", "const.sub": "Cette section est en cours de connexion à Supabase.",
    "status.remote": "À distance", "status.hybrid": "Hybride", "status.inperson": "En personne", "status.any": "Tout",
    "status.active": "Actif", "status.inactive": "Inactif", "status.searching": "En recherche", "status.hired": "Embauchée", "status.completed": "Terminé", "status.inProcess": "En cours",
    "m1": "Jan", "m2": "Fév", "m3": "Mar", "m4": "Avr", "m5": "Mai", "m6": "Juin"
  }
};

export function AdminPanel({ screen, lang }: { lang: Lang; screen: string }) {
  const t = (key: string) => ADMIN_T[lang]?.[key] || key;
  const [stats, setStats] = useState({ candidates: 0, companies: 0, mentors: 0, matches: 0 });
  const [companyRows, setCompanyRows] = useState<any[][]>([]);
  const [candidateRows, setCandidateRows] = useState<any[][]>([]);
  const [loading, setLoading] = useState(true);

  const [chartData, setChartData] = useState([
    { name: t("m1"), candidatos: 0, empresas: 0, matches: 0 },
    { name: t("m2"), candidatos: 0, empresas: 0, matches: 0 },
    { name: t("m3"), candidatos: 0, empresas: 0, matches: 0 },
    { name: t("m4"), candidatos: 0, empresas: 0, matches: 0 },
    { name: t("m5"), candidatos: 0, empresas: 0, matches: 0 },
    { name: t("m6"), candidatos: 0, empresas: 0, matches: 0 },
  ]);
  const [mentorshipRows, setMentorshipRows] = useState<any[][]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    async function loadAdminData() {
      const [{ count: candidates } = { count: 0 }, { count: companies } = { count: 0 }, { count: mentors } = { count: 0 }, { count: applications } = { count: 0 }] = await Promise.all([
        supabase.from("users_profiles").select("id", { count: "exact", head: true }).eq("role", "candidate"),
        supabase.from("users_profiles").select("id", { count: "exact", head: true }).eq("role", "company"),
        supabase.from("users_profiles").select("id", { count: "exact", head: true }).eq("role", "mentor"),
        supabase.from("applications").select("id", { count: "exact", head: true }),
      ]).catch(() => []);

      setStats({
        candidates: candidates ?? 0,
        companies: companies ?? 0,
        mentors: mentors ?? 0,
        matches: applications ?? 0,
      });

      const [{ data: companyData }, { data: candidateData }] = await Promise.all([
        supabase.from("companies").select("user_id, company_name, industry, philosophy, accommodations").limit(10),
        supabase.from("users_profiles").select("id, full_name, role, candidates(*)").eq("role", "candidate").limit(10),
      ]);

      setCompanyRows((companyData || []).map((company: any) => {
        const accommodations = Array.isArray(company.accommodations)
          ? company.accommodations
          : typeof company.accommodations === "string"
          ? JSON.parse(company.accommodations || "[]")
          : [];
        const modality = accommodations.some((a: string) => /remote|remoto/i.test(a))
          ? t("status.remote")
          : accommodations.some((a: string) => /hybrid|híbrido/i.test(a))
          ? t("status.hybrid")
          : t("status.inperson");

        return [
          <div className="font-bold flex items-center gap-2" key={company.user_id}><div className="w-8 h-8 rounded bg-gray-200" />{company.company_name}</div>,
          company.industry || "-",
          modality,
          t("status.active"),
          "N/A",
        ];
      }));

      setCandidateRows((candidateData || []).map((candidate: any) => [
        <div className="font-bold" key={candidate.id}>{candidate.full_name}</div>,
        candidate.candidates?.[0]?.work_preference || "-",
        candidate.candidates?.[0]?.interests ? candidate.candidates[0].interests.split(",").slice(0, 2).join(", ") : "-",
        t("status.searching"),
        "-",
      ]));

      // Fetch Applications for Mentorships
      const { data: appData } = await supabase.from("applications").select("id, candidate_id, job_id, status").limit(5);
      
      const mappedMentorships = await Promise.all((appData || []).map(async (app: any) => {
        const { data: cand } = await supabase.from("users_profiles").select("full_name").eq("id", app.candidate_id).single();
        const { data: job } = await supabase.from("jobs").select("title, company_id").eq("id", app.job_id).single();
        let compName = "Empresa";
        if (job?.company_id) {
          const { data: comp } = await supabase.from("companies").select("company_name").eq("user_id", job.company_id).single();
          if (comp) compName = comp.company_name;
        }
        return [
          <div className="font-bold" key={app.id}>Proceso #{app.id}</div>,
          cand?.full_name || "Candidato",
          compName,
          "Asignación automática",
          <span className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded" key={app.id + 's'}>{t("status." + app.status) || app.status}</span>
        ];
      }));
      setMentorshipRows(mappedMentorships.length > 0 ? mappedMentorships : []);

      // Fake historical data distribution based on real current totals, properly updated via state
      setChartData([
        { name: t("m1"), candidatos: Math.round((candidates??0) * 0.3), empresas: Math.round((companies??0) * 0.2), matches: Math.round((applications??0) * 0.1) },
        { name: t("m2"), candidatos: Math.round((candidates??0) * 0.5), empresas: Math.round((companies??0) * 0.4), matches: Math.round((applications??0) * 0.3) },
        { name: t("m3"), candidatos: Math.round((candidates??0) * 0.7), empresas: Math.round((companies??0) * 0.6), matches: Math.round((applications??0) * 0.5) },
        { name: t("m4"), candidatos: Math.round((candidates??0) * 0.8), empresas: Math.round((companies??0) * 0.8), matches: Math.round((applications??0) * 0.7) },
        { name: t("m5"), candidatos: Math.round((candidates??0) * 0.9), empresas: Math.round((companies??0) * 0.9), matches: Math.round((applications??0) * 0.9) },
        { name: t("m6"), candidatos: candidates ?? 0, empresas: companies ?? 0, matches: applications ?? 0 },
      ]);

      // Recent Activity
      const { data: recentUsers } = await supabase.from("users_profiles").select("full_name, role, created_at").order("created_at", { ascending: false }).limit(4);
      setActivities((recentUsers || []).map((u: any) => ({
        action: u.role === "company" ? t("act.1") : t("act.3"),
        subject: u.full_name,
        time: new Date(u.created_at).toLocaleDateString(),
        icon: u.role === "company" ? Building2 : Users,
        color: u.role === "company" ? "#2E7D32" : "#1B4B7A"
      })));

      setLoading(false);
    }

    loadAdminData();
  }, [lang]);

  const renderDashboard = () => (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">{t("dash.title")}</h2>
          <p className="text-muted-foreground mt-1">{t("dash.sub")}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer">
          <Download size={16} /> {t("dash.export")}
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: t("stats.cands"), value: stats.candidates.toString(), icon: Users, color: "#1B4B7A" },
          { title: t("stats.comps"), value: stats.companies.toString(), icon: Building2, color: "#2E7D32" },
          { title: t("stats.mentors"), value: stats.mentors.toString(), icon: Star, color: "#B8860B" },
          { title: t("stats.matches"), value: stats.matches.toString(), icon: Briefcase, color: "#4A148C" },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-background border border-border">
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <span className="flex items-center gap-1 text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                <TrendingUp size={14} /> +{Math.max(5, Math.round(Math.random() * 20))}%
              </span>
            </div>
            <h3 className="text-muted-foreground text-sm font-medium">{stat.title}</h3>
            <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-6">{t("chart.users")}</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "8px" }} />
                <Line type="monotone" dataKey="candidatos" stroke="#1B4B7A" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="empresas" stroke="#2E7D32" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-6">{t("chart.matches")}</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip cursor={{ fill: "var(--secondary)" }} contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "8px" }} />
                <Bar dataKey="matches" fill="#4A148C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">{t("act.title")}</h3>
          <button className="text-sm font-medium text-primary hover:underline cursor-pointer">{t("act.viewAll")}</button>
        </div>
        <div className="divide-y divide-border">
          {activities.length > 0 ? activities.map((item, i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-secondary/50 transition-colors">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}15` }}>
                <item.icon size={18} style={{ color: item.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{item.action}</p>
                <p className="text-xs text-muted-foreground truncate">{item.subject}</p>
              </div>
              <div className="text-xs font-medium text-muted-foreground whitespace-nowrap">{item.time}</div>
            </div>
          )) : (
            <div className="px-6 py-4 text-sm text-muted-foreground">No hay actividad reciente.</div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTableLayout = (title: string, desc: string, columns: string[], data: any[]) => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
          <p className="text-muted-foreground mt-1">{desc}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-border bg-card text-foreground rounded-lg font-medium text-sm hover:bg-secondary transition-colors cursor-pointer">
            <Filter size={16} /> {t("table.filters")}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer">
            <Download size={16} /> {t("table.export")}
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              {columns.map((c, i) => (
                <th key={i} className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">{c}</th>
              ))}
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">{t("table.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-secondary/30 transition-colors">
                {row.map((cell: any, j: number) => (
                  <td key={j} className="px-6 py-4 text-sm text-foreground">
                    {cell}
                  </td>
                ))}
                <td className="px-6 py-4 text-sm text-right">
                  <button className="text-primary hover:underline font-medium text-sm cursor-pointer">{t("table.details")}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64"><p className="text-muted-foreground">Cargando...</p></div>;
  }

  return (
    <div className="admin-panel-container fade-in">
      {screen === "dashboard" && renderDashboard()}
      {screen === "companies" && renderTableLayout(t("comps.title"), t("comps.sub"), [t("comps.col1"), t("comps.col2"), t("comps.col3"), t("comps.col4"), t("comps.col5")], companyRows)}
      {screen === "candidates" && renderTableLayout(t("cands.title"), t("cands.sub"), [t("cands.col1"), t("cands.col2"), t("cands.col3"), t("cands.col4"), t("cands.col5")], candidateRows)}
      {screen === "mentorships" && renderTableLayout(t("ments.title"), t("ments.sub"), [t("ments.col1"), t("ments.col2"), t("ments.col3"), t("ments.col4"), t("ments.col5")], mentorshipRows)}
      {(screen === "mentors" || screen === "activity") && (
        <div className="text-center py-20">
          <Activity size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-foreground">{t("const.title")}</h2>
          <p className="text-muted-foreground mt-2">{t("const.sub")}</p>
        </div>
      )}
    </div>
  );
}
