import { z } from "zod";
import {
  ALL_SEATED_MAINS,
  ATTENTION_WEEKDAYS,
  DESSERTS,
  EVENT_SHIFT_IDS,
  EVENT_TYPE_IDS,
  findSeatedProposal,
  MEETING_MODE_IDS,
  MEETING_TIME_SLOTS,
  SEATED_PROPOSAL_IDS,
  SERVICE_STYLE_IDS,
} from "@/features/catalog/party-options";
import { EXTRA_SERVICES, SALON } from "@/features/catalog/salon";
import { addDaysFromToday, getWeekday } from "@/features/utils/calendar-dates";

/**
 * Reglas de una solicitud de fiesta. Se usan en el navegador (paso a paso,
 * para mostrar errores) y en el servidor (completas, antes de guardar),
 * así las dos validaciones nunca se desfasan.
 */

const MIN_PHONE_DIGITS = 8;
export const MAX_SHORT_TEXT = 80;
const MAX_NOTES = 500;
const MAX_PHONE_DIGITS = 15;
const MIN_NAME_LENGTH = 2;
const { minGuests: MIN_GUESTS, maxGuests: MAX_GUESTS } = SALON.capacity;

// Solo se aceptan caracteres esperables en cada campo: nada de símbolos raros, emojis ni código.
// Se incluyen las comillas y rayas tipográficas (’ “ ” … – —) que escriben solos los teclados de celular.
const PERSON_NAME_PATTERN = /^[\p{L}\p{M}'’ .-]+$/u;
const PHONE_PATTERN = /^[0-9+() -]+$/;
export const SHORT_TEXT_PATTERN = /^[\p{L}\p{M}\p{N} ,.'’°-]*$/u;
const NOTES_PATTERN = /^[\p{L}\p{M}\p{N}\s.,;:!?¡¿()'"’“”…–—%+/°@#&$*_=-]*$/u;
export const UNEXPECTED_CHARACTERS_MESSAGE = "Usa solo letras, números y signos de puntuación comunes.";

function isKnownMain(dish: string) {
  return ALL_SEATED_MAINS.includes(dish);
}

function isKnownDessert(dish: string) {
  return DESSERTS.includes(dish);
}

function countDigits(text: string) {
  return text.replace(/\D/g, "").length;
}

const partyRequestFields = z.object({
  eventType: z.enum(EVENT_TYPE_IDS, { error: "Elige qué tipo de evento quieres hacer." }),
  customEventName: z
    .string()
    .trim()
    .max(MAX_SHORT_TEXT, `Usa hasta ${MAX_SHORT_TEXT} caracteres.`)
    .regex(SHORT_TEXT_PATTERN, UNEXPECTED_CHARACTERS_MESSAGE),
  guestCount: z
    .number({ error: "Ingresa la cantidad de invitados." })
    .int("Ingresa un número entero.")
    .min(MIN_GUESTS, `Cotizamos eventos desde ${MIN_GUESTS} invitados.`)
    .max(MAX_GUESTS, `La capacidad máxima del salón es de ${MAX_GUESTS} personas.`),
  serviceStyle: z.enum(SERVICE_STYLE_IDS, { error: "Elige entre lunch o formal." }),
  seatedMenu: z.object({
    proposal: z.enum(SEATED_PROPOSAL_IDS).nullable(),
    // Solo platos de la carta, aunque el servicio elegido no los use: nunca texto libre.
    main: z.string().refine(isKnownMain).nullable(),
    dessert: z.string().refine(isKnownDessert).nullable(),
  }),
  extras: z.array(z.enum(EXTRA_SERVICES)),
  eventDate: z.iso.date({ error: "Elige la fecha de tu evento." }),
  eventShift: z.enum(EVENT_SHIFT_IDS, { error: "Elige si el evento es de día o de noche." }),
  meeting: z.object({
    date: z.iso.date({ error: "Elige un día para la reunión." }),
    time: z.enum(MEETING_TIME_SLOTS, { error: "Elige un horario." }),
    mode: z.enum(MEETING_MODE_IDS, { error: "Elige la modalidad." }),
  }),
  contact: z.object({
    name: z
      .string()
      .trim()
      .min(MIN_NAME_LENGTH, "Dinos tu nombre.")
      .max(MAX_SHORT_TEXT, `Usa hasta ${MAX_SHORT_TEXT} caracteres.`)
      .regex(PERSON_NAME_PATTERN, "El nombre solo puede tener letras y espacios."),
    phone: z
      .string()
      .trim()
      .regex(PHONE_PATTERN, "El teléfono solo puede tener números, espacios y los signos + - ( ).")
      .refine((phone) => {
        const digits = countDigits(phone);
        return digits >= MIN_PHONE_DIGITS && digits <= MAX_PHONE_DIGITS;
      }, "Ingresa un teléfono válido."),
  }),
  notes: z
    .string()
    .trim()
    .max(MAX_NOTES, `Usa hasta ${MAX_NOTES} caracteres.`)
    .regex(NOTES_PATTERN, UNEXPECTED_CHARACTERS_MESSAGE),
});

export type PartyRequestInput = z.output<typeof partyRequestFields>;

type RequestFields<Keys extends keyof PartyRequestInput> = Pick<PartyRequestInput, Keys>;

function requireCustomEventName(value: RequestFields<"eventType" | "customEventName">, ctx: z.RefinementCtx) {
  if (value.eventType === "otro" && !value.customEventName) {
    ctx.addIssue({ code: "custom", path: ["customEventName"], message: "Cuéntanos qué evento quieres celebrar." });
  }
}

function requireSeatedMenu(value: RequestFields<"serviceStyle" | "seatedMenu">, ctx: z.RefinementCtx) {
  if (value.serviceStyle !== "sentado") return;

  const { proposal: proposalId, main, dessert } = value.seatedMenu;
  const proposal = proposalId ? findSeatedProposal(proposalId) : undefined;
  if (!proposal) {
    ctx.addIssue({ code: "custom", path: ["seatedMenu", "proposal"], message: "Elige una propuesta de menú." });
    return;
  }

  const mustChooseMain = proposal.mains.length > 1;
  if (mustChooseMain && (!main || !proposal.mains.includes(main))) {
    ctx.addIssue({ code: "custom", path: ["seatedMenu", "main"], message: "Elige un plato principal." });
  }
  if (!dessert || !DESSERTS.includes(dessert)) {
    ctx.addIssue({ code: "custom", path: ["seatedMenu", "dessert"], message: "Elige un postre." });
  }
}

function requireFutureEventDate(value: RequestFields<"eventDate">, ctx: z.RefinementCtx) {
  if (value.eventDate < addDaysFromToday(1)) {
    ctx.addIssue({ code: "custom", path: ["eventDate"], message: "Elige una fecha a partir de mañana." });
  }
}

function validateMeetingDate(value: RequestFields<"eventDate" | "meeting">, ctx: z.RefinementCtx) {
  const { date } = value.meeting;
  const path = ["meeting", "date"];

  if (date < addDaysFromToday(1)) {
    ctx.addIssue({ code: "custom", path, message: "La reunión tiene que ser a partir de mañana." });
  } else if (date >= value.eventDate) {
    ctx.addIssue({ code: "custom", path, message: "La reunión tiene que ser antes del evento." });
  } else if (!ATTENTION_WEEKDAYS.includes(getWeekday(date))) {
    ctx.addIssue({ code: "custom", path, message: "Atendemos de lunes a jueves. Elige otro día." });
  }
}

/**
 * Por defecto Zod no corre las reglas cruzadas si algún campo del objeto tiene
 * errores. Con `when` cada regla corre igual, siempre que *sus* campos sean
 * válidos: así en un mismo intento se ven todos los errores del paso.
 */
function whenFieldsAreValid(...fieldPaths: string[]) {
  return {
    when: (payload: z.core.ParsePayload) =>
      !payload.issues.some((issue) => {
        const issuePath = (issue.path ?? []).join(".");
        return fieldPaths.some((field) => issuePath === field || issuePath.startsWith(`${field}.`));
      }),
  };
}

const CUSTOM_EVENT_NAME_RULE = whenFieldsAreValid("eventType", "customEventName");
const SEATED_MENU_RULE = whenFieldsAreValid("serviceStyle", "seatedMenu");
const FUTURE_EVENT_DATE_RULE = whenFieldsAreValid("eventDate");
const MEETING_DATE_RULE = whenFieldsAreValid("eventDate", "meeting.date");

/** Esquemas parciales, uno por sección del armador. */
export const eventDetailsSchema = partyRequestFields
  .pick({ eventType: true, customEventName: true, guestCount: true })
  .superRefine((value, ctx) => requireCustomEventName(value, ctx), CUSTOM_EVENT_NAME_RULE);

export const serviceSchema = partyRequestFields.pick({ serviceStyle: true });

export const menuSchema = partyRequestFields
  .pick({ serviceStyle: true, seatedMenu: true, extras: true })
  .superRefine((value, ctx) => requireSeatedMenu(value, ctx), SEATED_MENU_RULE);

export const eventDateSchema = partyRequestFields
  .pick({ eventDate: true, eventShift: true })
  .superRefine((value, ctx) => requireFutureEventDate(value, ctx), FUTURE_EVENT_DATE_RULE);

export const meetingSchema = partyRequestFields
  .pick({ eventDate: true, meeting: true, contact: true, notes: true })
  .superRefine((value, ctx) => validateMeetingDate(value, ctx), MEETING_DATE_RULE);

/** Esquema completo: es el que valida el servidor antes de guardar. */
export const partyRequestSchema = partyRequestFields
  .superRefine((value, ctx) => requireCustomEventName(value, ctx), CUSTOM_EVENT_NAME_RULE)
  .superRefine((value, ctx) => requireSeatedMenu(value, ctx), SEATED_MENU_RULE)
  .superRefine((value, ctx) => requireFutureEventDate(value, ctx), FUTURE_EVENT_DATE_RULE)
  .superRefine((value, ctx) => validateMeetingDate(value, ctx), MEETING_DATE_RULE);
