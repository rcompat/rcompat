type IsEmptyObject<T> =
  [keyof T] extends [never]
    ? T extends object
      ? true
      : false
    : false;

export type { IsEmptyObject as default };
