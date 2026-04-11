import assert from "@rcompat/assert";
import type { Dict } from "@rcompat/type";

function keys<T extends Dict>(dict: T): (keyof T)[] {
  assert.dict(dict);

  return Object.keys(dict) as (keyof T)[];
};

export default keys;
