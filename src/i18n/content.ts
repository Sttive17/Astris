import { Lang, PaletteKey } from "@/types";

export const QUIZ_AXES = [
  {
    key: "axis1",
    radarAxis: "Procesamiento",
    questions: [
      {
        stems: {
          es: "Interacción social: ¿Prefieres trabajar solo/a y de forma autónoma, o en equipo con interacción constante?",
          en: "Social interaction: Do you prefer working alone autonomously, or in a team with constant interaction?",
          pt: "Interação social: Você prefere trabalhar sozinho/a de forma autônoma, ou em equipe com interação constante?",
          fr: "Interaction sociale : Préférez-vous travailler seul(e) de manière autonome, ou en équipe avec une interaction constante ?"
        },
        opts: {
          es: ["Prefiero trabajar solo/a", "Prefiero trabajar en equipo", "Depende de la tarea"],
          en: ["I prefer working alone", "I prefer working in a team", "It depends on the task"],
          pt: ["Prefiro trabalhar sozinho/a", "Prefiro trabalhar em equipe", "Depende da tarefa"],
          fr: ["Je préfère travailler seul(e)", "Je préfère travailler en équipe", "Cela dépend de la tâche"]
        },
        vals: [88, 35, 62], type: "single" as const,
      },
      {
        stems: {
          es: "Retroalimentación: ¿Prefieres que te digan cómo vas apenas terminas una tarea, o revisar tu trabajo en reuniones programadas?",
          en: "Feedback: Do you prefer to be told how you are doing as soon as you finish a task, or review your work in scheduled meetings?",
          pt: "Feedback: Você prefere saber como está indo assim que termina uma tarefa, ou revisar seu trabalho em reuniões agendadas?",
          fr: "Retour d'information : Préférez-vous qu'on vous dise comment vous vous en sortez dès que vous avez terminé une tâche, ou revoir votre travail lors de réunions planifiées ?"
        },
        opts: {
          es: ["Retroalimentación inmediata", "En reuniones programadas", "Prefiero autoevaluar"],
          en: ["Immediate feedback", "In scheduled meetings", "I prefer self-assessment"],
          pt: ["Feedback imediato", "Em reuniões agendadas", "Prefiro me autoavaliar"],
          fr: ["Retour immédiat", "Lors de réunions planifiées", "Je préfère m'auto-évaluer"]
        },
        vals: [82, 45, 65], type: "single" as const,
      },
      {
        stems: {
          es: "Formato de entrada: ¿Aprendes mejor viendo videos o diagramas, leyendo instrucciones escritas, o escuchando explicaciones?",
          en: "Input format: Do you learn best by watching videos or diagrams, reading written instructions, or listening to explanations?",
          pt: "Formato de entrada: Você aprende melhor assistindo vídeos ou diagramas, lendo instruções escritas, ou ouvindo explicações?",
          fr: "Format d'entrée : Apprenez-vous mieux en regardant des vidéos ou des diagrammes, en lisant des instructions écrites, ou en écoutant des explications ?"
        },
        opts: {
          es: ["Viendo videos o diagramas", "Leyendo instrucciones escritas", "Escuchando explicaciones"],
          en: ["Watching videos or diagrams", "Reading written instructions", "Listening to explanations"],
          pt: ["Assistindo vídeos ou diagramas", "Lendo instruções escritas", "Ouvindo explicações"],
          fr: ["En regardant des vidéos ou des diagrammes", "En lisant des instructions écrites", "En écoutant des explications"]
        },
        vals: [70, 90, 52], type: "single" as const,
      },
      {
        stems: {
          es: "Estilo de comunicación: ¿Prefieres instrucciones directas y literales, o te es cómodo interpretar instrucciones abiertas?",
          en: "Communication style: Do you prefer direct and literal instructions, or are you comfortable interpreting open-ended instructions?",
          pt: "Estilo de comunicação: Você prefere instruções diretas e literais, ou se sente confortável interpretando instruções abertas?",
          fr: "Style de communication : Préférez-vous des instructions directes et littérales, ou êtes-vous à l'aise pour interpréter des instructions ouvertes ?"
        },
        opts: {
          es: ["Directas y literales", "Puedo interpretar instrucciones abiertas", "Me adapto a ambas"],
          en: ["Direct and literal", "I can interpret open-ended instructions", "I adapt to both"],
          pt: ["Diretas e literais", "Consigo interpretar instruções abertas", "Me adapto a ambas"],
          fr: ["Directes et littérales", "Je peux interpréter des instructions ouvertes", "Je m'adapte aux deux"]
        },
        vals: [90, 42, 65], type: "single" as const,
      },
    ],
  },
  {
    key: "axis2",
    radarAxis: "T. Ambiental",
    questions: [
      {
        stems: {
          es: "Carga sensorial auditiva: ¿Necesitas silencio total, toleras ruido moderado, o te es indiferente un ambiente ruidoso?",
          en: "Auditory sensory load: Do you need complete silence, tolerate moderate noise, or are you indifferent to a noisy environment?",
          pt: "Carga sensorial auditiva: Você precisa de silêncio total, tolera ruído moderado, ou é indiferente a um ambiente barulhento?",
          fr: "Charge sensorielle auditive : Avez-vous besoin d'un silence total, tolérez-vous un bruit modéré, ou êtes-vous indifférent(e) à un environnement bruyant ?"
        },
        opts: {
          es: ["Necesito silencio total", "Tolero ruido moderado", "El ruido no me afecta"],
          en: ["I need complete silence", "I tolerate moderate noise", "Noise doesn't affect me"],
          pt: ["Preciso de silêncio total", "Tolero ruído moderado", "O ruído não me afeta"],
          fr: ["J'ai besoin d'un silence total", "Je tolère un bruit modéré", "Le bruit ne m'affecte pas"]
        },
        vals: [20, 62, 90], type: "single" as const,
      },
      {
        stems: {
          es: "Carga sensorial visual: ¿Te molestan las luces fluorescentes, prefieres luz natural, o no tienes preferencia?",
          en: "Visual sensory load: Do fluorescent lights bother you, do you prefer natural light, or do you have no preference?",
          pt: "Carga sensorial visual: Luzes fluorescentes te incomodam, você prefere luz natural, ou não tem preferência?",
          fr: "Charge sensorielle visuelle : Les lumières fluorescentes vous dérangent-elles, préférez-vous la lumière naturelle, ou n'avez-vous aucune préférence ?"
        },
        opts: {
          es: ["Me molestan las luces fluorescentes", "Prefiero luz natural", "No tengo preferencia"],
          en: ["Fluorescent lights bother me", "I prefer natural light", "I have no preference"],
          pt: ["Luzes fluorescentes me incomodam", "Prefiro luz natural", "Não tenho preferência"],
          fr: ["Les lumières fluorescentes me dérangent", "Je préfère la lumière naturelle", "Je n'ai pas de préférence"]
        },
        vals: [22, 58, 85], type: "single" as const,
      },
      {
        stems: {
          es: "Estructura del espacio: ¿Necesitas un puesto fijo, prefieres espacios abiertos o rotativos, o prefieres trabajar remoto?",
          en: "Space structure: Do you need a fixed workspace, do you prefer open or rotating spaces, or do you prefer working remotely?",
          pt: "Estrutura do espaço: Você precisa de um posto fixo, prefere espaços abertos ou rotativos, ou prefere trabalhar remotamente?",
          fr: "Structure de l'espace : Avez-vous besoin d'un poste fixe, préférez-vous des espaces ouverts ou rotatifs, ou préférez-vous travailler à distance ?"
        },
        opts: {
          es: ["Necesito un puesto fijo", "Prefiero espacios abiertos o rotativos", "Prefiero trabajar remoto"],
          en: ["I need a fixed workspace", "I prefer open or rotating spaces", "I prefer working remotely"],
          pt: ["Preciso de um posto fixo", "Prefiro espaços abertos ou rotativos", "Prefiro trabalhar remotamente"],
          fr: ["J'ai besoin d'un poste fixe", "Je préfère des espaces ouverts ou rotatifs", "Je préfère travailler à distance"]
        },
        vals: [38, 60, 88], type: "single" as const,
      },
      {
        stems: {
          es: "Interrupciones: ¿Necesitas bloques de tiempo sin interrupciones, o te adaptas bien a cambios de contexto frecuentes?",
          en: "Interruptions: Do you need uninterrupted blocks of time, or do you adapt well to frequent context switching?",
          pt: "Interrupções: Você precisa de blocos de tempo sem interrupções, ou se adapta bem a mudanças frequentes de contexto?",
          fr: "Interruptions : Avez-vous besoin de blocs de temps sans interruption, ou vous adaptez-vous bien aux changements de contexte fréquents ?"
        },
        opts: {
          es: ["Necesito bloques sin interrupciones", "Me adapto bien a cambios frecuentes", "Depende del tipo de tarea"],
          en: ["I need uninterrupted blocks", "I adapt well to frequent changes", "It depends on the task type"],
          pt: ["Preciso de blocos sem interrupções", "Me adapto bem a mudanças frequentes", "Depende do tipo de tarefa"],
          fr: ["J'ai besoin de blocs sans interruption", "Je m'adapte bien aux changements fréquents", "Cela dépend du type de tâche"]
        },
        vals: [18, 88, 55], type: "single" as const,
      },
    ],
  },
  {
    key: "axis3",
    radarAxis: "Ejecución",
    questions: [
      {
        stems: {
          es: "Foco y atención: ¿Te concentras mejor en una tarea larga y repetitiva, o prefieres tareas cortas y variadas?",
          en: "Focus and attention: Do you concentrate better on a long, repetitive task, or do you prefer short, varied tasks?",
          pt: "Foco e atenção: Você se concentra melhor em uma tarefa longa e repetitiva, ou prefere tarefas curtas e variadas?",
          fr: "Concentration et attention : Vous concentrez-vous mieux sur une tâche longue et répétitive, ou préférez-vous des tâches courtes et variées ?"
        },
        opts: {
          es: ["Tarea larga y repetitiva", "Tareas cortas y variadas", "Ambas me funcionan"],
          en: ["Long, repetitive task", "Short, varied tasks", "Both work for me"],
          pt: ["Tarefa longa e repetitiva", "Tarefas curtas e variadas", "Ambas funcionam para mim"],
          fr: ["Tâche longue et répétitive", "Tâches courtes et variées", "Les deux me conviennent"]
        },
        vals: [82, 52, 68], type: "single" as const,
      },
      {
        stems: {
          es: "Estructura de la tarea: ¿Prefieres rutinas claras y estructuradas, o resolver problemas de forma creativa sin un camino fijo?",
          en: "Task structure: Do you prefer clear and structured routines, or solving problems creatively without a fixed path?",
          pt: "Estrutura da tarefa: Você prefere rotinas claras e estruturadas, ou resolver problemas de forma criativa sem um caminho fixo?",
          fr: "Structure de la tâche : Préférez-vous des routines claires et structurées, ou résoudre des problèmes de manière créative sans chemin fixe ?"
        },
        opts: {
          es: ["Rutinas claras y estructuradas", "Solución creativa sin camino fijo", "Una mezcla de ambas"],
          en: ["Clear and structured routines", "Creative solution without a fixed path", "A mix of both"],
          pt: ["Rotinas claras e estruturadas", "Solução criativa sem caminho fixo", "Uma mistura de ambas"],
          fr: ["Routines claires et structurées", "Solution créative sans chemin fixe", "Un mélange des deux"]
        },
        vals: [88, 45, 68], type: "single" as const,
      },
      {
        stems: {
          es: "Manejo del tiempo: ¿Necesitas horarios flexibles, o trabajas mejor con un horario fijo y predecible?",
          en: "Time management: Do you need flexible hours, or do you work better with a fixed, predictable schedule?",
          pt: "Gestão de tempo: Você precisa de horários flexíveis, ou trabalha melhor com um horário fixo e previsível?",
          fr: "Gestion du temps : Avez-vous besoin d'horaires flexibles, ou travaillez-vous mieux avec un horaire fixe et prévisible ?"
        },
        opts: {
          es: ["Necesito horarios flexibles", "Trabajo mejor con horario fijo", "Me adapto a cualquiera"],
          en: ["I need flexible hours", "I work better with a fixed schedule", "I adapt to either"],
          pt: ["Preciso de horários flexíveis", "Trabalho melhor com horário fixo", "Me adapto a qualquer um"],
          fr: ["J'ai besoin d'horaires flexibles", "Je travaille mieux avec un horaire fixe", "Je m'adapte aux deux"]
        },
        vals: [62, 82, 72], type: "single" as const,
      },
      {
        stems: {
          es: "Profundidad de tarea: ¿Prefieres especializarte en pocas tareas a fondo, o manejar varias tareas distintas a la vez?",
          en: "Task depth: Do you prefer specializing deeply in a few tasks, or handling several different tasks at once?",
          pt: "Profundidade da tarefa: Você prefere se especializar profundamente em poucas tarefas, ou gerenciar várias tarefas diferentes ao mesmo tempo?",
          fr: "Profondeur de la tâche : Préférez-vous vous spécialiser profondément dans quelques tâches, ou gérer plusieurs tâches différentes à la fois ?"
        },
        opts: {
          es: ["Especializarme en pocas tareas a fondo", "Manejar varias tareas distintas", "Depende del contexto"],
          en: ["Specialize deeply in a few tasks", "Handle several different tasks", "It depends on the context"],
          pt: ["Me especializar em poucas tarefas a fundo", "Gerenciar várias tarefas diferentes", "Depende do contexto"],
          fr: ["Me spécialiser dans quelques tâches en profondeur", "Gérer plusieurs tâches différentes", "Cela dépend du contexte"]
        },
        vals: [88, 50, 68], type: "single" as const,
      },
    ],
  },
  {
    key: "axis4",
    radarAxis: "Ajustes",
    questions: [
      {
        stems: {
          es: "Software de accesibilidad: ¿Cuál de estos recursos digitales te sería útil? (puedes seleccionar varios)",
          en: "Accessibility software: Which of these digital resources would be useful to you? (you can select several)",
          pt: "Software de acessibilidade: Qual destes recursos digitais seria útil para você? (pode selecionar vários)",
          fr: "Logiciel d'accessibilité : Lequel de ces outils numériques vous serait utile ? (vous pouvez en sélectionner plusieurs)"
        },
        opts: {
          es: ["Lector de pantalla", "Tipografía para dislexia", "Bloqueador de distracciones", "Alto contraste", "Ninguno por ahora"],
          en: ["Screen reader", "Dyslexia-friendly font", "Distraction blocker", "High contrast", "None for now"],
          pt: ["Leitor de tela", "Tipografia para dislexia", "Bloqueador de distrações", "Alto contraste", "Nenhum por enquanto"],
          fr: ["Lecteur d'écran", "Police pour la dyslexie", "Bloqueur de distractions", "Contraste élevé", "Aucun pour l'instant"]
        },
        vals: [], type: "multi" as const,
      },
      {
        stems: {
          es: "Hardware de accesibilidad: ¿Qué recursos físicos necesitarías? (puedes seleccionar varios)",
          en: "Accessibility hardware: What physical resources would you need? (you can select several)",
          pt: "Hardware de acessibilidade: Quais recursos físicos você precisaria? (pode selecionar vários)",
          fr: "Matériel d'accessibilité : De quelles ressources physiques auriez-vous besoin ? (vous pouvez en sélectionner plusieurs)"
        },
        opts: {
          es: ["Audífonos con cancelación de ruido", "Teclado adaptado", "Pantalla sin parpadeo", "Ninguno por ahora"],
          en: ["Noise-canceling headphones", "Adapted keyboard", "Flicker-free screen", "None for now"],
          pt: ["Fones de ouvido com cancelamento de ruído", "Teclado adaptado", "Tela sem cintilação", "Nenhum por enquanto"],
          fr: ["Écouteurs à réduction de bruit", "Clavier adapté", "Écran sans scintillement", "Aucun pour l'instant"]
        },
        vals: [], type: "multi" as const,
      },
      {
        stems: {
          es: "Acompañamiento inicial: ¿Te gustaría tener un mentor asignado durante tus primeros 30 a 60 días en el rol?",
          en: "Initial support: Would you like to have an assigned mentor during your first 30 to 60 days in the role?",
          pt: "Acompanhamento inicial: Você gostaria de ter um mentor designado durante seus primeiros 30 a 60 dias na função?",
          fr: "Accompagnement initial : Aimeriez-vous avoir un mentor attitré pendant vos 30 à 60 premiers jours dans le poste ?"
        },
        opts: {
          es: ["Sí, me gustaría tener un mentor", "No por ahora", "Quiero saber más primero"],
          en: ["Yes, I would like to have a mentor", "Not right now", "I want to know more first"],
          pt: ["Sim, gostaria de ter um mentor", "Não por enquanto", "Quero saber mais primeiro"],
          fr: ["Oui, j'aimerais avoir un mentor", "Pas pour le moment", "Je veux d'abord en savoir plus"]
        },
        vals: [85, 32, 58], type: "single" as const,
      },
      {
        stems: {
          es: "Modalidad de trabajo: ¿Prefieres trabajo presencial, híbrido o completamente remoto?",
          en: "Work modality: Do you prefer working in-person, hybrid, or completely remote?",
          pt: "Modalidade de trabalho: Você prefere trabalho presencial, híbrido ou totalmente remoto?",
          fr: "Modalité de travail : Préférez-vous travailler en présentiel, en mode hybride, ou entièrement à distance ?"
        },
        opts: {
          es: ["Presencial", "Híbrido", "Completamente remoto"],
          en: ["In-person", "Hybrid", "Completely remote"],
          pt: ["Presencial", "Híbrido", "Totalmente remoto"],
          fr: ["En présentiel", "Hybride", "Entièrement à distance"]
        },
        vals: [38, 65, 90], type: "single" as const,
      },
    ],
  },
];

export const PALETTES: Record<PaletteKey, {
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
