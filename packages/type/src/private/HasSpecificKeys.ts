// true when the keys are concrete (e.g. "ok"),
// not broad (e.g. string) nor empty
type HasSpecificKeys<T> =
  [keyof T] extends [never] ? false
  : [string] extends [keyof T] ? false
  : true;

export type { HasSpecificKeys as default };
