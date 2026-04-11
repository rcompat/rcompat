import assert from "@rcompat/assert";
import type { Dict } from "@rcompat/type";

function values<T extends Dict>(dict: T): T[keyof T][] {
  assert.dict(dict);

  return Object.values(dict) as T[keyof T][];
};

export default values;
