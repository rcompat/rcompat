import entries from "#entries";
import assert from "@rcompat/assert";
import type { Dict } from "@rcompat/type";

function filter<T extends Dict>(
  dict: T,
  predicate: (k: keyof T, v: T[keyof T]) => boolean,
): Partial<T> {
  assert.dict(dict);
  assert.function(predicate);

  return Object.fromEntries(
    entries(dict).filter(([k, v]) => predicate(k, v)),
  ) as Partial<T>;
};

export default filter;
