import { useFormContext } from "react-hook-form";
import { EXTRA_SERVICES } from "@/features/catalog/salon";
import type { PartyRequestInput } from "@/features/party-requests/party-request-schema";

export function ExtrasField() {
  const { register } = useFormContext<PartyRequestInput>();

  return (
    <fieldset>
      <legend className="font-semibold">
        Servicios extra <span className="font-normal text-muted">(opcional)</span>
      </legend>
      <p className="mt-1 mb-3 text-sm text-muted">Marca los que te interesan y los cotizamos en la reunión.</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {EXTRA_SERVICES.map((extra) => (
          <label
            key={extra}
            className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-line px-4 py-2 text-sm transition-[border-color,background-color] duration-150 has-checked:border-gold has-checked:bg-gold-dim has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-gold"
          >
            <input type="checkbox" value={extra} className="size-4 accent-gold" {...register("extras")} />
            {extra}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
