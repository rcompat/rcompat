import errors from "#errors";

export type Code = keyof typeof errors;
export const Code = Object.fromEntries(
  Object.keys(errors).map(k => [k, k])) as { [K in keyof typeof errors]: K };
