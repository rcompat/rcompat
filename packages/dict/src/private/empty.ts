import assert from "@rcompat/assert";
import type { Dict } from "@rcompat/type";

export default (dict: Dict): boolean => {
  assert.dict(dict);

  return Object.keys(dict).length === 0;
};
