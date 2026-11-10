/**
 * Datos institucionales del salón, tomados del folleto y de la carta de
 * opciones que entrega El Hornero (carpeta `media/`).
 */

/**
 * Los teléfonos del salón no están en el repositorio: se cargan con variables de entorno
 * (ver `.env.example`). Sin ellas se muestran números de ejemplo.
 */
const DEFAULT_WHATSAPP_NUMBER = "5492610000000";
const DEFAULT_PHONES = "261 000 0000";

function readPhones(): string[] {
  return (process.env.NEXT_PUBLIC_SALON_PHONES ?? DEFAULT_PHONES)
    .split(",")
    .map((phone) => phone.trim())
    .filter(Boolean);
}

export const SALON = {
  name: "El Hornero",
  tagline: "Salón de eventos",
  slogan: "Donde los sueños se hacen realidad",
  address: "Aráoz 1949, Luján de Cuyo, Mendoza",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Ar%C3%A1oz+1949+Luj%C3%A1n+de+Cuyo+Mendoza",
  phones: readPhones(),
  attentionHours: "Lunes a jueves de 18:00 a 21:00 h",
  instagram: "@salonelhornero",
  instagramUrl: "https://www.instagram.com/salonelhornero",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? DEFAULT_WHATSAPP_NUMBER,
  capacity: {
    /** Piso para cotizar: por debajo no se arma una consulta (evita pedidos falsos). */
    minGuests: 20,
    /** Por debajo de este mínimo de adultos a la cena se cobra un adicional. */
    minAdultsWithoutSurcharge: 100,
    maxGuests: 250,
  },
  eventDurationHours: 8,
  closingTime: "5:00",
  alcoholServedUntil: "4:30",
} as const;

export const SALON_ABOUT = {
  heading: "Más de 20 años creando momentos inolvidables",
  body:
    "Con una trayectoria de más de dos décadas en la organización de eventos, nuestro salón se ha " +
    "consolidado como un espacio de referencia en Luján de Cuyo. Atendido personalmente por sus dueños, " +
    "ofrecemos un servicio cercano, comprometido y enfocado en cada detalle para garantizar experiencias únicas.",
  commitment:
    "Cada evento es único. Por eso trabajamos de manera personalizada, acompañando a nuestros clientes " +
    "desde la planificación hasta la realización, brindando asesoramiento permanente y soluciones a medida.",
  invitation:
    "Lo invitamos a conocer nuestras instalaciones y descubrir por qué, después de más de 20 años, " +
    "seguimos siendo elegidos para celebrar los momentos más importantes.",
} as const;

export const SALON_SERVICES: ReadonlyArray<string> = [
  "Amplio estacionamiento interno para mayor comodidad de sus invitados.",
  "Servicio de seguridad durante todo el evento.",
  "Menú de elaboración propia, preparado con ingredientes seleccionados y la más alta calidad.",
  "Diversas alternativas gastronómicas adaptadas a cada ocasión.",
  "Presupuestos personalizados según las necesidades y características de cada evento.",
  "Servicio de DJ profesional.",
  "Iluminación y efectos de luces para crear ambientes únicos.",
  "Amplios jardines y espacios al aire libre ideales para ceremonias, recepciones y fotografías.",
];

/** Lo que incluye cualquiera de las opciones de menú. */
export const INCLUDED_SERVICES: ReadonlyArray<string> = [
  "Salón con ambiente climatizado",
  "Vajilla de porcelana, doble copa, silla vestida y mantelería fina",
  "Mozos (personal especializado)",
  "Portería y seguridad",
  "DJ, sonido e iluminación",
  "Ambientación lumínica de jardines y salón",
  "Jardines",
  "Playa de estacionamiento",
  "Grupo electrógeno",
  "Servicio de emergencia (área protegida)",
];

/** Nombres según la lista de servicios adicionales del salón. Sin precios: se cotizan en la reunión. */
export const EXTRA_SERVICES = [
  "Pernil",
  "Mesa dulce básica",
  "Mesa dulce premium",
  "Sándwich de jamón crudo en pan casero",
  "Cafetería",
  "Foto cabina y plataforma 360",
  "Foto cabina (2 horas)",
  "Plataforma 360",
  "Láser show",
  "Chispas frías (x2)",
  "Pistola de CO2",
  "Decoración de fondo de mesa principal o de fotos",
  "Letras, números y símbolos",
  "Living",
  "Sillón de mesa principal",
  "Muebles candy",
  "Pérgola para bodas",
] as const;

export const SALON_CONDITIONS: ReadonlyArray<string> = [
  "Eventos de día y de noche. El horario es flexible, con un total de 8 horas.",
  "Tope de finalización: 5:00 h. Consumición de alcohol hasta las 4:30 h, según las leyes vigentes.",
  "Mínimo a la cena: 100 personas adultas (con menos se cobra un adicional). Máximo: 250 personas.",
  "Los niños de hasta 10 años abonan el 50 % cuando hay 100 adultos.",
  "Menús especiales (vegetarianos, veganos, celíacos): se solicitan antes del evento, con nombre y apellido.",
  "Los precios se cotizan a valores del día y se reajustan según los precios de plaza a la fecha del evento.",
];

export const NOT_INCLUDED_AND_RULES: ReadonlyArray<string> = [
  "No incluye torta ni fotografía y video.",
  "No se puede tirar papel picado, pétalos de rosa, aerosoles que pintan ni golosinas (chicles).",
  "No se permiten bandas de música en vivo después de la 01:00 h.",
  "Prohibido realizar invitación masiva por redes.",
];
