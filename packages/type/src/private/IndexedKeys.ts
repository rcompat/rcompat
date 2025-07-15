import type Dict from "#Dict";

type IndexedKeys<T extends Dict> =
  Extract<keyof T, string | number> extends never ? false : true;

export type { IndexedKeys as default };
