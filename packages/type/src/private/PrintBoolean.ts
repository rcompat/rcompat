type PrintBoolean<T> = T extends "false" | "true" ? "boolean" : T;

export type { PrintBoolean as default };
