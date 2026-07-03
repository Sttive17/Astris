import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { Lang } from "../../types";
import { useT } from "../../i18n/useT";
import { supabase, getMatchesForCompany } from "../../../lib/supabase";
import { MatchBadge } from "../../components/common/MatchBadge";

export function CompanyCandidates({ lang, onSelect }: { lang: Lang; onSelect: (id: string) => void }) {
  const t = useT(lang);
  const [candidates, setCandidates] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCandidates() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const matches = await getMatchesForCompany(session.user.id);
      
      const mapped = matches.map((m: any) => ({
        id: m.candidateId,
        strengths: "Perfil compatible evaluado",
        match: m.matchPercentage,
        profile: null,
      }));
      setCandidates(mapped);
      setLoading(false);
    }
    loadCandidates();
  }, [lang]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
      <div className="px-4 lg:px-20 py-10 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t("comp.candidates.title")}</h1>
        <p className="text-muted-foreground mt-2">{t("comp.candidates.sub")}</p>
      </div>
      <div className="max-w-7xl mx-auto w-full px-4 lg:px-20 py-10">
        <div className="rounded-2xl border border-border overflow-hidden">
          <div className="grid border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wide px-7 py-4" style={{ gridTemplateColumns: "1fr 2fr 100px 160px", backgroundColor: "var(--muted)" }}>
            <span>Identificador</span><span>Resumen de fortalezas</span><span className="text-center">Compatibilidad</span><span />
          </div>
          {loading ? (
            <div className="px-7 py-6 md:py-12 text-center text-muted-foreground">Cargando candidatos...</div>
          ) : candidates.length === 0 ? (
            <div className="px-7 py-6 md:py-12 text-center text-muted-foreground">No se encontraron candidatos.</div>
          ) : candidates.map((c, i) => (
            <div key={c.id} className="grid items-center px-7 py-5 border-b border-border last:border-0 hover:bg-secondary/40 transition-colors group" style={{ gridTemplateColumns: "1fr 2fr 100px 160px", backgroundColor: i % 2 === 0 ? "var(--background)" : "var(--card)" }}>
              <div className="font-mono text-sm font-bold group-hover:text-primary transition-colors" style={{ color: "var(--primary)", fontFamily: "DM Mono, monospace" }}>{c.id.substring(0, 8)}</div>
              <div className="text-sm text-muted-foreground leading-relaxed pr-4">{c.strengths}</div>
              <div className="flex justify-center"><MatchBadge value={c.match} size="sm" /></div>
              <button onClick={() => onSelect(c.id)} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold cursor-pointer text-sm transition-transform hover:scale-105" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
                {lang === "es" ? "Ver perfil" : "View profile"}<ChevronRight size={14} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
