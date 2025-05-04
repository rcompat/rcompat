import type IndexedKeys from "#IndexedKeys";
import type Dictionary from "#Dictionary";
import type PrintEntries from "#PrintEntries";

type PrintRecord<T extends Dictionary> = IndexedKeys<T> extends true
  ? `{ ${PrintEntries<T>} }`
  : "{}"
;

export type { PrintRecord as default };
