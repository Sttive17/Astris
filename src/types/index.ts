export type Lang = "es" | "en" | "pt" | "fr";
export type ModalStep = "language" | "register" | "login" | "none";
export type Role = "candidate" | "company" | "mentor" | "admin";
export type PaletteKey = "azul" | "tierra" | "contraste" | "verde";
export type FontKey = "inter" | "lexend";
export type PublicView = "landing" | "about" | "support" | "partners";
export type QuizAnswers = Record<number, Record<number, number | number[]>>;

export interface VacancyItem {
  id: string;
  title: string;
  company: string;
  sector: string;
  modality: string;
  type: string;
  match: number;
  socialLevel: string;
  adjustments: string[];
  desc: string;
  companyDesc: string;
}

export interface MentorItem {
  id: string;
  name: string;
  specialty: string;
  years: number;
  modality: string;
  bio: string;
}
