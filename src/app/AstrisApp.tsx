import { useState, useEffect } from "react";
import {
  RadarChart, Radar, PolarAngleAxis, ResponsiveContainer,
} from "recharts";
import {
  User, Users, Building2, Briefcase, ArrowRight, Check, X, ChevronRight,
  ChevronLeft, ChevronDown, Sun, Moon, Type, Globe, MessageSquare,
  Shield, MapPin, Clock, Activity, Calendar, Star, BarChart2, FileText,
  Settings, LogOut, AlertCircle,
} from "lucide-react";
import { getCurrentUser, loginUser, logoutUser, registerUser, signInWithGoogle, getCandidates, getCompanies, getMatchesForCandidate, getMatchesForCompany, supabase } from "../lib/supabase";
import vibraLatinaImg from "../imports/vibralatina.png";
import astrisImg from "../imports/astris.png";
import genuineImg from "../imports/genuine.png";
import { AdminPanel } from "./components/admin/AdminPanel";

// ── Types ─────────────────────────────────────────────────────────────────────

type Lang = "es" | "en" | "pt" | "fr";
type ModalStep = "language" | "auth" | "role" | "register" | "login" | "none";
type Role = "candidate" | "company" | "mentor" | "admin";
type PaletteKey = "azul" | "tierra" | "contraste" | "verde";
type FontKey = "atkinson" | "lexend";
type QuizAnswers = Record<number, Record<number, number | number[]>>;

// ── Translations ──────────────────────────────────────────────────────────────

const T: Record<Lang, Record<string, any>> = {
  es: {
    "lang.title": "Selecciona tu idioma",
    "lang.sub": "Elige el idioma en que deseas usar Astris",
    "auth.title": "Bienvenido/a a Astris",
    "auth.q": "¿Es tu primera vez aquí?",
    "auth.new": "Es mi primera vez",
    "auth.new.sub": "Crea tu perfil y encuentra tu lugar de trabajo ideal",
    "auth.existing": "Ya tengo una cuenta",
    "auth.existing.sub": "Accede a tu panel y retoma donde lo dejaste",
    "login.title": "Acceder a tu cuenta",
    "login.email": "Correo electrónico",
    "login.pass": "Contraseña",
    "login.role": "Accedo como",
    "login.submit": "Entrar",
    "login.back": "Atrás",
    "role.title": "¿Cómo vas a usar Astris?",
    "role.sub": "Cada perfil tiene su propio flujo de trabajo",
    "role.candidate": "Soy candidato/a",
    "role.candidate.sub": "Busco empleo que se adapte a cómo trabajo mejor",
    "role.company": "Soy una empresa",
    "role.company.sub": "Quiero incorporar talento de forma genuinamente inclusiva",
    "role.mentor": "Soy mentor/a",
    "role.mentor.sub": "Acompaño procesos de inserción laboral adaptativa",
    "role.admin": "Admin",
    "nav.home": "Inicio",
    "nav.profile": "Mi perfil",
    "nav.vacancies": "Vacantes",
    "nav.mentor": "Mi mentor",
    "nav.tracking": "Seguimiento",
    "nav.org": "Perfil organizacional",
    "nav.post": "Publicar vacante",
    "nav.candidates": "Candidatos",
    "nav.dashboard": "Panel",
    "nav.checkins": "Check-ins",
    "nav.companies": "Empresas",
    "nav.logout": "Cerrar sesión",
    "landing.nav.about": "Sobre nosotros",
    "landing.nav.support": "Soporte y contacto",
    "landing.nav.partners": "Aliados",
    "landing.nav.login": "Iniciar sesión",
    "landing.nav.register": "Registrarme",
    "landing.hero.t1": "No preguntamos qué condición tienes.",
    "landing.hero.t2": "Preguntamos cómo trabajas mejor.",
    "landing.hero.sub": "Astris conecta el talento con entornos laborales que se adaptan genuinamente a cómo trabajan las personas — sin diagnósticos, sin barreras invisibles.",
    "landing.hero.cand": "Soy candidato/a",
    "landing.hero.comp": "Soy una empresa",
    "landing.prob.title": "Las barreras invisibles del mercado laboral",
    "landing.pillars.title": "Los cuatro pilares de Astris",
    "landing.how.title": "Cómo funciona",
    "landing.compare.title": "Modelo tradicional vs. Astris",
    "landing.impact.title": "Impacto esperado",
    "landing.impact.cand": "Para el talento",
    "landing.impact.comp": "Para las empresas",
    "landing.footer.program": "Closer to the Stars Educational Program",
    "back": "Atrás",
    "next": "Siguiente",
    "continue": "Continuar",
    "save": "Guardar cambios",
    "start": "Iniciar proceso",
    "choose": "Elegir",
    "palette.title": "Personaliza tu interfaz",
    "palette.sub": "Elige la paleta de colores con la que te sientas más cómodo/a. Tu elección se aplica a todas las pantallas de tu flujo.",
    "palette.dark": "Modo claro / Modo oscuro",
    "palette.font": "Fuente de lectura",
    "quiz.step": "Paso",
    "quiz.of": "de",
    "quiz.axis1": "Procesamiento y Comunicación",
    "quiz.axis2": "Tolerancia Ambiental",
    "quiz.axis3": "Ejecución y Tareas",
    "quiz.axis4": "Ajustes Razonables",
    "quiz.radar.title": "Tu perfil en construcción",
    "quiz.radar.sub": "Se actualiza con cada respuesta",
    "profile.title": "Tu perfil de compatibilidad",
    "profile.privacy": "Tu perfil describe cómo trabajas mejor. Esta información nunca se comparte como diagnóstico médico.",
    "profile.adjustments": "Ajustes razonables declarados",
    "vacancies.title": "Vacantes sugeridas para ti",
    "vacancies.filters": "Filtros",
    "vacancies.modality": "Modalidad",
    "vacancies.sector": "Sector",
    "vacancies.social": "Nivel de interacción",
    "vacancy.match": "Compatibilidad",
    "vacancy.why": "Por qué eres compatible",
    "vacancy.start": "Iniciar proceso",
    "mentor.title": "Elige tu mentor",
    "mentor.sub": "Tu mentor te acompañará desde la preparación hasta los primeros 60 días en el rol.",
    "mentor.choose": "Elegir como mi mentor",
    "accomp.title": "Tu proceso de acompañamiento",
    "accomp.sub": "El mentor coordina cada etapa contigo y con la empresa.",
    "posthire.title": "Seguimiento post-contratación",
    "posthire.status": "Estado de adaptación",
    "comp.org.title": "Perfil organizacional",
    "comp.org.sub": "Define el entorno de tu organización para que el sistema calcule compatibilidades precisas.",
    "comp.vacancy.title": "Publicar vacante",
    "comp.candidates.title": "Perfiles sugeridos",
    "comp.candidates.sub": "Candidatos compatibles con la vacante activa. Sin datos médicos ni diagnósticos.",
    "comp.detail.title": "Perfil del candidato",
    "comp.posthire.title": "Seguimiento de integración",
    "mentor.dash.title": "Panel del mentor",

    vacancies: [
      { id: "V-1042", title: "Analista de Datos Junior", company: "Veritas Analytics", sector: "Tecnología", modality: "Remoto", type: "Tiempo completo", match: 94, socialLevel: "Bajo", adjustments: ["100% remoto", "Comunicación asíncrona", "Horario flexible", "Instrucciones escritas"], desc: "Análisis de bases de datos, generación de reportes y visualización de métricas clave. Ambiente de trabajo tranquilo, equipo pequeño de 6 personas.", companyDesc: "Empresa de análisis de datos con 7 años en el mercado. Cultura de trabajo orientada a resultados, no a presencia." },
      { id: "V-0873", title: "Diseñadora UX", company: "Forma Studio", sector: "Diseño", modality: "Híbrido", type: "Tiempo completo", match: 87, socialLevel: "Medio", adjustments: ["Espacio de trabajo tranquilo", "Briefs escritos", "Evaluación por entregables"], desc: "Diseño de experiencias digitales para clientes de salud y educación. 3 días remoto, 2 en oficina con escritorio individual.", companyDesc: "Estudio de diseño boutique con enfoque en accesibilidad digital. 45 colaboradores, ambiente flexible." },
    ],
    mentors: [
      { id: "M-01", name: "Carmen Ruiz", specialty: "Inclusión laboral y funciones ejecutivas", years: 8, modality: "Virtual", bio: "Psicóloga organizacional especializada en estrategias de inserción laboral para perfiles con estilos cognitivos diversos. Certificada en acompañamiento de transiciones profesionales." },
      { id: "M-02", name: "David Morales", specialty: "Aprendizaje adaptativo en entornos corporativos", years: 5, modality: "Presencial y virtual", bio: "Consultor de inclusión con experiencia en mediación empresa-candidato. Ha acompañado más de 60 procesos de contratación adaptativa exitosos." },
    ],
    candAdjustments: ["Trabajo remoto o híbrido", "Comunicación asíncrona", "Flexibilidad de horario", "Instrucciones escritas", "Espacio individual silencioso"],
    compCandsData: [
      { id: "CAND-A7X2", match: 96, strengths: "Alto enfoque en tareas detalladas. Prefiere entorno silencioso. Requiere instrucciones escritas.", radar: [{ axis: "Procesamiento", value: 88 }, { axis: "T. Ambiental", value: 22 }, { axis: "Ejecución", value: 92 }, { axis: "Ajustes", value: 70 }], env: [{ req: "Trabajo remoto disponible", met: true }, { req: "Comunicación asíncrona", met: true }, { req: "Espacio individual silencioso", met: false }, { req: "Horario flexible", met: true }] },
      { id: "CAND-B3M9", match: 89, strengths: "Excelente tolerancia a entornos variables. Habilidad multitarea alta. Comunicación verbal fluida.", radar: [{ axis: "Procesamiento", value: 65 }, { axis: "T. Ambiental", value: 82 }, { axis: "Ejecución", value: 68 }, { axis: "Ajustes", value: 85 }], env: [{ req: "Trabajo remoto disponible", met: true }, { req: "Comunicación asíncrona", met: false }, { req: "Instrucciones escritas", met: true }, { req: "Evaluación por entregables", met: true }] },
    ],
    prestaciones: ["Audífonos con cancelación de ruido", "Teclados especializados", "Pantallas anti-reflejo", "Rampas y ascensores", "Salas de descanso sensorial", "Modalidad remota e híbrida disponible"],
    politicas: ["Pausas activas programadas", "Flexibilidad de horario"],
    skills: ["Mecanografía", "Microsoft Office", "Lectura intensiva", "Redacción técnica", "Análisis de datos", "Diseño visual", "Comunicación verbal"],
  },
  en: {
    "lang.title": "Select your language",
    "lang.sub": "Choose the language you want to use Astris in",
    "auth.title": "Welcome to Astris",
    "auth.q": "Is this your first time here?",
    "auth.new": "First time here",
    "auth.new.sub": "Create your profile and find your ideal workplace",
    "auth.existing": "I already have an account",
    "auth.existing.sub": "Access your panel and pick up where you left off",
    "login.title": "Sign in to your account",
    "login.email": "Email address",
    "login.pass": "Password",
    "login.role": "I'm signing in as",
    "login.submit": "Sign in",
    "login.back": "Back",
    "role.title": "How will you use Astris?",
    "role.sub": "Each profile has its own workflow",
    "role.candidate": "I'm a Candidate",
    "role.candidate.sub": "I'm looking for work that adapts to how I work best",
    "role.company": "I'm a Company",
    "role.company.sub": "I want to hire talent in a genuinely inclusive way",
    "role.mentor": "I'm a Mentor",
    "role.mentor.sub": "I support adaptive employment integration processes",
    "role.admin": "Admin",
    "nav.home": "Home",
    "nav.profile": "My profile",
    "nav.vacancies": "Vacancies",
    "nav.mentor": "My mentor",
    "nav.tracking": "Tracking",
    "nav.org": "Company profile",
    "nav.post": "Post vacancy",
    "nav.candidates": "Candidates",
    "nav.dashboard": "Dashboard",
    "nav.checkins": "Check-ins",
    "nav.companies": "Companies",
    "nav.logout": "Sign out",
    "landing.nav.about": "About us",
    "landing.nav.support": "Support & Contact",
    "landing.nav.partners": "Partners",
    "landing.nav.login": "Sign in",
    "landing.nav.register": "Register",
    "landing.hero.t1": "We don't ask what condition you have.",
    "landing.hero.t2": "We ask how you work best.",
    "landing.hero.sub": "Astris connects talent with work environments that genuinely adapt to how people work — no diagnoses, no invisible barriers.",
    "landing.hero.cand": "I'm a Candidate",
    "landing.hero.comp": "I'm a Company",
    "landing.prob.title": "The invisible barriers of the job market",
    "landing.pillars.title": "The four pillars of Astris",
    "landing.how.title": "How it works",
    "landing.compare.title": "Traditional model vs. Astris",
    "landing.impact.title": "Expected impact",
    "landing.impact.cand": "For talent",
    "landing.impact.comp": "For companies",
    "landing.footer.program": "Closer to the Stars Educational Program",
    "back": "Back",
    "next": "Next",
    "continue": "Continue",
    "save": "Save changes",
    "start": "Start process",
    "choose": "Choose",
    "palette.title": "Customize your interface",
    "palette.sub": "Choose the color palette you feel most comfortable with. Your choice applies to all screens in your flow.",
    "palette.dark": "Light mode / Dark mode",
    "palette.font": "Reading font",
    "quiz.step": "Step",
    "quiz.of": "of",
    "quiz.axis1": "Processing & Communication",
    "quiz.axis2": "Environmental Tolerance",
    "quiz.axis3": "Execution & Tasks",
    "quiz.axis4": "Reasonable Adjustments",
    "quiz.radar.title": "Your profile in progress",
    "quiz.radar.sub": "Updates with each answer",
    "profile.title": "Your compatibility profile",
    "profile.privacy": "Your profile describes how you work best. This information is never shared as a medical diagnosis.",
    "profile.adjustments": "Declared reasonable adjustments",
    "vacancies.title": "Suggested vacancies for you",
    "vacancies.filters": "Filters",
    "vacancies.modality": "Modality",
    "vacancies.sector": "Sector",
    "vacancies.social": "Interaction level",
    "vacancy.match": "Compatibility",
    "vacancy.why": "Why you are compatible",
    "vacancy.start": "Start process",
    "mentor.title": "Choose your mentor",
    "mentor.sub": "Your mentor will support you from preparation through your first 60 days in the role.",
    "mentor.choose": "Choose as my mentor",
    "accomp.title": "Your accompaniment process",
    "accomp.sub": "Your mentor coordinates each stage with you and with the company.",
    "posthire.title": "Post-hire tracking",
    "posthire.status": "Adaptation status",
    "comp.org.title": "Organizational profile",
    "comp.org.sub": "Define your organization's environment so the system calculates precise compatibility scores.",
    "comp.vacancy.title": "Post a vacancy",
    "comp.candidates.title": "Suggested profiles",
    "comp.candidates.sub": "Candidates compatible with the active vacancy. No medical data or diagnoses.",
    "comp.detail.title": "Candidate profile",
    "comp.posthire.title": "Integration tracking",
    "mentor.dash.title": "Mentor dashboard",

    vacancies: [
      { id: "V-1042", title: "Junior Data Analyst", company: "Veritas Analytics", sector: "Technology", modality: "Remote", type: "Full-time", match: 94, socialLevel: "Low", adjustments: ["100% remote", "Asynchronous communication", "Flexible schedule", "Written instructions"], desc: "Database analysis, reporting, and key metrics visualization. Quiet work environment, small team of 6 people.", companyDesc: "Data analysis company with 7 years in the market. Results-oriented work culture, not presence-oriented." },
      { id: "V-0873", title: "UX Designer", company: "Forma Studio", sector: "Design", modality: "Hybrid", type: "Full-time", match: 87, socialLevel: "Medium", adjustments: ["Quiet workspace", "Written briefs", "Deliverable-based evaluation"], desc: "Design of digital experiences for health and education clients. 3 days remote, 2 in office with individual desk.", companyDesc: "Boutique design studio focusing on digital accessibility. 45 employees, flexible environment." },
    ],
    mentors: [
      { id: "M-01", name: "Carmen Ruiz", specialty: "Labor inclusion & executive functions", years: 8, modality: "Virtual", bio: "Organizational psychologist specializing in labor insertion strategies for diverse cognitive profiles. Certified in professional transition support." },
      { id: "M-02", name: "David Morales", specialty: "Adaptive learning in corporate environments", years: 5, modality: "In-person & virtual", bio: "Inclusion consultant with experience in company-candidate mediation. Has accompanied over 60 successful adaptive hiring processes." },
    ],
    candAdjustments: ["Remote or hybrid work", "Asynchronous communication", "Flexible schedule", "Written instructions", "Quiet individual workspace"],
    compCandsData: [
      { id: "CAND-A7X2", match: 96, strengths: "High focus on detailed tasks. Prefers quiet environment. Requires written instructions.", radar: [{ axis: "Processing", value: 88 }, { axis: "Env. Tolerance", value: 22 }, { axis: "Execution", value: 92 }, { axis: "Adjustments", value: 70 }], env: [{ req: "Remote work available", met: true }, { req: "Asynchronous communication", met: true }, { req: "Quiet individual workspace", met: false }, { req: "Flexible schedule", met: true }] },
      { id: "CAND-B3M9", match: 89, strengths: "Excellent tolerance to variable environments. High multitasking ability. Fluent verbal communication.", radar: [{ axis: "Processing", value: 65 }, { axis: "Env. Tolerance", value: 82 }, { axis: "Execution", value: 68 }, { axis: "Adjustments", value: 85 }], env: [{ req: "Remote work available", met: true }, { req: "Asynchronous communication", met: false }, { req: "Written instructions", met: true }, { req: "Deliverable-based evaluation", met: true }] },
    ],
    prestaciones: ["Noise-canceling headphones", "Specialized keyboards", "Anti-glare screens", "Ramps and elevators", "Sensory rest rooms", "Remote and hybrid modality available"],
    politicas: ["Scheduled active breaks", "Flexible schedule"],
    skills: ["Typing", "Microsoft Office", "Intensive reading", "Technical writing", "Data analysis", "Visual design", "Verbal communication"],
  },
  pt: {
    "lang.title": "Selecione seu idioma",
    "lang.sub": "Escolha o idioma em que deseja usar a Astris",
    "auth.title": "Bem-vindo(a) à Astris",
    "auth.q": "É sua primeira vez aqui?",
    "auth.new": "É minha primeira vez",
    "auth.new.sub": "Crie seu perfil e encontre seu ambiente de trabalho ideal",
    "auth.existing": "Já tenho uma conta",
    "auth.existing.sub": "Acesse seu painel e continue de onde parou",
    "login.title": "Acessar sua conta",
    "login.email": "Endereço de email",
    "login.pass": "Senha",
    "login.role": "Entro como",
    "login.submit": "Entrar",
    "login.back": "Voltar",
    "role.title": "Como você vai usar a Astris?",
    "role.sub": "Cada perfil tem seu próprio fluxo de trabalho",
    "role.candidate": "Sou candidato/a",
    "role.candidate.sub": "Procuro emprego que se adapte à minha forma de trabalhar",
    "role.company": "Sou uma empresa",
    "role.company.sub": "Quero contratar talento de forma genuinamente inclusiva",
    "role.mentor": "Sou mentor(a)",
    "role.mentor.sub": "Acompanho processos de inserção profissional adaptativa",
    "role.admin": "Admin",
    "nav.home": "Início",
    "nav.profile": "Meu perfil",
    "nav.vacancies": "Vagas",
    "nav.mentor": "Meu mentor",
    "nav.tracking": "Acompanhamento",
    "nav.org": "Perfil organizacional",
    "nav.post": "Publicar vaga",
    "nav.candidates": "Candidatos",
    "nav.dashboard": "Painel",
    "nav.checkins": "Check-ins",
    "nav.companies": "Empresas",
    "nav.logout": "Sair",
    "landing.nav.about": "Sobre nós",
    "landing.nav.support": "Suporte e contato",
    "landing.nav.partners": "Aliados",
    "landing.nav.login": "Entrar",
    "landing.nav.register": "Cadastrar-me",
    "landing.hero.t1": "Não perguntamos que condição você tem.",
    "landing.hero.t2": "Perguntamos como você trabalha melhor.",
    "landing.hero.sub": "A Astris conecta talentos com ambientes de trabalho que se adaptam genuinamente à forma de trabalhar das pessoas — sem diagnósticos, sem barreiras invisíveis.",
    "landing.hero.cand": "Sou candidato/a",
    "landing.hero.comp": "Sou uma empresa",
    "landing.prob.title": "As barreiras invisíveis do mercado de trabalho",
    "landing.pillars.title": "Os quatro pilares da Astris",
    "landing.how.title": "Como funciona",
    "landing.compare.title": "Modelo tradicional vs. Astris",
    "landing.impact.title": "Impacto esperado",
    "landing.impact.cand": "Para o talento",
    "landing.impact.comp": "Para as empresas",
    "landing.footer.program": "Closer to the Stars Educational Program",
    "back": "Voltar",
    "next": "Próximo",
    "continue": "Continuar",
    "save": "Salvar alterações",
    "start": "Iniciar processo",
    "choose": "Escolher",
    "palette.title": "Personalize sua interface",
    "palette.sub": "Escolha a paleta de cores com a qual se sente mais confortável. Sua escolha se aplica a todas as telas do seu fluxo.",
    "palette.dark": "Modo claro / Modo escuro",
    "palette.font": "Fonte de leitura",
    "quiz.step": "Passo",
    "quiz.of": "de",
    "quiz.axis1": "Processamento e Comunicação",
    "quiz.axis2": "Tolerância Ambiental",
    "quiz.axis3": "Execução e Tarefas",
    "quiz.axis4": "Ajustes Razoáveis",
    "quiz.radar.title": "Seu perfil em construção",
    "quiz.radar.sub": "Atualiza com cada resposta",
    "profile.title": "Seu perfil de compatibilidade",
    "profile.privacy": "Seu perfil descreve como você trabalha melhor. Esta informação nunca é compartilhada como diagnóstico médico.",
    "profile.adjustments": "Ajustes razoáveis declarados",
    "vacancies.title": "Vagas sugeridas para você",
    "vacancies.filters": "Filtros",
    "vacancies.modality": "Modalidade",
    "vacancies.sector": "Setor",
    "vacancies.social": "Nível de interação",
    "vacancy.match": "Compatibilidade",
    "vacancy.why": "Por que você é compatível",
    "vacancy.start": "Iniciar processo",
    "mentor.title": "Escolha seu mentor",
    "mentor.sub": "Seu mentor vai acompanhá-lo(a) desde a preparação até os primeiros 60 dias no cargo.",
    "mentor.choose": "Escolher como meu mentor",
    "accomp.title": "Seu processo de acompanhamento",
    "accomp.sub": "O mentor coordena cada etapa com você e com a empresa.",
    "posthire.title": "Acompanhamento pós-contratação",
    "posthire.status": "Estado de adaptação",
    "comp.org.title": "Perfil organizacional",
    "comp.org.sub": "Defina o ambiente da sua organização para que o sistema calcule compatibilidades precisas.",
    "comp.vacancy.title": "Publicar vaga",
    "comp.candidates.title": "Perfis sugeridos",
    "comp.candidates.sub": "Candidatos compatíveis com a vaga ativa. Sem dados médicos ou diagnósticos.",
    "comp.detail.title": "Perfil do candidato",
    "comp.posthire.title": "Acompanhamento de integração",
    "mentor.dash.title": "Painel do mentor",

    vacancies: [
      { id: "V-1042", title: "Junior Data Analyst", company: "Veritas Analytics", sector: "Tecnologia", modality: "Remote", type: "Full-time", match: 94, socialLevel: "Low", adjustments: ["100% remote", "Asynchronous communication", "Flexible schedule", "Written instructions"], desc: "Database analysis, reporting, and key metrics visualization. Quiet work environment, small team of 6 people.", companyDesc: "Data analysis company with 7 years in the market. Results-oriented work culture, not presence-oriented." },
      { id: "V-0873", title: "UX Designer", company: "Forma Studio", sector: "Design", modality: "Hybrid", type: "Full-time", match: 87, socialLevel: "Medium", adjustments: ["Quiet workspace", "Written briefs", "Deliverable-based evaluation"], desc: "Design of digital experiences for health and education clients. 3 days remote, 2 in office with individual desk.", companyDesc: "Boutique design studio focusing on digital accessibility. 45 employees, flexible environment." },
    ],
    mentors: [
      { id: "M-01", name: "Carmen Ruiz", specialty: "Labor inclusion & executive functions", years: 8, modality: "Virtual", bio: "Organizational psychologist specializing in labor insertion strategies for diverse cognitive profiles. Certified in professional transition support." },
      { id: "M-02", name: "David Morales", specialty: "Adaptive learning in corporate environments", years: 5, modality: "In-person & virtual", bio: "Inclusion consultant with experience in company-candidate mediation. Has accompanied over 60 successful adaptive hiring processes." },
    ],
    candAdjustments: ["Remote or hybrid work", "Asynchronous communication", "Flexible schedule", "Written instructions", "Quiet individual workspace"],
    compCandsData: [
      { id: "CAND-A7X2", match: 96, strengths: "High focus on detailed tasks. Prefers quiet environment. Requires written instructions.", radar: [{ axis: "Processing", value: 88 }, { axis: "Env. Tolerance", value: 22 }, { axis: "Execution", value: 92 }, { axis: "Adjustments", value: 70 }], env: [{ req: "Remote work available", met: true }, { req: "Asynchronous communication", met: true }, { req: "Quiet individual workspace", met: false }, { req: "Flexible schedule", met: true }] },
      { id: "CAND-B3M9", match: 89, strengths: "Excellent tolerance to variable environments. High multitasking ability. Fluent verbal communication.", radar: [{ axis: "Processing", value: 65 }, { axis: "Env. Tolerance", value: 82 }, { axis: "Execution", value: 68 }, { axis: "Adjustments", value: 85 }], env: [{ req: "Remote work available", met: true }, { req: "Asynchronous communication", met: false }, { req: "Written instructions", met: true }, { req: "Deliverable-based evaluation", met: true }] },
    ],
    prestaciones: ["Noise-canceling headphones", "Specialized keyboards", "Anti-glare screens", "Ramps and elevators", "Sensory rest rooms", "Remote and hybrid modality available"],
    politicas: ["Scheduled active breaks", "Flexible schedule"],
    skills: ["Typing", "Microsoft Office", "Intensive reading", "Technical writing", "Data analysis", "Visual design", "Verbal communication"],
  },
  fr: {
    "lang.title": "Choisissez votre langue",
    "lang.sub": "Choisissez la langue dans laquelle vous souhaitez utiliser Astris",
    "auth.title": "Bienvenue sur Astris",
    "auth.q": "C'est votre première fois ici ?",
    "auth.new": "Première fois ici",
    "auth.new.sub": "Créez votre profil et trouvez votre environnement de travail idéal",
    "auth.existing": "J'ai déjà un compte",
    "auth.existing.sub": "Accédez à votre tableau de bord et reprenez là où vous en étiez",
    "login.title": "Accéder à votre compte",
    "login.email": "Adresse email",
    "login.pass": "Mot de passe",
    "login.role": "Je me connecte en tant que",
    "login.submit": "Se connecter",
    "login.back": "Retour",
    "role.title": "Comment allez-vous utiliser Astris ?",
    "role.sub": "Chaque profil dispose de son propre flux de travail",
    "role.candidate": "Je suis candidat(e)",
    "role.candidate.sub": "Je cherche un emploi adapté à ma façon de travailler",
    "role.company": "Je suis une entreprise",
    "role.company.sub": "Je veux recruter des talents de façon genuinement inclusive",
    "role.mentor": "Je suis mentor(e)",
    "role.mentor.sub": "J'accompagne des processus d'insertion professionnelle adaptative",
    "role.admin": "Admin",
    "nav.home": "Accueil",
    "nav.profile": "Mon profil",
    "nav.vacancies": "Offres",
    "nav.mentor": "Mon mentor",
    "nav.tracking": "Suivi",
    "nav.org": "Profil de l'entreprise",
    "nav.post": "Publier une offre",
    "nav.candidates": "Candidats",
    "nav.dashboard": "Tableau de bord",
    "nav.checkins": "Check-ins",
    "nav.companies": "Entreprises",
    "nav.logout": "Se déconnecter",
    "landing.nav.about": "À propos",
    "landing.nav.support": "Support et contact",
    "landing.nav.partners": "Partenaires",
    "landing.nav.login": "Se connecter",
    "landing.nav.register": "S'inscrire",
    "landing.hero.t1": "Nous ne demandons pas quelle condition vous avez.",
    "landing.hero.t2": "Nous demandons comment vous travaillez le mieux.",
    "landing.hero.sub": "Astris connecte les talents avec des environnements de travail qui s'adaptent genuinement à la façon dont les personnes travaillent — sans diagnostics, sans barrières invisibles.",
    "landing.hero.cand": "Je suis candidat(e)",
    "landing.hero.comp": "Je suis une entreprise",
    "landing.prob.title": "Les barrières invisibles du marché de l'emploi",
    "landing.pillars.title": "Les quatre piliers d'Astris",
    "landing.how.title": "Comment ça marche",
    "landing.compare.title": "Modèle traditionnel vs. Astris",
    "landing.impact.title": "Impact attendu",
    "landing.impact.cand": "Pour les talents",
    "landing.impact.comp": "Pour les entreprises",
    "landing.footer.program": "Closer to the Stars Educational Program",
    "back": "Retour",
    "next": "Suivant",
    "continue": "Continuer",
    "save": "Enregistrer",
    "start": "Démarrer le processus",
    "choose": "Choisir",
    "palette.title": "Personnalisez votre interface",
    "palette.sub": "Choisissez la palette de couleurs avec laquelle vous vous sentez le plus à l'aise. Votre choix s'applique à tous les écrans de votre flux.",
    "palette.dark": "Mode clair / Mode sombre",
    "palette.font": "Police de lecture",
    "quiz.step": "Étape",
    "quiz.of": "sur",
    "quiz.axis1": "Traitement et Communication",
    "quiz.axis2": "Tolérance Environnementale",
    "quiz.axis3": "Exécution et Tâches",
    "quiz.axis4": "Aménagements Raisonnables",
    "quiz.radar.title": "Votre profil en construction",
    "quiz.radar.sub": "Se met à jour avec chaque réponse",
    "profile.title": "Votre profil de compatibilité",
    "profile.privacy": "Votre profil décrit comment vous travaillez le mieux. Cette information n'est jamais partagée en tant que diagnostic médical.",
    "profile.adjustments": "Aménagements raisonnables déclarés",
    "vacancies.title": "Offres suggérées pour vous",
    "vacancies.filters": "Filtres",
    "vacancies.modality": "Modalité",
    "vacancies.sector": "Secteur",
    "vacancies.social": "Niveau d'interaction",
    "vacancy.match": "Compatibilité",
    "vacancy.why": "Pourquoi vous êtes compatible",
    "vacancy.start": "Démarrer le processus",
    "mentor.title": "Choisissez votre mentor",
    "mentor.sub": "Votre mentor vous accompagnera de la préparation aux 60 premiers jours dans le rôle.",
    "mentor.choose": "Choisir comme mon mentor",
    "accomp.title": "Votre processus d'accompagnement",
    "accomp.sub": "Le mentor coordonne chaque étape avec vous et avec l'entreprise.",
    "posthire.title": "Suivi post-embauche",
    "posthire.status": "État d'adaptation",
    "comp.org.title": "Profil organisationnel",
    "comp.org.sub": "Définissez l'environnement de votre organisation pour que le système calcule des compatibilités précises.",
    "comp.vacancy.title": "Publier une offre",
    "comp.candidates.title": "Profils suggérés",
    "comp.candidates.sub": "Candidats compatibles avec l'offre active. Sans données médicales ni diagnostics.",
    "comp.detail.title": "Profil du candidat",
    "comp.posthire.title": "Suivi d'intégration",
    "mentor.dash.title": "Tableau de bord mentor",

    vacancies: [
      { id: "V-1042", title: "Junior Data Analyst", company: "Veritas Analytics", sector: "Technologie", modality: "Remote", type: "Full-time", match: 94, socialLevel: "Low", adjustments: ["100% remote", "Asynchronous communication", "Flexible schedule", "Written instructions"], desc: "Database analysis, reporting, and key metrics visualization. Quiet work environment, small team of 6 people.", companyDesc: "Data analysis company with 7 years in the market. Results-oriented work culture, not presence-oriented." },
      { id: "V-0873", title: "UX Designer", company: "Forma Studio", sector: "Design", modality: "Hybrid", type: "Full-time", match: 87, socialLevel: "Medium", adjustments: ["Quiet workspace", "Written briefs", "Deliverable-based evaluation"], desc: "Design of digital experiences for health and education clients. 3 days remote, 2 in office with individual desk.", companyDesc: "Boutique design studio focusing on digital accessibility. 45 employees, flexible environment." },
    ],
    mentors: [
      { id: "M-01", name: "Carmen Ruiz", specialty: "Labor inclusion & executive functions", years: 8, modality: "Virtual", bio: "Organizational psychologist specializing in labor insertion strategies for diverse cognitive profiles. Certified in professional transition support." },
      { id: "M-02", name: "David Morales", specialty: "Adaptive learning in corporate environments", years: 5, modality: "In-person & virtual", bio: "Inclusion consultant with experience in company-candidate mediation. Has accompanied over 60 successful adaptive hiring processes." },
    ],
    candAdjustments: ["Remote or hybrid work", "Asynchronous communication", "Flexible schedule", "Written instructions", "Quiet individual workspace"],
    compCandsData: [
      { id: "CAND-A7X2", match: 96, strengths: "High focus on detailed tasks. Prefers quiet environment. Requires written instructions.", radar: [{ axis: "Processing", value: 88 }, { axis: "Env. Tolerance", value: 22 }, { axis: "Execution", value: 92 }, { axis: "Adjustments", value: 70 }], env: [{ req: "Remote work available", met: true }, { req: "Asynchronous communication", met: true }, { req: "Quiet individual workspace", met: false }, { req: "Flexible schedule", met: true }] },
      { id: "CAND-B3M9", match: 89, strengths: "Excellent tolerance to variable environments. High multitasking ability. Fluent verbal communication.", radar: [{ axis: "Processing", value: 65 }, { axis: "Env. Tolerance", value: 82 }, { axis: "Execution", value: 68 }, { axis: "Adjustments", value: 85 }], env: [{ req: "Remote work available", met: true }, { req: "Asynchronous communication", met: false }, { req: "Written instructions", met: true }, { req: "Deliverable-based evaluation", met: true }] },
    ],
    prestaciones: ["Noise-canceling headphones", "Specialized keyboards", "Anti-glare screens", "Ramps and elevators", "Sensory rest rooms", "Remote and hybrid modality available"],
    politicas: ["Scheduled active breaks", "Flexible schedule"],
    skills: ["Typing", "Microsoft Office", "Intensive reading", "Technical writing", "Data analysis", "Visual design", "Verbal communication"],
  },
};

