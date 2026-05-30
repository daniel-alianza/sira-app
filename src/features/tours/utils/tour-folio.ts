function randomSuffix(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export function createWalkthroughFolio(): string {
  return `REC-${new Date().getFullYear()}-${randomSuffix()}`;
}

export function createDetectionFolio(): string {
  return `DET-${new Date().getFullYear()}-${randomSuffix()}`;
}

export function formatTourTimestamp(date: Date): string {
  return date.toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
