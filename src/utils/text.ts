/** Quita tildes y pasa a minúsculas, para comparar texto sin distinguir acentos/mayúsculas. */
export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
