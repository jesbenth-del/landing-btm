/**
 * Copy y datos editables del evento de captación de BTM Academy.
 *
 * Todo el texto que cambia de una convocatoria a otra vive aquí, no en los
 * componentes: cambiar la oferta es editar este archivo. La fecha, la hora, el
 * nombre de la convocatoria y el grupo de WhatsApp NO van aquí: se editan en
 * /admin y la landing los lee en cada visita.
 *
 * TODO(copy): el contenido actual es el de la landing anterior adaptado a la
 * nueva estructura. Reemplazar con el copy definitivo.
 */

/** Las sesiones se anuncian en hora Colombia, que no tiene horario de verano. */
export const ZONA_HORARIA = {
  desfase: "-05:00",
  etiqueta: "Hora Colombia",
} as const;

/** Nombre del evento en los píxeles de Meta (navegador y Conversions API). */
export const EVENT_CONTENT_NAME = "Sesión Cero BTM";

export const MARCA = {
  nombre: "BTM Academy",
  mentor: "Jesus Bentham",
  rolMentor: "Fundador de BTM Academy",
} as const;

/** Enlaces de la barra de navegación flotante (anclas a las secciones). */
export const NAV = [
  { href: "#para-quien", label: "Para quién" },
  { href: "#aprenderas", label: "Qué aprenderás" },
  { href: "#mentor", label: "Mentor" },
  { href: "#faq", label: "Preguntas" },
] as const;

export const SEO = {
  title: "Sesión Cero BTM · Clase gratuita en vivo | BTM Academy",
  description:
    "Clase gratuita en vivo con Jesus Bentham: las 4 leyes estructurales para validar zonas de alta probabilidad en Forex, Oro e Índices.",
} as const;

export const HERO = {
  /** Va antes de la fecha en la insignia: "Clase gratuita en vivo · 15 de noviembre". */
  insignia: "Clase gratuita en vivo",
  estado: "Cupos limitados",
  /** El titular se arma como: antes + resaltado + después. */
  tituloAntes: "Entiende lo que",
  tituloResaltado: "realmente mueve",
  tituloDespues: "el mercado.",
  bajada:
    "Deja de acumular conceptos aislados. En esta sesión en vivo aprendes a conectar estructura, contexto y validación para tomar decisiones con criterio en Forex, Oro e Índices.",
  formularioTitulo: "Reserva tu cupo",
  formularioBajada: "Completa tus datos y te enviamos el acceso por WhatsApp.",
  botonFormulario: "Quiero mi cupo gratis",
  avisoFormulario:
    "Al enviar aceptas unirte al grupo de WhatsApp y recibir ahí el acceso y los avisos de la sesión en vivo.",
  /** Línea corta debajo del nombre del mentor en la tarjeta del héroe. */
  credencialMentor: "Forex · Oro · Índices — sin señales ni promesas",
} as const;

/**
 * Franja de credibilidad debajo del héroe. Texto ya formateado: se lee de un
 * vistazo y no se anima.
 *
 * TODO(copy): cambiar por cifras reales (alumnos, países, cohortes...).
 */
export const PROOF_STATS = [
  { value: "FX · XAU · Índices", label: "Mercados que cubrimos" },
  { value: "4", label: "Leyes estructurales" },
  { value: "1:1", label: "Mentoría personalizada" },
  { value: "0", label: "Señales o promesas de rentabilidad" },
] as const;

export const AUDIENCIA = {
  eyebrow: "Identifícate",
  titulo: "¿Para quién es la",
  resaltado: "Sesión Cero BTM?",
  intro:
    "Es para ti si sientes que sabes muchas cosas de trading pero no tienes claridad. Aquí no venimos a darte señales ni a prometerte rentabilidades: te vamos a enseñar a leer el mercado con estructura, contexto y validación.",
  cierre:
    "En resumen: cualquier trader que ya haya explorado el mercado y quiera dejar de acumular conceptos sueltos para construir un marco claro y repetible.",
  perfiles: [
    {
      title: "Has visto cientos de videos de trading",
      description:
        "Conoces muchos conceptos pero sigues confundido. Cada mentor enseña algo diferente y no sabes qué pieza va primero.",
    },
    {
      title: "Tu análisis cambia constantemente",
      description:
        "Lo que ves el lunes ya no te sirve el miércoles. Te falta un marco que te diga qué mirar y en qué orden.",
    },
    {
      title: "Dependes de indicadores o señales",
      description:
        "Saltas de una estrategia a otra buscando la que por fin funcione, sin entender el contexto en el que opera cada una.",
    },
    {
      title: "Quieres criterio propio",
      description:
        "No buscas que te digan dónde entrar: quieres entender por qué, y construir una metodología que puedas repetir.",
    },
  ],
} as const;

