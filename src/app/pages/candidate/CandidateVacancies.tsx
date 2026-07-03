import { useState, useEffect } from "react";
import { Clock, MapPin, Check, ArrowRight } from "lucide-react";
import { Lang, VacancyItem } from "../../types";
import { useT } from "../../i18n/useT";
import { supabase, getMatchesForCandidate } from "../../../lib/supabase";
import { MatchBadge } from "../../components/common/MatchBadge";

export function CandidateVacancies({ lang, onSelect }: { lang: Lang; onSelect: (id: string) => void }) {
  const t = useT(lang);
  const [modalityFilter, setModalityFilter] = useState("all");
  const [vacancies, setVacancies] = useState<VacancyItem[]>([]);
  const [loadingVac, setLoadingVac] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const matches = await getMatchesForCandidate(session.user.id);
      
      if (matches.length > 0) {
        const { data } = await supabase
          .from("jobs")
          .select(`id, title, description, company_id, status, work_modality, location_text, contract_type, offered_accommodations, required_skills`)
          .in("id", matches.map((m: any) => m.jobId));
          
        if (data && data.length > 0) {
          const companyIds = Array.from(new Set(data.map((j: any) => j.company_id).filter(Boolean)));
          let companiesMap: Record<string, any> = {};
          if (companyIds.length > 0) {
            const { data: companies } = await supabase
              .from("companies")
              .select("user_id, company_name, industry, philosophy")
              .in("user_id", companyIds);
            (companies || []).forEach((c: any) => {
              if (c.user_id) companiesMap[c.user_id] = c;
            });
          }

          const mapped: VacancyItem[] = data.map((j: any) => {
            const matchScore = matches.find((m: any) => m.jobId === j.id)?.matchPercentage || 0;
            return {
              id: j.id,
              title: j.title,
              company: (companiesMap[j.company_id]?.company_name) || "Empresa",
              sector: (companiesMap[j.company_id]?.industry) || "-",
              modality: j.work_modality === "remote" ? (lang === "es" ? "Remoto" : "Remote") : j.work_modality === "hybrid" ? (lang === "es" ? "Híbrido" : "Hybrid") : (lang === "es" ? "Presencial" : "In-person"),
              type: j.contract_type ?? (lang === "es" ? "Tiempo completo" : "Full-time"),
              match: matchScore,
              socialLevel: "Bajo",
              adjustments: j.offered_accommodations ?? [],
              desc: j.description ?? "",
              companyDesc: (companiesMap[j.company_id]?.philosophy) || "",
            };
          });
          setVacancies(mapped.sort((a,b) => b.match - a.match));
        } else {
          setVacancies([]);
        }
      } else {
        setVacancies([]);
      }
      setLoadingVac(false);
    }
    loadJobs();
  }, [lang]);

  const filtered = modalityFilter === "all" ? vacancies : vacancies.filter((v) => v.modality.toLowerCase().includes(modalityFilter));

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
      <div className="px-4 lg:px-20 py-10 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t("vacancies.title")}</h1>
        <p className="text-muted-foreground mt-1">{filtered.length} {lang === "es" ? "vacantes compatibles" : "compatible vacancies"}</p>
      </div>
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 lg:px-20 py-10 gap-4 md:gap-8">
        {/* Filters */}
        <div className="w-60 shrink-0">
          <div className="rounded-2xl border border-border p-6" style={{ backgroundColor: "var(--card)" }}>
            <h3 className="font-bold text-foreground text-sm mb-4">{t("vacancies.filters")}</h3>
            <div className="mb-5">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t("vacancies.modality")}</div>
              <div className="flex flex-col gap-2">
                {[["all", lang === "es" ? "Todas" : "All"], ["remote", lang === "es" ? "Remoto" : "Remote"], ["hybrid", lang === "es" ? "Híbrido" : "Hybrid"]].map(([val, label]) => (
                  <button key={val} onClick={() => setModalityFilter(val)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer text-left bg-transparent border-0" style={{ backgroundColor: modalityFilter === val ? "var(--secondary)" : "transparent", color: "var(--foreground)", fontWeight: modalityFilter === val ? 600 : 400 }}>
                    {modalityFilter === val && <div className="w-2 h-2 rounded-full bg-primary shrink-0" aria-hidden="true" />}
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t border-border pt-5">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t("vacancies.social")}</div>
              {["Bajo", "Medio", "Alto"].map((s) => (
                <div key={s} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground cursor-pointer">{s}</div>
              ))}
            </div>
          </div>
        </div>
        {/* Vacancy cards */}
        <div className="flex-1 flex flex-col gap-5">
          {loadingVac ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">{lang === "es" ? "Cargando vacantes..." : "Loading jobs..."}</div>
          ) : filtered.map((v) => (
            <article key={v.id} className="rounded-2xl border border-border p-7 flex flex-col md:flex-row items-start md:items-center gap-7 transition-all duration-300 hover:shadow-xl hover:border-primary group" style={{ backgroundColor: "var(--card)" }}>
              <MatchBadge value={v.match} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{v.title}</h3>
                    <div className="text-muted-foreground">{v.company} · {v.sector}</div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground shrink-0 mt-2 md:mt-0">
                    <span className="flex items-center gap-1.5"><Clock size={13} aria-hidden="true" />{v.type}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={13} aria-hidden="true" />{v.modality}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {v.adjustments.map((a) => (
                    <span key={a} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border border-border" style={{ backgroundColor: "var(--secondary)" }}>
                      <Check size={9} aria-hidden="true" style={{ color: "var(--accent)" }} />{a}
                    </span>
                  ))}
                </div>
              </div>
              <button onClick={() => onSelect(v.id)} className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold cursor-pointer text-sm border-0 transition-transform hover:scale-105" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
                {lang === "es" ? "Ver detalle" : "View detail"}<ArrowRight size={13} aria-hidden="true" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
