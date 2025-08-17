type JSONPrimitive = boolean | null | number | string;

type JSONValue =
  | { [key: string]: JSONValue }
  | JSONPrimitive
  | JSONValue[];

export type { JSONValue as default };
