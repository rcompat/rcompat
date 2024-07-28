export type Boolish = "true" | "false";

export default (value: string): value is Boolish =>
  value === "true" || value === "false";
