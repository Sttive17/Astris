import { Calendar, MessageSquare } from "lucide-react";
import { Lang } from "@/types";
import { C } from "@/i18n/useT";

export function MentorCheckins({ lang }: { lang: Lang }) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
      <div className="px-4 lg:px-20 py-10 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{C(lang, "checkinPageTitle") as string}</h1>
        <p className="text-muted-foreground mt-2">{C(lang, "checkinPageSub") as string}</p>
      </div>
      <div className="w-[95%] md:w-full md:max-w-4xl mx-auto w-full px-4 lg:px-20 py-10 flex flex-col gap-5">
        {[
          { date: "Jun 18, 2025", cand: "CAND-A7X2", company: "Veritas Analytics", type: C(lang, "mentor.checkin.onboardingWeek2") as string, time: "10:00 AM" },
          { date: "Jun 20, 2025", cand: "CAND-B3M9", company: "Forma Studio", type: C(lang, "mentor.checkin.interviewPrep") as string, time: "2:00 PM" },
          { date: "Jun 24, 2025", cand: "CAND-C1K4", company: "Kestrel Systems", type: C(lang, "mentor.checkin.review30") as string, time: "11:30 AM" },
        ].map((item) => (
          <article key={item.cand} className="rounded-2xl border border-border p-6 flex items-center gap-3 md:gap-6" style={{ backgroundColor: "var(--card)" }}>
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--secondary)" }}>
              <Calendar size={24} aria-hidden="true" style={{ color: "var(--primary)" }} />
            </div>
            <div className="flex-1">
              <div className="font-bold text-foreground">{item.cand} × {item.company}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{item.type}</div>
              <div className="text-xs text-muted-foreground mt-1" style={{ fontFamily: "DM Mono, monospace" }}>{item.date} · {item.time}</div>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold cursor-pointer text-sm" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
              <MessageSquare size={14} aria-hidden="true" />
              {C(lang, "scheduleSession") as string}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
