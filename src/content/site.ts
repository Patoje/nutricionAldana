// Todo el texto de la página. Los textos de Aldana van como ella los escribió.
import { bookingConfig } from "@/config/booking";

export const site = {
  brand: "Aldana Heyde",
  title: "Aldana Heyde | Nutricionista online",
  description:
    "Aldana Heyde, Licenciada en Nutrición (Universidad Adventista del Plata). Consultas online: consulta inicial integral y seguimiento. Pedí tu turno y se arma el mensaje de WhatsApp.",
  shareDescription: "Consultas de nutrición online con Aldana Heyde, Licenciada en Nutrición. Pedí tu turno por WhatsApp.",
  /** Datos legales del pie. matricula: el número de matrícula profesional (por ejemplo "M.P. 1234"). */
  legal: {
    fullName: "Aldana Heyde",
    profession: "Licenciada en Nutrición",
    // PENDIENTE: completar con el número real. Mientras esté vacío, no se muestra.
    matricula: "",
    contactEmail: "",
  },
  lede: "Nutrición vivida desde el cariño, la cercanía y la confianza.",
  mainAction: { label: "Pedir un turno", href: "#turnos" },
  hours: [
    { days: "Lunes a viernes", time: "9 a 12 h" },
    { days: "Lunes a viernes", time: "15 a 20 h" },
  ],
  social: {
    instagram: "https://www.instagram.com/nutri.aldiheyde/",
    instagramHandle: "@nutri.aldiheyde",
    whatsapp: `https://wa.me/${bookingConfig.whatsappNumber}`,
    whatsappDisplay: "+54 9 351 228-3170",
  },
} as const;

/** Los links del menú: cada uno baja a su sección. "Turnos" no va: ya está el botón "Pedir un turno". */
export const nav = [
  { label: "Servicios", href: "#servicios" },
  { label: "Proceso", href: "#proceso" },
  { label: "Sobre mí", href: "#sobre-mi" },
] as const;

export const hero = {
  badge: "Consultas 100% online",
  titleStart: "Nutricionista para comer bien",
  titleAccent: "sin dietas extremas",
  lead: "Soy Aldana, Licenciada en Nutrición. Atiendo online, estés donde estés: mi objetivo es que te sientas acompañado/a, escuchado/a y contenido/a de una manera real y personalizada.",
  secondaryAction: { label: "Ver los servicios", href: "#servicios" },
} as const;

/** Tipos de consulta, con el texto que pasó Aldana. */
export const services = {
  title: "Tipos de consulta.",
  titleMuted: "Todas son online.",
  note: "Cada turno se reserva por una hora.",
  items: [
    {
      name: "Consulta inicial integral",
      duration: "Turno de 1 hora",
      body: "El primer paso para empezar tu proceso. Analizamos tu historia clínica, hábitos actuales, análisis de sangre y objetivos para diseñar una estrategia nutricional 100% personalizada y adaptada a tu rutina.",
      includes: [
        "Evaluación nutricional completa.",
        "Plan de alimentación personalizado + guía de organización.",
        "Soporte por WhatsApp durante los primeros 7 días para resolver dudas iniciales sobre el plan.",
      ],
    },
    {
      name: "Consulta de seguimiento / control",
      duration: "Turno de 1 hora",
      body: "Para sostener el proceso, evaluar avances, resolver dificultades y avanzar con claridad hacia tus metas. Suele llevar menos tiempo que la primera, unos 30 a 35 minutos.",
      includes: [
        "Ajustes y evolución del plan nutricional.",
        "Acompañamiento e intercambio por WhatsApp (días hábiles, respuesta en horarios de atención).",
      ],
    },
  ],
} as const;

/** El proceso, paso a paso (se recorre bajando, como una historia). */
export const process = {
  kicker: "Cómo es el proceso",
  title: "De la primera consulta a tu nueva rutina",
  steps: [
    {
      label: "Consulta inicial integral",
      title: "Te conozco",
      body: "Repasamos tu historia clínica, tus hábitos actuales, tus análisis de sangre y lo que querés lograr.",
      meta: "Online · 1 hora",
      photo: "stepInitial",
    },
    {
      label: "Tu plan",
      title: "Un plan hecho para tu rutina",
      body: "Te llevás un plan de alimentación personalizado y una guía de organización para tu semana.",
      meta: "Al terminar la consulta",
      photo: "stepPlan",
    },
    {
      label: "Primera semana",
      title: "Siete días de soporte por WhatsApp",
      body: "Durante los primeros días resolvemos por WhatsApp las dudas que te surjan al poner en práctica el plan.",
      meta: "Primeros 7 días",
      photo: "stepSupport",
    },
    {
      label: "Seguimiento / control",
      title: "Seguimos avanzando juntos",
      body: "Evaluamos avances, resolvemos dificultades y ajustamos el plan para que sigas avanzando con claridad hacia tus metas.",
      meta: "Online · cuando lo necesites",
      photo: "stepFollowUp",
    },
  ],
} as const;

/** Sobre mí: el texto de Aldana, su frase y sus especialidades. */
export const about = {
  quote: "Nuestra comida será la medicina y nuestra medicina será la comida.",
  quoteCaption: "La frase que me acompaña",
  title: "Mi historia.",
  titleMuted: "Aldana Heyde, Licenciada en Nutrición.",
  paragraphs: [
    "Soy Licenciada en Nutrición, formada en la Universidad Adventista del Plata, y creo profundamente que la nutrición va mucho más allá de planes alimentarios o números. Comer es un acto cotidiano, algo que todos hacemos todos los días, y sin embargo tiene un impacto enorme en cómo nos sentimos, cómo vivimos y cómo nos relacionamos con nuestro cuerpo y con los demás.",
    "Me gusta mantenerme activa, disfrutar de la actividad física, las actividades al aire libre, explorar nuevos lugares y seguir aprendiendo constantemente. Esa curiosidad y ese movimiento también forman parte de mi forma de acompañar: con una mirada flexible, real y adaptada a cada persona.",
    "Mi objetivo es acompañarte en tu proceso, entendiendo que cada historia es única. Quiero que este espacio sea un lugar de apoyo, donde te sientas escuchado/a, contenido/a y sin juicios. Creo en una nutrición vivida desde el cariño, la cercanía y la confianza, porque nadie debería transitar estos cambios en soledad.",
    "Estoy acá para acompañarte, para caminar juntos este proceso y para que sepas que podés contar conmigo en cada paso.",
  ],
  specialtiesTitle: "Especialidades",
  specialties: [
    "Mindfulness y alimentación consciente",
    "Patologías crónicas",
    "Alimentación vegetariana y vegana",
    "Hábitos",
  ],
  facts: [
    { label: "Modalidad", value: "Consultas online" },
    { label: "Formación", value: "Licenciatura en Nutrición, Universidad Adventista del Plata (UAP)" },
    { label: "Instagram", value: site.social.instagramHandle, href: site.social.instagram },
  ],
} as const;

export const gallery = {
  title: "Comer bien, todos los días.",
  titleMuted: "Algunas de mis comidas.",
} as const;

export const booking = {
  title: "Pedí tu turno.",
  titleMuted: "Se confirma por WhatsApp.",
  intro: "La consulta es online. Completá tus datos, elegí día y horario y respondé cinco preguntas cortas. Al final se abre WhatsApp con el mensaje listo para enviar.",
} as const;

export const closing = {
  title: "Empecemos tu proceso",
  lead: "Pedí tu turno y te respondo por WhatsApp.",
} as const;
