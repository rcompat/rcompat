import type Unpack from "#Unpack";

type Undef = undefined;

type UndefinedToOptional<T> = Unpack<{
  [K in keyof T as Undef extends T[K] ? K : never]?: Exclude<T[K], Undef>;
} & {
  [K in keyof T as Undef extends T[K] ? never : K]: T[K];
}>;

export type { UndefinedToOptional as default };
