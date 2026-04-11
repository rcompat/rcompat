import assert from "@rcompat/assert";
import type { Dict } from "@rcompat/type";

function has(dict: Dict, value: PropertyKey): boolean {
  assert.dict(dict);

  return Object.hasOwn(dict, value);
}

export default has;
