import type { DashboardAiHighlight, DashboardKpis } from '../interfaces';

const LEADING_FORMAL_ADDRESS_PATTERN =
  /^(?:(?:estimad[oa]\s+)?(?:señoría|señor|señora|señorita)(?:\s+[a-záéíóúñ]+)?[,:\s-]+)+/iu;

const INLINE_FORMAL_ADDRESS_PATTERN =
  /\b(?:señoría|señor|señora|señorita)\s+[a-záéíóúñ]+[,]?\s*/giu;

function capitalizeFirstLetter(text: string): string {
  if (text.length === 0) {
    return text;
  }

  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}

export function stripFormalGreeting(text: string): string {
  let result = text.trim().replace(INLINE_FORMAL_ADDRESS_PATTERN, '');

  while (LEADING_FORMAL_ADDRESS_PATTERN.test(result)) {
    result = result.replace(LEADING_FORMAL_ADDRESS_PATTERN, '').trim();
  }

  result = result.replace(/\s{2,}/g, ' ').trim();

  if (result.length === 0) {
    return text.trim();
  }

  return capitalizeFirstLetter(result);
}

export function buildDashboardAiHighlightsFromKpis(
  kpis: DashboardKpis,
): DashboardAiHighlight[] {
  const highlights: DashboardAiHighlight[] = [
    {
      label: 'Acciones totales',
      value: String(kpis.totalActions),
      tone: 'neutral',
    },
    {
      label: 'Abiertas',
      value: String(kpis.openActions),
      tone: kpis.openActions > 0 ? 'warning' : 'neutral',
    },
    {
      label: 'Vencidas',
      value: String(kpis.expiredActions),
      tone: kpis.expiredActions > 0 ? 'warning' : 'success',
    },
    {
      label: 'Cerradas',
      value: String(kpis.closedActions),
      tone: kpis.closedActions > 0 ? 'success' : 'neutral',
    },
  ];

  if (kpis.pendingAcceptance > 0) {
    highlights.push({
      label: 'Pend. aceptación',
      value: String(kpis.pendingAcceptance),
      tone: 'warning',
    });
  }

  return highlights.slice(0, 4);
}
