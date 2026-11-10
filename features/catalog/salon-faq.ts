import { SALON } from "./salon";

/**
 * Preguntas frecuentes de la portada. Las respuestas salen del folleto y de la
 * carta de opciones del salón: sin precios, que se cotizan en la reunión.
 */
export const SALON_FAQ: ReadonlyArray<{ question: string; answer: string }> = [
  {
    question: `¿Dónde queda el salón de eventos ${SALON.name}?`,
    answer: `Estamos en ${SALON.address}. El salón tiene playa de estacionamiento interna y servicio de seguridad durante todo el evento.`,
  },
  {
    question: "¿Para cuántas personas es el salón?",
    answer: `Recibimos hasta ${SALON.capacity.maxGuests} personas. El mínimo a la cena es de ${SALON.capacity.minAdultsWithoutSurcharge} personas adultas: con menos invitados se cobra un adicional.`,
  },
  {
    question: "¿Qué tipos de eventos se pueden celebrar?",
    answer:
      "Casamientos, fiestas de 15 y de 18 años, cumpleaños, aniversarios, eventos empresariales, bautismos y comuniones, fiestas de egresados y otras reuniones familiares o sociales.",
  },
  {
    question: "¿Qué incluye el servicio?",
    answer:
      "Salón climatizado, vajilla de porcelana, doble copa, silla vestida y mantelería fina, mozos, portería y seguridad, DJ con sonido e iluminación, ambientación lumínica de jardines y salón, playa de estacionamiento, grupo electrógeno y servicio de emergencia. No incluye torta ni fotografía y video.",
  },
  {
    question: "¿Cuánto dura el evento y hasta qué hora se puede festejar?",
    answer: `El evento dura ${SALON.eventDurationHours} horas en total, de día o de noche, con horario flexible. El tope de finalización es a las ${SALON.closingTime} h y el alcohol se sirve hasta las ${SALON.alcoholServedUntil} h, según las leyes vigentes.`,
  },
  {
    question: "¿Hay menús para vegetarianos, veganos y celíacos?",
    answer:
      "Sí. Los menús especiales se solicitan antes del evento, indicando el nombre y apellido de cada invitado.",
  },
  {
    question: "¿Los niños pagan el cubierto completo?",
    answer: `Los niños de hasta 10 años abonan el 50 % cuando hay ${SALON.capacity.minAdultsWithoutSurcharge} adultos.`,
  },
  {
    question: "¿Cuánto cuesta hacer una fiesta en el salón?",
    answer:
      "No publicamos precios: cada presupuesto es personalizado según el evento, el menú y la cantidad de invitados. Lo cotizamos a valores del día y lo conversamos contigo en la reunión.",
  },
  {
    question: "¿Cómo reservo una fecha?",
    answer:
      "Arma tu fiesta en la web, consulta si la fecha está disponible, propón una reunión y envíanos tu propuesta por WhatsApp. La web no confirma ninguna reserva: la fecha queda confirmada únicamente cuando lo acordamos contigo en la reunión.",
  },
];
