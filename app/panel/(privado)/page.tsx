import Link from "next/link";
import { requirePanelSession } from "@/features/panel-auth/panel-session";
import { partyRequestRepository } from "@/features/party-requests/party-request-repository";
import { formatLongDate, toIsoDate } from "@/features/utils/calendar-dates";
import { MonthlyRequestsChart } from "./components/monthly-requests-chart";
import { SummaryCard } from "./components/summary-card";
import { UpcomingList } from "./components/upcoming-list";
import { buildDashboardSummary, describeMeetingMode } from "./utils/build-dashboard-summary";

function describeAge(days: number) {
  if (days === 0) return "La más vieja llegó hoy";
  return `La más vieja espera hace ${days} ${days === 1 ? "día" : "días"}`;
}

export default async function PanelSummaryPage() {
  await requirePanelSession();

  const requests = await partyRequestRepository.listNewestFirst();
  const summary = buildDashboardSummary({ requests, today: toIsoDate(new Date()) });
  const { confirmationRate } = summary;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-semibold tracking-tight">Resumen</h1>
        <p className="mt-2 text-muted">Lo que necesita atención y lo que viene.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Consultas nuevas"
          value={String(summary.newCount)}
          detail={summary.oldestNewAgeDays === null ? "Todo atendido" : describeAge(summary.oldestNewAgeDays)}
          href="/panel/consultas?estado=nueva"
        />
        <SummaryCard
          title="Reuniones en 14 días"
          value={String(summary.upcomingMeetings.length)}
          href="/panel/calendario"
        />
        <SummaryCard
          title="Fiestas confirmadas (90 días)"
          value={String(summary.upcomingParties.length)}
          detail={
            confirmationRate === null
              ? undefined
              : `${Math.round(confirmationRate * 100)}% de las consultas cerradas se confirmaron`
          }
          href="/panel/calendario"
        />
      </div>

      {summary.dateConflicts.length > 0 && (
        <section role="alert" className="rounded-2xl border border-danger/30 bg-danger/5 p-5">
          <h2 className="font-semibold text-danger">Fechas ya tomadas por otra fiesta</h2>
          <p className="mt-1 text-sm text-muted">
            Estas consultas siguen abiertas para un día en que ya hay una fiesta confirmada. Avísales o cámbialas de fecha.
          </p>
          <ul className="mt-3 space-y-1">
            {summary.dateConflicts.map((request) => (
              <li key={request.id}>
                <Link href={`/panel/consultas/${request.id}`} className="font-semibold underline-offset-4 hover:underline">
                  {request.contact.name}
                </Link>
                <span className="text-muted"> · {formatLongDate(request.eventDate)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <UpcomingList
          title="Próximas reuniones"
          emptyText="No hay reuniones en los próximos 14 días."
          items={summary.upcomingMeetings.map(({ request, meeting, isAgreed }) => ({
            id: request.id,
            href: `/panel/consultas/${request.id}`,
            title: request.contact.name,
            detail: `${formatLongDate(meeting.date)}, ${meeting.time} h · ${describeMeetingMode(meeting)}${isAgreed ? "" : " · sin confirmar horario"}`,
          }))}
        />
        <UpcomingList
          title="Próximas fiestas confirmadas"
          emptyText="No hay fiestas confirmadas en los próximos 90 días."
          items={summary.upcomingParties.map((request) => ({
            id: request.id,
            href: `/panel/consultas/${request.id}`,
            title: request.contact.name,
            detail: `${formatLongDate(request.eventDate)} · ${request.guestCount} invitados`,
          }))}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <MonthlyRequestsChart months={summary.monthlyRequests} />
        <section className="rounded-2xl border border-line bg-night p-5">
          <h2 className="font-display text-xl font-semibold">Consultas por tipo de evento</h2>
          {summary.requestsByEventType.length === 0 ? (
            <p className="mt-3 text-muted">Todavía no hay consultas.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {summary.requestsByEventType.map(({ label, count }) => (
                <li key={label} className="flex justify-between py-2">
                  <span>{label}</span>
                  <span className="tabular-nums text-muted">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
