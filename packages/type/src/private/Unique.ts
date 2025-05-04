type Unique<T extends readonly string[], Accumulator extends string[] = []> =
  T extends [infer Head extends string, ...infer Rest extends string[]]
    ? Head extends Accumulator[number]
      ? Unique<Rest, Accumulator>
      : Unique<Rest, [...Accumulator, Head]>
    : Accumulator;

export type { Unique as default };
