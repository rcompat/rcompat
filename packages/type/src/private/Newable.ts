type Newable<I = unknown, A extends any[] = any[]> = new (...args: A) => I;

export type { Newable as default };
