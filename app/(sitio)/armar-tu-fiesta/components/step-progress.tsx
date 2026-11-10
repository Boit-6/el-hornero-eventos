import { BUILDER_STEPS } from "../utils/builder-steps";

type StepProgressProps = {
  currentIndex: number;
  onStepSelect: (index: number) => void;
};

/** Barra de pasos. Solo deja volver a pasos ya completados. */
export function StepProgress({ currentIndex, onStepSelect }: StepProgressProps) {
  return (
    <nav aria-label="Pasos para armar tu fiesta">
      <ol className="grid grid-cols-6 gap-1.5">
        {BUILDER_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <li key={step.id}>
              <button
                type="button"
                disabled={!isCompleted}
                onClick={() => onStepSelect(index)}
                aria-current={isCurrent ? "step" : undefined}
                className="group flex w-full flex-col gap-2 py-2 text-left disabled:cursor-default"
              >
                <span
                  className={`h-1.5 rounded-full transition-colors duration-200 ${
                    index <= currentIndex ? "bg-gold" : "bg-line"
                  }`}
                />
                <span
                  className={`hidden text-xs sm:block ${
                    isCurrent ? "font-semibold text-ivory" : "text-muted"
                  } ${isCompleted ? "group-hover:text-ivory" : ""}`}
                >
                  {step.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="mt-1 text-sm text-muted sm:hidden">
        Paso {currentIndex + 1} de {BUILDER_STEPS.length}: {BUILDER_STEPS[currentIndex].label}
      </p>
    </nav>
  );
}
