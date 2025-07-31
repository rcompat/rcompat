type JSONPrimitive = string | number | boolean | null;

type JSONValue =
  | JSONPrimitive
  | JSONValue[]
  | { [key: string]: JSONValue };

export type { JSONValue as default };
