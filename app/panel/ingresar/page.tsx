import { LogInForm } from "./components/log-in-form";

export default function PanelLogInPage() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16">
      <p className="font-display text-3xl font-semibold">El Hornero</p>
      <p className="mt-1 mb-8 text-muted">Panel de consultas del salón</p>
      <LogInForm />
    </div>
  );
}
