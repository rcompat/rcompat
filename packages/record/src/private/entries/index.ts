import Entries from "./Entries.js";

export default <K extends string, V>(record: Record<K, V>): Entries<K, V> =>
  new Entries(Object.entries(record)) as never;
