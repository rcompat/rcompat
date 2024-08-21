import is from "@rcompat/invariant/is";

type Entry<K extends string, V> = [K, V];

class Entries<K extends string, V> {
  #entries: Entry<K, V>[];

  constructor(entries: Entry<K, V>[]) {
    is(entries).array();

    this.#entries = entries;
  }

  filter<U extends V>(predicate: (entry: Entry<K, V>) => entry is Entry<K, U>): Entries<K, U>;
  filter(predicate: (entry: Entry<K, V>) => boolean): Entries<K, V>;
  filter(predicate: (entry: Entry<K, V>) => boolean): Entries<K, V> {
    is(predicate).function();

    return new Entries(this.#entries.filter(predicate));
  }

  map<U>(mapper: (entry: Entry<K, V>) => Entry<K, U>): Entries<K, U> {
    is(mapper).function();

    return new Entries(this.#entries.map(mapper));
  }

  mapKey(mapper: (entry: Entry<K, V>) => K): Entries<K, V> {
    is(mapper).function();

    return new Entries(this.#entries.map(entry => [mapper(entry), entry[1]]));
  }

  mapValue<U>(mapper: (entry: Entry<K, V>) => U): Entries<K, U> {
    is(mapper).function();

    return new Entries(this.#entries.map(entry => [entry[0], mapper(entry)]));
  }

  get(): Record<K, V> {
    return Object.fromEntries(this.#entries) as never;
  }

  [Symbol.iterator](): IterableIterator<Entry<K, V>> {
    return this.#entries.values()
  }
}

export default <K extends string, V>(record: Record<K, V>): Entries<K, V> =>
  new Entries(Object.entries(record)) as never;
