import type Dict from "#Dict";

type IndexedKeys<T extends Dict> =
  Extract<keyof T, number | string> extends never ? false : true;

export type { IndexedKeys as default };