function useT(lang: Lang) {
  return (key: string) => T[lang][key] ?? key;
}

// ── Questionnaire Data ────────────────────────────────────────────────────────

const QUIZ_AXES = [
  {
    key: "axis1",
    radarAxis: "Procesamiento",
    questions: [
      {
        stems: { es: "Interacción social: ¿Prefieres trabajar solo/a y de forma autónoma, o en equipo con interacción constante?", en: "Social interaction: Do you prefer working alone and autonomously, or in a team with constant interaction?", pt: "Interação social: Você prefere trabalhar sozinho/a e de forma autônoma, ou em equipe com interação constante?", fr: "Interaction sociale: Préférez-vous travailler seul(e) de façon autonome, ou en équipe avec une interaction constante?" },
        opts: { es: ["Prefiero trabajar solo/a", "Prefiero trabajar en equipo", "Depende de la tarea"], en: ["I prefer working alone", "I prefer working in a team", "Depends on the task"], pt: ["Prefiro trabalhar sozinho/a", "Prefiro trabalhar em equipe", "Depende da tarefa"], fr: ["Je préfère travailler seul(e)", "Je préfère travailler en équipe", "Ça dépend de la tâche"] },
        vals: [88, 35, 62], type: "single" as const,
      },
      {
        stems: { es: "Retroalimentación: ¿Prefieres que te digan cómo vas apenas terminas una tarea, o revisar tu trabajo en reuniones programadas?", en: "Feedback: Do you prefer being told how you're doing right after a task, or reviewing your work in scheduled meetings?", pt: "Feedback: Você prefere receber retorno logo após concluir uma tarefa, ou revisar seu trabalho em reuniões agendadas?", fr: "Retour: Préférez-vous être informé(e) de vos progrès juste après une tâche, ou revoir votre travail lors de réunions planifiées?" },
        opts: { es: ["Retroalimentación inmediata", "En reuniones programadas", "Prefiero autoevaluar"], en: ["Immediate feedback", "In scheduled meetings", "I prefer self-assessment"], pt: ["Feedback imediato", "Em reuniões agendadas", "Prefiro autoavaliar"], fr: ["Retour immédiat", "Lors de réunions planifiées", "Je préfère m'autoévaluer"] },
        vals: [82, 45, 65], type: "single" as const,
      },
      {
        stems: { es: "Formato de entrada: ¿Aprendes mejor viendo videos o diagramas, leyendo instrucciones escritas, o escuchando explicaciones?", en: "Input format: Do you learn better watching videos or diagrams, reading written instructions, or listening to explanations?", pt: "Formato de entrada: Você aprende melhor assistindo vídeos ou diagramas, lendo instruções escritas, ou ouvindo explicações?", fr: "Format d'entrée: Apprenez-vous mieux en regardant des vidéos/diagrammes, en lisant des instructions écrites, ou en écoutant des explications?" },
        opts: { es: ["Viendo videos o diagramas", "Leyendo instrucciones escritas", "Escuchando explicaciones"], en: ["Watching videos or diagrams", "Reading written instructions", "Listening to explanations"], pt: ["Assistindo vídeos ou diagramas", "Lendo instruções escritas", "Ouvindo explicações"], fr: ["En regardant des vidéos/diagrammes", "En lisant des instructions écrites", "En écoutant des explications"] },
        vals: [70, 90, 52], type: "single" as const,
      },
      {
        stems: { es: "Estilo de comunicación: ¿Prefieres instrucciones directas y literales, o te es cómodo interpretar instrucciones abiertas?", en: "Communication style: Do you prefer direct and literal instructions, or are you comfortable interpreting open-ended instructions?", pt: "Estilo de comunicação: Você prefere instruções diretas e literais, ou se sente confortável interpretando instruções abertas?", fr: "Style de communication: Préférez-vous des instructions directes et littérales, ou êtes-vous à l'aise pour interpréter des instructions ouvertes?" },
        opts: { es: ["Directas y literales", "Puedo interpretar instrucciones abiertas", "Me adapto a ambas"], en: ["Direct and literal", "I can interpret open-ended instructions", "I adapt to both"], pt: ["Diretas e literais", "Consigo interpretar instruções abertas", "Me adapto a ambas"], fr: ["Directes et littérales", "Je peux interpréter des instructions ouvertes", "Je m'adapte aux deux"] },
        vals: [90, 42, 65], type: "single" as const,
      },
    ],
  },
  {
    key: "axis2",
    radarAxis: "T. Ambiental",
    questions: [
      {
        stems: { es: "Carga sensorial auditiva: ¿Necesitas silencio total, toleras ruido moderado, o te es indiferente un ambiente ruidoso?", en: "Auditory load: Do you need total silence, tolerate moderate noise, or are indifferent to a noisy environment?", pt: "Carga sensorial auditiva: Você precisa de silêncio total, tolera ruído moderado, ou é indiferente a um ambiente barulhento?", fr: "Charge sensorielle auditive: Avez-vous besoin d'un silence total, tolérez-vous un bruit modéré, ou êtes-vous indifférent(e) à un environnement bruyant?" },
        opts: { es: ["Necesito silencio total", "Tolero ruido moderado", "El ruido no me afecta"], en: ["I need total silence", "I tolerate moderate noise", "Noise doesn't affect me"], pt: ["Preciso de silêncio total", "Tolero ruído moderado", "O ruído não me afeta"], fr: ["J'ai besoin d'un silence total", "Je tolère un bruit modéré", "Le bruit ne m'affecte pas"] },
        vals: [20, 62, 90], type: "single" as const,
      },
      {
        stems: { es: "Carga sensorial visual: ¿Te molestan las luces fluorescentes, prefieres luz natural, o no tienes preferencia?", en: "Visual load: Do fluorescent lights bother you, do you prefer natural light, or have no preference?", pt: "Carga sensorial visual: As luzes fluorescentes te incomodam, você prefere luz natural, ou não tem preferência?", fr: "Charge sensorielle visuelle: Les lumières fluorescentes vous gênent-elles, préférez-vous la lumière naturelle, ou n'avez-vous pas de préférence?" },
        opts: { es: ["Me molestan las luces fluorescentes", "Prefiero luz natural", "No tengo preferencia"], en: ["Fluorescent lights bother me", "I prefer natural light", "No preference"], pt: ["Luzes fluorescentes me incomodam", "Prefiro luz natural", "Não tenho preferência"], fr: ["Les lumières fluorescentes me gênent", "Je préfère la lumière naturelle", "Pas de préférence"] },
        vals: [22, 58, 85], type: "single" as const,
      },
      {
        stems: { es: "Estructura del espacio: ¿Necesitas un puesto fijo, prefieres espacios abiertos o rotativos, o prefieres trabajar remoto?", en: "Space structure: Do you need a fixed desk, prefer open or rotating spaces, or prefer working remotely?", pt: "Estrutura do espaço: Você precisa de uma mesa fixa, prefere espaços abertos ou rotativos, ou prefere trabalhar remotamente?", fr: "Structure de l'espace: Avez-vous besoin d'un bureau fixe, préférez-vous des espaces ouverts ou rotatifs, ou préférez-vous travailler à distance?" },
        opts: { es: ["Necesito un puesto fijo", "Prefiero espacios abiertos o rotativos", "Prefiero trabajar remoto"], en: ["I need a fixed desk", "I prefer open or rotating spaces", "I prefer working remotely"], pt: ["Preciso de uma mesa fixa", "Prefiro espaços abertos ou rotativos", "Prefiro trabalhar remotamente"], fr: ["J'ai besoin d'un bureau fixe", "Je préfère des espaces ouverts/rotatifs", "Je préfère travailler à distance"] },
        vals: [38, 60, 88], type: "single" as const,
      },
      {
        stems: { es: "Interrupciones: ¿Necesitas bloques de tiempo sin interrupciones, o te adaptas bien a cambios de contexto frecuentes?", en: "Interruptions: Do you need uninterrupted time blocks, or do you adapt well to frequent context switches?", pt: "Interrupções: Você precisa de blocos de tempo sem interrupções, ou se adapta bem a mudanças frequentes de contexto?", fr: "Interruptions: Avez-vous besoin de plages horaires sans interruption, ou vous adaptez-vous bien aux changements de contexte fréquents?" },
        opts: { es: ["Necesito bloques sin interrupciones", "Me adapto bien a cambios frecuentes", "Depende del tipo de tarea"], en: ["I need uninterrupted blocks", "I adapt well to frequent changes", "Depends on the type of task"], pt: ["Preciso de blocos sem interrupções", "Me adapto bem a mudanças frequentes", "Depende do tipo de tarefa"], fr: ["J'ai besoin de plages sans interruption", "Je m'adapte bien aux changements fréquents", "Ça dépend du type de tâche"] },
        vals: [18, 88, 55], type: "single" as const,
      },
    ],
  },
  {
    key: "axis3",
    radarAxis: "Ejecución",
    questions: [
      {
        stems: { es: "Foco y atención: ¿Te concentras mejor en una tarea larga y repetitiva, o prefieres tareas cortas y variadas?", en: "Focus and attention: Do you concentrate better on a long, repetitive task, or do you prefer short, varied tasks?", pt: "Foco e atenção: Você se concentra melhor em uma tarefa longa e repetitiva, ou prefere tarefas curtas e variadas?", fr: "Concentration: Vous concentrez-vous mieux sur une tâche longue et répétitive, ou préférez-vous des tâches courtes et variées?" },
        opts: { es: ["Tarea larga y repetitiva", "Tareas cortas y variadas", "Ambas me funcionan"], en: ["Long and repetitive task", "Short and varied tasks", "Both work for me"], pt: ["Tarefa longa e repetitiva", "Tarefas curtas e variadas", "Ambas funcionam para mim"], fr: ["Tâche longue et répétitive", "Tâches courtes et variées", "Les deux fonctionnent pour moi"] },
        vals: [82, 52, 68], type: "single" as const,
      },
      {
        stems: { es: "Estructura de la tarea: ¿Prefieres rutinas claras y estructuradas, o resolver problemas de forma creativa sin un camino fijo?", en: "Task structure: Do you prefer clear, structured routines, or solving problems creatively without a fixed path?", pt: "Estrutura da tarefa: Você prefere rotinas claras e estruturadas, ou resolver problemas de forma criativa sem um caminho fixo?", fr: "Structure de la tâche: Préférez-vous des routines claires et structurées, ou résoudre des problèmes de façon créative sans chemin fixe?" },
        opts: { es: ["Rutinas claras y estructuradas", "Solución creativa sin camino fijo", "Una mezcla de ambas"], en: ["Clear and structured routines", "Creative solutions without a fixed path", "A mix of both"], pt: ["Rotinas claras e estruturadas", "Solução criativa sem caminho fixo", "Uma mistura de ambas"], fr: ["Des routines claires et structurées", "Des solutions créatives sans chemin fixe", "Un mélange des deux"] },
        vals: [88, 45, 68], type: "single" as const,
      },
      {
        stems: { es: "Manejo del tiempo: ¿Necesitas horarios flexibles, o trabajas mejor con un horario fijo y predecible?", en: "Time management: Do you need flexible hours, or do you work better with a fixed and predictable schedule?", pt: "Gestão do tempo: Você precisa de horários flexíveis, ou trabalha melhor com um horário fixo e previsível?", fr: "Gestion du temps: Avez-vous besoin d'horaires flexibles, ou travaillez-vous mieux avec un horaire fixe et prévisible?" },
        opts: { es: ["Necesito horarios flexibles", "Trabajo mejor con horario fijo", "Me adapto a cualquiera"], en: ["I need flexible hours", "I work better with a fixed schedule", "I adapt to either"], pt: ["Preciso de horários flexíveis", "Trabalho melhor com horário fixo", "Me adapto a qualquer um"], fr: ["J'ai besoin d'horaires flexibles", "Je travaille mieux avec un horaire fixe", "Je m'adapte aux deux"] },
        vals: [62, 82, 72], type: "single" as const,
      },
      {
        stems: { es: "Profundidad de tarea: ¿Prefieres especializarte en pocas tareas a fondo, o manejar varias tareas distintas a la vez?", en: "Task depth: Do you prefer specializing in a few tasks deeply, or managing several different tasks at once?", pt: "Profundidade da tarefa: Você prefere se especializar em poucas tarefas em profundidade, ou gerenciar várias tarefas diferentes ao mesmo tempo?", fr: "Profondeur de la tâche: Préférez-vous vous spécialiser dans peu de tâches en profondeur, ou gérer plusieurs tâches différentes simultanément?" },
        opts: { es: ["Especializarme en pocas tareas a fondo", "Manejar varias tareas distintas", "Depende del contexto"], en: ["Specialize deeply in few tasks", "Manage several different tasks", "Depends on the context"], pt: ["Especializar-me em poucas tarefas em profundidade", "Gerenciar várias tarefas diferentes", "Depende do contexto"], fr: ["Me spécialiser en peu de tâches en profondeur", "Gérer plusieurs tâches différentes", "Ça dépend du contexte"] },
        vals: [88, 50, 68], type: "single" as const,
      },
    ],
  },
  {
    key: "axis4",
    radarAxis: "Ajustes",
    questions: [
      {
        stems: { es: "Software de accesibilidad: ¿Cuál de estos recursos digitales te sería útil? (puedes seleccionar varios)", en: "Accessibility software: Which of these digital resources would be useful to you? (you can select multiple)", pt: "Software de acessibilidade: Qual desses recursos digitais seria útil para você? (pode selecionar vários)", fr: "Logiciels d'accessibilité: Quels de ces outils numériques vous seraient utiles? (vous pouvez en sélectionner plusieurs)" },
        opts: { es: ["Lector de pantalla", "Tipografía para dislexia", "Bloqueador de distracciones", "Alto contraste", "Ninguno por ahora"], en: ["Screen reader", "Dyslexia-friendly font", "Distraction blocker", "High contrast", "None for now"], pt: ["Leitor de tela", "Tipografia para dislexia", "Bloqueador de distrações", "Alto contraste", "Nenhum por enquanto"], fr: ["Lecteur d'écran", "Police pour dyslexie", "Bloqueur de distractions", "Contraste élevé", "Aucun pour l'instant"] },
        vals: [], type: "multi" as const,
      },
      {
        stems: { es: "Hardware de accesibilidad: ¿Qué recursos físicos necesitarías? (puedes seleccionar varios)", en: "Accessibility hardware: What physical resources would you need? (you can select multiple)", pt: "Hardware de acessibilidade: Quais recursos físicos você precisaria? (pode selecionar vários)", fr: "Matériel d'accessibilité: De quels équipements physiques auriez-vous besoin? (vous pouvez en sélectionner plusieurs)" },
        opts: { es: ["Audífonos con cancelación de ruido", "Teclado adaptado", "Pantalla sin parpadeo", "Ninguno por ahora"], en: ["Noise-canceling headphones", "Adapted keyboard", "Flicker-free screen", "None for now"], pt: ["Fones com cancelamento de ruído", "Teclado adaptado", "Tela sem cintilação", "Nenhum por enquanto"], fr: ["Casque antibruit", "Clavier adapté", "Écran sans scintillement", "Aucun pour l'instant"] },
        vals: [], type: "multi" as const,
      },
      {
        stems: { es: "Acompañamiento inicial: ¿Te gustaría tener un mentor asignado durante tus primeros 30 a 60 días en el rol?", en: "Initial support: Would you like to have an assigned mentor during your first 30 to 60 days in the role?", pt: "Acompanhamento inicial: Você gostaria de ter um mentor designado durante seus primeiros 30 a 60 dias no cargo?", fr: "Accompagnement initial: Souhaitez-vous avoir un mentor assigné pendant vos 30 à 60 premiers jours dans le rôle?" },
        opts: { es: ["Sí, me gustaría tener un mentor", "No por ahora", "Quiero saber más primero"], en: ["Yes, I'd like a mentor", "Not for now", "I want to learn more first"], pt: ["Sim, gostaria de ter um mentor", "Não por enquanto", "Quero saber mais primeiro"], fr: ["Oui, j'aimerais avoir un mentor", "Pas pour l'instant", "Je veux d'abord en savoir plus"] },
        vals: [85, 32, 58], type: "single" as const,
      },
      {
        stems: { es: "Modalidad de trabajo: ¿Prefieres trabajo presencial, híbrido o completamente remoto?", en: "Work modality: Do you prefer in-person, hybrid, or fully remote work?", pt: "Modalidade de trabalho: Você prefere trabalho presencial, híbrido ou totalmente remoto?", fr: "Modalité de travail: Préférez-vous le travail en présentiel, hybride ou entièrement à distance?" },
        opts: { es: ["Presencial", "Híbrido", "Completamente remoto"], en: ["In-person", "Hybrid", "Fully remote"], pt: ["Presencial", "Híbrido", "Totalmente remoto"], fr: ["En présentiel", "Hybride", "Entièrement à distance"] },
        vals: [38, 65, 90], type: "single" as const,
      },
    ],
  },
];