export const DIFERENCIA = {
  titulo: "¿Por qué esta sesión es",
  resaltado: "completamente distinta?",
  /** Párrafo con fragmentos resaltados: cada objeto `{ mark }` va en color de acento. */
  parrafo: [
    "El problema no es que existan pocos cursos de trading. El problema es que la mayoría enseña conceptos aislados. Nosotros enseñamos ",
    { mark: "cómo conectar todas las piezas" },
    " para interpretar el mercado con criterio: primero el ",
    { mark: "contexto" },
    ", luego la estructura y, solo al final, la entrada. Cuando entiendes el contexto, las entradas dejan de ser una adivinanza.",
  ],
  boton: "Reservar mi cupo en vivo",
} as const;

export const APRENDIZAJES = {
  eyebrow: "El plan de la sesión",
  titulo: "Lo que vas a aprender en la",
  resaltado: "Sesión Cero BTM",
  cierreAntes: "Prepárate para dejar de acumular información y empezar a",
  cierreResaltado: "operar con un marco claro",
  cierreDespues: ".",
  items: [
    {
      title: "Comprender la estructura del mercado",
      description:
        "Identifica el esqueleto del precio antes de mirar cualquier indicador.",
    },
    {
      title: "Interpretar correctamente el contexto",
      description:
        "Lee el momento del mercado para no operar contra la narrativa dominante.",
    },
    {
      title: "Validar zonas de alta probabilidad",
      description:
        "Aplica las 4 leyes estructurales para confirmar dónde merece la pena operar.",
    },
    {
      title: "Tomar decisiones con criterio",
      description:
        "Ejecuta con un proceso definido, no con impulsos ni sesgos.",
    },
  ],
} as const;

export const MENTOR = {
  eyebrow: "Quién te va a enseñar",
  titulo: "¿Quién es",
  resaltado: "Jesus Bentham?",
  // TODO(copy): biografía real del mentor.
  puntos: [
    "Fundador de BTM Academy, una marca educativa enfocada en Forex, Oro (XAUUSD) e Índices.",
    "Creador de una metodología que conecta estructura, contexto y validación en lugar de depender de indicadores aislados o estrategias memorizadas.",
    "Acompaña a traders en mentoría 1:1 con diagnóstico individual, revisión continua de análisis y seguimiento de su operativa.",
  ],
  /** Cifras animadas. TODO(copy): cifras reales. */
  stats: [
    { value: 3, decimals: 0, suffix: "", label: "Mercados: Forex, Oro e Índices" },
    { value: 4, decimals: 0, suffix: "", label: "Leyes estructurales del método" },
    { value: 1, decimals: 0, suffix: ":1", label: "Mentoría personalizada" },
  ],
  destacadoTitulo: "Pero lo más importante es esto:",
  destacado:
    "No te falta información. Te falta un mapa. La diferencia entre un trader que opera con miedo y uno que opera con criterio es el marco que usa para leer el mercado, y eso es exactamente lo que vas a construir.",
} as const;

export const FILTRO = {
  eyebrow: "Filtro honesto",
  titulo: "¿Esta sesión es para ti?",
  resaltado: "Revísalo con total honestidad",
  boton: "Quiero mi cupo gratis",
  filas: [
    {
      no: "Buscas señales para copiar o una promesa de rentabilidad.",
      yes: "Quieres entender el mercado y desarrollar criterio propio.",
    },
    {
      no: "Prefieres saltar de una estrategia a otra hasta encontrar la mágica.",
      yes: "Estás dispuesto a construir una metodología que puedas repetir.",
    },
    {
      no: "Memorizas nombres de patrones sin entender el contexto.",
      yes: "Quieres entender el contexto antes de buscar entradas.",
    },
    {
      no: "Esperas que un indicador tome las decisiones por ti.",
      yes: "Quieres tomar decisiones con lógica estructurada.",
    },
  ],
} as const;

