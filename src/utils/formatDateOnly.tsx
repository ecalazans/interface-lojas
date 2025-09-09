export function formatDateOnly(dateString: string): string {
  return dateString.split(",")[0].trim();
}