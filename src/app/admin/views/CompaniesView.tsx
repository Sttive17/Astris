import React, { useEffect, useState } from "react";
import { Search, Building2, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { getAdminCompanies } from "../../../lib/supabase-admin";

export default function CompaniesView() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAdminCompanies().then(data => {
      setCompanies(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-center text-muted-foreground font-medium anim-pulse">Cargando empresas...</div>;

  const filtered = companies.filter(c => c.company_name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 anim-fade-in flex flex-col h-full">
      <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-foreground">Gestión de Empresas</h1>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Buscar por nombre..." 
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
                <th className="px-6 py-4">Empresa</th>
                <th className="px-6 py-4">Industria</th>
                <th className="px-6 py-4">Ubicación</th>
                <th className="px-6 py-4">Índices ESG</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(c => (
                <tr key={c.user_id} className={"hover:bg-muted/30 transition-colors " + (c.users_profiles?.deleted_at ? "opacity-50" : "")}>
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-foreground font-bold">{c.company_name || "Sin Nombre"}</div>
                      <div className="text-xs text-muted-foreground">{c.users_profiles?.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{c.industry || "No especificada"}</td>
                  <td className="px-6 py-4">{c.city ? c.city + ", " + c.country : "Global / Remoto"}</td>
                  <td className="px-6 py-4">
                    <div className="text-xs">
                      <span className="font-semibold">Retención:</span> {c.esg_retention_rate ? c.esg_retention_rate + "%" : "N/A"} <br/>
                      <span className="font-semibold">Bienestar:</span> {c.esg_wellness_index ? c.esg_wellness_index + "/100" : "N/A"}
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
                    No se encontraron empresas.
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
