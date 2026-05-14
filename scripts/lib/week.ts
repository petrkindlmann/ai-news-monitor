// ISO 8601 week number — week starts Monday, week 1 contains the first Thursday.
export function isoWeek(date: Date): { year: number; week: number } {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((+d - +yearStart) / 86400000 + 1) / 7);
  return { year: d.getUTCFullYear(), week };
}

export function issueSlug(date: Date): string {
  const { year, week } = isoWeek(date);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

export function weekRange(date: Date): { start: string; end: string } {
  const end = new Date(date);
  const start = new Date(date);
  start.setUTCDate(start.getUTCDate() - 7);
  return { start: start.toISOString(), end: end.toISOString() };
}
