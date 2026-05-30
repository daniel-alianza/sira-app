export function formatResolutionDuration(minutes: number | null | undefined): string | null {
  if (minutes === null || minutes === undefined) {
    return null;
  }

  if (minutes < 1) {
    return 'Menos de 1 minuto';
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${remainingMinutes} min`;
}
