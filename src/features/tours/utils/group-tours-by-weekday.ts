import type { TourCorrectiveActionRow, TourDayGroup } from '../interfaces';

export function groupToursByWeekday(rows: TourCorrectiveActionRow[]): TourDayGroup[] {
  const groupsMap = new Map<string, TourDayGroup>();

  for (const row of rows) {
    const groupKey = `${row.weekdayOrder}-${row.tourDate}`;
    const existing = groupsMap.get(groupKey);

    if (existing) {
      groupsMap.set(groupKey, {
        ...existing,
        rows: [...existing.rows, row],
      });
      continue;
    }

    groupsMap.set(groupKey, {
      weekdayLabel: row.weekdayLabel,
      tourDate: row.tourDate,
      rows: [row],
    });
  }

  return [...groupsMap.values()].sort((a, b) => {
    const orderA = a.rows[0]?.weekdayOrder ?? 0;
    const orderB = b.rows[0]?.weekdayOrder ?? 0;
    return orderA - orderB;
  });
}
