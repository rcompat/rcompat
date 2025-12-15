import type Dict from "#Dict";
import type IndexedKeys from "#IndexedKeys";
import type PrintEntries from "#PrintEntries";

type PrintDict<T extends Dict> = IndexedKeys<T> extends true
  ? `{ ${PrintEntries<T>} }`
  : "{}"
  ;

export type { PrintDict as default };
