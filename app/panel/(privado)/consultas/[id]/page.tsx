import Link from "next/link";
import { notFound } from "next/navigation";
import { blockedDateRepository } from "@/features/availability/blocked-date-repository";
import { requirePanelSession } from "@/features/panel-auth/panel-session";
import { describePartyRequest } from "@/features/party-requests/describe-party-request";
import { partyRequestRepository } from "@/features/party-requests/party-request-repository";
import { StatusBadge } from "../../components/status-badge";
import { formatCreatedAt } from "../../utils/format-created-at";
import { ActivityTimeline } from "./components/activity-timeline";
import { AgreedMeetingForm } from "./components/agreed-meeting-form";
import { NoteForm } from "./components/note-form";
import { StatusForm } from "./components/status-form";
import { toWhatsappNumber } from "./utils/to-whatsapp-number";

export default async function PanelRequestDetailPage({ params }: PageProps<"/panel/consultas/[id]">) {
  await requirePanelSession();

  const { id } = await params;
  const request = await partyRequestRepository.findById(id);
  if (!request) notFound();

  const [allRequests, activity, isEventDateBlocked] = await Promise.all([
    partyRequestRepository.listNewestFirst(),
    partyRequestRepository.listActivity(id),
    blockedDateRepository.isBlocked(request.eventDate),
  ]);
  const confirmedSameDate = allRequests.filter(
    (other) => other.id !== request.id && other.status === "confirmada" && other.eventDate === request.eventDate,
  );

  return (
    <div className="space-y-8">
      <Link href="/panel/consultas" className="text-sm text-muted hover:text-ivory">
        ← Volver a consultas
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">{request.contact.name}</h1>
          <p className="mt-2 text-muted">Recibida el {formatCreatedAt(request.createdAt)}</p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      {confirmedSameDate.length > 0 && (
        <p role="alert" className="rounded-2xl border border-danger/30 bg-danger/5 p-4 text-danger">
          Atención: ya hay {confirmedSameDate.length === 1 ? "otra consulta confirmada" : `${confirmedSameDate.length} consultas confirmadas`} para esta fecha.
        </p>
      )}

      {isEventDateBlocked && (
        <p role="alert" className="rounded-2xl border border-danger/30 bg-danger/5 p-4 text-danger">
          Atención: la fecha del evento está bloqueada en el calendario, así que no se puede confirmar.
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <dl className="divide-y divide-line rounded-2xl border border-line bg-night">
          {describePartyRequest(request).map((section) => (
            <div key={section.title} className="p-5">
              <dt className="font-display text-lg font-semibold text-gold">{section.title}</dt>
              <dd className="mt-2">
                <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-[10rem_1fr]">
                  {section.rows.map((row) => (
                    <div key={row.label} className="contents">
                      <dt className="text-sm text-muted">{row.label}</dt>
                      <dd className="mb-2 sm:mb-0">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </dd>
            </div>
          ))}
        </dl>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-line bg-night p-5">
            <StatusForm
              requestId={request.id}
              currentStatus={request.status}
              defaultMeeting={request.agreedMeeting ?? request.meeting}
            />
          </div>
          {request.status === "reunion-pactada" && request.agreedMeeting && (
            <div className="rounded-2xl border border-line bg-night p-5">
              <AgreedMeetingForm requestId={request.id} meeting={request.agreedMeeting} />
            </div>
          )}
          <div className="rounded-2xl border border-line bg-night p-5">
            <NoteForm requestId={request.id} />
          </div>
          <div className="flex flex-col gap-3">
            <a
              href={`https://wa.me/${toWhatsappNumber(request.contact.phone)}`}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#1f8f4e] px-5 text-sm font-semibold text-white"
            >
              Escribirle por WhatsApp
            </a>
            <a
              href={`/panel/consultas/${request.id}/pdf`}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-ivory/20 bg-night px-5 text-sm font-semibold"
            >
              Ver PDF
            </a>
          </div>
        </aside>
      </div>

      <ActivityTimeline activity={activity} receivedAt={request.createdAt} />
    </div>
  );
}
