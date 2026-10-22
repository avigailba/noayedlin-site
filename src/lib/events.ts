import type { CollectionEntry } from 'astro:content';

export type EventEntry = CollectionEntry<'events'>;

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function parseDate(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** `Nov 4`, `Nov 12–13`, `Nov 30–Dec 2`; with a year: `Mar 18, 2025`. */
export function fmtShortDate(startStr: string, endStr?: string | null, showYear = false): string {
  const start = parseDate(startStr);
  const end = endStr ? parseDate(endStr) : null;
  let out = `${MONTHS_SHORT[start.getMonth()]} ${start.getDate()}`;
  if (end) {
    out += start.getMonth() === end.getMonth()
      ? `–${end.getDate()}`
      : `–${MONTHS_SHORT[end.getMonth()]} ${end.getDate()}`;
  }
  return showYear ? `${out}, ${(end ?? start).getFullYear()}` : out;
}

/** `Baltimore, MD`, or just `Online` when there is no region. */
export function fmtLocation(city: string, region?: string | null): string {
  return [city, region].filter(Boolean).join(', ');
}

export function lastDay(e: EventEntry): Date {
  return parseDate(e.data.date_end ?? e.data.date_start);
}

export function isPast(e: EventEntry, today = new Date()): boolean {
  const t = new Date(today); t.setHours(0, 0, 0, 0);
  return e.data.status === 'past' || lastDay(e) < t;
}

export function byDate(a: EventEntry, b: EventEntry): number {
  const diff = a.data.date_start.localeCompare(b.data.date_start);
  return diff !== 0 ? diff : (a.data.order ?? 99) - (b.data.order ?? 99);
}
