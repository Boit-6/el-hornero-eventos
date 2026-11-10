import { agreedMeetingSchema } from "@/features/party-requests/agreed-meeting-schema";

/** Lee y valida los campos de la reunión acordada de un formulario del panel. */
export function readAgreedMeeting(formData: FormData) {
  return agreedMeetingSchema.safeParse({
    date: formData.get("meetingDate"),
    time: formData.get("meetingTime"),
    mode: formData.get("meetingMode"),
  });
}
