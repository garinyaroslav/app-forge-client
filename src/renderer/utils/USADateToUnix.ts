export function USADateToUnix(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return Math.floor(date.getTime() / 1000);
}
