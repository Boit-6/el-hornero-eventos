/**
 * Catálogo para armar una fiesta, según la carta de opciones de El Hornero.
 * La carta no publica precios: el presupuesto es personalizado y se define
 * en la reunión con el salón.
 */

export const EVENT_TYPE_IDS = [
  "casamiento",
  "quince",
  "dieciocho",
  "cumpleanos",
  "aniversario",
  "empresa",
  "bautismo",
  "egresados",
  "otro",
] as const;
export type EventTypeId = (typeof EVENT_TYPE_IDS)[number];

export const EVENT_TYPES: ReadonlyArray<{ id: EventTypeId; label: string }> = [
  { id: "casamiento", label: "Casamiento" },
  { id: "quince", label: "Fiesta de 15 años" },
  { id: "dieciocho", label: "Fiesta de 18 años" },
  { id: "cumpleanos", label: "Cumpleaños décadas" },
  { id: "aniversario", label: "Aniversario" },
  { id: "empresa", label: "Evento empresarial" },
  { id: "bautismo", label: "Bautismo o comunión" },
  { id: "egresados", label: "Fiesta de egresados" },
  { id: "otro", label: "Otra reunión familiar o social" },
];

export const EVENT_SHIFT_IDS = ["noche", "dia"] as const;
export type EventShiftId = (typeof EVENT_SHIFT_IDS)[number];

export const EVENT_SHIFTS: ReadonlyArray<{ id: EventShiftId; label: string }> = [
  { id: "noche", label: "De noche" },
  { id: "dia", label: "De día" },
];

export const SERVICE_STYLE_IDS = ["sentado", "lunch"] as const;
export type ServiceStyleId = (typeof SERVICE_STYLE_IDS)[number];

export const SERVICE_STYLES: ReadonlyArray<{ id: ServiceStyleId; label: string; summary: string }> = [
  {
    id: "sentado",
    label: "Formal",
    summary: "Recepción, plato principal servido a la mesa y postre. Eliges la propuesta, el plato y el postre.",
  },
  {
    id: "lunch",
    label: "Lunch",
    summary: "“Lunch El Hornero”: recepción e islas con un menú completo que circula durante toda la fiesta.",
  },
];

/** Opción 1 de la carta. */
export const LUNCH_MENU = {
  name: "Lunch El Hornero",
  reception: [
    "Mini brusquetas (palta, queso azul, jamón crudo con rúcula, palmitos)",
    "Empanadas de jamón y queso, choclo y capresse",
    "Canapés y pastelitos criollos de papa",
    "Tabla con variedad de fiambres",
    "Cazuelas",
    "Sándwich en pan tipo Viena: pollo, guacamole, atún cremoso",
    "Bocados delicatessen en cuchara (palta y camarones, humus con olivas, pollo a la barbacoa)",
  ],
  islands: [
    "Paella",
    "Pinchos de pollo y carne con vegetales grillados, y de cerdo agridulce",
    "Empanadas mallorquinas, criollas y de pollo",
    "Cazuelas: cerdo a la criolla, pasta con salsa de cuatro quesos, ternera a la criolla, pollo al curry, cordero al malbec",
    "Tapas de hongos con parmesano",
    "Pollo escabechado en tapas",
    "Pernil de cerdo con salsas y pan casero",
  ],
} as const;

/** Recepción común a las opciones con plato principal (2 a 5). */
export const SEATED_RECEPTION: ReadonlyArray<string> = [
  "Mini brusquetas (palta, queso azul, palmitos, jamón crudo y rúcula)",
  "Empanadas de jamón y queso, choclo, capresse y criollas",
  "Canapés y pastelitos criollos de papa",
  "Sándwich en pan tipo Viena: pollo, guacamole, atún cremoso",
  "Tabla con variedad de fiambres",
  "Cazuelas (ternera o cerdo, pasta)",
  "Bocados delicatessen en cuchara (palta y camarones, humus con olivas, pollo a la barbacoa)",
];

export const SEATED_PROPOSAL_IDS = ["opcion-2", "opcion-3", "opcion-4", "opcion-5"] as const;
export type SeatedProposalId = (typeof SEATED_PROPOSAL_IDS)[number];

