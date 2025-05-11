export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const padded = (num: number) => String(num).padStart(2, "0");

  return `${padded(hrs)}:${padded(mins)}:${padded(secs)}`;
}
