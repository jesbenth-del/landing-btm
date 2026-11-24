/**
 * Copy y datos editables del evento de captación de BTM Academy.
 *
 * Todo el texto que cambia de una convocatoria a otra vive aquí, no en los
 * componentes: cambiar la oferta es editar este archivo. La fecha, la hora, el
 * nombre de la convocatoria y el grupo de WhatsApp NO van aquí: se editan en
 * /admin. La fecha y la hora solo se muestran en la landing cuando la variable
 * de entorno SHOW_EVENT_DATE vale "true".
 *
 * Reglas de redacción: decir «clase» (nunca «sesión»), «claridad» o
 * «fundamento» (nunca «criterio») y «rango operativo» (nunca «rango» solo).
 */

/** Las clases se anuncian en hora Colombia, que no tiene horario de verano. */
export const ZONA_HORARIA = {
  desfase: "-05:00",
  etiqueta: "Hora Colombia",
} as const;

/**
 * Nombre del evento en los píxeles de Meta (navegador y Conversions API).
 * No se muestra en la página; cambiarlo parte los reportes de Meta en dos.
 */
export const EVENT_CONTENT_NAME = "Sesión Cero BTM";

export const MARCA = {
  nombre: "BTM Academy",
  // TODO(Jesús): confirmar si su nombre se escribe con tilde («Jesús»).
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
  title: "Deja de operar zonas sin contexto · Clase gratuita | BTM Academy",
  description:
    "Clase gratuita de Sistema BTM: aprende a leer el contexto, ubicar el precio y construir un escenario antes de buscar una entrada.",
} as const;

export const HERO = {
  /** Va antes de la fecha en la insignia (la fecha solo aparece con SHOW_EVENT_DATE). */
  insignia: "Clase gratuita en vivo",
  /** Va en la cabecera de /procesando y /registro. */
  estado: "100 % online",
  /** El titular se arma como: antes + resaltado + después. */
  tituloAntes: "Deja de operar",
  tituloResaltado: "zonas sin contexto.",
  tituloDespues: "",
  bajada:
    "Clase gratuita de Sistema BTM: aprende a leer el contexto, ubicar el precio y construir un escenario antes de buscar una entrada.",
  formularioTitulo: "Reserva tu cupo",
  formularioBajada: "Completa tus datos y te enviamos el acceso por WhatsApp.",
  botonFormulario: "Quiero mi cupo gratis",
  avisoFormulario:
    "Al enviar aceptas unirte al grupo de WhatsApp y recibir ahí el acceso y los avisos de la clase en vivo.",
  /** Línea pequeña debajo del formulario cuando no se muestra la fecha. */
  lineaSinFecha: "Evento 100 % online y gratuito",
} as const;

/** Opciones de «¿Cuánto tiempo llevas analizando gráficos?» en el formulario. */
export const EXPERIENCIA_OPCIONES = [
  { value: "menos-6-meses", label: "Menos de 6 meses" },
  { value: "6-meses-1-ano", label: "De 6 meses a 1 año" },
  { value: "1-2-anos", label: "De 1 a 2 años" },
  { value: "mas-2-anos", label: "Más de 2 años" },
] as const;

export type Experiencia = (typeof EXPERIENCIA_OPCIONES)[number]["value"];

export const experienciaLabel = (value?: string | null) =>
  EXPERIENCIA_OPCIONES.find((o) => o.value === value)?.label ?? "";

/** Franja de credibilidad debajo del héroe. Texto ya formateado: no se anima. */
export const PROOF_STATS = [
  { value: "FX · XAU · Índices", label: "Mercados que cubrimos" },
  { value: "Clase", label: "En vivo" },
  { value: "100 %", label: "Online y gratuita" },
  { value: "0", label: "Señales o promesas de rentabilidad" },
] as const;

