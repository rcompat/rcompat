import type Dictionary from "#Dictionary";

type IndexedKeys<T extends Dictionary> =
  Extract<keyof T, string | number> extends never ? false : true;

export type { IndexedKeys as default };
