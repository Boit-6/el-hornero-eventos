import type { EventTypeId } from "./party-options";
import { SALON, type EXTRA_SERVICES } from "./salon";

export const EVENT_PAGE_SLUGS = ["casamientos", "fiestas-de-15", "empresariales"] as const;
export type EventPageSlug = (typeof EVENT_PAGE_SLUGS)[number];

export type EventPage = {
  slug: EventPageSlug;
  eventTypeId: EventTypeId;
  /** Nombre corto, para enlaces y migas de pan. */
  label: string;
  heading: string;
  description: string;
  intro: string;
  highlights: ReadonlyArray<{ title: string; text: string }>;
  /** Extras de la carta que se destacan en la página (selección nuestra, no un dato del salón). */
  extras: ReadonlyArray<(typeof EXTRA_SERVICES)[number]>;
  notes: ReadonlyArray<string>;
};

const { maxGuests, minAdultsWithoutSurcharge } = SALON.capacity;

/**
 * Páginas por tipo de evento. Todo lo que afirman sale del folleto y de la
 * carta de opciones del salón (ver `salon.ts`): sin precios ni datos nuevos.
 */
export const EVENT_PAGES: ReadonlyArray<EventPage> = [
  {
    slug: "casamientos",
    eventTypeId: "casamiento",
    label: "Casamientos",
    heading: "Salón para casamientos en Luján de Cuyo, Mendoza",
    description: `Celebra tu casamiento en El Hornero: jardines para la ceremonia y las fotos, salón climatizado para hasta ${maxGuests} invitados y menú de elaboración propia. Arma tu fiesta online.`,
    intro:
      "Con más de 20 años organizando eventos en Luján de Cuyo, en El Hornero te acompañamos desde la planificación hasta el día del casamiento. El salón está atendido por sus dueños y cada propuesta se arma a tu medida.",
    highlights: [
      {
        title: "Jardines para la ceremonia y las fotos",
        text: "Amplios jardines y espacios al aire libre, ideales para la ceremonia, la recepción y las fotografías, con ambientación lumínica al caer la noche.",
      },
      {
        title: `Salón para hasta ${maxGuests} invitados`,
        text: "Ambiente climatizado, vajilla de porcelana, doble copa, silla vestida y mantelería fina, con mozos durante todo el evento.",
      },
      {
        title: "Menú de elaboración propia",
        text: "Lunch o cena formal con recepción, plato principal y postre. Eliges la propuesta en la web y la ajustamos contigo en la reunión.",
      },
      {
        title: `${SALON.eventDurationHours} horas de fiesta`,
        text: `De día o de noche, con DJ, sonido e iluminación incluidos. De noche, el tope de finalización es a las ${SALON.closingTime} h.`,
      },
    ],
    extras: [
      "Pérgola para bodas",
      "Decoración de fondo de mesa principal o de fotos",
      "Sillón de mesa principal",
      "Mesa dulce premium",
      "Chispas frías (x2)",
      "Living",
      "Foto cabina y plataforma 360",
    ],
    notes: [
      "No incluye torta ni fotografía y video.",
      "No se puede tirar papel picado ni pétalos de rosa.",
      `Mínimo a la cena: ${minAdultsWithoutSurcharge} personas adultas (con menos se cobra un adicional).`,
    ],
  },
  {
    slug: "fiestas-de-15",
    eventTypeId: "quince",
    label: "Fiestas de 15",
    heading: "Salón para fiestas de 15 en Luján de Cuyo, Mendoza",
    description: `Fiestas de 15 años en El Hornero: salón con DJ, luces y sonido incluidos, jardines iluminados para las fotos y lugar para hasta ${maxGuests} invitados. Arma tu fiesta online.`,
    intro:
      "Una fiesta de 15 se vive una sola vez. En El Hornero ponemos el salón, los jardines, la música y el menú, y te acompañamos en cada detalle para que la familia solo tenga que disfrutar.",
    highlights: [
      {
        title: "DJ, sonido y luces incluidos",
        text: "Todas las propuestas incluyen DJ profesional, sonido e iluminación con efectos de luces para armar la pista.",
      },
      {
        title: "Jardines iluminados para las fotos",
        text: "Jardines con ambientación lumínica y livings al aire libre, ideales para la recepción y las fotografías.",
      },
      {
        title: "Menú para todos los invitados",
        text: `Lunch o cena formal. Hay menús vegetarianos, veganos y para celíacos si se piden antes, y los niños de hasta 10 años abonan el 50 % cuando hay ${minAdultsWithoutSurcharge} adultos.`,
      },
      {
        title: "Tranquilidad para la familia",
        text: "Portería y seguridad durante todo el evento, estacionamiento interno, grupo electrógeno y servicio de emergencia.",
      },
    ],
    extras: [
      "Letras, números y símbolos",
      "Foto cabina y plataforma 360",
      "Láser show",
      "Chispas frías (x2)",
      "Pistola de CO2",
      "Muebles candy",
      "Mesa dulce básica",
      "Decoración de fondo de mesa principal o de fotos",
    ],
    notes: [
      "No incluye torta ni fotografía y video.",
      "Prohibido realizar invitación masiva por redes.",
      "No se puede tirar papel picado, aerosoles que pintan ni golosinas (chicles).",
    ],
  },
  {
    slug: "empresariales",
    eventTypeId: "empresa",
    label: "Eventos empresariales",
    heading: "Salón para eventos empresariales en Luján de Cuyo, Mendoza",
    description: `Eventos empresariales en El Hornero: salón climatizado para hasta ${maxGuests} personas, de día o de noche, con estacionamiento interno, sonido y menú de elaboración propia.`,
    intro:
      "Fiestas de fin de año, aniversarios de la empresa o reuniones de equipo: en El Hornero resolvemos el lugar, el menú y la técnica en un solo espacio, con un presupuesto a la medida de cada evento.",
    highlights: [
      {
        title: "De día o de noche",
        text: `Horario flexible, con un total de ${SALON.eventDurationHours} horas de evento.`,
      },
      {
        title: "Lunch o cena formal",
        text: "El Lunch El Hornero circula durante todo el evento, con recepción e islas. Si prefieres mesa servida, hay cuatro propuestas con plato principal y postre.",
      },
      {
        title: "Todo resuelto en un solo lugar",
        text: "Salón climatizado, estacionamiento interno, seguridad, grupo electrógeno, sonido e iluminación.",
      },
      {
        title: "Presupuesto a medida",
        text: `Cotizamos según las necesidades de cada evento, para hasta ${maxGuests} personas. Con menos de ${minAdultsWithoutSurcharge} adultos a la cena se cobra un adicional.`,
      },
    ],
    extras: [
      "Cafetería",
      "Living",
      "Pernil",
      "Sándwich de jamón crudo en pan casero",
      "Foto cabina y plataforma 360",
    ],
    notes: [
      "Los precios se cotizan a valores del día y se reajustan según los precios de plaza a la fecha del evento.",
      "No se permiten bandas de música en vivo después de la 01:00 h.",
    ],
  },
];

export function findEventPage(slug: string) {
  return EVENT_PAGES.find((page) => page.slug === slug);
}

export function toEventPagePath(slug: EventPageSlug) {
  return `/eventos/${slug}`;
}
