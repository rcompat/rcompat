import type Nullish from "@rcompat/type/Nullish";

export default function isNullish(x: unknown): x is Nullish {
  return x === null || x === undefined;
}
