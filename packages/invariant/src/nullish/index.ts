export type Nullish = null | undefined;

export default (value: unknown): value is Nullish =>
  value === undefined || value === null;
