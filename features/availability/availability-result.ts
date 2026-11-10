export type AvailabilityStatus = "available" | "unavailable" | "too-soon";

export type AvailabilityResult = {
  date: string;
  status: AvailabilityStatus;
  message: string;
};

export const MIN_DAYS_IN_ADVANCE = 7;
