import entries from "#entries";
import assert from "@rcompat/assert";
import type { Dict } from "@rcompat/type";

export default <T extends Dict, const E extends keyof T>
  (dict: T, excludes: readonly E[]): Omit<T, E> => {
  assert.dict(dict);
  assert.array(excludes);

  return entries(dict)
    .filter(entry => !excludes.includes(entry[0] as E))
    .get() as never;
};
