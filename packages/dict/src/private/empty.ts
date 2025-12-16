import assert from "@rcompat/assert";
import type Dict from "@rcompat/type/Dict";

export default (dict: Dict): boolean => {
  assert.dict(dict);

  return Object.keys(dict).length === 0;
};
