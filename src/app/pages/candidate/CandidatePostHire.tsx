import { useState } from "react";
import { Lang } from "../../types";
import { useT, C } from "../../i18n/useT";
import { supabase } from "../../../lib/supabase";

export function CandidatePostHire({ lang }: { lang: Lang }) {
  const t = useT(lang);
  const [status, setStatus] = useState(1);
  const STATUS_LABELS = C(lang, "statusLabels") as string[];
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [history, setHistory] = useState(C(lang, "postHireHistory") as any[]);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!q1.trim() && !q2.trim()) return;
    setSending(true);
    const newEntry = {
      date: new Date().toLocaleDateString(),
      note: `${q1 ? 'Q1: ' + q1 : ''} ${q2 ? '| Q2: ' + q2 : ''}`
    };
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
         await supabase.from("checkins").insert({ user_id: session.user.id, role: "candidate", note: newEntry.note });
      }
    } catch (e) {}
    setHistory([newEntry, ...history]);
    setQ1("");
    setQ2("");
    setSending(false);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
      <div className="px-4 lg:px-20 py-10 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t("posthire.title")}</h1>
        <p className="text-muted-foreground mt-1">Veritas Analytics · {lang === "es" ? "Analista de Datos Junior" : "Junior Data Analyst"} · {lang === "es" ? "Día 14 de 60" : "Day 14 of 60"}</p>
      </div>
      <div className="max-w-5xl mx-auto w-full px-4 lg:px-20 py-10 flex flex-col gap-4 md:gap-8">
        {/* Status */}
        <div className="rounded-2xl border border-border p-4 md:p-8" style={{ backgroundColor: "var(--card)" }}>
          <h2 className="font-bold text-foreground mb-6">{t("posthire.status")}</h2>
          <div className="flex gap-4 flex-col sm:flex-row">
            {STATUS_LABELS.map((label, i) => (
              <button 
                key={i} 
                onClick={() => setStatus(i)}
                className="flex-1 py-5 rounded-xl border-2 text-center cursor-pointer font-semibold text-sm transition-all hover:scale-[1.02]" 
                style={{ borderColor: status === i ? "var(--primary)" : "var(--border)", backgroundColor: status === i ? "var(--secondary)" : "var(--background)", color: "var(--foreground)" }}
              >
                {status === i && <div className="w-2 h-2 rounded-full bg-primary mx-auto mb-2" aria-hidden="true" />}
                {label}
              </button>
            ))}
          </div>
        </div>
        {/* Report */}
        <div className="rounded-2xl border border-border p-4 md:p-8" style={{ backgroundColor: "var(--card)" }}>
          <h2 className="font-bold text-foreground mb-4">{lang === "es" ? "Reporte de esta semana" : lang === "pt" ? "Relatório desta semana" : lang === "fr" ? "Rapport de cette semaine" : "This week's report"}</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{C(lang, "postHireQ1") as string}</label>
              <textarea 
                value={q1}
                onChange={(e) => setQ1(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border text-sm text-foreground outline-none focus:border-primary resize-y min-h-[80px]" 
                style={{ backgroundColor: "var(--input-background)" }} 
                placeholder={C(lang, "postHireTextPlaceholder") as string}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{C(lang, "postHireQ2") as string}</label>
              <textarea 
                value={q2}
                onChange={(e) => setQ2(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border text-sm text-foreground outline-none focus:border-primary resize-y min-h-[80px]" 
                style={{ backgroundColor: "var(--input-background)" }} 
                placeholder={C(lang, "postHireTextPlaceholder") as string}
              />
            </div>
            <button onClick={handleSend} disabled={sending || (!q1.trim() && !q2.trim())} className="self-start px-6 py-3 rounded-xl font-semibold cursor-pointer text-sm disabled:opacity-50" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
              {sending ? "Enviando..." : (C(lang, "postHireSend") as string)}
            </button>
          </div>
        </div>
        {/* History */}
        <div className="rounded-2xl border border-border p-4 md:p-8" style={{ backgroundColor: "var(--card)" }}>
          <h2 className="font-bold text-foreground mb-4">{C(lang, "postHireCheckins") as string}</h2>
          {history.map((h, i) => (
            <div key={i} className="flex gap-4 py-4 border-b border-border last:border-0">
              <span className="text-xs text-muted-foreground w-24 shrink-0 pt-0.5" style={{ fontFamily: "DM Mono, monospace" }}>{h.date}</span>
              <p className="text-sm text-foreground leading-relaxed">{h.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
