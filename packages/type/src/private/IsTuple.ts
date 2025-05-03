type IsTuple<T> =
  [T] extends [readonly [...infer Elements]]
    ? number extends Elements["length"]
      ? false
      : true
    : false;

export type { IsTuple as default };
