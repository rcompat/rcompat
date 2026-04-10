import entries from "#entries";
import assert from "@rcompat/assert";
import type { Dict } from "@rcompat/type";

export default <T extends Dict>(
  dict: T,
  mapper: (k: keyof T, v: T[keyof T]) => [string, unknown] | [],
): Dict => {
  assert.dict(dict);
  assert.function(mapper);

  return Object.fromEntries(
    (entries(dict) as [keyof T & string, T[keyof T]][])
      .flatMap(([k, v]) => {
        const result = mapper(k, v);
        return result.length === 0 ? [] : [result];
      }),
  ) as Dict;
};
