import { useFormContext } from "react-hook-form";
import { EVENT_TYPES } from "@/features/catalog/party-options";
import { SALON } from "@/features/catalog/salon";
import type { PartyRequestInput } from "@/features/party-requests/party-request-schema";
import { ChoiceCard } from "./choice-card";
import { ChoiceGroup } from "./choice-group";
import { TextField } from "./text-field";

export function EventStep() {
  const { register, watch, formState } = useFormContext<PartyRequestInput>();
  const { errors } = formState;
  const { minGuests, minAdultsWithoutSurcharge, maxGuests } = SALON.capacity;
  const isCustomEvent = watch("eventType") === "otro";

  return (
    <div className="space-y-8">
      <ChoiceGroup legend="¿Qué quieres celebrar?" error={errors.eventType?.message}>
        {EVENT_TYPES.map((eventType) => (
          <ChoiceCard key={eventType.id} registration={register("eventType")} value={eventType.id}>
            <span className="font-semibold">{eventType.label}</span>
          </ChoiceCard>
        ))}
      </ChoiceGroup>

      {isCustomEvent && (
        <TextField
          label="¿Qué evento es?"
          placeholder="Ej.: reunión familiar, despedida, cena de fin de año…"
          autoComplete="off"
          error={errors.customEventName?.message}
          {...register("customEventName")}
        />
      )}

      <div>
        <TextField
          label="Cantidad de invitados adultos a la cena"
          type="number"
          inputMode="numeric"
          min={minGuests}
          max={maxGuests}
          placeholder={`De ${minGuests} a ${maxGuests}`}
          error={errors.guestCount?.message}
          className="max-w-xs"
          {...register("guestCount", { valueAsNumber: true })}
        />
        <p className="mt-2 text-sm text-muted">
          Con menos de {minAdultsWithoutSurcharge} adultos se cobra un adicional. Los niños de hasta 10
          años y los invitados al baile se cotizan aparte: cuéntanos cuántos son en los comentarios.
        </p>
      </div>
    </div>
  );
}