// ── Locale Content (complex multi-language content arrays) ────────────────────

const CONTENT = {
  es: {
    pillars: [
      { num: "01", title: "Preparar", body: "Caracterizamos cómo trabaja cada persona y qué entorno necesita. Sin diagnósticos, sin etiquetas clínicas." },
      { num: "02", title: "Adaptar", body: "La empresa define exactamente qué ajustes puede ofrecer antes de iniciar cualquier proceso de selección." },
      { num: "03", title: "Acompañar", body: "Un mentor humano guía al candidato y a la empresa durante todo el proceso, desde el match hasta el día 60." },
      { num: "04", title: "Conectar", body: "El sistema cruza perfiles y sugiere compatibilidades reales, no percepciones. Ambas partes saben qué esperar." },
    ],
    problems: [
      "Los procesos de selección estándar no están diseñados para evaluar el talento — están diseñados para filtrar diferencias.",
      "Más del 85% de las personas con estilos cognitivos diversos en edad laboral están desempleadas o subempleadas, no por falta de capacidades, sino por falta de compatibilidad.",
      "Las entrevistas convencionales, los entornos no adaptados y la comunicación ambigua excluyen sistemáticamente perfiles con alto potencial.",
      "Una contratación fallida por ausencia de ajustes razonables cuesta entre 3 y 5 veces el salario anual del cargo.",
    ],
    how: [
      { phase: "1. Perfil y Adaptación", desc: "El candidato caracteriza su estilo de trabajo en 4 ejes. La empresa documenta su entorno y ajustes disponibles." },
      { phase: "2. Matching Laboral", desc: "El sistema cruza ambos perfiles y sugiere compatibilidades con porcentaje visible para el candidato." },
      { phase: "3. Entrenamiento Personalizado", desc: "El mentor acompaña la preparación para el proceso de selección, adaptado al candidato y a la empresa." },
      { phase: "4. Inserción y Seguimiento", desc: "Post-contratación, el mentor monitorea la adaptación durante los primeros 60 a 90 días del nuevo rol." },
    ],
    compare: [
      { aspect: "Proceso de selección", trad: "Entrevista única, sin adaptación", astris: "Perfilamiento en 4 ejes, formato adaptado" },
      { aspect: "Información del candidato", trad: "Diagnóstico y historial clínico", astris: "Cómo trabaja mejor y qué necesita el entorno" },
      { aspect: "Compatibilidad", trad: "Determinada por el reclutador", astris: "Calculada por el sistema con datos objetivos" },
      { aspect: "Ajustes razonables", trad: "Reactivos o inexistentes", astris: "Definidos y comprometidos desde el inicio" },
      { aspect: "Seguimiento", trad: "Ninguno o informal", astris: "Protocolo de 8 etapas con mentor asignado" },
      { aspect: "Privacidad del candidato", trad: "Variable", astris: "Nunca se comparten datos médicos" },
    ],
    impactCand: ["Reducción del 60% en tiempo de búsqueda de empleo compatible", "Acceso a roles que genuinamente se ajustan a su estilo de trabajo", "Acompañamiento desde el primer día de proceso", "Sin necesidad de revelar diagnósticos médicos en ningún momento"],
    impactComp: ["Acceso a talento altamente especializado y motivado", "Reducción del 40% en rotación durante los primeros 6 meses", "Marco legal claro para implementar ajustes razonables", "Asesoría continua del mentor durante todo el período de integración"],
    privacyTitle: "Tu privacidad es el cimiento, no un complemento.",
    privacyBody: "Ningún diagnóstico médico se almacena ni se comparte. Las empresas nunca ven nombres reales ni fotografías — solo perfiles de compatibilidad anónimos. El candidato controla qué información es visible en cada etapa.",
    accompStages: [
      { label: "Análisis de perfil", done: true, current: false },
      { label: "Primer contacto con el mentor", done: true, current: false },
      { label: "Plan de acompañamiento", done: true, current: false },
      { label: "Reunión de explicación con la empresa", done: false, current: true },
      { label: "Consentimiento y acuerdo", done: false, current: false },
      { label: "Inicio de capacitación adaptada", done: false, current: false },
      { label: "Vinculación laboral", done: false, current: false },
      { label: "Seguimiento post-contratación", done: false, current: false },
    ],
    statusLabels: ["Adaptándome", "Estable", "Consolidado"],
    postHireQ1: "¿Cómo estuvo tu semana en términos de comodidad en el entorno de trabajo?",
    postHireQ2: "¿Hubo algo que te generó dificultad o incomodidad?",
    postHireTextPlaceholder: "Escribe aquí tu respuesta...",
    postHireSend: "Enviar reporte",
    postHireCheckins: "Historial de check-ins",
    postHireHistory: [
      { date: "Jun 10, 2025", note: "Primera semana positiva. Herramientas asíncronas configuradas correctamente." },
      { date: "Jun 3, 2025", note: "Onboarding completado. Plan de acompañamiento acordado con mentor." },
    ],
    previewNav: ["Mi perfil", "Vacantes", "Mi mentor"],
    previewTitle: "Vacantes sugeridas para ti",
    previewSubtitle: "3 vacantes compatibles esta semana",
    mentorAssigned: "Tu mentor asignado",
    openNotes: "Abrir notas de sesión",
    scheduleCheckin: "Agendar check-in",
    orgSections: ["Datos generales", "Filosofía y cultura", "Entorno físico", "Prestaciones de accesibilidad", "Políticas"],
    orgSectionIds: ["general", "cultura", "entorno", "prestaciones", "politicas"],
    compPostHireStatus: "Estado de adaptación",
    compPostHireObs: "Observaciones de la empresa",
    compPostHireObsPlaceholder: "Escribe tus observaciones sobre el proceso de adaptación...",
    compPostHireSend: "Enviar observaciones",
    compPostHireContact: "Contacto con el mentor",
    compPostHireSendMsg: "Enviar mensaje",
    mentorProcesses: "Procesos activos",
    mentorCheckins: "Próximos check-ins",
    mentorCompanies: "Empresas",
    mentorImpact: "Impacto este mes",
    activeFor: "Activo hace",
    sessionNotes: "Notas de sesión",
    nextAction: "Próxima acción",
    scheduleSession: "Agendar sesión",
    notes: "Notas",
    registerName: "Nombre completo",
    registerTitle: "Crea tu cuenta",
    registerSubmit: "Crear cuenta",
    footerLinks: ["Accesibilidad", "Privacidad", "Términos de uso"],
    checkinPageTitle: "Check-ins",
    checkinPageSub: "Sesiones programadas con tus candidatos",
    companiesPageTitle: "Empresas colaboradoras",
    companiesPageSub: "Empresas activas en procesos de inclusión",
  },
  en: {
    pillars: [
      { num: "01", title: "Prepare", body: "We characterize how each person works and what environment they need. No diagnoses, no clinical labels." },
      { num: "02", title: "Adapt", body: "The company defines exactly what adjustments it can offer before starting any selection process." },
      { num: "03", title: "Accompany", body: "A human mentor guides the candidate and the company throughout the entire process, from match to day 60." },
      { num: "04", title: "Connect", body: "The system cross-references profiles and suggests real compatibilities, not perceptions. Both parties know what to expect." },
    ],
    problems: [
      "Standard selection processes are not designed to evaluate talent — they are designed to filter out differences.",
      "More than 85% of people with diverse cognitive styles of working age are unemployed or underemployed, not due to lack of skills, but lack of compatibility.",
      "Conventional interviews, unadapted environments, and ambiguous communication systematically exclude high-potential profiles.",
      "A failed hire due to absence of reasonable adjustments costs between 3 and 5 times the annual salary for the role.",
    ],
    how: [
      { phase: "1. Profile & Adaptation", desc: "The candidate profiles their work style across 4 axes. The company documents their environment and available adjustments." },
      { phase: "2. Job Matching", desc: "The system cross-references both profiles and suggests compatibilities with a visible percentage for the candidate." },
      { phase: "3. Personalized Training", desc: "The mentor supports preparation for the selection process, adapted to both the candidate and the company." },
      { phase: "4. Placement & Follow-up", desc: "Post-hire, the mentor monitors adaptation during the first 60 to 90 days of the new role." },
    ],
    compare: [
      { aspect: "Selection process", trad: "Single interview, no adaptation", astris: "4-axis profiling, adapted format" },
      { aspect: "Candidate information", trad: "Diagnosis and clinical history", astris: "How they work best and what their environment needs" },
      { aspect: "Compatibility", trad: "Determined by the recruiter", astris: "Calculated by the system with objective data" },
      { aspect: "Reasonable adjustments", trad: "Reactive or non-existent", astris: "Defined and committed to from the start" },
      { aspect: "Follow-up", trad: "None or informal", astris: "8-stage protocol with assigned mentor" },
      { aspect: "Candidate privacy", trad: "Variable", astris: "Medical data never shared" },
    ],
    impactCand: ["60% reduction in time to find compatible employment", "Access to roles that genuinely adapt to their work style", "Support from day one of the process", "No need to disclose medical diagnoses at any point"],
    impactComp: ["Access to highly specialized and motivated talent", "40% reduction in turnover during the first 6 months", "Clear legal framework for implementing reasonable adjustments", "Continuous mentor guidance throughout the integration period"],
    privacyTitle: "Your privacy is the foundation, not an afterthought.",
    privacyBody: "No medical diagnoses are stored or shared. Companies never see real names or photos — only anonymous compatibility profiles. The candidate controls what information is visible at every stage.",
    accompStages: [
      { label: "Profile analysis", done: true, current: false },
      { label: "First contact with mentor", done: true, current: false },
      { label: "Accompaniment plan", done: true, current: false },
      { label: "Explanation meeting with company", done: false, current: true },
      { label: "Consent and agreement", done: false, current: false },
      { label: "Start of adapted training", done: false, current: false },
      { label: "Employment placement", done: false, current: false },
      { label: "Post-hire follow-up", done: false, current: false },
    ],
    statusLabels: ["Adjusting", "Stable", "Established"],
    postHireQ1: "How was your week in terms of comfort in the work environment?",
    postHireQ2: "Was there anything that caused difficulty or discomfort?",
    postHireTextPlaceholder: "Write your answer here...",
    postHireSend: "Submit report",
    postHireCheckins: "Check-in history",
    postHireHistory: [
      { date: "Jun 10, 2025", note: "Positive first week. Async tools configured correctly." },
      { date: "Jun 3, 2025", note: "Onboarding completed. Accompaniment plan agreed with mentor." },
    ],
    previewNav: ["My profile", "Vacancies", "My mentor"],
    previewTitle: "Suggested vacancies for you",
    previewSubtitle: "3 compatible vacancies this week",
    mentorAssigned: "Your assigned mentor",
    openNotes: "Open session notes",
    scheduleCheckin: "Schedule check-in",
    orgSections: ["General information", "Philosophy and culture", "Physical environment", "Accessibility provisions", "Policies"],
    orgSectionIds: ["general", "cultura", "entorno", "prestaciones", "politicas"],
    compPostHireStatus: "Adaptation status",
    compPostHireObs: "Company observations",
    compPostHireObsPlaceholder: "Write your observations about the adaptation process...",
    compPostHireSend: "Submit observations",
    compPostHireContact: "Mentor contact",
    compPostHireSendMsg: "Send message",
    mentorProcesses: "Active processes",
    mentorCheckins: "Upcoming check-ins",
    mentorCompanies: "Companies",
    mentorImpact: "Impact this month",
    activeFor: "Active for",
    sessionNotes: "Session notes",
    nextAction: "Next action",
    scheduleSession: "Schedule session",
    notes: "Notes",
    registerName: "Full name",
    registerTitle: "Create your account",
    registerSubmit: "Create account",
    footerLinks: ["Accessibility", "Privacy", "Terms of use"],
    checkinPageTitle: "Check-ins",
    checkinPageSub: "Scheduled sessions with your candidates",
    companiesPageTitle: "Partner companies",
    companiesPageSub: "Companies active in inclusion processes",
  },
  pt: {
    pillars: [
      { num: "01", title: "Preparar", body: "Caracterizamos como cada pessoa trabalha e qual ambiente precisa. Sem diagnósticos, sem rótulos clínicos." },
      { num: "02", title: "Adaptar", body: "A empresa define exatamente quais ajustes pode oferecer antes de iniciar qualquer processo de seleção." },
      { num: "03", title: "Acompanhar", body: "Um mentor humano guia o candidato e a empresa durante todo o processo, do match ao dia 60." },
      { num: "04", title: "Conectar", body: "O sistema cruza perfis e sugere compatibilidades reais, não percepções. Ambas as partes sabem o que esperar." },
    ],
    problems: [
      "Os processos de seleção padrão não são projetados para avaliar talentos — são projetados para filtrar diferenças.",
      "Mais de 85% das pessoas com estilos cognitivos diversos em idade produtiva estão desempregadas ou subempregadas, não por falta de capacidades, mas por falta de compatibilidade.",
      "Entrevistas convencionais, ambientes não adaptados e comunicação ambígua excluem sistematicamente perfis com alto potencial.",
      "Uma contratação malsucedida por falta de ajustes razoáveis custa entre 3 e 5 vezes o salário anual do cargo.",
    ],
    how: [
      { phase: "1. Perfil e Adaptação", desc: "O candidato caracteriza seu estilo de trabalho em 4 eixos. A empresa documenta seu ambiente e ajustes disponíveis." },
      { phase: "2. Matching Profissional", desc: "O sistema cruza ambos os perfis e sugere compatibilidades com percentual visível para o candidato." },
      { phase: "3. Treinamento Personalizado", desc: "O mentor acompanha a preparação para o processo de seleção, adaptado ao candidato e à empresa." },
      { phase: "4. Inserção e Acompanhamento", desc: "Após a contratação, o mentor monitora a adaptação durante os primeiros 60 a 90 dias no novo cargo." },
    ],
    compare: [
      { aspect: "Processo de seleção", trad: "Entrevista única, sem adaptação", astris: "Perfilamento em 4 eixos, formato adaptado" },
      { aspect: "Informação do candidato", trad: "Diagnóstico e histórico clínico", astris: "Como trabalha melhor e o que o ambiente precisa" },
      { aspect: "Compatibilidade", trad: "Determinada pelo recrutador", astris: "Calculada pelo sistema com dados objetivos" },
      { aspect: "Ajustes razoáveis", trad: "Reativos ou inexistentes", astris: "Definidos e comprometidos desde o início" },
      { aspect: "Acompanhamento", trad: "Nenhum ou informal", astris: "Protocolo de 8 etapas com mentor designado" },
      { aspect: "Privacidade do candidato", trad: "Variável", astris: "Dados médicos nunca compartilhados" },
    ],
    impactCand: ["Redução de 60% no tempo de busca por emprego compatível", "Acesso a cargos que genuinamente se adaptam ao seu estilo de trabalho", "Acompanhamento desde o primeiro dia do processo", "Sem necessidade de revelar diagnósticos médicos em nenhum momento"],
    impactComp: ["Acesso a talentos altamente especializados e motivados", "Redução de 40% na rotatividade durante os primeiros 6 meses", "Marco legal claro para implementar ajustes razoáveis", "Orientação contínua do mentor durante todo o período de integração"],
    privacyTitle: "Sua privacidade é o alicerce, não um complemento.",
    privacyBody: "Nenhum diagnóstico médico é armazenado ou compartilhado. As empresas nunca veem nomes reais ou fotos — apenas perfis de compatibilidade anônimos. O candidato controla quais informações são visíveis em cada etapa.",
    accompStages: [
      { label: "Análise de perfil", done: true, current: false },
      { label: "Primeiro contato com o mentor", done: true, current: false },
      { label: "Plano de acompanhamento", done: true, current: false },
      { label: "Reunião de explicação com a empresa", done: false, current: true },
      { label: "Consentimento e acordo", done: false, current: false },
      { label: "Início do treinamento adaptado", done: false, current: false },
      { label: "Vínculo empregatício", done: false, current: false },
      { label: "Acompanhamento pós-contratação", done: false, current: false },
    ],
    statusLabels: ["Adaptando-me", "Estável", "Consolidado"],
    postHireQ1: "Como foi sua semana em termos de conforto no ambiente de trabalho?",
    postHireQ2: "Houve algo que gerou dificuldade ou desconforto?",
    postHireTextPlaceholder: "Escreva sua resposta aqui...",
    postHireSend: "Enviar relatório",
    postHireCheckins: "Histórico de check-ins",
    postHireHistory: [
      { date: "Jun 10, 2025", note: "Primeira semana positiva. Ferramentas assíncronas configuradas corretamente." },
      { date: "Jun 3, 2025", note: "Onboarding concluído. Plano de acompanhamento acordado com o mentor." },
    ],
    previewNav: ["Meu perfil", "Vagas", "Meu mentor"],
    previewTitle: "Vagas sugeridas para você",
    previewSubtitle: "3 vagas compatíveis esta semana",
    mentorAssigned: "Seu mentor designado",
    openNotes: "Abrir notas de sessão",
    scheduleCheckin: "Agendar check-in",
    orgSections: ["Informações gerais", "Filosofia e cultura", "Ambiente físico", "Prestações de acessibilidade", "Políticas"],
    orgSectionIds: ["general", "cultura", "entorno", "prestaciones", "politicas"],
    compPostHireStatus: "Estado de adaptação",
    compPostHireObs: "Observações da empresa",
    compPostHireObsPlaceholder: "Escreva suas observações sobre o processo de adaptação...",
    compPostHireSend: "Enviar observações",
    compPostHireContact: "Contato com o mentor",
    compPostHireSendMsg: "Enviar mensagem",
    mentorProcesses: "Processos ativos",
    mentorCheckins: "Próximos check-ins",
    mentorCompanies: "Empresas",
    mentorImpact: "Impacto este mês",
    activeFor: "Ativo há",
    sessionNotes: "Notas de sessão",
    nextAction: "Próxima ação",
    scheduleSession: "Agendar sessão",
    notes: "Notas",
    registerName: "Nome completo",
    registerTitle: "Crie sua conta",
    registerSubmit: "Criar conta",
    footerLinks: ["Acessibilidade", "Privacidade", "Termos de uso"],
    checkinPageTitle: "Check-ins",
    checkinPageSub: "Sessões agendadas com seus candidatos",
    companiesPageTitle: "Empresas parceiras",
    companiesPageSub: "Empresas ativas em processos de inclusão",
  },
  fr: {
    pillars: [
      { num: "01", title: "Préparer", body: "Nous caractérisons comment chaque personne travaille et quel environnement elle nécessite. Sans diagnostics, sans étiquettes cliniques." },
      { num: "02", title: "Adapter", body: "L'entreprise définit exactement quels aménagements elle peut offrir avant de démarrer tout processus de sélection." },
      { num: "03", title: "Accompagner", body: "Un mentor humain guide le candidat et l'entreprise tout au long du processus, du match au jour 60." },
      { num: "04", title: "Connecter", body: "Le système croise les profils et suggère des compatibilités réelles, pas des perceptions. Les deux parties savent à quoi s'attendre." },
    ],
    problems: [
      "Les processus de sélection standard ne sont pas conçus pour évaluer les talents — ils sont conçus pour filtrer les différences.",
      "Plus de 85 % des personnes avec des styles cognitifs divers en âge de travailler sont au chômage ou sous-employées, non par manque de compétences, mais par manque de compatibilité.",
      "Les entretiens conventionnels, les environnements non adaptés et la communication ambiguë excluent systématiquement des profils à fort potentiel.",
      "Un recrutement échoué par absence d'aménagements raisonnables coûte entre 3 et 5 fois le salaire annuel du poste.",
    ],
    how: [
      { phase: "1. Profil et Adaptation", desc: "Le candidat caractérise son style de travail sur 4 axes. L'entreprise documente son environnement et les aménagements disponibles." },
      { phase: "2. Matching Professionnel", desc: "Le système croise les deux profils et suggère des compatibilités avec un pourcentage visible pour le candidat." },
      { phase: "3. Formation Personnalisée", desc: "Le mentor accompagne la préparation au processus de sélection, adapté au candidat et à l'entreprise." },
      { phase: "4. Insertion et Suivi", desc: "Après l'embauche, le mentor surveille l'adaptation pendant les 60 à 90 premiers jours du nouveau rôle." },
    ],
    compare: [
      { aspect: "Processus de sélection", trad: "Entretien unique, sans adaptation", astris: "Profilage sur 4 axes, format adapté" },
      { aspect: "Information du candidat", trad: "Diagnostic et historique clinique", astris: "Comment il travaille le mieux et ce dont l'environnement a besoin" },
      { aspect: "Compatibilité", trad: "Déterminée par le recruteur", astris: "Calculée par le système avec des données objectives" },
      { aspect: "Aménagements raisonnables", trad: "Réactifs ou inexistants", astris: "Définis et engagés dès le début" },
      { aspect: "Suivi", trad: "Aucun ou informel", astris: "Protocole en 8 étapes avec mentor assigné" },
      { aspect: "Confidentialité du candidat", trad: "Variable", astris: "Données médicales jamais partagées" },
    ],
    impactCand: ["Réduction de 60% du temps de recherche d'emploi compatible", "Accès à des rôles qui s'adaptent genuinement à leur style de travail", "Accompagnement dès le premier jour du processus", "Sans besoin de divulguer des diagnostics médicaux à aucun moment"],
    impactComp: ["Accès à des talents hautement spécialisés et motivés", "Réduction de 40% du turnover durant les 6 premiers mois", "Cadre juridique clair pour mettre en œuvre des aménagements raisonnables", "Guidance continue du mentor pendant toute la période d'intégration"],
    privacyTitle: "Votre confidentialité est le fondement, pas un complément.",
    privacyBody: "Aucun diagnostic médical n'est stocké ni partagé. Les entreprises ne voient jamais de vrais noms ni de photos — uniquement des profils de compatibilité anonymes. Le candidat contrôle quelles informations sont visibles à chaque étape.",
    accompStages: [
      { label: "Analyse du profil", done: true, current: false },
      { label: "Premier contact avec le mentor", done: true, current: false },
      { label: "Plan d'accompagnement", done: true, current: false },
      { label: "Réunion d'explication avec l'entreprise", done: false, current: true },
      { label: "Consentement et accord", done: false, current: false },
      { label: "Début de la formation adaptée", done: false, current: false },
      { label: "Placement professionnel", done: false, current: false },
      { label: "Suivi post-embauche", done: false, current: false },
    ],
    statusLabels: ["En adaptation", "Stable", "Établi"],
    postHireQ1: "Comment s'est passée votre semaine en termes de confort dans l'environnement de travail ?",
    postHireQ2: "Y a-t-il eu quelque chose qui vous a causé des difficultés ou un inconfort ?",
    postHireTextPlaceholder: "Écrivez votre réponse ici...",
    postHireSend: "Envoyer le rapport",
    postHireCheckins: "Historique des check-ins",
    postHireHistory: [
      { date: "Jun 10, 2025", note: "Première semaine positive. Outils asynchrones configurés correctement." },
      { date: "Jun 3, 2025", note: "Onboarding terminé. Plan d'accompagnement convenu avec le mentor." },
    ],
    previewNav: ["Mon profil", "Offres", "Mon mentor"],
    previewTitle: "Offres suggérées pour vous",
    previewSubtitle: "3 offres compatibles cette semaine",
    mentorAssigned: "Votre mentor assigné",
    openNotes: "Ouvrir les notes de session",
    scheduleCheckin: "Planifier un check-in",
    orgSections: ["Informations générales", "Philosophie et culture", "Environnement physique", "Prestations d'accessibilité", "Politiques"],
    orgSectionIds: ["general", "cultura", "entorno", "prestaciones", "politicas"],
    compPostHireStatus: "État d'adaptation",
    compPostHireObs: "Observations de l'entreprise",
    compPostHireObsPlaceholder: "Rédigez vos observations sur le processus d'adaptation...",
    compPostHireSend: "Envoyer les observations",
    compPostHireContact: "Contact avec le mentor",
    compPostHireSendMsg: "Envoyer un message",
    mentorProcesses: "Processus actifs",
    mentorCheckins: "Prochains check-ins",
    mentorCompanies: "Entreprises",
    mentorImpact: "Impact ce mois",
    activeFor: "Actif depuis",
    sessionNotes: "Notes de session",
    nextAction: "Prochaine action",
    scheduleSession: "Planifier une session",
    notes: "Notes",
    registerName: "Nom complet",
    registerTitle: "Créez votre compte",
    registerSubmit: "Créer un compte",
    footerLinks: ["Accessibilité", "Confidentialité", "Conditions d'utilisation"],
    checkinPageTitle: "Check-ins",
    checkinPageSub: "Sessions planifiées avec vos candidats",
    companiesPageTitle: "Entreprises partenaires",
    companiesPageSub: "Entreprises actives dans les processus d'inclusion",
  },
} as const;

