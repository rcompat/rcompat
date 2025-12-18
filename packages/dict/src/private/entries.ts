import assert from "@rcompat/assert";
import type { Entry } from "@rcompat/type";

class Entries<K extends string, V> {
  #entries: Entry<K, V>[];

  constructor(entries: Entry<K, V>[]) {
    assert.array(entries);

    this.#entries = entries;
  }

  filter<U extends V>(predicate: (entry: Entry<K, V>) => entry is Entry<K, U>): Entries<K, U>;
  filter(predicate: (entry: Entry<K, V>) => boolean): Entries<K, V>;
  filter(predicate: (entry: Entry<K, V>) => boolean): Entries<K, V> {
    assert.function(predicate);

    return new Entries(this.#entries.filter(predicate));
  }

  map<U>(mapper: (entry: Entry<K, V>) => Entry<K, U>): Entries<K, U> {
    assert.function(mapper);

    return new Entries(this.#entries.map(mapper));
  }

  keymap(mapper: (entry: Entry<K, V>) => K): Entries<K, V> {
    assert.function(mapper);

    return new Entries(this.#entries.map(entry => [mapper(entry), entry[1]]));
  }

  valmap<U>(mapper: (entry: Entry<K, V>) => U): Entries<K, U> {
    assert.function(mapper);

    return new Entries(this.#entries.map(entry => [entry[0], mapper(entry)]));
  }

  get(): Record<K, V> {
    return Object.fromEntries(this.#entries) as never;
  }

  [Symbol.iterator](): IterableIterator<Entry<K, V>> {
    return this.#entries.values();
  }
}

export default <K extends string, V>(record: Record<K, V>): Entries<K, V> =>
  new Entries(Object.entries(record)) as never;
