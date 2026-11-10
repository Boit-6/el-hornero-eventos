import { z } from "zod";
import { checkDateAvailability } from "@/features/availability/check-date-availability";

const querySchema = z.object({ fecha: z.iso.date() });

/** GET /api/disponibilidad?fecha=AAAA-MM-DD */
export async function GET(request: Request) {
  const query = querySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!query.success) {
    return Response.json({ message: "Fecha inválida. Usa el formato AAAA-MM-DD." }, { status: 400 });
  }

  try {
    return Response.json(await checkDateAvailability(query.data.fecha));
  } catch (error) {
    console.error("Error al consultar la agenda del salón", error);
    return Response.json({ message: "No pudimos consultar la agenda. Prueba de nuevo." }, { status: 502 });
  }
}
