import { useId, type ReactNode } from "react";

type ChoiceGroupProps = {
  legend: string;
  error?: string;
  children: ReactNode;
};

/** Agrupa opciones de radio con su título y el error pegado al grupo. */
export function ChoiceGroup({ legend, error, children }: ChoiceGroupProps) {
  const errorId = useId();

  return (
    <fieldset aria-describedby={error ? errorId : undefined} aria-invalid={Boolean(error)}>
      <legend className="mb-3 font-semibold">{legend}</legend>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
      {error && (
        <p id={errorId} className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}
