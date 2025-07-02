import type Boolish from "@rcompat/type/Boolish";

export default (value: string): value is Boolish =>
  value === "true" || value === "false";
