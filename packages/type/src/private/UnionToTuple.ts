type UnionToIntersection<U> = (U extends unknown
  ? (x: U) => void
  : never) extends ((x: infer I) => void) ? I : never;

type LastOf<U> = UnionToIntersection<U extends unknown
  ? () => U 
  : never> extends () => infer R ? R : never

type UnionToTuple<U, T extends unknown[] = []> = [U] extends [never]
  ? T
  : UnionToTuple<Exclude<U, LastOf<U>>, [LastOf<U>, ...T]>;

export type { UnionToTuple as default };
