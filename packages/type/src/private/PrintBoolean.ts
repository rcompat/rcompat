type PrintBoolean<T> = T extends "true" | "false" ? "boolean" : T;

export type { PrintBoolean as default };
