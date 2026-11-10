import type { AgreedMeeting } from "@/features/party-requests/agreed-meeting-schema";
import { PANEL_FIELD_CLASS } from "../../../utils/panel-field-class";

type AgreedMeetingFieldsProps = {
  idPrefix: string;
  defaultMeeting: AgreedMeeting;
};

/** Fecha y hora de la reunión; sin estado propio para que sirva dentro de cualquier formulario. */
export function AgreedMeetingFields({ idPrefix, defaultMeeting }: AgreedMeetingFieldsProps) {
  return (
    <div className="space-y-3">
      {/* Las reuniones son siempre en el salón: la modalidad viaja fija. */}
      <input type="hidden" name="meetingMode" value="presencial" />
      <div>
        <label htmlFor={`${idPrefix}-date`} className="mb-1 block text-sm text-muted">
          Día
        </label>
        <input
          id={`${idPrefix}-date`}
          name="meetingDate"
          type="date"
          defaultValue={defaultMeeting.date}
          className={PANEL_FIELD_CLASS}
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-time`} className="mb-1 block text-sm text-muted">
          Hora
        </label>
        <input
          id={`${idPrefix}-time`}
          name="meetingTime"
          type="time"
          defaultValue={defaultMeeting.time}
          className={PANEL_FIELD_CLASS}
        />
      </div>
    </div>
  );
}
