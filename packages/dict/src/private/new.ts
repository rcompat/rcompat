import assert from "@rcompat/assert";
import type { Dict } from "@rcompat/type";

function $new<T extends Dict>(dict: T): Readonly<T> {
  assert.dict(dict);

  return Object.freeze(Object.assign(Object.create(null), dict));
}

export default $new;
