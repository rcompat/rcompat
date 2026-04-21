import assert from "@rcompat/assert";
import type { Dict } from "@rcompat/type";

function has<D extends Dict>(dict: D, key: PropertyKey): key is keyof D {
  assert.dict(dict);
  return Object.hasOwn(dict, key);
}

export default has;
