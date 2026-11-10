const ARGENTINA_MOBILE_PREFIX = "549";

/**
 * Convierte un teléfono tal como lo escribió la persona ("11 2345 6789",
 * "+54 9 11…") al formato de wa.me. Es una aproximación: asume celulares de
 * Argentina cuando no viene el código de país.
 */
export function toWhatsappNumber(phone: string) {
  const digits = phone.replace(/\D/g, "").replace(/^0/, "");
  return digits.startsWith("54") ? digits : `${ARGENTINA_MOBILE_PREFIX}${digits}`;
}
