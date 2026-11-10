import {
  PARTY_REQUEST_STATUS_LABELS,
  type PartyRequestStatus,
} from "@/features/party-requests/party-request-status";

const STATUS_STYLES: Record<PartyRequestStatus, string> = {
  nueva: "bg-gold text-night",
  contactada: "bg-gold-dim text-gold-bright",
  "reunion-pactada": "bg-ok/15 text-ok",
  confirmada: "bg-ok text-night",
  descartada: "bg-line text-muted",
};

export function StatusBadge({ status }: { status: PartyRequestStatus }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${STATUS_STYLES[status]}`}>
      {PARTY_REQUEST_STATUS_LABELS[status]}
    </span>
  );
}
