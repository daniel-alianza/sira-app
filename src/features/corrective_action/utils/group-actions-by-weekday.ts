import type { CorrectiveActionItem } from '../interfaces';

export interface ActionDayGroup {
  readonly weekdayLabel: string;
  readonly tourDate: string;
  readonly actions: CorrectiveActionItem[];
}

export function groupActionsByWeekday(actions: CorrectiveActionItem[]): ActionDayGroup[] {
  const groupsMap = new Map<string, ActionDayGroup>();

  for (const action of actions) {
    const groupKey = `${action.weekdayOrder}-${action.tourDate}`;
    const existing = groupsMap.get(groupKey);

    if (existing) {
      groupsMap.set(groupKey, {
        ...existing,
        actions: [...existing.actions, action],
      });
      continue;
    }

    groupsMap.set(groupKey, {
      weekdayLabel: action.weekdayLabel,
      tourDate: action.tourDate,
      actions: [action],
    });
  }

  return [...groupsMap.values()].sort((left, right) => {
    const orderLeft = left.actions[0]?.weekdayOrder ?? 0;
    const orderRight = right.actions[0]?.weekdayOrder ?? 0;
    return orderRight - orderLeft;
  });
}
