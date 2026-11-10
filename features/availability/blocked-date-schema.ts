import { z } from "zod";
import {
  MAX_SHORT_TEXT,
  SHORT_TEXT_PATTERN,
  UNEXPECTED_CHARACTERS_MESSAGE,
} from "@/features/party-requests/party-request-schema";

/** Motivo opcional con el que el salón bloquea una fecha (feriado, evento externo…). */
export const blockReasonSchema = z
  .string()
  .trim()
  .max(MAX_SHORT_TEXT, `El motivo puede tener hasta ${MAX_SHORT_TEXT} caracteres.`)
  .regex(SHORT_TEXT_PATTERN, UNEXPECTED_CHARACTERS_MESSAGE);
