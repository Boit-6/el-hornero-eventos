import { useFormContext } from "react-hook-form";
import { SERVICE_STYLES } from "@/features/catalog/party-options";
import type { PartyRequestInput } from "@/features/party-requests/party-request-schema";
import { ChoiceCard } from "./choice-card";
import { ChoiceGroup } from "./choice-group";

export function ServiceStep() {
  const { register, formState } = useFormContext<PartyRequestInput>();

  return (
    <ChoiceGroup legend="¿Cómo quieres el servicio?" error={formState.errors.serviceStyle?.message}>
      {SERVICE_STYLES.map((style) => (
        <ChoiceCard key={style.id} registration={register("serviceStyle")} value={style.id}>
          <span className="font-display text-3xl font-semibold">{style.label}</span>
          <span className="text-sm text-muted">{style.summary}</span>
        </ChoiceCard>
      ))}
    </ChoiceGroup>
  );
}