export const AUDIENCIA = {
  eyebrow: "Identifícate",
  titulo: "¿Para quién es",
  resaltado: "esta clase?",
  intro:
    "Es para ti si sientes que sabes muchas cosas de trading pero no tienes claridad. Aquí no venimos a darte señales ni a prometerte rentabilidades: te vamos a enseñar a leer el mercado con estructura, contexto y fundamento.",
  cierre: "No necesitas más conceptos. Necesitas conectarlos.",
  perfiles: [
    {
      title: "Tu gráfico está lleno de zonas",
      description:
        "Marcas zonas por todos lados, pero no tienes claro dónde está realmente el precio.",
    },
    {
      title: "No sabes cuáles zonas sirven",
      description:
        "Reconoces order blocks, FVG y quiebres de estructura, pero no tienes cómo decidir cuáles tienen sentido y cuáles descartar.",
    },
    {
      title: "El patrón se veía perfecto y falló",
      description:
        "La zona parecía correcta y aun así no funcionó. Faltaba entender dónde estaba el precio y qué contexto había.",
    },
    {
      title: "Dudas al ejecutar",
      description:
        "No siempre es por el resultado. A veces es que no tienes claro qué estás haciendo ni por qué.",
    },
  ],
} as const;

export const DIFERENCIA = {
  titulo: "¿Qué cambia en",
  resaltado: "esta clase?",
  /** Párrafo con fragmentos resaltados: cada objeto `{ mark }` va en color de acento. */
  parrafo: [
    "El problema no es que falte información. La mayoría de la formación enseña conceptos aislados. En esta clase verás ",
    { mark: "cómo conectarlos" },
    ": primero entiendes ",
    { mark: "dónde está el precio" },
    ", después construyes un escenario y, solo al final, buscas la entrada.",
  ],
  boton: "Quiero mi cupo gratis",
} as const;

export const APRENDIZAJES = {
  eyebrow: "El plan de la clase",
  titulo: "Lo que vas a aprender en",
  resaltado: "la clase",
  cierreAntes: "Deja de acumular conceptos.",
  cierreResaltado: "Aprende a conectarlos.",
  cierreDespues: "",
  // TODO(Jesús): los cuatro pasos deben coincidir con lo que enseñe en la clase.
  items: [
    {
      title: "Ubicar el precio",
      description:
        "Entiende en qué rango operativo está y en qué parte de él, antes de elegir una zona.",
    },
    {
      title: "Leer el contexto de arriba hacia abajo",
      description:
        "Descubre cómo lo que ves en temporalidades menores cambia según la temporalidad mayor.",
    },
    {
      title: "Descartar zonas sin sentido",
      description:
        "Aprende a decidir cuáles zonas tienen sentido en tu escenario y cuáles descartar.",
    },
    {
      title: "Construir un escenario completo",
      description:
        "Define tu objetivo, qué necesitas que ocurra y qué lo invalida, y entiende por qué a veces no hay operación.",
    },
  ],
} as const;

export const MENTOR = {
  eyebrow: "Quién te va a enseñar",
  titulo: "¿Quién es",
  resaltado: `${MARCA.mentor}?`,
  puntos: [
    "Fundador de BTM Academy, una marca educativa enfocada en Forex, Oro (XAUUSD) e Índices.",
    "Creador del Sistema BTM, una metodología de análisis que conecta estructura, rangos operativos y contexto.",
    "Enseña a traders a leer el contexto y a construir escenarios con condiciones claras.",
  ],
  /** Cifras animadas. Vacío = la fila de cifras no se muestra. */
  stats: [] as readonly { value: number; decimals: number; suffix: string; label: string }[],
  destacadoTitulo: "Pero lo más importante es esto:",
  destacado:
    "No te falta información. Te falta conectarla. La diferencia entre un trader que duda y uno que opera con claridad está en cómo lee el mercado, y eso es lo que vas a empezar a construir.",
} as const;

export const FILTRO = {
  eyebrow: "Filtro honesto",
  titulo: "¿Esta clase es para ti?",
  resaltado: "Revísalo con honestidad",
  boton: "Quiero mi cupo gratis",
  /** Cada fila empareja un «NO es para ti» con un «SÍ es para ti». */
  filas: [
    {
      no: "Buscas señales para copiar o una promesa de rentabilidad.",
      yes: "Quieres entender el mercado y desarrollar tu propia lectura.",
    },
    {
      no: "Prefieres saltar de una estrategia a otra hasta encontrar la mágica.",
      yes: "Estás dispuesto a construir un proceso de análisis que puedas repetir.",
    },
    {
      no: "Memorizas nombres de patrones sin entender el contexto.",
      yes: "Quieres entender el contexto antes de buscar entradas.",
    },
    {
      no: "Esperas que un indicador tome las decisiones por ti.",
      yes: "Quieres tomar decisiones con fundamento.",
    },
    {
      no: "Estás empezando y aún no conoces las bases del análisis técnico.",
      yes: "Ya conoces los conceptos básicos y quieres aprender a conectarlos.",
    },
  ],
} as const;

