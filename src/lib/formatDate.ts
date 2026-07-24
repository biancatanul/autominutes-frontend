function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function formatDate(value: string | Date): string {
  const date = new Date(value);
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

export function formatDateTime(value: string | Date): string {
  const date = new Date(value);
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  return `${formatDate(date)}, ${time}`;
}