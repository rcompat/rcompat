import type Unpack from "#Unpack";

type Undef = undefined;

type LooseOptional<T> = Unpack<
  { [K in keyof T as Undef extends T[K] ? K : never]?: Exclude<T[K], Undef> | undefined; } &
  { [K in keyof T as Undef extends T[K] ? never : K]: T[K]; }
>;

export type { LooseOptional as default };
