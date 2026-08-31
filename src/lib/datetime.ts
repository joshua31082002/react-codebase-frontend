export function minutesBetween(start: Date, end: Date) {
  return Math.round((end.getTime() - start.getTime()) / 60000);
}

export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

export function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 86_400_000);
}

export function expandOccurrences(
  start: Date,
  end: Date,
  freq: "daily" | "weekly",
  count: number,
) {
  const stepDays = freq === "weekly" ? 7 : 1;
  const duration = end.getTime() - start.getTime();
  const occurrences: { start: Date; end: Date }[] = [];
  for (let i = 0; i < count; i += 1) {
    const occurrenceStart = addDays(start, i * stepDays);
    occurrences.push({
      start: occurrenceStart,
      end: new Date(occurrenceStart.getTime() + duration),
    });
  }
  return occurrences;
}

export function formatInTimeZone(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
