import type Nullish from "@rcompat/type/Nullish";

export default (value: unknown): value is Nullish =>
  value === undefined || value === null;
