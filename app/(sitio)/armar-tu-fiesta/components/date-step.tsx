import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { EVENT_SHIFTS } from "@/features/catalog/party-options";
import { SALON } from "@/features/catalog/salon";
import type { AvailabilityResult } from "@/features/availability/availability-result";
import type { PartyRequestInput } from "@/features/party-requests/party-request-schema";
import { addDaysFromToday } from "@/features/utils/calendar-dates";
import { ChoiceCard } from "./choice-card";
import { ChoiceGroup } from "./choice-group";
import { TextField } from "./text-field";

type DateStepProps = {
  availability: AvailabilityResult | null;
  onAvailabilityChecked: (result: AvailabilityResult) => void;
};

const AVAILABILITY_STYLES: Record<AvailabilityResult["status"], string> = {
  available: "border-ok/40 bg-ok/10 text-ok",
  unavailable: "border-danger/30 bg-danger/5 text-danger",
  "too-soon": "border-danger/30 bg-danger/5 text-danger",
};

async function fetchAvailability(date: string): Promise<AvailabilityResult> {
  const response = await fetch(`/api/disponibilidad?fecha=${encodeURIComponent(date)}`);
  if (!response.ok) throw new Error(`Disponibilidad respondió ${response.status}`);
  return response.json();
}

export function DateStep({ availability, onAvailabilityChecked }: DateStepProps) {
  const { register, watch, clearErrors, formState } = useFormContext<PartyRequestInput>();
  const [isChecking, setIsChecking] = useState(false);
  const [checkFailed, setCheckFailed] = useState(false);
  const eventDate = watch("eventDate");
  const availabilityForDate = availability?.date === eventDate ? availability : null;

  async function handleCheckAvailability() {
    setIsChecking(true);
    setCheckFailed(false);
    try {
      onAvailabilityChecked(await fetchAvailability(eventDate));
      clearErrors("eventDate");
    } catch {
      setCheckFailed(true);
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-muted">
        Elige el día de tu fiesta y consulta si está disponible. Esto no reserva la fecha: la
        confirmamos juntos en la reunión.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <TextField
          label="Fecha del evento"
          type="date"
          min={addDaysFromToday(1)}
          error={formState.errors.eventDate?.message}
          className="sm:w-72"
          {...register("eventDate")}
        />
        <button
          type="button"
          onClick={handleCheckAvailability}
          disabled={!eventDate || isChecking}
          className="min-h-12 rounded-full border border-ivory/20 px-6 font-semibold transition-[border-color,transform,opacity] duration-150 hover:border-ivory/50 active:scale-[0.97] disabled:opacity-50 sm:mt-8"
        >
          {isChecking ? "Consultando…" : "Consultar disponibilidad"}
        </button>
      </div>

      <div aria-live="polite" className="min-h-14">
        {availabilityForDate && (
          <p className={`rounded-2xl border p-4 ${AVAILABILITY_STYLES[availabilityForDate.status]}`}>
            {availabilityForDate.message}
          </p>
        )}
        {checkFailed && (
          <p className="rounded-2xl border border-danger/30 bg-danger/5 p-4 text-danger">
            No pudimos consultar la agenda. Prueba de nuevo en unos segundos.
          </p>
        )}
      </div>

      <ChoiceGroup legend="¿De día o de noche?" error={formState.errors.eventShift?.message}>
        {EVENT_SHIFTS.map((shift) => (
          <ChoiceCard key={shift.id} registration={register("eventShift")} value={shift.id}>
            <span className="font-semibold">{shift.label}</span>
          </ChoiceCard>
        ))}
      </ChoiceGroup>
      <p className="text-sm text-muted">
        El horario es flexible, con un total de {SALON.eventDurationHours} horas. Tope de finalización:{" "}
        {SALON.closingTime} h.
      </p>
    </div>
  );
}
