import { z } from "zod";

const MAX_NOTE_LENGTH = 1000;

/** Nota interna del salón. Solo se muestra en el panel, escapada por React. */
export const internalNoteSchema = z
  .string()
  .trim()
  .min(1, "Escribe la nota.")
  .max(MAX_NOTE_LENGTH, `La nota puede tener hasta ${MAX_NOTE_LENGTH} caracteres.`);