export type SeatedProposal = {
  id: SeatedProposalId;
  label: string;
  /** Platos principales entre los que se elige. Si hay uno solo, es el plato de la propuesta. */
  mains: ReadonlyArray<string>;
  receptionExtra?: string;
  hasPremiumLateNight: boolean;
};

/** Opciones 2 a 5 de la carta. */
export const SEATED_PROPOSALS: ReadonlyArray<SeatedProposal> = [
  {
    id: "opcion-2",
    label: "Opción 2",
    mains: [
      "Medallones de pollo relleno (jamón, queso, morrón, limón) con salsa y papas rústicas",
      "Bondiola de cerdo a la cerveza con batatas y papas a las finas hierbas",
      "Roast beef de ternera en cocción lenta con reducción de vino sobre cremoso de papas",
    ],
    hasPremiumLateNight: false,
  },
  {
    id: "opcion-3",
    label: "Opción 3",
    mains: [
      "Carne a la olla con vegetales y papas al horno",
      "Lasaña de carne, jamón cocido y queso con mix de salsas",
      "¼ de pollo asado al limón con salsa y ensalada fresca o papas rústicas",
    ],
    hasPremiumLateNight: false,
  },
  {
    id: "opcion-4",
    label: "Opción 4 · Asado",
    mains: ["Asado: morcilla, cortes de novillo, chorizo, cerdo y costillas, acompañado de ensaladas"],
    hasPremiumLateNight: false,
  },
  {
    id: "opcion-5",
    label: "Opción 5 · Premium + trasnoche",
    mains: ["Lomo de ternera en reducción de vino con cremoso de papas"],
    receptionExtra: "Pinchos mixtos de cerdo y pollo con vegetales",
    hasPremiumLateNight: true,
  },
];

export const ALL_SEATED_MAINS: ReadonlyArray<string> = SEATED_PROPOSALS.flatMap((proposal) => proposal.mains);

export const DESSERTS: ReadonlyArray<string> = [
  "Ostra de helado con crema y salsa",
  "Flan casero con dulce de leche y crema",
  "Postre tropical",
  "Delicia helada con mousse frutal y salsa de frutos rojos",
];

export const DRINKS: ReadonlyArray<string> = [
  "Vino tinto y blanco (Bodega Familia Zuccardi)",
  "Soda, agua mineral y agua saborizada",
  "Gaseosas línea Coca-Cola",
  "Hielo",
];

export const LATE_NIGHT_SERVICE = {
  standard: [
    "Cerveza (Andes o Quilmes), gaseosas, aguas saborizadas y jugos",
    "Pizzas caseras y sándwiches de miga de jamón cocido y queso",
    "Helado",
  ],
  premium: [
    "Cerveza, fernet, daiquiris de frutilla y durazno, mojito, gin tonic, Gancia y cuba libre",
    "Gaseosas, aguas saborizadas y jugos",
    "Pizzas caseras y sándwiches de miga",
    "Mini hamburguesas, jamón crudo en pan casero y mini choripanes",
    "Helado",
  ],
} as const;

/** Días (0 = domingo) y horarios en que el salón atiende reuniones. */
export const ATTENTION_WEEKDAYS: ReadonlyArray<number> = [1, 2, 3, 4];

export const MEETING_TIME_SLOTS = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30"] as const;

export const MEETING_MODE_IDS = ["presencial"] as const;
export type MeetingModeId = (typeof MEETING_MODE_IDS)[number];

export const MEETING_MODES: ReadonlyArray<{ id: MeetingModeId; label: string; description: string }> = [
  { id: "presencial", label: "En el salón", description: "Conoce las instalaciones y los jardines." },
];

export function findEventType(id: EventTypeId) {
  return EVENT_TYPES.find((eventType) => eventType.id === id);
}

export function findEventShift(id: EventShiftId) {
  return EVENT_SHIFTS.find((shift) => shift.id === id);
}

export function findServiceStyle(id: ServiceStyleId) {
  return SERVICE_STYLES.find((style) => style.id === id);
}

export function findSeatedProposal(id: SeatedProposalId) {
  return SEATED_PROPOSALS.find((proposal) => proposal.id === id);
}

export function findMeetingMode(id: MeetingModeId) {
  return MEETING_MODES.find((mode) => mode.id === id);
}
