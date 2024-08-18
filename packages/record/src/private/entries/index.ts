import is from "@rcompat/invariant/is";

type Entry<T> = [PropertyKey, T];

class Entries<T> {
  #entries: Entry<T>[];

  constructor(entries: Entry<T>[]) {
    is(entries).array();

    this.#entries = entries;
  }

  filter(predicate: (entry: Entry<T>) => boolean): Entries<T> {
    is(predicate).function();

    return new Entries(this.#entries.filter(predicate));
  }

  map<U>(mapper: (entry: Entry<T>) => Entry<U>): Entries<U> {
    is(mapper).function();

    return new Entries(this.#entries.map(mapper));
  }

  mapKey(mapper: (value: T, key: PropertyKey) => PropertyKey): Entries<T> {
    is(mapper).function();

    return new Entries(this.#entries.map(([key, value]) =>
      [mapper(value, key), value]));
  }

  mapValue<U>(mapper: (value: T, key: PropertyKey) => U): Entries<U> {
    is(mapper).function();
    
    return new Entries(this.#entries.map(([key, value]) => [key,
      mapper(value, key)]));
  }

  get() {
    return Object.fromEntries(this.#entries);
  }
}

export default <T>(object: Record<PropertyKey, T>) => 
  new Entries(Object.entries(object));
