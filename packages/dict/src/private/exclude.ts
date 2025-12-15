import entries from "#entries";
import is from "@rcompat/assert/is";
import type Dict from "@rcompat/type/Dict";

export default <T extends Dict, const E extends keyof T>
  (dict: T, excludes: readonly E[]): Omit<T, E> => {
  is(dict).object();
  is(excludes).array();

  return entries(dict)
    .filter(entry => !excludes.includes(entry[0] as E))
    .get() as never;
};
