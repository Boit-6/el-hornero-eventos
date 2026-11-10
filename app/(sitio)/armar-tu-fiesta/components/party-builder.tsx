"use client";

import { useEffect, useRef } from "react";
import { FormProvider } from "react-hook-form";
import type { Holiday } from "@/features/availability/holiday";
import { usePartyBuilder } from "../hooks/use-party-builder";
import { DateStep } from "./date-step";
import { EventStep } from "./event-step";
import { MeetingStep } from "./meeting-step";
import { MenuStep } from "./menu-step";
import { ServiceStep } from "./service-step";
import { StepProgress } from "./step-progress";
import { SummaryStep } from "./summary-step";

export function PartyBuilder({ holidays }: { holidays: Holiday[] }) {
  const builder = usePartyBuilder(holidays);
  const { currentStep, stepIndex } = builder;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);
  const isLastStep = currentStep.id === "resumen";

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // Al cambiar de paso, el foco va al título: así lectores de pantalla y teclado no se pierden.
    headingRef.current?.focus({ preventScroll: true });
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    headingRef.current?.scrollIntoView({ block: "start", behavior: prefersReducedMotion ? "auto" : "smooth" });
  }, [stepIndex]);

  return (
    <FormProvider {...builder.form}>
      <div className="space-y-8">
        <StepProgress currentIndex={stepIndex} onStepSelect={builder.goToStep} />

        <form onSubmit={builder.submitCurrentStep} noValidate className="rounded-3xl border border-line bg-night p-5 sm:p-8">
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="scroll-mt-24 font-display text-3xl font-semibold tracking-tight outline-none"
          >
            {currentStep.title}
          </h2>

          <div className="mt-6">
            {currentStep.id === "evento" && <EventStep />}
            {currentStep.id === "servicio" && <ServiceStep />}
            {currentStep.id === "menu" && <MenuStep />}
            {currentStep.id === "fecha" && (
              <DateStep availability={builder.availability} onAvailabilityChecked={builder.setAvailability} />
            )}
            {currentStep.id === "reunion" && <MeetingStep />}
            {currentStep.id === "resumen" && <SummaryStep />}
          </div>

          <div className="mt-10 flex items-center justify-between gap-3 border-t border-line pt-6">
            <button
              type="button"
              onClick={builder.goToPreviousStep}
              disabled={stepIndex === 0}
              className="min-h-12 rounded-full px-5 font-semibold text-muted transition-colors duration-150 hover:text-ivory disabled:invisible"
            >
              Volver
            </button>
            {!isLastStep && (
              <button
                type="submit"
                className="min-h-12 rounded-full bg-gold px-7 font-semibold text-night transition-[background-color,transform] duration-150 hover:bg-gold-bright active:scale-[0.97]"
              >
                Continuar
              </button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
