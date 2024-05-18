const number = (value: string): boolean => !Number.isNaN(Number.parseFloat(value))
  && Number.isFinite(Number(value));

const isNumeric = (value: string): boolean => typeof value === "string" && number(value);

export const numeric = (value: string): boolean => {
  try {
    return isNumeric(value);
  } catch (_) {
    return false;
  }
};

export type Boolish = "true" | "false";

export const boolish = (value: string): value is Boolish => value === "true" || value === "false";

export type Nullish = null | undefined;

export const nullish = (value: unknown): value is Nullish => value === undefined || value === null;
