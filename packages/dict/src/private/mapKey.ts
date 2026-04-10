import entries from "#entries";
import assert from "@rcompat/assert";
import type { Dict } from "@rcompat/type";

export default function mapKey<T extends Dict>(
  dict: T,
  mapper: (k: keyof T, v: T[keyof T]) => string,
): Dict<T[keyof T]> {
  assert.dict(dict);
  assert.function(mapper);

  return Object.fromEntries(
    (entries(dict) as [keyof T & string, T[keyof T]][])
      .map(([k, v]) => [mapper(k, v), v]));
};