type ContentKey = keyof typeof CONTENT.es;

function C(lang: Lang, key: ContentKey): any {
  return (CONTENT[lang] as any)[key] ?? (CONTENT.es as any)[key];
}

// ── Candidate Palettes ────────────────────────────────────────────────────────

const PALETTES: Record<PaletteKey, {
  nameEs: string; nameEn: string; namePt: string; nameFr: string;
  bg: string; fg: string; card: string; accent: string; border: string;
  descEs: string; descEn: string;
}> = {
  azul: {
    nameEs: "Azul calma", nameEn: "Calm Blue", namePt: "Azul calmo", nameFr: "Bleu calme",
    bg: "#EDF2F8", fg: "#1A3355", card: "#F3F7FC", accent: "#2563A8", border: "#C2D5EA",
    descEs: "Bajo estímulo visual — para hipersensibilidad visual",
    descEn: "Low visual stimulus — for visual hypersensitivity",
  },
  tierra: {
    nameEs: "Tierra cálida", nameEn: "Warm Earth", namePt: "Terra quente", nameFr: "Terre chaude",
    bg: "#F5EDE0", fg: "#3D2B1F", card: "#FBF5EE", accent: "#8B5C3A", border: "#E0C9B0",
    descEs: "Reduce el contraste duro — para sensibilidad a luz brillante",
    descEn: "Reduces harsh contrast — for bright light sensitivity",
  },
  contraste: {
    nameEs: "Alto contraste", nameEn: "High Contrast", namePt: "Alto contraste", nameFr: "Contraste élevé",
    bg: "#1A1A04", fg: "#FFE600", card: "#252510", accent: "#FFE600", border: "#555510",
    descEs: "Máxima legibilidad — compatible con tecnologías de accesibilidad",
    descEn: "Maximum legibility — compatible with assistive technologies",
  },
  verde: {
    nameEs: "Verde natural", nameEn: "Natural Green", namePt: "Verde natural", nameFr: "Vert naturel",
    bg: "#EDF5F0", fg: "#1A3B2A", card: "#F3FAF6", accent: "#3D7A56", border: "#C0DDD0",
    descEs: "Paleta calmante — reduce carga cognitiva en sesiones largas",
    descEn: "Calming palette — reduces cognitive load in long sessions",
  },
};

function getPaletteName(p: PaletteKey, lang: Lang) {
  const pal = PALETTES[p];
  if (lang === "es") return pal.nameEs;
  if (lang === "pt") return pal.namePt;
  if (lang === "fr") return pal.nameFr;
  return pal.nameEn;
}

function getPaletteDesc(p: PaletteKey, lang: Lang) {
  return lang === "es" ? PALETTES[p].descEs : PALETTES[p].descEn;
}

// ── Mock Data (fallback) ──────────────────────────────────────────────────────

type VacancyItem = { id: string; title: string; company: string; sector: string; modality: string; type: string; match: number; socialLevel: string; adjustments: string[]; desc: string; companyDesc: string; };
type MentorItem = { id: string; name: string; specialty: string; years: number; modality: string; bio: string; };

const VACANCIES_FALLBACK: VacancyItem[] = [
  { id: "V-1042", title: "Analista de Datos Junior", company: "Veritas Analytics", sector: "Tecnología", modality: "Remoto", type: "Tiempo completo", match: 94, socialLevel: "Bajo", adjustments: ["100% remoto", "Comunicación asíncrona", "Horario flexible", "Instrucciones escritas"], desc: "Análisis de bases de datos, generación de reportes y visualización de métricas clave.", companyDesc: "Empresa de análisis de datos con 7 años en el mercado." },
  { id: "V-0873", title: "Diseñadora UX", company: "Forma Studio", sector: "Diseño", modality: "Híbrido", type: "Tiempo completo", match: 87, socialLevel: "Medio", adjustments: ["Espacio de trabajo tranquilo", "Briefs escritos", "Evaluación por entregables"], desc: "Diseño de experiencias digitales para clientes de salud y educación.", companyDesc: "Estudio de diseño boutique con enfoque en accesibilidad digital." },
];

const MENTORS_FALLBACK: MentorItem[] = [
  { id: "M-01", name: "Carmen Ruiz", specialty: "Inclusión laboral y funciones ejecutivas", years: 8, modality: "Virtual", bio: "Psicóloga organizacional especializada en estrategias de inserción laboral para perfiles con estilos cognitivos diversos." },
  { id: "M-02", name: "David Morales", specialty: "Aprendizaje adaptativo en entornos corporativos", years: 5, modality: "Presencial y virtual", bio: "Consultor de inclusión con experiencia en mediación empresa-candidato." },
  { id: "M-03", name: "Sofía Andrade", specialty: "Integración sensorial y entorno laboral", years: 6, modality: "Virtual", bio: "Terapeuta ocupacional con posgrado en accesibilidad laboral." },
  { id: "M-04", name: "Luis Torres", specialty: "Transición laboral y autonomía profesional", years: 10, modality: "Presencial", bio: "Coach laboral y educador especializado en autonomía profesional." },
];

// Keep COMPANY_CANDIDATES_DATA below

const CANDIDATE_RADAR_FINAL = [
  { axis: "Procesamiento", value: 82 },
  { axis: "T. Ambiental", value: 28 },
  { axis: "Ejecución", value: 80 },
  { axis: "Ajustes", value: 75 },
];

const CANDIDATE_ADJUSTMENTS = [
  "Trabajo remoto o híbrido",
  "Comunicación asíncrona",
  "Instrucciones escritas",
  "Control de ruido",
  "Horario flexible",
];

const COMPANY_CANDIDATES_DATA = [
  { id: "CAND-A7X2", match: 96, strengths: "Alto enfoque en tareas detalladas. Prefiere entorno silencioso. Requiere instrucciones escritas.", radar: [{ axis: "Procesamiento", value: 88 }, { axis: "T. Ambiental", value: 22 }, { axis: "Ejecución", value: 92 }, { axis: "Ajustes", value: 70 }], env: [{ req: "Trabajo remoto disponible", met: true }, { req: "Comunicación asíncrona", met: true }, { req: "Espacio individual silencioso", met: false }, { req: "Horario flexible", met: true }] },
  { id: "CAND-B3M9", match: 89, strengths: "Excelente tolerancia a entornos variables. Habilidad multitarea alta. Comunicación verbal fluida.", radar: [{ axis: "Procesamiento", value: 65 }, { axis: "T. Ambiental", value: 82 }, { axis: "Ejecución", value: 68 }, { axis: "Ajustes", value: 85 }], env: [{ req: "Trabajo remoto disponible", met: true }, { req: "Comunicación asíncrona", met: false }, { req: "Instrucciones escritas", met: true }, { req: "Evaluación por entregables", met: true }] },
  { id: "CAND-C1K4", match: 82, strengths: "Alta especialización en tareas repetitivas. Requiere estructura clara. Prefiere trabajo presencial o híbrido.", radar: [{ axis: "Procesamiento", value: 90 }, { axis: "T. Ambiental", value: 55 }, { axis: "Ejecución", value: 85 }, { axis: "Ajustes", value: 50 }], env: [{ req: "Trabajo remoto disponible", met: true }, { req: "Gestión visual de tareas", met: true }, { req: "Control de ruido", met: false }, { req: "Check-ins diarios estructurados", met: false }] },
];

const MENTOR_PROCESSES = [
  { cid: "CAND-A7X2", company: "Veritas Analytics", role: "Analista de Datos Junior", stage: "Onboarding activo", stageColor: "#2D7D5F", days: 14, action: "Check-in semana 2 con líder de equipo", notes: "Candidato/a adaptándose bien. Herramientas asíncronas configuradas. Punto de fricción: llamadas de equipo sin agenda previa." },
  { cid: "CAND-B3M9", company: "Forma Studio", role: "Diseñadora UX", stage: "Preparación — Entrevista", stageColor: "#1B4B7A", days: 7, action: "Sesión de preparación para entrevista técnica", notes: "Portafolio sólido. Trabajando en presentación verbal y ritmo de respuesta en preguntas abiertas." },
  { cid: "CAND-C1K4", company: "Kestrel Systems", role: "Redactor/a Técnico/a", stage: "Período de prueba", stageColor: "#8B5C3A", days: 30, action: "Revisión de 30 días con RRHH y candidato/a", notes: "Período de prueba positivo. Empresa confirmó actualización de política de ruido para julio." },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function computeRadar(answers: QuizAnswers): Array<{ axis: string; value: number }> {
  return QUIZ_AXES.map((axis, ai) => {
    const axisAnswers = answers[ai];
    if (!axisAnswers || Object.keys(axisAnswers).length === 0) {
      return { axis: axis.radarAxis, value: 50 };
    }
    let total = 0; let count = 0;
    axis.questions.forEach((q, qi) => {
      const ans = axisAnswers[qi];
      if (ans === undefined || ans === null) return;
      if (q.type === "multi") {
        const sel = ans as number[];
        const real = sel.filter((i) => i < q.opts.es.length - 1);
        total += (real.length / (q.opts.es.length - 1)) * 100;
      } else {
        const idx = ans as number;
        total += q.vals[idx] ?? 50;
      }
      count++;
    });
    return { axis: axis.radarAxis, value: count > 0 ? Math.round(total / count) : 50 };
  });
}

function matchColor(v: number) {
  return v >= 90 ? "#2D7D5F" : v >= 82 ? "#1B4B7A" : v >= 74 ? "#C9830A" : "#6B7E9A";
}

// ── Shared Components ─────────────────────────────────────────────────────────

/* Mounts at width:0, transitions to target on next frame — creates a smooth
   fill animation without a JS animation library. */
function AnimatedBar({ value, color = "var(--primary)", height = "h-2.5" }: {
  value: number; color?: string; height?: string;
}) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setW(value), 60);
    return () => clearTimeout(id);
  }, [value]);
  return (
    <div
      className={`${height} rounded-full`}
      style={{
        width: `${w}%`,
        backgroundColor: color,
        transition: "width 650ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    />
  );
}

function MatchBadge({ value, size = "lg" }: { value: number; size?: "sm" | "lg" }) {
  const isLg = size === "lg";
  const r = isLg ? 44 : 28;
  const sw = isLg ? 7 : 4;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const dim = (r + sw) * 2 + 6;
  const color = matchColor(value);
  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: dim, height: dim }}>
      <svg width={dim} height={dim} style={{ position: "absolute", transform: "rotate(-90deg)" }} aria-hidden="true">
        <circle cx={dim / 2} cy={dim / 2} r={r} fill="none" stroke="#D5E2EF" strokeWidth={sw} />
        <circle
          cx={dim / 2} cy={dim / 2} r={r}
          fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{
            "--circ": circ,
            "--offset": offset,
            animation: "astris-draw-stroke 1s cubic-bezier(0.33, 1, 0.68, 1) both",
          } as React.CSSProperties}
        />
      </svg>
      <div className="relative z-10 text-center leading-tight">
        <div style={{ color, fontWeight: 700, fontSize: isLg ? 17 : 10 }}>{value}%</div>
        {isLg && <div style={{ color, fontSize: 9, opacity: 0.8, fontFamily: "DM Mono, monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>match</div>}
      </div>
    </div>
  );
}

function RadarViz({ data, height = 280, color = "#1B4B7A", outerRadius = 95, fontSize = 11 }: {
  data: Array<{ axis: string; value: number }>;
  height?: number; color?: string; outerRadius?: number; fontSize?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} outerRadius={outerRadius}>

        <PolarAngleAxis dataKey="axis" tick={{ fontSize, fill: "#4A5568", fontFamily: "'Atkinson Hyperlegible', Inter, sans-serif" }} />
        <Radar
          dataKey="value" stroke={color} fill={color} fillOpacity={0.15} strokeWidth={2.5}
          isAnimationActive={true} animationDuration={700} animationEasing="ease-out"
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

// ── Watermark ────────────────────────────────────────────────────────────────

function MicrosoftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 21 21" aria-hidden="true" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}

function Watermark() {
  return (
    <div
      className="fixed bottom-5 right-5 z-30 flex flex-col items-end gap-2.5 pointer-events-none select-none"
      aria-hidden="true"
    >
      <div
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: "var(--muted-foreground)", opacity: 0.75 }}
      >
        Supported by:
      </div>

      {/* Vibra Latina row */}
      <div className="flex items-center gap-3">
        <img
          src={vibraLatinaImg}
          alt="Vibra Latina"
          style={{ height: 42, opacity: 0.9, objectFit: "contain" }}
        />
        <span
          className="text-xl font-bold tracking-tight"
          style={{ color: "var(--foreground)", opacity: 0.85 }}
        >
          Vibra Latina
        </span>
      </div>

      {/* Microsoft row */}
      <div className="flex items-center gap-2" style={{ opacity: 0.8 }}>
        <MicrosoftIcon />
        <span
          className="text-sm font-semibold"
          style={{ color: "var(--muted-foreground)" }}
        >
          Microsoft
        </span>
      </div>

      {/* Genuine Foundation row */}
      <div className="flex items-center gap-2" style={{ opacity: 0.8 }}>
        <img
          src={genuineImg}
          alt="The Genuine Foundation"
          style={{ height: 32, objectFit: "contain" }}
        />
        <span
          className="text-sm font-semibold"
          style={{ color: "var(--muted-foreground)" }}
        >
          The Genuine Foundation
        </span>
      </div>
    </div>
  );
}

// ── Modal Overlay ─────────────────────────────────────────────────────────────

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 anim-overlay" style={{ backgroundColor: "rgba(26,26,46,0.72)" }} role="dialog" aria-modal="true">
      <div className="anim-modal w-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

// ── Language Modal ────────────────────────────────────────────────────────────

function LanguageModal({ onSelect }: { onSelect: (l: Lang) => void }) {
  const LANGS: Array<{ code: Lang; label: string; flag: string }> = [
    { code: "es", label: "Español", flag: "ES" },
    { code: "en", label: "English", flag: "EN" },
    { code: "pt", label: "Português", flag: "PT" },
    { code: "fr", label: "Français", flag: "FR" },
  ];
  return (
    <Overlay>
      <div className="w-full max-w-md rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--card)" }}>
        <div className="px-10 pt-10 pb-6 text-center border-b border-border">
          <div className="text-3xl font-bold text-foreground mb-1">Astris</div>
          <div className="flex items-center justify-center gap-2 mt-4 mb-2">
            <Globe size={18} aria-hidden="true" className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Select your language / Selecciona tu idioma</span>
          </div>
        </div>
        <div className="p-6 grid grid-cols-2 gap-3">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => onSelect(l.code)}
              className="flex items-center gap-3 p-5 rounded-xl border-2 cursor-pointer text-left"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>{l.flag}</div>
              <span className="font-semibold text-foreground text-base">{l.label}</span>
            </button>
          ))}
        </div>
      </div>
    </Overlay>
  );
}

// ── Auth Modal ────────────────────────────────────────────────────────────────

