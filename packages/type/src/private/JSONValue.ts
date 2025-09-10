type JSONPrimitive = boolean | null | number | string;

type JSONValue =
  | { readonly [key: string]: JSONValue }
  | JSONPrimitive
  | readonly JSONValue[];

export type { JSONValue as default };
