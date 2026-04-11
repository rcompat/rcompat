import assert from "@rcompat/assert";
import type { Dict } from "@rcompat/type";

function entries<T extends Dict>(dict: T): [keyof T, T[keyof T]][] {
  assert.dict(dict);

  return Object.entries(dict) as [keyof T, T[keyof T]][];
};

export default entries;
