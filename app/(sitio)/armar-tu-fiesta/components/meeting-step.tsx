import Link from "next/link";
import { useFormContext } from "react-hook-form";
import { MEETING_TIME_SLOTS } from "@/features/catalog/party-options";
import type { PartyRequestInput } from "@/features/party-requests/party-request-schema";
import { addDaysFromToday, parseIsoDate, toIsoDate } from "@/features/utils/calendar-dates";
import { ChoiceCard } from "./choice-card";
import { ChoiceGroup } from "./choice-group";
import { TextField } from "./text-field";

function getDayBefore(isoDate: string) {
  const date = parseIsoDate(isoDate);
  date.setDate(date.getDate() - 1);
  return toIsoDate(date);
}

export function MeetingStep() {
  const { register, getValues, formState } = useFormContext<PartyRequestInput>();
  const { errors } = formState;

  return (
    <div className="space-y-8">
      <p className="text-muted">
        Propón cuándo quieres que nos juntemos a hablar los detalles. Te respondemos por WhatsApp
        para coordinarlo. Atendemos de lunes a jueves, de 18:00 a 21:00 h.
      </p>

      <TextField
        label="Día de la reunión"
        type="date"
        min={addDaysFromToday(1)}
        max={getDayBefore(getValues("eventDate"))}
        error={errors.meeting?.date?.message}
        className="max-w-xs"
        {...register("meeting.date")}
      />

      <ChoiceGroup legend="Horario" error={errors.meeting?.time?.message}>
        {MEETING_TIME_SLOTS.map((time) => (
          <ChoiceCard key={time} registration={register("meeting.time")} value={time}>
            <span className="font-semibold tabular-nums">{time} h</span>
          </ChoiceCard>
        ))}
      </ChoiceGroup>

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          label="Tu nombre"
          autoComplete="name"
          error={errors.contact?.name?.message}
          {...register("contact.name")}
        />
        <TextField
          label="Tu teléfono"
          type="tel"
          autoComplete="tel"
          placeholder="261 555 5555"
          error={errors.contact?.phone?.message}
          {...register("contact.phone")}
        />
        <p className="text-sm text-muted sm:col-span-2">
          Usamos tu nombre y tu teléfono solo para responder esta consulta.{" "}
          <Link href="/privacidad" target="_blank" className="underline underline-offset-4 hover:text-ivory">
            Más sobre privacidad
          </Link>
        </p>
      </div>

      <div>
        <label htmlFor="notes" className="mb-2 block font-semibold">
          Comentarios <span className="font-normal text-muted">(opcional)</span>
        </label>
        <textarea
          id="notes"
          rows={3}
          placeholder="Niños hasta 10 años, invitados al baile, menús especiales, temática…"
          aria-invalid={Boolean(errors.notes)}
          className="w-full rounded-xl border border-line bg-night px-4 py-3 outline-none focus:border-gold focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold aria-invalid:border-danger"
          {...register("notes")}
        />
        {errors.notes && <p className="mt-2 text-sm text-danger">{errors.notes.message}</p>}
      </div>
    </div>
  );
}
