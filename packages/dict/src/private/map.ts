import entries from "#entries";
import assert from "@rcompat/assert";
import type { Dict } from "@rcompat/type";

export default <T extends Dict, U>(
  dict: T,
  mapper: (k: keyof T, v: T[keyof T]) => U,
): { [K in keyof T]: U } => {
  assert.dict(dict);
  assert.function(mapper);

  return Object.fromEntries(
    (entries(dict) as [keyof T & string, T[keyof T]][])
      .map(([k, v]) => [k, mapper(k, v)]),
  ) as { [K in keyof T]: U };
};
