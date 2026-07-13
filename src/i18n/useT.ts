import { Lang, PaletteKey, QuizAnswers } from "@/types";
import { PALETTES, QUIZ_AXES } from "./content";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

export function getInitialLang(): Lang {
  if (typeof window === "undefined") return "es";
  const stored = window.localStorage.getItem("astris_lang");
  if (stored === "es" || stored === "en" || stored === "pt" || stored === "fr") {
    return stored as Lang;
  }
  const browserLang = window.navigator.language?.toLowerCase() ?? "";
  if (browserLang.startsWith("pt")) return "pt";
  if (browserLang.startsWith("fr")) return "fr";
  if (browserLang.startsWith("en")) return "en";
  return "es";
}

export function getInitialModalStep() {
  if (typeof window === "undefined") return "none";
  return window.localStorage.getItem("astris_lang") ? "none" : "language";
}

export function useT(lang?: Lang) {
  const { t } = useTranslation();
  return t;
}

export type ContentKey = string;

export function C(lang: Lang, key: ContentKey): any {
  return i18next.t(key, { lng: lang, returnObjects: true });
}

export function getPaletteName(p: PaletteKey, lang: Lang) {
  const pal = PALETTES[p];
  if (lang === "es") return pal.nameEs;
  if (lang === "pt") return pal.namePt;
  if (lang === "fr") return pal.nameFr;
  return pal.nameEn;
}

export function getPaletteDesc(p: PaletteKey, lang: Lang) {
  return lang === "es" ? PALETTES[p].descEs : PALETTES[p].descEn;
}

export function computeRadar(answers: QuizAnswers) {
  return QUIZ_AXES.map((axis, ai) => {
    const axisAnswers = answers[ai] ?? {};
    const questions = axis.questions;
    let sum = 0;
    let count = 0;
    questions.forEach((q, qi) => {
      const ans = axisAnswers[qi];
      if (ans !== undefined && ans !== null) {
        if (q.type === "single") {
          sum += q.vals[ans as number] ?? 50;
          count++;
        } else if (Array.isArray(ans)) {
          if (ans.length > 0 && !ans.includes(q.opts.es.length - 1)) {
            sum += 85;
          } else {
            sum += 25;
          }
          count++;
        }
      }
    });
    const avg = count > 0 ? Math.round(sum / count) : 0;
    return { axis: axis.radarAxis, value: avg };
  });
}
