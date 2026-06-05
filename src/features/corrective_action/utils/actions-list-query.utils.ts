export const ACTIONS_LIST_ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const ACTIONS_LIST_UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isActionsListIsoDate(value: string): boolean {
  return ACTIONS_LIST_ISO_DATE_REGEX.test(value);
}

export function isActionsListUuid(value: string): boolean {
  return ACTIONS_LIST_UUID_REGEX.test(value);
}