function AuthModal({ lang, onNew, onExisting, onAdmin, onBack }: { lang: Lang; onNew: () => void; onExisting: () => void; onAdmin: () => void; onBack: () => void }) {
  const t = useT(lang);
  return (
    <Overlay>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--card)" }}>
        <div className="px-10 py-8 border-b border-border text-center relative">
          <button onClick={onBack} className="absolute left-6 top-8 flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer">
            <ChevronLeft size={15} aria-hidden="true" />{t("login.back")}
          </button>
          <div className="text-2xl font-bold text-foreground mb-1">{t("auth.title")}</div>
          <div className="text-muted-foreground text-base mt-2">{t("auth.q")}</div>
        </div>
        <div className="p-8 flex flex-col gap-4">
          <button onClick={onNew} className="flex items-start gap-4 p-5 rounded-xl border-2 text-left cursor-pointer" style={{ borderColor: "var(--primary)", backgroundColor: "var(--secondary)" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: "var(--primary)" }}>
              <User size={18} aria-hidden="true" style={{ color: "var(--primary-foreground)" }} />
            </div>
            <div>
              <div className="font-bold text-foreground text-base">{t("auth.new")}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{t("auth.new.sub")}</div>
            </div>
          </button>
          <button onClick={onExisting} className="flex items-start gap-4 p-5 rounded-xl border-2 text-left cursor-pointer" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: "var(--muted)" }}>
              <Briefcase size={18} aria-hidden="true" className="text-foreground" />
            </div>
            <div>
              <div className="font-bold text-foreground text-base">{t("auth.existing")}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{t("auth.existing.sub")}</div>
            </div>
          </button>
          <button onClick={onAdmin} className="flex items-start gap-4 p-5 rounded-xl border-2 text-left cursor-pointer" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: "var(--muted)" }}>
              <Shield size={18} aria-hidden="true" className="text-foreground" />
            </div>
            <div>
              <div className="font-bold text-foreground text-base">Admin</div>
              <div className="text-sm text-muted-foreground mt-0.5">Administrative access</div>
            </div>
          </button>
        </div>
      </div>
    </Overlay>
  );
}

// ── Login Modal ───────────────────────────────────────────────────────────────

function LoginModal({ lang, onLogin, onBack, error, loading, initialRole = "candidate" }: {
  lang: Lang;
  onLogin: (role: Role, email?: string, password?: string) => void;
  onBack: () => void;
  error?: string | null;
  loading?: boolean;
  initialRole?: Role;
}) {
  const t = useT(lang);
  const [loginRole, setLoginRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const ROLES: Array<{ id: Role; label: string }> = [
    { id: "candidate", label: t("role.candidate") },
    { id: "company", label: t("role.company") },
    { id: "mentor", label: t("role.mentor") },
  ];
  return (
    <Overlay>
      <div className="w-full max-w-md rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--card)" }}>
        <div className="px-8 py-7 border-b border-border">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer mb-4">
            <ChevronLeft size={15} aria-hidden="true" />{t("login.back")}
          </button>
          <div className="text-xl font-bold text-foreground">{t("login.title")}</div>
        </div>
        <div className="p-8 flex flex-col gap-5">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: "#FEF2F2", color: "#C0392B" }}>
              <AlertCircle size={15} aria-hidden="true" />{error}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">{t("login.email")}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-border text-foreground text-base" style={{ backgroundColor: "var(--input-background)" }} placeholder="nombre@correo.com" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">{t("login.pass")}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-border text-foreground text-base" style={{ backgroundColor: "var(--input-background)" }} placeholder="••••••••" />
          </div>
          {initialRole !== "admin" && (
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{t("login.role")}</label>
              <div className="flex gap-2">
                {ROLES.map((r) => (
                  <button key={r.id} onClick={() => setLoginRole(r.id)} className="flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold cursor-pointer" style={{ borderColor: loginRole === r.id ? "var(--primary)" : "var(--border)", backgroundColor: loginRole === r.id ? "var(--secondary)" : "var(--background)", color: "var(--foreground)" }}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <button onClick={() => onLogin(loginRole, email || undefined, password || undefined)} disabled={loading} className="w-full py-4 rounded-xl font-bold text-base cursor-pointer" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)", opacity: loading ? 0.6 : 1 }}>
            {loading ? "..." : t("login.submit")}
          </button>

          {loginRole !== "admin" && (
            <>
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-border"></div>
                <span className="flex-shrink-0 mx-4 text-muted-foreground text-sm font-medium">o</span>
                <div className="flex-grow border-t border-border"></div>
              </div>

              <button
                onClick={async () => {
                  try {
                    await signInWithGoogle(loginRole, 'login');
                  } catch (e) {
                    console.error(e);
                  }
                }}
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 border-2 border-border cursor-pointer hover:bg-secondary transition-colors"
                style={{ backgroundColor: "var(--card)", color: "var(--foreground)" }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continuar con Google
              </button>
            </>
          )}
        </div>
      </div>
    </Overlay>
  );
}



// ── Register Modal ────────────────────────────────────────────────────────────

function RegisterModal({ lang, role, onRegister, onBack, error, loading, googleAuthUser, onCompleteGoogle }: {
  lang: Lang; role: Role;
  onRegister: (email: string, password: string, name: string) => Promise<void>;
  onBack: () => void; error: string | null; loading: boolean;
  googleAuthUser?: any; onCompleteGoogle?: () => void;
}) {
  const t = useT(lang);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const ROLE_ICON: Record<Role, any> = { candidate: User, company: Building2, mentor: Users, admin: Shield };
  const RoleIcon = ROLE_ICON[role];

  if (googleAuthUser) {
    return (
      <Overlay>
        <div className="w-full max-w-md rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--card)" }}>
          <div className="px-8 py-7 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--primary)" }}>
                <RoleIcon size={18} aria-hidden="true" style={{ color: "var(--primary-foreground)" } as React.CSSProperties} />
              </div>
              <div className="text-xl font-bold text-foreground">Completar Registro</div>
            </div>
          </div>
          <div className="p-8 flex flex-col gap-5 text-center">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center border border-border bg-secondary mb-2" style={{ backgroundColor: "var(--secondary)" }}>
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground">Hola, {googleAuthUser.name}</h3>
            <p className="text-muted-foreground text-sm">Tu cuenta de Google ha sido vinculada. Confirma para crear tu perfil como <b>{role === 'candidate' ? 'Candidato' : role === 'company' ? 'Empresa' : 'Mentor'}</b>.</p>
            <button
              onClick={onCompleteGoogle}
              className="w-full mt-4 py-4 rounded-xl font-bold text-base cursor-pointer hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              Completar Registro
            </button>
          </div>
        </div>
      </Overlay>
    );
  }

  return (
    <Overlay>
      <div className="w-full max-w-md rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--card)" }}>
        <div className="px-8 py-7 border-b border-border">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer mb-4">
            <ChevronLeft size={15} aria-hidden="true" />{t("back")}
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--primary)" }}>
              <RoleIcon size={18} aria-hidden="true" style={{ color: "var(--primary-foreground)" } as React.CSSProperties} />
            </div>
            <div className="text-xl font-bold text-foreground">{C(lang, "registerTitle" as any)}</div>
          </div>
        </div>
        <div className="p-8 flex flex-col gap-5">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: "#FEF2F2", color: "#C0392B" }}>
              <AlertCircle size={15} aria-hidden="true" />{error}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">{C(lang, "registerName")}</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-border text-foreground text-base" style={{ backgroundColor: "var(--input-background)" }} placeholder="Jane Doe" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">{t("login.email")}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-border text-foreground text-base" style={{ backgroundColor: "var(--input-background)" }} placeholder="nombre@correo.com" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">{t("login.pass")}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-border text-foreground text-base" style={{ backgroundColor: "var(--input-background)" }} placeholder="••••••••" />
          </div>
          <button
            onClick={() => onRegister(email, password, name)}
            disabled={loading || !email || !password}
            className="w-full py-4 rounded-xl font-bold text-base"
            style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)", cursor: loading || !email || !password ? "not-allowed" : "pointer", opacity: loading || !email || !password ? 0.6 : 1 }}
          >
            {loading ? "..." : C(lang, "registerSubmit")}
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink-0 mx-4 text-muted-foreground text-sm font-medium">o</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <button
            onClick={async () => {
              try {
                await signInWithGoogle(role, 'register');
              } catch (e) {
                console.error(e);
              }
            }}
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 border-2 border-border cursor-pointer hover:bg-secondary transition-colors"
            style={{ backgroundColor: "var(--card)", color: "var(--foreground)" }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuar con Google
          </button>
        </div>
      </div>
    </Overlay>
  );
}

// ── Landing Page ──────────────────────────────────────────────────────────────

