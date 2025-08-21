type Some<T extends readonly boolean[]> =
  T extends readonly [infer First, ...infer Rest extends boolean[]]
  ? First extends true ? true : Some<Rest>
  : false
  ;

export type { Some as default };
