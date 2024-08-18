import is from "@rcompat/invariant/is";

type Entry<T> = [PropertyKey, T];

const Entries = class Entries<T> {
  #entries: Entry<T>[];

  constructor(entries: Entry<T>[]) {
    is(entries).array();

    this.#entries = entries;
  }

  filter(predicate: (entry: Entry<T>) => boolean) {
    is(predicate).function();

    this.#entries = this.#entries.filter(predicate);
  }

  map<U>(mapper: (t: T) => U): Entries<U> {
    is(mapper).function();

    return new Entries(this.#entries.map(([key, value]) => [key, mapper(value)]));
  }

  get() {
    return Object.fromEntries(this.#entries);
  }
}

export default (object: Record<PropertyKey, unknown>) => 
  new Entries(Object.entries(object));
