import type ErrorFunction from "#ErrorFallbackFunction";

type Condition = (x: unknown, error?: ErrorFunction | string) => boolean;

export type { Condition as default };
