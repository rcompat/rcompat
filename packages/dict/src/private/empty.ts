import is from "@rcompat/assert/is";
import type Dict from "@rcompat/type/Dict";

export default (dict: Dict): boolean => {
  is(dict).object();

  return Object.keys(dict).length === 0;
};
