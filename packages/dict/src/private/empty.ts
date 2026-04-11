import assert from "@rcompat/assert";
import type { Dict } from "@rcompat/type";

function empty(dict: Dict): boolean {
  assert.dict(dict);

  return Object.keys(dict).length === 0;
};

export default empty;
