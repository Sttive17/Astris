import React, { useEffect, useState } from "react";
import { Search, User, Edit, FileText, CheckCircle, Brain } from "lucide-react";
import { getAdminCandidates } from "../../../lib/supabase-admin";

export default function CandidatesView() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAdminCandidates().then(data => {
      setCandidates(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-center text-muted-foreground font-medium anim-pulse">Cargando candidatos...</div>;

  const filtered = candidates.filter(c => c.users_profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) || c.users_profiles?.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 anim-fade-in flex flex-col h-full">
      <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-foreground">Gestión de Candidatos</h1>
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
                <th className="px-6 py-4">Candidato</th>
                <th className="px-6 py-4">Neurotipo</th>
                <th className="px-6 py-4">Modalidad Ideal</th>
                <th className="px-6 py-4">Intereses</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(c => (
                <tr key={c.user_id} className={"hover:bg-muted/30 transition-colors " + (c.users_profiles?.deleted_at ? "opacity-50" : "")}>
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                      {c.users_profiles?.full_name ? c.users_profiles.full_name.charAt(0) : <User className="w-5 h-5"/>}
                    </div>
                    <div>
                      <div className="text-foreground font-bold">{c.users_profiles?.full_name || "Sin Nombre"}</div>
                      <div className="text-xs text-muted-foreground">{c.users_profiles?.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {c.neurotype ? (
                      <span className="inline-flex items-center px-2 py-1 bg-purple-500/10 text-purple-600 rounded-md text-xs font-semibold">
                        <Brain className="w-3 h-3 mr-1" /> {c.neurotype}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">No especificado</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{c.work_preference || "No especificada"}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap w-48 overflow-hidden">
                      {(c.interests || []).slice(0,2).map((int: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-[10px] uppercase font-bold">{int}</span>
                      ))}
                      {(c.interests || []).length > 2 && <span className="text-xs text-muted-foreground">+{c.interests.length - 2}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors mr-2">
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-muted-foreground">
                    No se encontraron candidatos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
