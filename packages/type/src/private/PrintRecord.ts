import type Dict from "#Dict";
import type IndexedKeys from "#IndexedKeys";
import type PrintEntries from "#PrintEntries";

type PrintRecord<T extends Dict> = IndexedKeys<T> extends true
  ? `{ ${PrintEntries<T>} }`
  : "{}"
  ;

export type { PrintRecord as default };
