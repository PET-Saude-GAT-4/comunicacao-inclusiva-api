export function isEmpty(obj: object): boolean {
  return Object.values(obj).every((v) => v === undefined);
}
