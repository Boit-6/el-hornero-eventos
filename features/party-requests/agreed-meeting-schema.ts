import { z } from "zod";
import { MEETING_MODE_IDS } from "@/features/catalog/party-options";

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * Reunión que el salón acordó con la persona. A diferencia de la propuesta que
 * armó en la web, el horario es libre: puede quedar fuera de los turnos públicos.
 */
export const agreedMeetingSchema = z.object({
  date: z.iso.date({ error: "Elige el día de la reunión." }),
  time: z.string().regex(TIME_PATTERN, "Elige el horario de la reunión."),
  mode: z.enum(MEETING_MODE_IDS, { error: "Elige la modalidad." }),
});

export type AgreedMeeting = z.output<typeof agreedMeetingSchema>;
