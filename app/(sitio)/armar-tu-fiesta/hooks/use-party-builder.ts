"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, type FormEvent } from "react";
import { useForm, type DefaultValues, type FieldErrors, type Resolver } from "react-hook-form";
import { findHoliday, type Holiday } from "@/features/availability/holiday";
import type { AvailabilityResult } from "@/features/availability/availability-result";
import type { PartyRequestInput } from "@/features/party-requests/party-request-schema";
import { BUILDER_STEPS } from "../utils/builder-steps";

const DEFAULT_VALUES: DefaultValues<PartyRequestInput> = {
  customEventName: "",
  seatedMenu: { proposal: null, main: null, dessert: null },
  extras: [],
  eventDate: "",
  eventShift: "noche",
  meeting: { date: "", mode: "presencial" },
  contact: { name: "", phone: "" },
  notes: "",
};

/**
 * Estado del armador: el formulario (React Hook Form), el paso actual y la
 * última consulta de disponibilidad. Cada paso se valida solo con su propio
 * esquema, así los errores de pasos futuros no aparecen antes de tiempo.
 *
 * "Continuar" envía el paso con `handleSubmit`: los errores aparecen recién
 * al intentar avanzar y desde ahí cada campo se revalida al cambiar.
 *
 * Los feriados llegan del servidor: el salón no atiende reuniones esos días.
 */
export function usePartyBuilder(holidays: Holiday[]) {
  const [stepIndex, setStepIndex] = useState(0);
  const [availability, setAvailability] = useState<AvailabilityResult | null>(null);
  // El resolver lo invoca React Hook Form fuera del render, por eso lee el paso desde una ref.
  const stepIndexRef = useRef(0);

  const validateCurrentStep: Resolver<PartyRequestInput> = async (values, context, options) => {
    const { schema } = BUILDER_STEPS[stepIndexRef.current];
    if (!schema) return { values, errors: {} };

    const result = await zodResolver(schema)(values, context, options as never);
    const hasErrors = Object.keys(result.errors).length > 0;
    if (hasErrors) return { values: {}, errors: result.errors as FieldErrors<PartyRequestInput> };
    return { values, errors: {} };
  };

  const form = useForm<PartyRequestInput>({
    defaultValues: DEFAULT_VALUES,
    resolver: validateCurrentStep,
  });

  const currentStep = BUILDER_STEPS[stepIndex];

  function goToStep(index: number) {
    // Conserva lo elegido pero limpia errores y el estado "enviado" del paso anterior.
    form.reset(undefined, { keepValues: true, keepDefaultValues: true });
    stepIndexRef.current = index;
    setStepIndex(index);
  }

  function hasAvailabilityForSelectedDate() {
    return (
      availability?.date === form.getValues("eventDate") && availability.status === "available"
    );
  }

  function advanceIfStepIsComplete() {
    if (currentStep.id === "fecha" && !hasAvailabilityForSelectedDate()) {
      form.setError("eventDate", { message: "Consulta la disponibilidad de esta fecha antes de seguir." });
      return;
    }
    const meetingHoliday = currentStep.id === "reunion" ? findHoliday(holidays, form.getValues("meeting.date")) : null;
    if (meetingHoliday) {
      form.setError("meeting.date", { message: `Ese día es feriado (${meetingHoliday.name}) y no atendemos. Elige otro día.` });
      return;
    }
    goToStep(Math.min(stepIndex + 1, BUILDER_STEPS.length - 1));
  }

  function submitCurrentStep(event: FormEvent<HTMLFormElement>) {
    return form.handleSubmit(advanceIfStepIsComplete)(event);
  }

  function goToPreviousStep() {
    goToStep(Math.max(stepIndex - 1, 0));
  }

  return {
    form,
    stepIndex,
    currentStep,
    availability,
    setAvailability,
    goToStep,
    submitCurrentStep,
    goToPreviousStep,
  };
}
