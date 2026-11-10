import type { ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

type ChoiceCardProps = {
  registration: UseFormRegisterReturn;
  value: string;
  children: ReactNode;
};

/**
 * Opción seleccionable con aspecto de tarjeta. Es un radio nativo envuelto en
 * su label: toda la tarjeta es clickeable y funciona con teclado (flechas).
 */
export function ChoiceCard({ registration, value, children }: ChoiceCardProps) {
  return (
    <label className="flex min-h-11 cursor-pointer flex-col gap-1 rounded-2xl border border-line bg-night p-4 transition-[border-color,background-color] duration-150 has-checked:border-gold has-checked:bg-gold-dim has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-gold [@media(hover:hover)]:hover:border-gold/60">
      <input type="radio" value={value} className="sr-only" {...registration} />
      {children}
    </label>
  );
}
