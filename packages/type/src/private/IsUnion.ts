type IsUnion<T> = (
  T extends unknown
    ? (x: T) => void
    : never
) extends (x: infer U) => void
  ? [T] extends [U]
    ? false
    : true
  : never;

export type { IsUnion as default };
