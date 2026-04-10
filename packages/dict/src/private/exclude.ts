import filter from "#filter";
import assert from "@rcompat/assert";
import type { Dict } from "@rcompat/type";

export default <T extends Dict, const E extends keyof T>(
  dict: T,
  excludes: readonly E[],
): Omit<T, E> => {
  assert.dict(dict);
  assert.array(excludes);

  return filter(dict, key => !excludes.includes(key as E)) as Omit<T, E>;
};