export const FAQ_ITEMS = [
  {
    question: "¿Necesito experiencia previa en trading?",
    answer:
      "Sí. La clase está pensada para quien ya tiene bases de análisis técnico y conoce conceptos como order block, FVG o quiebre de estructura. No es una clase para empezar desde cero.",
  },
  {
    question: "¿La clase tiene algún costo?",
    answer: "No. Es gratuita.",
  },
  {
    question: "¿Dan señales de trading o prometen rentabilidad?",
    answer:
      "No. Es formación educativa. No damos señales ni entradas para copiar, y no prometemos resultados. Operar implica riesgo.",
  },
  {
    question: "¿Qué mercados cubre la metodología?",
    answer: "Los ejemplos de la clase son en Forex, oro (XAUUSD) e índices.",
  },
  {
    question: "¿Qué pasa después de la clase?",
    answer:
      "Al final, Jesús cuenta cómo seguir aprendiendo, por si quieres continuar. No tienes ninguna obligación.",
  },
] as const;

/**
 * Clases del evento. `offsetDias` cuenta desde la fecha configurada en
 * /admin: 0 = ese mismo día, 1 = el día siguiente. Para un evento de dos días
 * basta con agregar una segunda clase con `offsetDias: 1`.
 */
export const AGENDA_BASE = [
  {
    offsetDias: 0,
    badge: "Clase en vivo",
    title: "Ubica el precio y construye un escenario",
    description:
      "Aprende a leer el contexto, ubicar el precio y decidir qué zonas tienen sentido antes de buscar una entrada.",
  },
] as const;

export const CIERRE = {
  eyebrow: "Último paso",
  tituloAntes: "Una clase en vivo,",
  tituloResaltado: "gratis",
  boton: "Quiero mi cupo gratis",
  // TODO(Jesús): si el límite de cupos es real, decirlo aquí con la cifra.
  aviso: "El acceso se entrega por WhatsApp.",
} as const;

export const STICKY = {
  titulo: "Clase gratuita · En vivo",
  bajada: "El acceso se entrega por WhatsApp",
  boton: "Quiero mi cupo gratis",
} as const;

/** Paso 2 (justo después del registro): llevar al grupo de WhatsApp. */
export const PROCESANDO = {
  titulo: (nombre: string) => `${nombre}, ya estás registrado`,
  texto:
    "Entra al grupo para recibir el enlace de la clase y los recordatorios. La fecha y la hora de la clase se publicarán en el grupo.",
  checklist: [
    { label: "Datos recibidos", done: true },
    { label: "Cupo reservado para la clase en vivo", done: true },
    { label: "Entrar al grupo de WhatsApp", done: false },
  ],
  boton: "Entrar al grupo de WhatsApp",
  notas: [
    "Por este canal compartimos el enlace directo a la transmisión y el material de la clase.",
    "El grupo es de solo lectura, administrado por nuestro equipo para respetar tu tiempo.",
  ],
} as const;

/** Paso 3: confirmación después de entrar al grupo. */
export const REGISTRO = {
  texto: (nombre: string) =>
    `Listo, ${nombre}. Ya estás registrado y en el grupo. Ahí recibirás el enlace de la clase y los recordatorios. La fecha y la hora de la clase se publicarán en el grupo.`,
  boton: "Abrir el grupo de WhatsApp",
} as const;

export const AVISO_LEGAL =
  "BTM Academy ofrece formación educativa. El contenido de esta página no constituye asesoría financiera, recomendación de inversión, señales de trading ni promesa de rentabilidad. Operar en mercados financieros implica riesgos y cada persona es responsable de sus propias decisiones.";

/** Versión de la Política de Privacidad que acepta el lead al registrarse. */
export const PRIVACY_POLICY_VERSION = "2026-07-02";
