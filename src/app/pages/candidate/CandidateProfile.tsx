import { Shield, User } from "lucide-react";
import { Lang, QuizAnswers } from "../../types";
import { useT, computeRadar } from "../../i18n/useT";
import { CANDIDATE_RADAR_FINAL } from "../../mockData";
import { RadarViz } from "../../components/common/RadarViz";
import { QUIZ_AXES } from "../../i18n/content";

export function CandidateProfile({ lang, answers, userName, userAvatar, vocation }: { lang: Lang; answers: QuizAnswers, userName?: string, userAvatar?: string, vocation?: string }) {
  const t = useT(lang);
  const radarData = Object.keys(answers).length > 0 ? computeRadar(answers) : CANDIDATE_RADAR_FINAL;
  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
      <div className="px-4 lg:px-20 py-10 border-b border-border flex items-center justify-between" style={{ backgroundColor: "var(--card)" }}>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Tu perfil</h1>
          <p className="text-muted-foreground mt-2 max-w-xl">{lang === "es" ? "Aquí tienes un resumen de tu perfil profesional y tus preferencias." : "Here is a summary of your professional profile and preferences."}</p>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-right">
          <div>
            <div className="text-lg font-bold text-foreground">{userName || "Candidato Astris"}</div>
            {vocation && <div className="text-sm font-medium text-primary mt-1">{vocation}</div>}
          </div>
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-border shrink-0 flex items-center justify-center bg-secondary">
            {userAvatar ? (
              <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={28} className="text-muted-foreground" />
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 lg:px-20 py-10 flex flex-col lg:flex-row gap-10">
        {/* Radar */}
        <div className="flex-1 max-w-xl rounded-[2rem] border border-border p-6 md:p-8" style={{ backgroundColor: "var(--card)", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
          <RadarViz data={radarData} height={340} outerRadius={110} fontSize={11} />
        </div>

        {/* Adjustments */}
        <div className="w-full lg:w-[400px] shrink-0 space-y-6">
          <div className="rounded-[2rem] border border-border p-6 md:p-8" style={{ backgroundColor: "var(--card)", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
            <h2 className="text-lg font-bold text-foreground mb-5">{t("profile.adjustments")}</h2>
            <div>
              {(() => {
                const active: string[] = [];
                const axis = QUIZ_AXES[3];
                if (answers[3] && Object.keys(answers[3]).length > 0) {
                  [0, 1].forEach((qi) => {
                    const ans = answers[3][qi];
                    if (Array.isArray(ans)) {
                      ans.forEach((oi) => {
                        const oText = axis.questions[qi].opts[lang]?.[oi] ?? axis.questions[qi].opts.es[oi];
                        if (oText && oi !== axis.questions[qi].opts.es.length - 1) {
                          active.push(oText);
                        }
                      });
                    }
                  });
                }
                return active.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {active.map((adj, idx) => (
                      <span key={idx} className="text-sm font-semibold px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20">{adj}</span>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
