const longDateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

const compactDateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "UTC",
});

function toUtcDate(date: string): Date {
  return new Date(`${date}T00:00:00Z`);
}

export function formatDate(date: string): string {
  return longDateFormatter.format(toUtcDate(date));
}

export function formatCompactDate(date: string): string {
  return compactDateFormatter.format(toUtcDate(date)).replaceAll("/", ".");
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} 分钟阅读`;
}

export function cx(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ");
}