export const FAQ_ITEMS = [
  {
    question: "¿Necesito experiencia previa en trading?",
    answer:
      "No es imprescindible, pero sí ayuda haber explorado el mercado antes. Lo importante es que quieras dejar de acumular conceptos sueltos y construir un marco estructurado para operar Forex, Oro e Índices con criterio.",
  },
  {
    question: "¿La sesión tiene algún costo?",
    answer:
      "No. La Sesión Cero BTM es gratuita y en vivo. El acceso y los avisos se envían por el grupo privado de WhatsApp al que te unes al registrarte.",
  },
  {
    question: "¿Dan señales de trading o prometen rentabilidad?",
    answer:
      "No. BTM Academy es una marca educativa. No vendemos señales ni garantizamos rentabilidades. Enseñamos a interpretar el mercado con estructura, contexto y validación para que desarrolles criterio propio.",
  },
  {
    question: "¿Qué mercados cubre la metodología?",
    answer:
      "La metodología se aplica a Forex, Oro (XAUUSD) e Índices. El enfoque es conectar estructura, contexto y validación en cualquiera de estos mercados, no depender de indicadores aislados ni de estrategias memorizadas.",
  },
  {
    question: "¿Qué pasa después de la sesión?",
    answer:
      "Si quieres seguir, te contaremos cómo funciona la Mentoría Personalizada: acompañamiento 1:1 con diagnóstico individual, revisión continua de análisis y seguimiento de tu operativa.",
  },
] as const;

/**
 * Sesiones del evento. `offsetDias` cuenta desde la fecha configurada en
 * /admin: 0 = ese mismo día, 1 = el día siguiente. Para un evento de dos días
 * basta con agregar una segunda sesión con `offsetDias: 1`.
 */
export const AGENDA_BASE = [
  {
    offsetDias: 0,
    badge: "Sesión en vivo",
    title: "Las 4 leyes estructurales",
    description:
      "Identifica el error que mantiene estancados a la mayoría de los traders, aprende a leer el contexto antes de operar y valida zonas de alta probabilidad sin depender de indicadores ni señales.",
  },
] as const;

export const CIERRE = {
  eyebrow: "Reserva la fecha",
  tituloAntes: "Una sesión en vivo,",
  tituloResaltado: "cero costo",
  boton: "Quiero mi cupo gratis",
  aviso:
    "Los cupos del grupo de WhatsApp son limitados. El acceso se entrega únicamente por ese canal.",
} as const;

export const STICKY = {
  titulo: "Sesión Cero BTM · Gratis y en vivo",
  bajada: "Cupos limitados en el grupo de WhatsApp",
  boton: "Quiero mi cupo gratis",
} as const;

export const PROCESANDO = {
  titulo: (nombre: string) => `${nombre}, tu cupo está casi confirmado`,
  bajadaAntes: "Sigue este último paso obligatorio para garantizar tu acceso a la",
  bajadaResaltado: "sesión en vivo",
  bajadaDespues: "y recibir los materiales de trabajo.",
  checklist: [
    { label: "Datos recibidos y verificados", done: true },
    { label: "Cupo reservado para la sesión en vivo", done: true },
    { label: "Acceso al grupo privado de WhatsApp", done: false },
  ],
  boton: "Unirme al grupo de WhatsApp",
  notas: [
    "Por este canal privado compartimos el enlace directo a la transmisión y el material de la sesión.",
    "El grupo es de solo lectura, administrado por nuestro equipo para respetar tu tiempo.",
  ],
} as const;

export const REGISTRO = {
  texto: (nombre: string) =>
    `Listo, ${nombre}. Tu cupo quedó confirmado y ya haces parte del grupo privado. Ahí te llega el enlace de la transmisión y el material de trabajo.`,
  boton: "Abrir el grupo de WhatsApp",
} as const;

export const AVISO_LEGAL =
  "BTM Academy ofrece formación educativa. El contenido de esta página no constituye asesoría financiera, recomendación de inversión, señales de trading ni promesa de rentabilidad. Operar en mercados financieros implica riesgos y cada persona es responsable de sus propias decisiones.";

/** Versión de la Política de Privacidad que acepta el lead al registrarse. */
export const PRIVACY_POLICY_VERSION = "2026-07-02";
