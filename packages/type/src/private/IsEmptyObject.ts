type IsEmptyObject<T> =
  [keyof T] extends [never]
    ? T extends object
      ? T extends { constructor: Function } // <- class-like instances
        ? false
        : true
      : false
    : false;

export type { IsEmptyObject as default };
