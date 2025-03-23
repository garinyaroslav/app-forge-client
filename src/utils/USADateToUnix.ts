// export function USADateToISO(dateStr: string) {
export function USADateToUnix(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.toISOString();
}
