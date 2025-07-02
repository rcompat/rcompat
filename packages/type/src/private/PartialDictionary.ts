import type Dictionary from "#Dictionary";

type PartialDictionary<T> = Dictionary<T | undefined>;

export { PartialDictionary as default };
