type Unpack<T> = { [K in keyof T]: T[K] } & {};

export type { Unpack as default };
