import { MessageSquare } from "lucide-react";
import { Lang } from "@/types";
import { useT, C } from "@/i18n/useT";

export function MentorCompanies({ lang }: { lang: Lang }) {
  const t = useT(lang);
  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
      <div className="px-4 lg:px-20 py-10 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{C(lang, "companiesPageTitle") as string}</h1>
        <p className="text-muted-foreground mt-2">{C(lang, "companiesPageSub") as string}</p>
      </div>
      <div className="w-[95%] md:w-full md:max-w-4xl mx-auto w-full px-4 lg:px-20 py-10 grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { name: "Veritas Analytics", contact: "RRHH · Ana García", status: C(lang, "mentor.co.active"), processes: 1, color: "#2D7D5F" },
          { name: "Forma Studio", contact: "Hiring · Daniel Reyes", status: C(lang, "mentor.co.inProcess"), processes: 1, color: "#1B4B7A" },
          { name: "Kestrel Systems", contact: "People · Laura Mena", status: C(lang, "mentor.co.probation"), processes: 1, color: "#8B5C3A" },
        ].map((co) => (
          <article key={co.name} className="rounded-2xl border border-border p-6 flex flex-col gap-4" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-foreground">{co.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{co.contact}</div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: co.color + "22", color: co.color }}>{co.status}</span>
            </div>
            <div className="text-xs text-muted-foreground">{co.processes} {C(lang, "mentor.co.activeProcess") as string}</div>
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold cursor-pointer text-sm border border-border" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
              <MessageSquare size={13} aria-hidden="true" />
              {C(lang, "compPostHireSendMsg") as string}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
