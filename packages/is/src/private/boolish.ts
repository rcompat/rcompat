import type Boolish from "@rcompat/type/Boolish";

export default function isBoolish(x: unknown): x is Boolish {
  return x === "true" || x === "false";
}