function LandingPage({ lang, onOpenAuth, onLang }: { lang: Lang; onOpenAuth: (preRole?: Role) => void; onLang: () => void }) {
  const t = useT(lang);
  const PILLAR_ICONS = [User, Settings, Users, Briefcase];
  const PILLARS = C(lang, "pillars") as typeof CONTENT.es.pillars;
  const PROBLEMS = C(lang, "problems") as string[];
  const HOW = C(lang, "how") as typeof CONTENT.es.how;
  const COMPARE = C(lang, "compare") as typeof CONTENT.es.compare;
  const IMPACT_CAND = C(lang, "impactCand") as string[];
  const IMPACT_COMP = C(lang, "impactComp") as string[];
  const compareAspect = lang === "es" ? "Aspecto" : lang === "pt" ? "Aspecto" : lang === "fr" ? "Aspect" : "Aspect";
  const compareTrad = lang === "es" ? "Modelo tradicional" : lang === "pt" ? "Modelo tradicional" : lang === "fr" ? "Modèle traditionnel" : "Traditional model";
  const compareAstris = "Astris";

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed header */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-border" style={{ backgroundColor: "var(--background)" }}>
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={astrisImg} alt="Astris Logo" className="w-14 h-14 object-contain" />
            <span className="text-xl font-bold text-foreground tracking-tight">Astris</span>
          </div>
          <nav className="flex items-center gap-6">
            {["landing.nav.about", "landing.nav.support", "landing.nav.partners"].map((k) => (
              <span key={k} className="text-sm text-muted-foreground cursor-pointer font-medium hover:text-foreground transition-colors">{t(k)}</span>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={onLang} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border border-border cursor-pointer hover:bg-secondary" aria-label="Cambiar idioma">
              <Globe size={16} />{lang.toUpperCase()}
            </button>
            <button onClick={() => onOpenAuth()} className="px-5 py-2.5 rounded-xl text-sm font-semibold border-2 border-border cursor-pointer" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>{t("landing.nav.login")}</button>
            <button onClick={() => onOpenAuth()} className="px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>{t("landing.nav.register")}</button>
          </div>
        </div>
      </header>

      <div className="pt-16">
        {/* Hero */}
        <section className="px-20 py-28 max-w-7xl mx-auto flex items-center justify-between gap-12">
          <div className="max-w-3xl">
            <h1 className="text-[58px] font-bold text-foreground leading-[1.1] mb-6">
              {t("landing.hero.t1")}<br />
              <span style={{ color: "var(--primary)" }}>{t("landing.hero.t2")}</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-14">{t("landing.hero.sub")}</p>
            <div className="flex flex-col gap-4 items-start">
              <button onClick={() => onOpenAuth("candidate")} className="flex items-center gap-3 px-6 py-4 rounded-xl text-lg font-bold border-2 cursor-pointer" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)", borderColor: "var(--primary)" }}>
                <User size={22} aria-hidden="true" />{t("landing.hero.cand")}<ArrowRight size={18} aria-hidden="true" />
              </button>
              <button onClick={() => onOpenAuth("company")} className="flex items-center gap-3 px-6 py-4 rounded-xl text-lg font-bold border-2 cursor-pointer" style={{ backgroundColor: "var(--card)", color: "var(--foreground)", borderColor: "var(--border)" }}>
                <Building2 size={22} aria-hidden="true" />{t("landing.hero.comp")}<ArrowRight size={18} aria-hidden="true" />
              </button>
              <button onClick={() => onOpenAuth("mentor")} className="flex items-center gap-3 px-6 py-4 rounded-xl text-lg font-bold border-2 cursor-pointer" style={{ backgroundColor: "var(--card)", color: "var(--foreground)", borderColor: "var(--border)" }}>
                <Star size={22} aria-hidden="true" />{t("role.mentor")}<ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="shrink-0 flex items-center justify-center anim-float">
            <img src={astrisImg} alt="Astris Logo" className="w-[380px] h-auto object-contain drop-shadow-2xl" />
          </div>
        </section>

        {/* Problem */}
        <section className="border-t border-border py-20 px-20" style={{ backgroundColor: "var(--card)" }}>
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-12">{t("landing.prob.title")}</h2>
            <div className="grid grid-cols-2 gap-6">
              {PROBLEMS.map((p, i) => (
                <div key={i} className="flex gap-4 p-6 rounded-2xl border border-border" style={{ backgroundColor: "var(--background)" }}>
                  <div className="text-2xl font-bold shrink-0" style={{ color: "var(--accent)", fontFamily: "DM Mono, monospace" }}>0{i + 1}</div>
                  <p className="text-foreground leading-relaxed">{p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="border-t border-border py-20 px-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-12">{t("landing.pillars.title")}</h2>
            <div className="grid grid-cols-4 gap-6">
              {PILLARS.map((p, pi) => {
                const PIcon = PILLAR_ICONS[pi];
                return (
                  <div key={p.num} className="rounded-2xl p-8 border border-border flex flex-col gap-5" style={{ backgroundColor: "var(--card)" }}>
                    <div className="text-4xl font-bold select-none" style={{ color: "var(--muted)", fontFamily: "DM Mono, monospace" }}>{p.num}</div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--secondary)" }}>
                        <PIcon size={20} aria-hidden="true" style={{ color: "var(--primary)" }} />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">{p.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-sm">{p.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-border py-20 px-20" style={{ backgroundColor: "var(--card)" }}>
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-14">{t("landing.how.title")}</h2>
            <div className="flex gap-0 relative">
              <div className="absolute top-8 left-0 right-0 h-px" style={{ backgroundColor: "var(--border)" }} aria-hidden="true" />
              {HOW.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col gap-6 px-6 first:pl-0 last:pr-0 relative">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold relative z-10" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)", fontFamily: "DM Mono, monospace" }}>{i + 1}</div>
                  <div>
                    <h3 className="font-bold text-foreground mb-2">{h.phase}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison table */}
        <section className="border-t border-border py-20 px-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-12">{t("landing.compare.title")}</h2>
            <div className="rounded-2xl border border-border overflow-hidden">
              <div className="grid grid-cols-3 border-b border-border" style={{ backgroundColor: "var(--primary)" }}>
                <div className="px-8 py-4 text-sm font-bold" style={{ color: "var(--primary-foreground)" }}>{compareAspect}</div>
                <div className="px-8 py-4 text-sm font-bold border-l border-white/20" style={{ color: "var(--primary-foreground)" }}>{compareTrad}</div>
                <div className="px-8 py-4 text-sm font-bold border-l border-white/20" style={{ color: "var(--primary-foreground)" }}>{compareAstris}</div>
              </div>
              {COMPARE.map((row, i) => (
                <div key={i} className={`grid grid-cols-3 border-b border-border last:border-0 ${i % 2 === 0 ? "" : ""}`} style={{ backgroundColor: i % 2 === 0 ? "var(--background)" : "var(--card)" }}>
                  <div className="px-8 py-4 text-sm font-semibold text-foreground">{row.aspect}</div>
                  <div className="px-8 py-4 text-sm text-muted-foreground border-l border-border">{row.trad}</div>
                  <div className="px-8 py-4 text-sm font-medium border-l border-border flex items-center gap-2" style={{ color: "var(--primary)" }}>
                    <Check size={14} aria-hidden="true" style={{ color: "var(--accent)" }} />{row.astris}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact */}
        <section className="border-t border-border py-20 px-20" style={{ backgroundColor: "var(--card)" }}>
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-12">{t("landing.impact.title")}</h2>
            <div className="grid grid-cols-2 gap-8">
              {[
                { titleKey: "landing.impact.cand", Icon: User, items: IMPACT_CAND },
                { titleKey: "landing.impact.comp", Icon: Building2, items: IMPACT_COMP },
              ].map((col) => (
                <div key={col.titleKey} className="rounded-2xl p-8 border border-border" style={{ backgroundColor: "var(--background)" }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--secondary)" }}>
                      <col.Icon size={20} aria-hidden="true" style={{ color: "var(--primary)" }} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{t(col.titleKey)}</h3>
                  </div>
                  <ul className="flex flex-col gap-3">
                    {col.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-foreground text-sm leading-relaxed">
                        <Check size={16} aria-hidden="true" className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy bar */}
        <section className="border-t border-border py-10 px-20">
          <div className="max-w-7xl mx-auto flex items-center gap-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--secondary)" }}>
              <Shield size={22} aria-hidden="true" style={{ color: "var(--accent)" }} />
            </div>
            <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
              <strong className="text-foreground">{C(lang, "privacyTitle")}</strong> {C(lang, "privacyBody")}
            </p>
          </div>
        </section>

        <footer className="border-t border-border px-20 py-10" style={{ backgroundColor: "var(--card)" }}>
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xl font-bold flex items-center gap-3 text-foreground mb-2">
                  <img src={astrisImg} alt="Astris" className="w-10 h-10 object-contain" /> Astris
                </div>
                <div className="text-sm text-muted-foreground max-w-sm mb-4">{t("landing.footer.program")}</div>
                <div className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Astris. Todos los derechos reservados.</div>
              </div>
              
              <div className="flex gap-16">
                <div className="flex flex-col gap-4">
                  <span className="font-bold text-foreground text-sm uppercase tracking-wider">Enlaces</span>
                  <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                    {(C(lang, "footerLinks") as string[]).map((link) => (
                      <span key={link} className="cursor-pointer hover:text-primary transition-colors">{link}</span>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <span className="font-bold text-foreground text-sm uppercase tracking-wider">Soporte y Contacto</span>
                  <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                    <a href="https://www.vibralatinatx.com/contact-1" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight size={14} />Vibra Latina</a>
                    <a href="https://support.microsoft.com/es-us/contactus/" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight size={14} />Microsoft Support</a>
                    <a href="https://genuinecup.org/" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight size={14} />The Genuine Foundation</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// ── Candidate Onboarding ──────────────────────────────────────────────────────

function CandidateOnboarding({ lang, palette, darkMode, font, onPalette, onDark, onFont, onContinue }: {
  lang: Lang; palette: PaletteKey; darkMode: boolean; font: FontKey;
  onPalette: (p: PaletteKey) => void; onDark: (d: boolean) => void; onFont: (f: FontKey) => void;
  onContinue: () => void;
}) {
  const t = useT(lang);
  const pal = PALETTES[palette];
  const bg = darkMode ? "#1A1A2E" : pal.bg;
  const fg = darkMode ? "#F0EFEA" : pal.fg;
  const card = darkMode ? "#252535" : pal.card;
  const accent = pal.accent;
  const border = darkMode ? "rgba(255,255,255,0.1)" : pal.border;
  const accentText = palette === "contraste" ? "#1A1A04" : "#fff";
  const fontFamily = font === "lexend" ? "'Lexend', Inter, sans-serif" : "'Atkinson Hyperlegible', Inter, sans-serif";

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-20 py-10 border-b border-border">
        <h1 className="text-3xl font-bold text-foreground">{t("palette.title")}</h1>
        <p className="text-muted-foreground mt-2 text-base max-w-xl">{t("palette.sub")}</p>
      </div>
      <div className="flex flex-1">
        {/* Controls */}
        <div className="w-[420px] shrink-0 border-r border-border px-10 py-10 flex flex-col gap-8 overflow-y-auto">
          {/* Dark mode */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide flex items-center gap-2"><Sun size={14} aria-hidden="true" /> {t("palette.dark")}</h3>
            <button onClick={() => onDark(!darkMode)} className="w-full flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
              <div className="flex items-center gap-3">
                {darkMode ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
                <span className="font-semibold text-foreground">{darkMode ? (lang === "es" ? "Modo oscuro" : lang === "pt" ? "Modo escuro" : lang === "fr" ? "Mode sombre" : "Dark mode") : (lang === "es" ? "Modo claro" : lang === "pt" ? "Modo claro" : lang === "fr" ? "Mode clair" : "Light mode")}</span>
              </div>
              <div className="w-12 h-6 rounded-full relative shrink-0" style={{ backgroundColor: darkMode ? "var(--primary)" : "var(--muted)" }} aria-hidden="true">
                <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white" style={{ left: darkMode ? "calc(100% - 22px)" : "2px", transition: "left 200ms ease" }} />
              </div>
            </button>
          </div>
          {/* Palettes */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-accent" aria-hidden="true" /> {lang === "es" ? "Paleta de color" : lang === "pt" ? "Paleta de cores" : lang === "fr" ? "Palette de couleur" : "Color palette"}</h3>
            <div className="flex flex-col gap-2.5">
              {(Object.keys(PALETTES) as PaletteKey[]).map((key) => {
                const p = PALETTES[key];
                const sel = palette === key;
                return (
                  <button key={key} onClick={() => onPalette(key)} className="w-full flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer text-left" style={{ borderColor: sel ? "var(--primary)" : "var(--border)", backgroundColor: sel ? "var(--secondary)" : "var(--background)" }}>
                    <div className="w-9 h-9 rounded-lg shrink-0 border" style={{ backgroundColor: p.bg, borderColor: p.border }} aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground text-sm">{getPaletteName(key, lang)}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{getPaletteDesc(key, lang)}</div>
                    </div>
                    {sel && <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--primary)" }}><Check size={11} aria-hidden="true" style={{ color: "var(--primary-foreground)" }} /></div>}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Font */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide flex items-center gap-2"><Type size={14} aria-hidden="true" /> {t("palette.font")}</h3>
            {([["atkinson", "Atkinson Hyperlegible", lang === "es" ? "Alta legibilidad — baja visión" : "High readability — low vision"], ["lexend", "Lexend", lang === "es" ? "Reduce fricción lectora — dislexia" : "Reduces reading friction — dyslexia"]] as const).map(([fk, fname, fdesc]) => {
              const sel = font === fk;
              return (
                <button key={fk} onClick={() => onFont(fk)} className="w-full flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer text-left mb-2.5" style={{ borderColor: sel ? "var(--primary)" : "var(--border)", backgroundColor: sel ? "var(--secondary)" : "var(--background)" }}>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground text-sm" style={{ fontFamily: fk === "lexend" ? "'Lexend', sans-serif" : "'Atkinson Hyperlegible', sans-serif" }}>{fname}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{fdesc}</div>
                  </div>
                  {sel && <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--primary)" }}><Check size={11} aria-hidden="true" style={{ color: "var(--primary-foreground)" }} /></div>}
                </button>
              );
            })}
          </div>
          <div className="mt-auto">
            <button onClick={onContinue} className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base cursor-pointer" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
              {t("continue")} <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
        {/* Preview */}
        <div className="flex-1 px-14 py-10">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-2 h-2 rounded-full bg-accent" aria-hidden="true" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{lang === "es" ? "Vista previa en tiempo real" : lang === "pt" ? "Visualização em tempo real" : lang === "fr" ? "Aperçu en temps réel" : "Real-time preview"}</span>
          </div>
          <div
            className="rounded-2xl border overflow-hidden shadow-md"
            style={{
              backgroundColor: bg, borderColor: border, color: fg, fontFamily,
              boxShadow: "0 4px 24px rgba(27,75,122,0.1)",
              transition: "background-color 320ms ease, border-color 320ms ease, color 320ms ease",
            }}
          >
            <div
              className="px-8 py-4 border-b flex items-center justify-between"
              style={{
                borderColor: border, backgroundColor: card,
                transition: "background-color 320ms ease, border-color 320ms ease",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 16, color: fg }}>Astris</span>
              <div className="flex gap-5">{(C(lang, "previewNav") as string[]).map((item) => <span key={item} style={{ fontSize: 13, color: fg, opacity: 0.6 }}>{item}</span>)}</div>
            </div>
            <div className="p-8">
              <div style={{ fontWeight: 700, fontSize: 22, color: fg, marginBottom: 4 }}>{C(lang, "previewTitle")}</div>
              <div style={{ fontSize: 14, color: fg, opacity: 0.55, marginBottom: 20 }}>{C(lang, "previewSubtitle")}</div>
              {[{ title: "Analista de Datos Junior", co: "Veritas Analytics", pct: 94 }, { title: "Diseñadora UX", co: "Forma Studio", pct: 87 }, { title: "Redactor/a Técnico/a", co: "Kestrel Systems", pct: 81 }].map((v) => (
                <div
                  key={v.title}
                  className="mb-3 rounded-xl p-4 border flex items-center justify-between"
                  style={{
                    backgroundColor: card, borderColor: border,
                    transition: "background-color 320ms ease, border-color 320ms ease",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: fg }}>{v.title}</div>
                    <div style={{ fontSize: 12, color: fg, opacity: 0.55 }}>{v.co}</div>
                  </div>
                  <div
                    className="px-3 py-1.5 rounded-full text-sm font-bold"
                    style={{
                      backgroundColor: accent, color: accentText,
                      transition: "background-color 320ms ease, color 320ms ease",
                    }}
                  >
                    {v.pct}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Candidate Quiz ────────────────────────────────────────────────────────────

function CandidateQuiz({ lang, axisIndex, answers, onAnswer, onPrev, onNext }: {
  lang: Lang; axisIndex: number; answers: QuizAnswers;
  onAnswer: (ai: number, qi: number, val: number | number[]) => void;
  onPrev: () => void; onNext: () => void;
}) {
  const t = useT(lang);
  const axis = QUIZ_AXES[axisIndex];
  const axisAnswers = answers[axisIndex] ?? {};
  const radarData = computeRadar(answers);
  const allAnswered = axis.questions.every((_, qi) => axisAnswers[qi] !== undefined && axisAnswers[qi] !== null);
  const AXIS_KEYS = ["quiz.axis1", "quiz.axis2", "quiz.axis3", "quiz.axis4"];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress */}
      <div className="px-20 py-8 border-b border-border">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-sm font-semibold text-muted-foreground" style={{ fontFamily: "DM Mono, monospace" }}>{t("quiz.step")} {axisIndex + 1} {t("quiz.of")} {QUIZ_AXES.length}</span>
          <div className="flex gap-2" role="progressbar" aria-valuenow={axisIndex + 1} aria-valuemax={QUIZ_AXES.length}>
            {QUIZ_AXES.map((_, i) => (
              <div
                key={i}
                className="h-2 rounded-full"
                style={{
                  width: i === axisIndex ? 44 : i < axisIndex ? 36 : 22,
                  backgroundColor: i <= axisIndex ? "var(--primary)" : "var(--muted)",
                  transition: "width 250ms ease, background-color 250ms ease",
                }}
              />
            ))}
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground">{t(AXIS_KEYS[axisIndex])}</h1>
      </div>

      <div className="flex flex-1">
        {/* Questions — key forces remount + fade on every axis change */}
        <div key={axisIndex} className="flex-1 px-20 py-10 overflow-y-auto anim-slide-up">
          <div className="max-w-xl">
            {axis.questions.map((q, qi) => {
              const ans = axisAnswers[qi];
              const opts = q.opts[lang] ?? q.opts.es;
              return (
                <div key={qi} className="mb-8">
                  <p className="text-base font-semibold text-foreground mb-4 leading-relaxed">{q.stems[lang] ?? q.stems.es}</p>
                  {q.type === "single" ? (
                    <div className="flex flex-col gap-2.5" role="radiogroup">
                      {opts.map((opt, oi) => {
                        const sel = ans === oi;
                        return (
                          <button key={oi} onClick={() => onAnswer(axisIndex, qi, oi)} className="flex items-center gap-4 p-4 rounded-xl border-2 text-left cursor-pointer" style={{ borderColor: sel ? "var(--primary)" : "var(--border)", backgroundColor: sel ? "var(--secondary)" : "var(--background)" }} role="radio" aria-checked={sel}>
                            <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0" style={{ borderColor: sel ? "var(--primary)" : "var(--muted-foreground)", backgroundColor: sel ? "var(--primary)" : "transparent" }} aria-hidden="true">
                              {sel && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <span className="text-foreground text-sm leading-snug">{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      {opts.map((opt, oi) => {
                        const selected = Array.isArray(ans) ? (ans as number[]).includes(oi) : false;
                        const isNone = oi === opts.length - 1;
                        const toggleMulti = () => {
                          const prev: number[] = Array.isArray(ans) ? (ans as number[]) : [];
                          let next: number[];
                          if (isNone) { next = selected ? [] : [oi]; }
                          else {
                            const withoutNone = prev.filter((x) => x !== opts.length - 1);
                            next = selected ? withoutNone.filter((x) => x !== oi) : [...withoutNone, oi];
                          }
                          onAnswer(axisIndex, qi, next);
                        };
                        return (
                          <button key={oi} onClick={toggleMulti} className="flex items-center gap-4 p-4 rounded-xl border-2 text-left cursor-pointer" style={{ borderColor: selected ? "var(--primary)" : "var(--border)", backgroundColor: selected ? "var(--secondary)" : "var(--background)" }}>
                            <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 border-2" style={{ borderColor: selected ? "var(--primary)" : "var(--muted-foreground)", backgroundColor: selected ? "var(--primary)" : "transparent" }} aria-hidden="true">
                              {selected && <Check size={11} style={{ color: "var(--primary-foreground)" }} />}
                            </div>
                            <span className="text-foreground text-sm leading-snug">{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Nav buttons */}
            <div className="flex gap-4 mt-4">
              {axisIndex > 0 && (
                <button onClick={onPrev} className="flex items-center gap-2 px-6 py-3.5 rounded-xl border-2 font-semibold cursor-pointer" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}>
                  <ChevronLeft size={18} aria-hidden="true" />{t("back")}
                </button>
              )}
              <button onClick={onNext} disabled={!allAnswered} className="flex items-center gap-2 px-7 py-3.5 rounded-xl border-2 font-bold" style={{ borderColor: allAnswered ? "var(--primary)" : "var(--muted)", backgroundColor: allAnswered ? "var(--primary)" : "var(--muted)", color: allAnswered ? "var(--primary-foreground)" : "var(--muted-foreground)", cursor: allAnswered ? "pointer" : "not-allowed", opacity: allAnswered ? 1 : 0.55 }}>
                {axisIndex === QUIZ_AXES.length - 1 ? (lang === "es" ? "Completar perfil" : lang === "pt" ? "Concluir perfil" : lang === "fr" ? "Compléter le profil" : "Complete profile") : t("next")}
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Radar */}
        <div className="w-[360px] shrink-0 border-l border-border px-10 py-10" style={{ backgroundColor: "var(--card)" }}>
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{t("quiz.radar.title")}</div>
          <p className="text-xs text-muted-foreground mb-4">{t("quiz.radar.sub")}</p>
          <RadarViz data={radarData} height={260} outerRadius={85} fontSize={10} />
          <div className="mt-4 flex flex-col gap-3">
            {radarData.map((d, i) => (
              <div key={d.axis} className="flex items-center gap-3">
                <span className="text-xs text-foreground w-28 shrink-0">{d.axis}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--muted)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${d.value}%`,
                      backgroundColor: answers[i] && Object.keys(answers[i]).length > 0 ? "var(--primary)" : "var(--muted-foreground)",
                      opacity: answers[i] && Object.keys(answers[i]).length > 0 ? 1 : 0.3,
                      transition: "width 450ms ease, background-color 300ms ease, opacity 300ms ease",
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-6 text-right" style={{ fontFamily: "DM Mono, monospace" }}>{answers[i] && Object.keys(answers[i]).length > 0 ? d.value : "—"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Candidate Profile ─────────────────────────────────────────────────────────

function CandidateProfile({ lang, answers }: { lang: Lang; answers: QuizAnswers }) {
  const t = useT(lang);
  const radarData = Object.keys(answers).length > 0 ? computeRadar(answers) : CANDIDATE_RADAR_FINAL;
  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-20 py-10 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <h1 className="text-3xl font-bold text-foreground">{t("profile.title")}</h1>
        <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground max-w-xl">
          <Shield size={14} aria-hidden="true" className="text-accent shrink-0" />
          <span>{t("profile.privacy")}</span>
        </div>
      </div>

      <div className="flex flex-1 max-w-7xl mx-auto w-full px-20 py-12 gap-12">
        <div className="flex-1">
          <RadarViz data={radarData} height={380} outerRadius={130} fontSize={13} />
          <div className="mt-4 flex flex-col gap-3">
            {radarData.map((d) => (
              <div key={d.axis} className="flex items-center gap-3">
                <span className="text-sm text-foreground w-32 shrink-0">{d.axis}</span>
                <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--muted)" }}>
                  <AnimatedBar value={d.value} height="h-2.5" />
                </div>
                <span className="text-sm font-semibold text-foreground w-8 text-right" style={{ fontFamily: "DM Mono, monospace" }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="w-80 shrink-0">
          <div className="rounded-2xl border border-border p-7" style={{ backgroundColor: "var(--card)" }}>
            <h3 className="font-bold text-foreground mb-4">{t("profile.adjustments")}</h3>
            <div className="flex flex-col gap-2.5">
              {CANDIDATE_ADJUSTMENTS.map((adj) => (
                <div key={adj} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--accent)" }} aria-hidden="true">
                    <Check size={11} style={{ color: "var(--accent-foreground)" }} />
                  </div>
                  <span className="text-sm text-foreground">{adj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Candidate Vacancies ───────────────────────────────────────────────────────

function CandidateVacancies({ lang, onSelect }: { lang: Lang; onSelect: (id: string) => void }) {
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
        // We already have the jobs in the matches response by ID, but we need the details.
        // Let's refetch or map them.
        const { data } = await supabase
          .from("jobs")
          .select(`id, title, description, company_id, status, work_modality, location_text, contract_type, offered_accommodations, required_skills`)
          .in("id", matches.map(m => m.jobId));
          
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
            const matchScore = matches.find(m => m.jobId === j.id)?.matchPercentage || 0;
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
  const MODALITIES = [["all", lang === "es" ? "Todas" : "All"], ["remoto", lang === "es" ? "Remoto" : "Remote"], ["remote", "Remote"], ["híbrido", lang === "es" ? "Híbrido" : "Hybrid"]];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-20 py-10 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <h1 className="text-3xl font-bold text-foreground">{t("vacancies.title")}</h1>
        <p className="text-muted-foreground mt-1">{filtered.length} {lang === "es" ? "vacantes compatibles" : "compatible vacancies"}</p>
      </div>
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-20 py-10 gap-8">
        {/* Filters */}
        <div className="w-60 shrink-0">
          <div className="rounded-2xl border border-border p-6" style={{ backgroundColor: "var(--card)" }}>
            <h3 className="font-bold text-foreground text-sm mb-4">{t("vacancies.filters")}</h3>
            <div className="mb-5">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t("vacancies.modality")}</div>
              <div className="flex flex-col gap-2">
                {[["all", lang === "es" ? "Todas" : "All"], ["remote", lang === "es" ? "Remoto" : "Remote"], ["hybrid", lang === "es" ? "Híbrido" : "Hybrid"]].map(([val, label]) => (
                  <button key={val} onClick={() => setModalityFilter(val)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer" style={{ backgroundColor: modalityFilter === val ? "var(--secondary)" : "transparent", color: "var(--foreground)", fontWeight: modalityFilter === val ? 600 : 400 }}>
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
            <article key={v.id} className="rounded-2xl border border-border p-7 flex items-center gap-7" style={{ backgroundColor: "var(--card)" }}>
              <MatchBadge value={v.match} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{v.title}</h3>
                    <div className="text-muted-foreground">{v.company} · {v.sector}</div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground shrink-0">
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
              <button onClick={() => onSelect(v.id)} className="shrink-0 flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold cursor-pointer text-sm" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
                {lang === "es" ? "Ver detalle" : "View detail"}<ArrowRight size={13} aria-hidden="true" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Vacancy Detail ────────────────────────────────────────────────────────────

function VacancyDetail({ lang, vacancyId, onStart, onBack }: { lang: Lang; vacancyId: string; onStart: () => void; onBack: () => void }) {
  const t = useT(lang);
  const [v, setV] = useState<VacancyItem | null>(null);

  useEffect(() => {
    async function loadData() {
      let currentMatch = 90;
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const matches = await getMatchesForCandidate(session.user.id);
        const m = matches.find((x: any) => x.jobId === vacancyId);
        if (m) currentMatch = m.matchPercentage;
      }

      if (vacancyId.startsWith("V-")) {
        setV(VACANCIES_FALLBACK.find((x) => x.id === vacancyId) ?? { ...VACANCIES_FALLBACK[0], match: currentMatch });
        return;
      }

      const { data } = await supabase
        .from("jobs")
        .select(`id, title, description, company_id, work_modality, location_text, contract_type, offered_accommodations`)
        .eq("id", vacancyId)
        .single();

      if (data) {
        const j: any = data;
        let companyName = "Empresa";
        let companyPhilosophy = "";
        if (j.company_id) {
          const { data: comp } = await supabase.from("companies").select("user_id, company_name, philosophy").eq("user_id", j.company_id).single();
          if (comp) {
            companyName = comp.company_name ?? companyName;
            companyPhilosophy = comp.philosophy ?? "";
          }
        }
        setV({
          id: j.id,
          title: j.title,
          company: companyName,
          sector: "-",
          modality: j.work_modality === "remote" ? (lang === "es" ? "Remoto" : "Remote") : j.work_modality === "hybrid" ? (lang === "es" ? "Híbrido" : "Hybrid") : (lang === "es" ? "Presencial" : "In-person"),
          type: j.contract_type ?? (lang === "es" ? "Tiempo completo" : "Full-time"),
          match: currentMatch,
          socialLevel: "Bajo",
          adjustments: j.offered_accommodations ?? [],
          desc: j.description ?? "",
          companyDesc: companyPhilosophy,
        });
      } else {
        setV({ ...VACANCIES_FALLBACK[0], match: currentMatch });
      }
    }
    loadData();
  }, [vacancyId, lang]);

  const COMPAT = [{ label: "Modalidad de trabajo", match: true }, { label: "Comunicación asíncrona", match: true }, { label: "Instrucciones escritas", match: true }, { label: "Espacio individual silencioso", match: false }, { label: "Horario flexible", match: true }];

  if (!v) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">{lang === "es" ? "Cargando..." : "Loading..."}</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-20 py-8 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer mb-4"><ChevronLeft size={15} aria-hidden="true" />{t("back")}</button>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{v.title}</h1>
            <p className="text-muted-foreground mt-0.5">{v.company} · {v.sector}</p>
          </div>
          <MatchBadge value={v.match} size="lg" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto w-full px-20 py-10 flex gap-10">
        <div className="flex-1">
          <div className="rounded-2xl border border-border p-8 mb-6" style={{ backgroundColor: "var(--card)" }}>
            <h2 className="font-bold text-foreground mb-3">{lang === "es" ? "Sobre la empresa" : "About the company"}</h2>
            <p className="text-muted-foreground leading-relaxed">{v.companyDesc}</p>
          </div>
          <div className="rounded-2xl border border-border p-8 mb-6" style={{ backgroundColor: "var(--card)" }}>
            <h2 className="font-bold text-foreground mb-3">{lang === "es" ? "El cargo" : "The role"}</h2>
            <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
            <div className="flex gap-4 mt-4">
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><Clock size={13} aria-hidden="true" />{v.type}</span>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin size={13} aria-hidden="true" />{v.modality}</span>
            </div>
          </div>
          <div className="rounded-2xl border border-border p-8" style={{ backgroundColor: "var(--card)" }}>
            <h2 className="font-bold text-foreground mb-4">{t("vacancy.why")}</h2>
            <div className="flex flex-col gap-2.5">
              {COMPAT.map((c) => (
                <div key={c.label} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded flex items-center justify-center shrink-0" style={{ backgroundColor: c.match ? "var(--accent)" : "var(--muted)" }} aria-hidden="true">
                    {c.match ? <Check size={11} style={{ color: "var(--accent-foreground)" }} /> : <X size={11} style={{ color: "var(--muted-foreground)" }} />}
                  </div>
                  <span className="text-sm text-foreground">{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-72 shrink-0 flex flex-col gap-5">
          <div className="rounded-2xl border border-border p-6" style={{ backgroundColor: "var(--card)" }}>
            <h3 className="font-bold text-foreground mb-4 text-sm">{lang === "es" ? "Ajustes ofrecidos" : "Adjustments offered"}</h3>
            <div className="flex flex-col gap-2">
              {v.adjustments.map((a) => (
                <div key={a} className="flex items-center gap-2.5">
                  <Check size={12} aria-hidden="true" style={{ color: "var(--accent)" }} />
                  <span className="text-sm text-foreground">{a}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={onStart} className="w-full flex items-center justify-center gap-2 py-5 rounded-xl font-bold text-base cursor-pointer" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
            <ArrowRight size={18} aria-hidden="true" />{t("vacancy.start")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Mentor Select ─────────────────────────────────────────────────────────────

function MentorSelect({ lang, onSelect }: { lang: Lang; onSelect: () => void }) {
  const t = useT(lang);
  const [chosen, setChosen] = useState<string | null>(null);
  const [mentors, setMentors] = useState<MentorItem[]>([]);
  const [loadingMent, setLoadingMent] = useState(true);

  useEffect(() => {
    async function loadMentors() {
      try {
        const { data: mentorsData, error: mentorsErr } = await supabase
          .from("mentors")
          .select("user_id, full_name, specialty, years_experience, modality, bio");

        if (mentorsErr || !mentorsData || mentorsData.length === 0) {
          setMentors([]);
          setLoadingMent(false);
          return;
        }

        const mapped: MentorItem[] = mentorsData.map((m: any) => ({
          id: m.user_id,
          name: m.full_name ?? "Mentor",
          specialty: m.specialty ?? "",
          years: m.years_experience ?? 5,
          modality: m.modality ?? "Virtual",
          bio: m.bio ?? "",
        }));
        setMentors(mapped);
      } catch (e) {
        setMentors([]);
      } finally {
        setLoadingMent(false);
      }
    }
    loadMentors();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-20 py-10 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <h1 className="text-3xl font-bold text-foreground">{t("mentor.title")}</h1>
        <p className="text-muted-foreground mt-2">{t("mentor.sub")}</p>
      </div>
      <div className="max-w-7xl mx-auto w-full px-20 py-10">
        {loadingMent ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">{lang === "es" ? "Cargando mentores..." : "Loading mentors..."}</div>
        ) : (
          <div className="grid grid-cols-4 gap-6">
            {mentors.map((m) => (
              <article key={m.id} className="rounded-2xl border-2 flex flex-col overflow-hidden" style={{ borderColor: chosen === m.id ? "var(--primary)" : "var(--border)", backgroundColor: "var(--card)" }}>
                <div className="px-6 pt-8 pb-5">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "var(--secondary)" }} aria-hidden="true">
                    <User size={28} style={{ color: "var(--primary)" }} />
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-foreground">{m.name}</div>
                    <div className="text-xs text-muted-foreground mt-1 leading-tight">{m.specialty}</div>
                  </div>
                </div>
                <div className="px-6 pb-5 flex flex-col gap-2 border-t border-border pt-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><Star size={12} aria-hidden="true" style={{ color: "var(--accent)" }} />{m.years} {lang === "es" ? "años de experiencia" : "years experience"}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><MapPin size={12} aria-hidden="true" />{m.modality}</div>
                  {m.bio && <p className="text-xs text-muted-foreground leading-relaxed mt-1">{m.bio}</p>}
                </div>
                <div className="px-6 pb-6 mt-auto">
                  <button onClick={() => { setChosen(m.id); setTimeout(onSelect, 300); }} className="w-full py-3 rounded-xl font-semibold cursor-pointer text-sm" style={{ backgroundColor: chosen === m.id ? "var(--primary)" : "var(--secondary)", color: chosen === m.id ? "var(--primary-foreground)" : "var(--foreground)" }}>
                    {chosen === m.id ? <span className="flex items-center justify-center gap-1.5"><Check size={14} aria-hidden="true" /> {lang === "es" ? "Seleccionado" : "Selected"}</span> : t("mentor.choose")}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Accompaniment Timeline ────────────────────────────────────────────────────

function CandidateAccompaniment({ lang }: { lang: Lang }) {
  const t = useT(lang);
  const STAGES = C(lang, "accompStages") as typeof CONTENT.es.accompStages;
  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-20 py-10 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <h1 className="text-3xl font-bold text-foreground">{t("accomp.title")}</h1>
        <p className="text-muted-foreground mt-2">{t("accomp.sub")}</p>
      </div>
      <div className="max-w-5xl mx-auto w-full px-20 py-12 flex gap-12">
        {/* Timeline */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5" style={{ backgroundColor: "var(--border)" }} aria-hidden="true" />
            {STAGES.map((s, i) => (
              <div key={i} className="relative flex gap-6 pb-8 last:pb-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 relative z-10" style={{ borderColor: s.current ? "var(--accent)" : s.done ? "var(--primary)" : "var(--muted)", backgroundColor: s.current ? "var(--accent)" : s.done ? "var(--primary)" : "var(--background)" }}>
                  {s.done ? <Check size={16} aria-hidden="true" style={{ color: "var(--primary-foreground)" }} /> : s.current ? <div className="w-3 h-3 rounded-full bg-white" aria-hidden="true" /> : <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--muted)" }} aria-hidden="true" />}
                </div>
                <div className="flex-1 pt-1.5 pb-4">
                  <div className="font-semibold text-foreground flex items-center gap-3">
                    {s.label}
                    {s.current && <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: "var(--accent)" + "22", color: "var(--accent)" }}>{lang === "es" ? "En curso" : lang === "pt" ? "Em andamento" : lang === "fr" ? "En cours" : "In progress"}</span>}
                    {s.done && <span className="text-xs text-muted-foreground">{lang === "es" ? "Completado" : lang === "pt" ? "Concluído" : lang === "fr" ? "Terminé" : "Completed"}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Mentor info */}
        <div className="w-72 shrink-0">
          <div className="rounded-2xl border border-border p-7" style={{ backgroundColor: "var(--card)" }}>
            <h3 className="font-bold text-foreground mb-5 text-sm">{C(lang, "mentorAssigned")}</h3>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--secondary)" }} aria-hidden="true">
                <User size={22} style={{ color: "var(--primary)" }} />
              </div>
              <div>
                <div className="font-bold text-foreground">Carmen Ruiz</div>
                <div className="text-xs text-muted-foreground">Inclusión laboral y funciones ejecutivas</div>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold cursor-pointer text-sm border border-border mb-2.5" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
              <MessageSquare size={14} aria-hidden="true" />{C(lang, "openNotes")}
            </button>
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold cursor-pointer text-sm" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
              <Calendar size={14} aria-hidden="true" />{C(lang, "scheduleCheckin")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Candidate Post-hire ───────────────────────────────────────────────────────

function CandidatePostHire({ lang }: { lang: Lang }) {
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
    // Simulate save to DB
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
    <div className="min-h-screen flex flex-col">
      <div className="px-20 py-10 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <h1 className="text-3xl font-bold text-foreground">{t("posthire.title")}</h1>
        <p className="text-muted-foreground mt-1">Veritas Analytics · {lang === "es" ? "Analista de Datos Junior" : "Junior Data Analyst"} · {lang === "es" ? "Día 14 de 60" : "Day 14 of 60"}</p>
      </div>
      <div className="max-w-5xl mx-auto w-full px-20 py-10 flex flex-col gap-8">
        {/* Status */}
        <div className="rounded-2xl border border-border p-8" style={{ backgroundColor: "var(--card)" }}>
          <h2 className="font-bold text-foreground mb-6">{t("posthire.status")}</h2>
          <div className="flex gap-4">
            {STATUS_LABELS.map((label, i) => (
              <div key={i} className="flex-1 py-5 rounded-xl border-2 text-center cursor-pointer font-semibold text-sm" style={{ borderColor: status === i ? "var(--primary)" : "var(--border)", backgroundColor: status === i ? "var(--secondary)" : "var(--background)", color: "var(--foreground)" }}>
                {status === i && <div className="w-2 h-2 rounded-full bg-primary mx-auto mb-2" aria-hidden="true" />}
                {label}
              </div>
            ))}
          </div>
        </div>
        {/* Report */}
        <div className="rounded-2xl border border-border p-8" style={{ backgroundColor: "var(--card)" }}>
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
        <div className="rounded-2xl border border-border p-8" style={{ backgroundColor: "var(--card)" }}>
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

// ── Company Screens ───────────────────────────────────────────────────────────

function CompanyOrgProfile({ lang }: { lang: Lang }) {
  const t = useT(lang);
  const [open, setOpen] = useState<Record<string, boolean>>({ general: true });
  const toggle = (k: string) => setOpen((p) => ({ ...p, [k]: !p[k] }));
  const sectionTitles = C(lang, "orgSections") as string[];
  const sectionIds = C(lang, "orgSectionIds") as string[];
  const SECTIONS = sectionTitles.map((title, i) => ({ id: sectionIds[i], title }));
  const PRESTACIONES = ["Audífonos con cancelación de ruido", "Teclados especializados", "Pantallas anti-reflejo", "Rampas y ascensores", "Salas de descanso sensorial", "Modalidad remota e híbrida disponible"];
  const POLITICAS = ["Pausas activas programadas", "Flexibilidad de horario"];

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    company_name: "",
    industry: "",
    company_size: "",
    country: "",
    city: "",
    philosophy: "",
    noise: "",
    light: "",
    layout: "",
    accommodations: [] as string[],
    policies: [] as string[],
  });

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase.from("companies").select("*").eq("user_id", session.user.id).single();
      if (data) {
        let env: any = {};
        try { env = JSON.parse(data.work_environment || "{}"); } catch (e) { }
        setFormData({
          company_name: data.company_name || "",
          industry: data.industry || "",
          company_size: env.company_size || "",
          country: env.country || "",
          city: env.city || "",
          philosophy: data.philosophy || "",
          noise: env.noise || "",
          light: env.light || "",
          layout: env.layout || "",
          accommodations: data.accommodations || [],
          policies: env.policies || [],
        });
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleChange = (field: string, val: string) => setFormData(p => ({ ...p, [field]: val }));

  const toggleArray = (field: "accommodations" | "policies", item: string) => {
    setFormData(p => ({
      ...p,
      [field]: p[field].includes(item) ? p[field].filter(x => x !== item) : [...p[field], item]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const env = JSON.stringify({
      noise: formData.noise,
      light: formData.light,
      layout: formData.layout,
      policies: formData.policies,
      company_size: formData.company_size,
      country: formData.country,
      city: formData.city
    });

    const { error } = await supabase.from("companies").upsert({
      user_id: session.user.id,
      company_name: formData.company_name || "Sin nombre",
      industry: formData.industry,
      philosophy: formData.philosophy,
      work_environment: env,
      accommodations: formData.accommodations
    });

    setSaving(false);
    if (!error) {
      setMessage(lang === "es" ? "Cambios guardados exitosamente" : "Changes saved successfully");
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage(lang === "es" ? "Error al guardar" : "Error saving changes");
      console.error(error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Cargando...</div>;

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <div className="px-20 py-10 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <h1 className="text-3xl font-bold text-foreground">{t("comp.org.title")}</h1>
        <p className="text-muted-foreground mt-2 max-w-xl">{t("comp.org.sub")}</p>
      </div>
      <div className="max-w-4xl mx-auto w-full px-20 py-10 flex flex-col gap-3">
        {SECTIONS.map((s) => (
          <div key={s.id} className="rounded-2xl border border-border overflow-hidden" style={{ backgroundColor: "var(--card)" }}>
            <button onClick={() => toggle(s.id)} className="w-full flex items-center justify-between px-7 py-5 text-left cursor-pointer">
              <span className="font-bold text-foreground">{s.title}</span>
              <ChevronDown size={18} aria-hidden="true" className="text-muted-foreground" style={{ transform: open[s.id] ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </button>
            {open[s.id] && (
              <div className="px-7 pb-7 border-t border-border anim-slide-down">
                {s.id === "general" && (
                  <div className="grid grid-cols-2 gap-5 pt-5">
                    {[
                      { label: "Nombre de la organización", field: "company_name" },
                      { label: "Sector de actividad", field: "industry" },
                      { label: "Tamaño de la organización", field: "company_size" },
                      { label: "País", field: "country" },
                      { label: "Ciudad", field: "city" }
                    ].map((f) => (
                      <div key={f.field}>
                        <label className="block text-sm font-semibold text-foreground mb-2">{f.label}</label>
                        <input
                          type="text"
                          value={(formData as any)[f.field]}
                          onChange={(e) => handleChange(f.field, e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-border text-sm outline-none focus:border-primary"
                          style={{ backgroundColor: "var(--input-background)", color: "var(--foreground)" }}
                          placeholder={f.label}
                        />
                      </div>
                    ))}
                  </div>
                )}
                {s.id === "cultura" && (
                  <div className="pt-5">
                    <textarea
                      value={formData.philosophy}
                      onChange={(e) => handleChange("philosophy", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border text-sm outline-none focus:border-primary min-h-[100px] resize-y"
                      style={{ backgroundColor: "var(--input-background)", color: "var(--foreground)" }}
                      placeholder="Describe la filosofía y cultura de tu empresa..."
                    />
                  </div>
                )}
                {s.id === "entorno" && (
                  <div className="grid grid-cols-3 gap-5 pt-5">
                    {[
                      { label: "Nivel de ruido habitual", field: "noise", placeholder: "Ej. Bajo (oficina silenciosa)" },
                      { label: "Tipo de iluminación", field: "light", placeholder: "Ej. Luz natural + LED" },
                      { label: "Distribución de espacios", field: "layout", placeholder: "Ej. Individual" }
                    ].map((f) => (
                      <div key={f.field}>
                        <label className="block text-sm font-semibold text-foreground mb-2">{f.label}</label>
                        <input
                          type="text"
                          value={(formData as any)[f.field]}
                          onChange={(e) => handleChange(f.field, e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-border text-sm outline-none focus:border-primary"
                          style={{ backgroundColor: "var(--input-background)", color: "var(--foreground)" }}
                          placeholder={f.placeholder}
                        />
                      </div>
                    ))}
                  </div>
                )}
                {s.id === "prestaciones" && (
                  <div className="grid grid-cols-2 gap-3 pt-5">
                    {PRESTACIONES.map((p) => {
                      const offered = formData.accommodations.includes(p);
                      return (
                        <button key={p} onClick={() => toggleArray("accommodations", p)} className="flex items-center gap-3 p-3.5 rounded-xl border border-border cursor-pointer text-left transition-colors" style={{ backgroundColor: offered ? "var(--secondary)" : "var(--background)" }}>
                          <div className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors" style={{ borderColor: offered ? "var(--primary)" : "var(--muted-foreground)", backgroundColor: offered ? "var(--primary)" : "transparent" }} aria-hidden="true">
                            {offered && <Check size={11} style={{ color: "var(--primary-foreground)" }} />}
                          </div>
                          <span className="text-sm text-foreground">{p}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
                {s.id === "politicas" && (
                  <div className="flex flex-col gap-4 pt-5">
                    {POLITICAS.map((pol) => {
                      const active = formData.policies.includes(pol);
                      return (
                        <div key={pol} className="flex items-center justify-between cursor-pointer" onClick={() => toggleArray("policies", pol)}>
                          <span className="text-sm font-semibold text-foreground">{pol}</span>
                          <div className="w-12 h-6 rounded-full relative transition-colors" style={{ backgroundColor: active ? "var(--primary)" : "var(--muted)" }} aria-hidden="true">
                            <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all" style={{ left: active ? "calc(100% - 22px)" : "2px" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        <div className="flex items-center justify-end gap-4 mt-2">
          {message && <span className="text-sm text-green-500 font-medium">{message}</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-4 rounded-xl font-bold cursor-pointer disabled:opacity-70"
            style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            {saving ? "Guardando..." : t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}

function CompanyPostVacancy({ lang }: { lang: Lang }) {
  const t = useT(lang);
  const SKILLS = ["Mecanografía", "Microsoft Office", "Lectura intensiva", "Redacción técnica", "Análisis de datos", "Diseño visual", "Comunicación verbal"];
  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-20 py-10 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <h1 className="text-3xl font-bold text-foreground">{t("comp.vacancy.title")}</h1>
      </div>
      <div className="max-w-3xl mx-auto w-full px-20 py-10 flex flex-col gap-7">
        {[["Título del cargo", "Analista de Datos Junior"], ["Descripción de funciones", ""], ["Tipo de comunicación predominante", "Escrita — asíncrona"]].map(([label, val]) => (
          <div key={label as string}>
            <label className="block text-sm font-semibold text-foreground mb-2">{label as string}</label>
            {label === "Descripción de funciones" ? (
              <div className="w-full px-4 py-4 rounded-xl border border-border text-sm text-muted-foreground min-h-[80px]" style={{ backgroundColor: "var(--input-background)" }}>Análisis y visualización de bases de datos para reportes semanales del equipo...</div>
            ) : (
              <div className="w-full px-4 py-3 rounded-xl border border-border text-sm" style={{ backgroundColor: "var(--input-background)", color: "var(--foreground)" }}>{val as string}</div>
            )}
          </div>
        ))}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">{lang === "es" ? "Nivel de socialización requerido" : "Required socialization level"}</label>
          <div className="flex gap-3">
            {["Bajo", "Medio", "Alto"].map((lvl, i) => (
              <button key={lvl} className="flex-1 py-3 rounded-xl border-2 text-sm font-semibold cursor-pointer" style={{ borderColor: i === 0 ? "var(--primary)" : "var(--border)", backgroundColor: i === 0 ? "var(--secondary)" : "var(--background)", color: "var(--foreground)" }}>{lvl}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">{lang === "es" ? "Habilidades técnicas requeridas" : "Required technical skills"}</label>
          <div className="flex flex-wrap gap-2.5">
            {SKILLS.map((sk, i) => {
              const checked = [0, 1, 3, 4].includes(i);
              return (
                <div key={sk} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer" style={{ borderColor: checked ? "var(--primary)" : "var(--border)", backgroundColor: checked ? "var(--secondary)" : "var(--background)" }}>
                  <div className="w-4 h-4 rounded border flex items-center justify-center" style={{ borderColor: checked ? "var(--primary)" : "var(--muted-foreground)", backgroundColor: checked ? "var(--primary)" : "transparent" }} aria-hidden="true">
                    {checked && <Check size={9} style={{ color: "var(--primary-foreground)" }} />}
                  </div>
                  <span className="text-sm text-foreground">{sk}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">{lang === "es" ? "Modalidad" : "Modality"}</label>
            <div className="px-4 py-3 rounded-xl border border-border text-sm" style={{ backgroundColor: "var(--input-background)", color: "var(--foreground)" }}>100% Remoto</div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">{lang === "es" ? "Horario" : "Schedule"}</label>
            <div className="px-4 py-3 rounded-xl border border-border text-sm" style={{ backgroundColor: "var(--input-background)", color: "var(--foreground)" }}>Flexible — 8h diarias</div>
          </div>
        </div>
        <button className="self-end px-8 py-4 rounded-xl font-bold cursor-pointer" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>{lang === "es" ? "Publicar vacante" : "Post vacancy"}</button>
      </div>
    </div>
  );
}

function CompanyCandidates({ lang, onSelect }: { lang: Lang; onSelect: (id: string) => void }) {
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
    <div className="min-h-screen flex flex-col">
      <div className="px-20 py-10 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <h1 className="text-3xl font-bold text-foreground">{t("comp.candidates.title")}</h1>
        <p className="text-muted-foreground mt-2">{t("comp.candidates.sub")}</p>
      </div>
      <div className="max-w-7xl mx-auto w-full px-20 py-10">
        <div className="rounded-2xl border border-border overflow-hidden">
          <div className="grid border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wide px-7 py-4" style={{ gridTemplateColumns: "1fr 2fr 100px 160px", backgroundColor: "var(--muted)" }}>
            <span>Identificador</span><span>Resumen de fortalezas</span><span className="text-center">Compatibilidad</span><span />
          </div>
          {loading ? (
            <div className="px-7 py-12 text-center text-muted-foreground">Cargando candidatos...</div>
          ) : candidates.length === 0 ? (
            <div className="px-7 py-12 text-center text-muted-foreground">No se encontraron candidatos.</div>
          ) : candidates.map((c, i) => (
            <div key={c.id} className="grid items-center px-7 py-5 border-b border-border last:border-0" style={{ gridTemplateColumns: "1fr 2fr 100px 160px", backgroundColor: i % 2 === 0 ? "var(--background)" : "var(--card)" }}>
              <div className="font-mono text-sm font-bold" style={{ color: "var(--primary)", fontFamily: "DM Mono, monospace" }}>{c.id}</div>
              <div className="text-sm text-muted-foreground leading-relaxed pr-4">{c.strengths}</div>
              <div className="flex justify-center"><MatchBadge value={c.match} size="sm" /></div>
              <button onClick={() => onSelect(c.id)} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold cursor-pointer text-sm" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
                {lang === "es" ? "Ver perfil" : "View profile"}<ChevronRight size={14} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CompanyCandidateDetail({ lang, candidateId, onBack, onStart }: { lang: Lang; candidateId: string; onBack: () => void; onStart: () => void }) {
  const t = useT(lang);
  const [candidate, setCandidate] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCandidate() {
      let currentMatch = 80;
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const matches = await getMatchesForCompany(session.user.id);
        const m = matches.find((x: any) => x.candidateId === candidateId);
        if (m) currentMatch = m.matchPercentage;
      }

      const { data, error } = await supabase
        .from("users_profiles")
        .select("*, candidates(*)")
        .eq("id", candidateId)
        .single();

      if (data) {
        setCandidate({ ...data, profile: data.candidates?.[0] ?? {}, match: currentMatch });
      }
      setLoading(false);
    }
    loadCandidate();
  }, [candidateId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Cargando...</div>;
  if (!candidate) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Candidato no encontrado.</div>;

  const profile = candidate.profile || {};
  const radar = [
    { axis: "Procesamiento", value: profile.work_preference ? 80 : 55 },
    { axis: "T. Ambiental", value: profile.ideal_environment ? 70 : 50 },
    { axis: "Ejecución", value: profile.interests ? 75 : 45 },
    { axis: "Ajustes", value: profile.accessibility_theme || profile.accessibility_font ? 85 : 50 },
  ];
  const env = [
    { req: profile.ideal_environment ? profile.ideal_environment : "Entorno ideal no definido", met: !!profile.ideal_environment },
    { req: profile.interests ? `Intereses: ${profile.interests}` : "Intereses no definidos", met: !!profile.interests },
    { req: profile.accessibility_theme ? `Tema accesible: ${profile.accessibility_theme}` : "Tema accesible no definido", met: !!profile.accessibility_theme },
    { req: profile.accessibility_font ? `Fuente accesible: ${profile.accessibility_font}` : "Fuente accesible no definida", met: !!profile.accessibility_font },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-20 py-8 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer mb-4"><ChevronLeft size={15} aria-hidden="true" />{t("back")}</button>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">{t("comp.detail.title")}</div>
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "DM Mono, monospace" }}>{candidate.id}</h1>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Shield size={13} aria-hidden="true" style={{ color: "var(--accent)" }} />{lang === "es" ? "Perfil anónimo — sin nombre, fotografía ni diagnóstico médico" : "Anonymous profile — no name, photo, or medical diagnosis"}
            </div>
          </div>
          <MatchBadge value={Math.floor(Math.random() * 20) + 80} size="lg" />
        </div>
      </div>
      <div className="max-w-5xl mx-auto w-full px-20 py-10 flex gap-10">
        <div className="flex-1">
          <h2 className="font-bold text-foreground mb-2">{lang === "es" ? "Perfil de compatibilidad" : "Compatibility profile"}</h2>
          <RadarViz data={radar} height={300} outerRadius={100} fontSize={12} />
        </div>
        <div className="w-72 shrink-0 flex flex-col gap-5">
          <div className="rounded-2xl border border-border p-6" style={{ backgroundColor: "var(--card)" }}>
            <h3 className="font-bold text-foreground mb-4 text-sm">{lang === "es" ? "Entorno requerido" : "Required environment"}</h3>
            <div className="flex flex-col gap-2.5">
              {env.map((e) => (
                <div key={e.req} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: e.met ? "var(--accent)" : "var(--muted)" }} aria-hidden="true">
                    {e.met ? <Check size={11} style={{ color: "var(--accent-foreground)" }} /> : <X size={11} style={{ color: "var(--muted-foreground)" }} />}
                  </div>
                  <span className="text-sm text-foreground leading-snug">{e.req}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={onStart} className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold cursor-pointer text-sm" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
            <Users size={16} aria-hidden="true" />{lang === "es" ? "Iniciar proceso de match" : "Start match process"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CompanyPostHire({ lang }: { lang: Lang }) {
  const t = useT(lang);
  const [obs, setObs] = useState("");
  const [sending, setSending] = useState(false);
  const [sentObs, setSentObs] = useState<string[]>([]);

  const handleSend = async () => {
    if (!obs.trim()) return;
    setSending(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
         await supabase.from("checkins").insert({ user_id: session.user.id, role: "company", note: obs });
      }
    } catch (e) {}
    setSentObs([obs, ...sentObs]);
    setObs("");
    setSending(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-20 py-10 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <h1 className="text-3xl font-bold text-foreground">{t("comp.posthire.title")}</h1>
        <p className="text-muted-foreground mt-1">CAND-A7X2 · {lang === "es" ? "Analista de Datos Junior · Día 14 de 60" : "Junior Data Analyst · Day 14 of 60"}</p>
      </div>
      <div className="max-w-4xl mx-auto w-full px-20 py-10 flex flex-col gap-6">
        <div className="rounded-2xl border border-border p-7" style={{ backgroundColor: "var(--card)" }}>
          <h2 className="font-bold text-foreground mb-5">{C(lang, "compPostHireStatus") as string}</h2>
          <div className="flex gap-3 mb-6">
            {(C(lang, "statusLabels") as string[]).map((s, i) => (
              <div key={s} className="flex-1 py-4 rounded-xl border-2 text-center text-sm font-semibold" style={{ borderColor: i === 1 ? "var(--primary)" : "var(--border)", backgroundColor: i === 1 ? "var(--secondary)" : "var(--background)", color: "var(--foreground)" }}>{s}</div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{lang === "es" ? "El colaborador se encuentra en estado estable. Las herramientas asíncronas están configuradas correctamente. Se identificó un punto de fricción: reuniones sin agenda previa. El mentor está trabajando con RRHH para implementar un formato estructurado." : "The collaborator is in stable status. Async tools are correctly configured. One friction point identified: meetings without prior agenda. The mentor is working with HR to implement a structured format."}</p>
        </div>
        <div className="rounded-2xl border border-border p-7" style={{ backgroundColor: "var(--card)" }}>
          <h2 className="font-bold text-foreground mb-4">{C(lang, "compPostHireObs") as string}</h2>
          <textarea 
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            className="w-full px-4 py-4 rounded-xl border border-border text-sm text-foreground outline-none focus:border-primary min-h-[80px] resize-y" 
            style={{ backgroundColor: "var(--input-background)" }} 
            placeholder={C(lang, "compPostHireObsPlaceholder") as string}
          />
          <button onClick={handleSend} disabled={sending || !obs.trim()} className="mt-4 px-6 py-3 rounded-xl font-semibold cursor-pointer text-sm disabled:opacity-50" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
            {sending ? "Enviando..." : (C(lang, "compPostHireSend") as string)}
          </button>
          
          {sentObs.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="font-bold text-sm mb-3">Observaciones enviadas</h3>
              <div className="flex flex-col gap-3">
                {sentObs.map((o, i) => (
                   <div key={i} className="text-sm text-muted-foreground p-3 rounded-lg border border-border" style={{ backgroundColor: "var(--background)" }}>{o}</div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-border p-7" style={{ backgroundColor: "var(--card)" }}>
          <h2 className="font-bold text-foreground mb-4">{C(lang, "compPostHireContact") as string}</h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--secondary)" }} aria-hidden="true"><User size={22} style={{ color: "var(--primary)" }} /></div>
            <div><div className="font-bold text-foreground">Carmen Ruiz</div><div className="text-sm text-muted-foreground">carmen.ruiz@astris.co</div></div>
            <button className="ml-auto px-5 py-2.5 rounded-xl font-semibold cursor-pointer text-sm border border-border" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}><MessageSquare size={14} aria-hidden="true" className="inline mr-2" />{C(lang, "compPostHireSendMsg") as string}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Mentor Dashboard ──────────────────────────────────────────────────────────

function MentorDashboard({ lang }: { lang: Lang }) {
  const t = useT(lang);
  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <div className="px-20 py-10 max-w-7xl mx-auto">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{t("mentor.dash.title")}</div>
          <h2 className="text-2xl font-bold text-foreground">Carmen Ruiz</h2>
          <p className="text-muted-foreground mt-1">Inclusión laboral y funciones ejecutivas</p>
        </div>
      </div>
      <div className="border-b border-border" style={{ backgroundColor: "var(--background)" }}>
        <div className="px-20 py-5 max-w-7xl mx-auto flex gap-10">
          {([["3", C(lang, "mentorProcesses"), "var(--primary)"], ["2", lang === "es" ? "Sesiones pendientes" : lang === "pt" ? "Sessões pendentes" : lang === "fr" ? "Sessions en attente" : "Pending sessions", "var(--accent)"], ["12", lang === "es" ? "Completados este año" : lang === "pt" ? "Concluídos este ano" : lang === "fr" ? "Complétés cette année" : "Completed this year", "var(--muted-foreground)"], ["91%", lang === "es" ? "Retención promedio" : lang === "pt" ? "Retenção média" : lang === "fr" ? "Rétention moyenne" : "Average retention", "var(--accent)"]] as const).map(([val, label, color]) => (
            <div key={label as string} className="flex flex-col gap-1">
              <div className="text-2xl font-bold" style={{ color: color as string, fontFamily: "DM Mono, monospace" }}>{val}</div>
              <div className="text-xs text-muted-foreground">{label as string}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-20 py-10 gap-8">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-foreground mb-6">{C(lang, "mentorProcesses") as string}</h3>
          <div className="flex flex-col gap-5">
            {MENTOR_PROCESSES.map((proc) => (
              <article key={proc.cid} className="rounded-2xl border border-border p-7" style={{ backgroundColor: "var(--card)" }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: proc.stageColor + "22", color: proc.stageColor }}>{proc.stage}</span>
                      <span className="text-xs text-muted-foreground" style={{ fontFamily: "DM Mono, monospace" }}>{proc.cid}</span>
                    </div>
                    <h4 className="text-lg font-bold text-foreground">{proc.role}</h4>
                    <div className="text-muted-foreground text-sm">{proc.company}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-muted-foreground">{lang === "es" ? "Activo hace" : "Active for"}</div>
                    <div className="text-2xl font-bold text-foreground" style={{ fontFamily: "DM Mono, monospace" }}>{proc.days}d</div>
                  </div>
                </div>
                <div className="p-4 rounded-xl mb-4 border border-border" style={{ backgroundColor: "var(--background)" }}>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">{C(lang, "sessionNotes") as string}</div>
                  <p className="text-sm text-foreground leading-relaxed">{proc.notes}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div><div className="text-xs text-muted-foreground mb-0.5">{C(lang, "nextAction") as string}</div><div className="text-sm font-semibold text-foreground">{proc.action}</div></div>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold cursor-pointer text-sm border border-border" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}><MessageSquare size={14} aria-hidden="true" />{C(lang, "notes") as string}</button>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold cursor-pointer text-sm" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}><Calendar size={14} aria-hidden="true" />{C(lang, "scheduleSession") as string}</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="w-72 shrink-0 flex flex-col gap-5">
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

// ── Mentor Sub-screens ────────────────────────────────────────────────────────

function MentorCheckins({ lang }: { lang: Lang }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-20 py-10 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <h1 className="text-3xl font-bold text-foreground">{C(lang, "checkinPageTitle") as string}</h1>
        <p className="text-muted-foreground mt-2">{C(lang, "checkinPageSub") as string}</p>
      </div>
      <div className="max-w-4xl mx-auto w-full px-20 py-10 flex flex-col gap-5">
        {[
          { date: "Jun 18, 2025", cand: "CAND-A7X2", company: "Veritas Analytics", type: lang === "es" ? "Onboarding — Semana 2" : lang === "pt" ? "Onboarding — Semana 2" : lang === "fr" ? "Onboarding — Semaine 2" : "Onboarding — Week 2", time: "10:00 AM" },
          { date: "Jun 20, 2025", cand: "CAND-B3M9", company: "Forma Studio", type: lang === "es" ? "Preparación de entrevista" : lang === "pt" ? "Preparação de entrevista" : lang === "fr" ? "Préparation entretien" : "Interview preparation", time: "2:00 PM" },
          { date: "Jun 24, 2025", cand: "CAND-C1K4", company: "Kestrel Systems", type: lang === "es" ? "Revisión de 30 días" : lang === "pt" ? "Revisão de 30 dias" : lang === "fr" ? "Révision de 30 jours" : "30-day review", time: "11:30 AM" },
        ].map((item) => (
          <article key={item.cand} className="rounded-2xl border border-border p-6 flex items-center gap-6" style={{ backgroundColor: "var(--card)" }}>
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

function MentorCompanies({ lang }: { lang: Lang }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-20 py-10 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <h1 className="text-3xl font-bold text-foreground">{C(lang, "companiesPageTitle") as string}</h1>
        <p className="text-muted-foreground mt-2">{C(lang, "companiesPageSub") as string}</p>
      </div>
      <div className="max-w-4xl mx-auto w-full px-20 py-10 grid grid-cols-3 gap-5">
        {[
          { name: "Veritas Analytics", contact: "RRHH · Ana García", status: lang === "es" ? "Activa" : lang === "pt" ? "Ativa" : lang === "fr" ? "Active" : "Active", processes: 1, color: "#2D7D5F" },
          { name: "Forma Studio", contact: "Hiring · Daniel Reyes", status: lang === "es" ? "En proceso" : lang === "pt" ? "Em processo" : lang === "fr" ? "En cours" : "In process", processes: 1, color: "#1B4B7A" },
          { name: "Kestrel Systems", contact: "People · Laura Mena", status: lang === "es" ? "Período de prueba" : lang === "pt" ? "Período de avaliação" : lang === "fr" ? "Période d'essai" : "Trial period", processes: 1, color: "#8B5C3A" },
        ].map((co) => (
          <article key={co.name} className="rounded-2xl border border-border p-6 flex flex-col gap-4" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-foreground">{co.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{co.contact}</div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: co.color + "22", color: co.color }}>{co.status}</span>
            </div>
            <div className="text-xs text-muted-foreground">{co.processes} {lang === "es" ? "proceso activo" : lang === "pt" ? "processo ativo" : lang === "fr" ? "processus actif" : "active process"}</div>
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

// ── Navigation Bar ────────────────────────────────────────────────────────────

function NavBar({ lang, role, screen, onNav, onLang, onLogout, darkMode, onDarkToggle }: {
  lang: Lang; role: Role; screen: string;
  onNav: (s: string) => void; onLang: () => void; onLogout: () => void;
  darkMode: boolean; onDarkToggle: () => void;
}) {
  const t = useT(lang);
  const CANDIDATE_NAV = [
    { id: "profile", label: t("nav.profile"), Icon: BarChart2 },
    { id: "vacancies", label: t("nav.vacancies"), Icon: Briefcase },
    { id: "mentor-select", label: t("nav.mentor"), Icon: Users },
    { id: "tracking", label: t("nav.tracking"), Icon: Activity },
  ];
  const COMPANY_NAV = [
    { id: "org-profile", label: t("nav.org"), Icon: Building2 },
    { id: "post-vacancy", label: t("nav.post"), Icon: FileText },
    { id: "candidates", label: t("nav.candidates"), Icon: Users },
    { id: "post-hire", label: t("nav.tracking"), Icon: Activity },
  ];
  const MENTOR_NAV = [
    { id: "dashboard", label: t("nav.dashboard"), Icon: BarChart2 },
    { id: "checkins", label: t("nav.checkins"), Icon: Calendar },
    { id: "companies", label: t("nav.companies"), Icon: Building2 },
  ];
  const ADMIN_NAV = [
    { id: "dashboard", label: "Dashboard", Icon: BarChart2 },
    { id: "companies", label: "Empresas", Icon: Building2 },
    { id: "candidates", label: "Candidatos", Icon: Users },
    { id: "mentors", label: "Mentores", Icon: Star },
    { id: "mentorships", label: "Mentorías", Icon: Briefcase },
    { id: "activity", label: "Actividad", Icon: Activity },
  ];
  const navItems = role === "candidate" ? CANDIDATE_NAV : role === "company" ? COMPANY_NAV : role === "mentor" ? MENTOR_NAV : ADMIN_NAV;
  const ROLE_LABELS: Record<Role, string> = { candidate: t("role.candidate"), company: t("role.company"), mentor: t("role.mentor"), admin: t("role.admin") };

  const darkLabel = darkMode
    ? (lang === "es" ? "Modo claro" : lang === "pt" ? "Modo claro" : lang === "fr" ? "Mode clair" : "Light mode")
    : (lang === "es" ? "Modo oscuro" : lang === "pt" ? "Modo escuro" : lang === "fr" ? "Mode sombre" : "Dark mode");

  return (
    <header className="sticky top-0 z-40 border-b border-border" style={{ backgroundColor: "var(--background)" }}>
      <div className="px-8 h-16 flex items-center gap-2">
        <button onClick={() => onNav("home")} className="flex items-center gap-2 text-lg font-bold text-foreground tracking-tight mr-6 cursor-pointer">
          <img src={astrisImg} alt="Astris Logo" className="w-10 h-10 object-contain" />
          <span>Astris</span>
        </button>

        {navItems.map((item) => {
          const active = screen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
              style={{ backgroundColor: active ? "var(--secondary)" : "transparent", color: active ? "var(--foreground)" : "var(--muted-foreground)" }}
              aria-current={active ? "page" : undefined}
            >
              <item.Icon size={14} aria-hidden="true" />{item.label}
            </button>
          );
        })}

        <div className="ml-auto flex items-center gap-2">
          {/* ── Dark / Light mode toggle ── */}
          <button
            onClick={onDarkToggle}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold cursor-pointer border-2"
            style={{
              borderColor: darkMode ? "rgba(245,196,66,0.55)" : "var(--border)",
              backgroundColor: darkMode ? "rgba(245,196,66,0.12)" : "var(--card)",
              color: darkMode ? "#F5C442" : "var(--muted-foreground)",
            }}
            aria-label={darkLabel}
            title={darkLabel}
          >
            {darkMode
              ? <Sun size={15} aria-hidden="true" />
              : <Moon size={15} aria-hidden="true" />
            }
            <span className="hidden sm:inline">{darkLabel}</span>
          </button>

          {/* Language */}
          <button
            onClick={onLang}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground cursor-pointer border border-border"
            style={{ backgroundColor: "var(--background)" }}
          >
            <Globe size={14} aria-hidden="true" />{lang.toUpperCase()}
          </button>

          <div className="text-xs text-muted-foreground px-3 py-2 rounded-lg border border-border" style={{ backgroundColor: "var(--card)" }}>
            {ROLE_LABELS[role]}
          </div>

          <button onClick={onLogout} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground cursor-pointer">
            <LogOut size={14} aria-hidden="true" />{t("nav.logout")}
          </button>
        </div>
      </div>
    </header>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  // Modal flow
  const [modalStep, setModalStep] = useState<ModalStep>("none");
  const [lang, setLang] = useState<Lang>("es");
  const [role, setRole] = useState<Role | null>(null);
  const [pendingRole, setPendingRole] = useState<Role>("candidate");
  const [loggedIn, setLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [appReady, setAppReady] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [googleAuthUser, setGoogleAuthUser] = useState<any>(null);

  // Navigation
  const [screen, setScreen] = useState("home");

  // Candidate-specific state
  const [palette, setPalette] = useState<PaletteKey>("azul");
  const [darkMode, setDarkMode] = useState(false);
  const [font, setFont] = useState<FontKey>("atkinson");
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({});
  const [quizAxis, setQuizAxis] = useState(0);
  const [selectedVacancy, setSelectedVacancy] = useState("V-1042");
  const [selectedCandidate, setSelectedCandidate] = useState("CAND-A7X2");

  const fontFamily = font === "lexend" ? "'Lexend', Inter, sans-serif" : "'Atkinson Hyperlegible', Inter, sans-serif";

  // ── Dark mode — applied at root level so NavBar + entire page go dark ────────
  // Brand dark theme (navy-based, matches Astris identity):
  const darkRootStyle: Record<string, string> = darkMode ? {
    "--background": "#0D1824",
    "--foreground": "#E8EDF5",
    "--card": "#152030",
    "--popover": "#152030",
    "--primary": "#4B8EC8",
    "--primary-foreground": "#0D1824",
    "--secondary": "#1A2D42",
    "--secondary-foreground": "#E8EDF5",
    "--muted": "#152030",
    "--muted-foreground": "#7A9CC0",
    "--accent": "#3D9BC5",
    "--accent-foreground": "#0D1824",
    "--border": "rgba(255,255,255,0.1)",
    "--input-background": "#152030",
    "--card-foreground": "#E8EDF5",
  } : {};

  // ── Palette — scoped to <main> only so NavBar always uses the above dark vars ─
  const pal = PALETTES[palette];
  const palStyle: Record<string, string> = role === "candidate" && loggedIn ? {
    "--background": darkMode ? "#1A1A2E" : pal.bg,
    "--foreground": darkMode ? "#F0EFEA" : pal.fg,
    "--card": darkMode ? "#252535" : pal.card,
    "--card-foreground": darkMode ? "#F0EFEA" : pal.fg,
    "--primary": pal.accent,
    "--primary-foreground": palette === "contraste" ? "#1A1A04" : "#fff",
    "--secondary": darkMode ? "#303045" : pal.border,
    "--secondary-foreground": darkMode ? "#F0EFEA" : pal.fg,
    "--border": darkMode ? "rgba(255,255,255,0.1)" : pal.border,
    "--muted": darkMode ? "#2A2A3E" : pal.bg,
    "--muted-foreground": darkMode ? "#A8A8C8" : "#6A6A66",
    "--accent": pal.accent,
    "--accent-foreground": palette === "contraste" ? "#1A1A04" : "#fff",
    "--input-background": darkMode ? "#1A1A2E" : pal.card,
  } : {};

  // ── Restore Supabase session on mount ───────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          if ((user as any).needsRegistration) {
            setAuthMessage("No tienes cuenta, redireccionando a registro...");
            setAppReady(true);
            setTimeout(() => {
              setAuthMessage(null);
              setGoogleAuthUser(user);
              setPendingRole(user.role);
              setModalStep("register");
            }, 3000);
            return;
          }
          setRole(user.role);
          setLoggedIn(true);
          setModalStep("none");
          const first =
            user.role === "candidate"
              ? user.completedOnboarding ? "vacancies" : "onboarding"
              : user.role === "company" ? "org-profile" : "dashboard";
          setScreen(first);
        }
      } catch {
        // No active session — show language modal
      } finally {
        setAppReady(true);
      }
    })();
  }, []);

  const handleAnswer = (ai: number, qi: number, val: number | number[]) => {
    setQuizAnswers((prev) => ({ ...prev, [ai]: { ...(prev[ai] ?? {}), [qi]: val } }));
  };

  // ── FIX: language change when logged in must NOT restart auth flow ──────────
  const handleLangSelect = (l: Lang) => {
    setLang(l);
    setModalStep("none");
  };

  const handleAuthNew = () => {
    if (!pendingRole) setPendingRole("candidate");
    setModalStep("register");
  };
  const handleAuthExisting = () => {
    if (!pendingRole) setPendingRole("candidate"); // Default for login modal
    setModalStep("login");
  };
  const handleAuthAdmin = () => {
    setPendingRole("admin");
    setModalStep("login");
  };

  // ── Real Supabase register ──────────────────────────────────────────────────
  const handleCompleteGoogleRegistration = () => {
    if (googleAuthUser) {
      setRole(googleAuthUser.role);
      setLoggedIn(true);
      setModalStep("none");
      const first = googleAuthUser.role === "candidate" ? (googleAuthUser.completedOnboarding ? "vacancies" : "onboarding") : googleAuthUser.role === "company" ? "org-profile" : "dashboard";
      setScreen(first);
      setGoogleAuthUser(null);
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await registerUser(email, password, name, pendingRole);
      setRole(pendingRole);
      setLoggedIn(true);
      setModalStep("none");
      setScreen(pendingRole === "candidate" ? "onboarding" : pendingRole === "company" ? "org-profile" : "dashboard");
    } catch (err: any) {
      setAuthError(err.message ?? "Registration failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  // ── Real Supabase login ─────────────────────────────────────────────────────
  const handleLogin = async (r: Role, email?: string, password?: string) => {
    if (email && password) {
      setAuthLoading(true);
      setAuthError(null);
      try {
        await loginUser(email, password);
        const user = await getCurrentUser();
        const resolvedRole = user?.role ?? r;
        setRole(resolvedRole);
        setLoggedIn(true);
        setModalStep("none");
        setScreen(resolvedRole === "candidate" ? "vacancies" : resolvedRole === "company" ? "candidates" : "dashboard");
      } catch (err: any) {
        setAuthError(err.message ?? "Login failed. Please check your credentials.");
      } finally {
        setAuthLoading(false);
      }
    } else {
      // Demo mode (no credentials entered)
      setRole(r);
      setLoggedIn(true);
      setModalStep("none");
      setScreen(r === "candidate" ? "vacancies" : r === "company" ? "candidates" : "dashboard");
    }
  };

  const handleLogout = async () => {
    try { await logoutUser(); } catch { /* ignore */ }
    setLoggedIn(false);
    setRole(null);
    setScreen("home");
    setModalStep("language");
  };

  const handleNav = (s: string) => {
    if (s === "home") { setLoggedIn(false); setRole(null); setScreen("home"); return; }
    if (s === "tracking") { setScreen(role === "candidate" ? "post-hire" : "comp-post-hire"); return; }
    setScreen(s);
  };

  // When logged in, language button opens the language modal but will close without auth redirect
  const reopenLang = () => setModalStep("language");

  const showModal = modalStep !== "none";

  if (!appReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" style={{ fontFamily }}>
        <div className="text-muted-foreground text-sm">...</div>
      </div>
    );
  }

  if (authMessage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" style={{ fontFamily, ...(darkRootStyle as React.CSSProperties) }}>
        <div className="p-6 rounded-2xl border border-border flex items-center gap-4 shadow-lg" style={{ backgroundColor: "var(--card)" }}>
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }}></div>
          <p className="text-foreground font-medium">{authMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily, ...(darkRootStyle as React.CSSProperties) }}>
      {/* Modals */}
      {showModal && modalStep === "language" && <LanguageModal onSelect={handleLangSelect} />}
      {showModal && modalStep === "auth" && <AuthModal lang={lang} onNew={handleAuthNew} onExisting={handleAuthExisting} onAdmin={handleAuthAdmin} onBack={() => setModalStep("none")} />}
      {showModal && modalStep === "register" && (
        <RegisterModal lang={lang} role={pendingRole} onRegister={handleRegister} onBack={() => setModalStep("auth")} error={authError} loading={authLoading} googleAuthUser={googleAuthUser} onCompleteGoogle={handleCompleteGoogleRegistration} />
      )}
      {showModal && modalStep === "login" && (
        <LoginModal lang={lang} initialRole={pendingRole} onLogin={(r, email, pass) => handleLogin(r, email, pass)} onBack={() => setModalStep("auth")} error={authError} loading={authLoading} />
      )}

      {/* Main content */}
      {!showModal && (
        <>
          {!loggedIn && (
            <LandingPage lang={lang} onOpenAuth={(preRole) => {
              if (preRole) { setPendingRole(preRole); }
              setModalStep("auth");
            }} onLang={reopenLang} />
          )}
          {loggedIn && role && (
            <div>
              {/* NavBar inherits root-level dark vars; palette NOT applied here */}
              <NavBar lang={lang} role={role} screen={screen} onNav={handleNav} onLang={reopenLang} onLogout={handleLogout} darkMode={darkMode} onDarkToggle={() => setDarkMode((d) => !d)} />
              {/* FIX: palStyle scoped to <main> only — NavBar stays brand-colored */}
              <main style={palStyle as React.CSSProperties}>
                {/* Candidate flow */}
                {role === "candidate" && screen === "onboarding" && (
                  <CandidateOnboarding lang={lang} palette={palette} darkMode={darkMode} font={font} onPalette={setPalette} onDark={setDarkMode} onFont={setFont} onContinue={() => { setQuizAxis(0); setScreen("quiz"); }} />
                )}
                {role === "candidate" && screen === "quiz" && (
                  <CandidateQuiz lang={lang} axisIndex={quizAxis} answers={quizAnswers} onAnswer={handleAnswer}
                    onPrev={() => quizAxis > 0 ? setQuizAxis((a) => a - 1) : setScreen("onboarding")}
                    onNext={() => quizAxis < QUIZ_AXES.length - 1 ? setQuizAxis((a) => a + 1) : setScreen("profile")} />
                )}
                {role === "candidate" && screen === "profile" && (
                  <CandidateProfile lang={lang} answers={quizAnswers} />
                )}
                {role === "candidate" && screen === "vacancies" && (
                  <CandidateVacancies lang={lang} onSelect={(id) => { setSelectedVacancy(id); setScreen("vacancy-detail"); }} />
                )}
                {role === "candidate" && screen === "vacancy-detail" && (
                  <VacancyDetail lang={lang} vacancyId={selectedVacancy} onBack={() => setScreen("vacancies")} onStart={() => setScreen("mentor-select")} />
                )}
                {role === "candidate" && screen === "mentor-select" && (
                  <MentorSelect lang={lang} onSelect={() => setScreen("accompaniment")} />
                )}
                {role === "candidate" && screen === "accompaniment" && <CandidateAccompaniment lang={lang} />}
                {role === "candidate" && (screen === "post-hire" || screen === "tracking") && <CandidatePostHire lang={lang} />}

                {/* Company flow */}
                {role === "company" && screen === "org-profile" && <CompanyOrgProfile lang={lang} />}
                {role === "company" && screen === "post-vacancy" && <CompanyPostVacancy lang={lang} />}
                {role === "company" && screen === "candidates" && (
                  <CompanyCandidates lang={lang} onSelect={(id) => { setSelectedCandidate(id); setScreen("candidate-detail"); }} />
                )}
                {role === "company" && screen === "candidate-detail" && (
                  <CompanyCandidateDetail lang={lang} candidateId={selectedCandidate} onBack={() => setScreen("candidates")} onStart={() => setScreen("comp-post-hire")} />
                )}
                {role === "company" && (screen === "comp-post-hire" || screen === "post-hire") && <CompanyPostHire lang={lang} />}

                {/* Mentor flow — FIX: each nav item renders its own screen */}
                {role === "mentor" && screen === "dashboard" && <MentorDashboard lang={lang} />}
                {role === "mentor" && screen === "checkins" && <MentorCheckins lang={lang} />}
                {role === "mentor" && screen === "companies" && <MentorCompanies lang={lang} />}
                {/* Default: dashboard for any unmatched mentor screen */}
                {role === "mentor" && !["dashboard", "checkins", "companies"].includes(screen) && <MentorDashboard lang={lang} />}

                {/* Admin flow */}
                {role === "admin" && <AdminPanel lang={lang} screen={screen} />}
              </main>
            </div>
          )}
        </>
      )}

      {/* Watermark — always visible, above content */}
      <Watermark />
    </div>
  );
}
