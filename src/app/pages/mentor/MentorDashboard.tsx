import { MessageSquare, Calendar, Activity } from "lucide-react";
import { Lang } from "../../types";
import { useT, C } from "../../i18n/useT";
import { MENTOR_PROCESSES } from "../../mockData";

export function MentorDashboard({ lang }: { lang: Lang }) {
  const t = useT(lang);
  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
      <div className="border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <div className="px-4 lg:px-20 py-10 max-w-7xl mx-auto">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{t("mentor.dash.title")}</div>
          <h2 className="text-2xl font-bold text-foreground">Carmen Ruiz</h2>
          <p className="text-muted-foreground mt-1">Inclusión laboral y funciones ejecutivas</p>
        </div>
      </div>
      <div className="border-b border-border" style={{ backgroundColor: "var(--background)" }}>
        <div className="px-4 lg:px-20 py-5 max-w-7xl mx-auto flex gap-5 md:gap-10">
          {([["3", C(lang, "mentorProcesses"), "var(--primary)"], ["2", lang === "es" ? "Sesiones pendientes" : lang === "pt" ? "Sessões pendentes" : lang === "fr" ? "Sessions en attente" : "Pending sessions", "var(--accent)"], ["12", lang === "es" ? "Completados este año" : lang === "pt" ? "Concluídos este ano" : lang === "fr" ? "Complétés cette année" : "Completed this year", "var(--muted-foreground)"], ["91%", lang === "es" ? "Retención promedio" : lang === "pt" ? "Retenção média" : lang === "fr" ? "Rétention moyenne" : "Average retention", "var(--accent)"]] as const).map(([val, label, color]) => (
            <div key={label as string} className="flex flex-col gap-1">
              <div className="text-2xl font-bold" style={{ color: color as string, fontFamily: "DM Mono, monospace" }}>{val}</div>
              <div className="text-xs text-muted-foreground">{label as string}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 lg:px-20 py-10 gap-4 md:gap-8">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-foreground mb-6">{C(lang, "mentorProcesses") as string}</h3>
          <div className="flex flex-col gap-5">
            {MENTOR_PROCESSES.map((proc) => (
              <article key={proc.cid} className="rounded-2xl border border-border p-7 transition-all duration-300 hover:shadow-xl hover:border-primary group" style={{ backgroundColor: "var(--card)" }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: proc.stageColor + "22", color: proc.stageColor }}>{proc.stage}</span>
                      <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors" style={{ fontFamily: "DM Mono, monospace" }}>{proc.cid}</span>
                    </div>
                    <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{proc.role}</h4>
                    <div className="text-muted-foreground text-sm">{proc.company}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-muted-foreground">{lang === "es" ? "Activo hace" : "Active for"}</div>
                    <div className="text-2xl font-bold text-foreground" style={{ fontFamily: "DM Mono, monospace" }}>{proc.days}d</div>
                  </div>
                </div>
                <div className="p-4 rounded-xl mb-4 border border-border group-hover:border-primary/30 transition-colors" style={{ backgroundColor: "var(--background)" }}>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">{C(lang, "sessionNotes") as string}</div>
                  <p className="text-sm text-foreground leading-relaxed">{proc.notes}</p>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div><div className="text-xs text-muted-foreground mb-0.5">{C(lang, "nextAction") as string}</div><div className="text-sm font-semibold text-foreground">{proc.action}</div></div>
                  <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold cursor-pointer text-sm border border-border transition-colors hover:bg-secondary hover:border-primary/50" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}><MessageSquare size={14} aria-hidden="true" />{C(lang, "notes") as string}</button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold cursor-pointer text-sm transition-transform hover:scale-105" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}><Calendar size={14} aria-hidden="true" />{C(lang, "scheduleSession") as string}</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="w-full md:w-72 shrink-0 flex flex-col gap-5">
          <div className="rounded-2xl border border-border p-6" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex items-center gap-2 mb-4"><Calendar size={15} aria-hidden="true" style={{ color: "var(--primary)" }} /><h3 className="font-bold text-foreground text-sm">{C(lang, "mentorCheckins") as string}</h3></div>
            <div className="flex flex-col gap-3">
              {[["Jun 18", "CAND-A7X2 × Veritas", "Onboarding semana 2"], ["Jun 20", "CAND-B3M9 × Forma Studio", "Preparación entrevista"], ["Jun 24", "CAND-C1K4 × Kestrel", "Revisión de 30 días"]].map(([date, cand, type]) => (
                <div key={date as string} className="flex items-start gap-3 p-3 rounded-xl border border-border" style={{ backgroundColor: "var(--background)" }}>
                  <div className="text-xs font-bold shrink-0 pt-0.5" style={{ color: "var(--primary)", fontFamily: "DM Mono, monospace" }}>{date}</div>
                  <div><div className="text-xs font-semibold text-foreground leading-tight">{cand as string}</div><div className="text-xs text-muted-foreground mt-0.5">{type as string}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border p-6" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex items-center gap-2 mb-4"><Activity size={15} aria-hidden="true" style={{ color: "var(--accent)" }} /><h3 className="font-bold text-foreground text-sm">{C(lang, "mentorImpact") as string}</h3></div>
            {([[lang === "es" ? "Entrevistas acompañadas" : lang === "pt" ? "Entrevistas acompanhadas" : lang === "fr" ? "Entretiens accompagnés" : "Interviews supported", "5"], [lang === "es" ? "Onboardings completados" : lang === "pt" ? "Onboardings concluídos" : lang === "fr" ? "Onboardings complétés" : "Onboardings completed", "2"], [lang === "es" ? "Ajustes negociados" : lang === "pt" ? "Ajustes negociados" : lang === "fr" ? "Aménagements négociés" : "Adjustments negotiated", "8"]] as const).map(([label, val]) => (
              <div key={label as string} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm text-foreground">{label as string}</span>
                <span className="font-bold text-foreground" style={{ fontFamily: "DM Mono, monospace" }}>{val as string}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
