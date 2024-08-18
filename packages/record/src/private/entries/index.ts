const Entries = class Entries<T> {
  #entries: [PropertyKey, T][];

  constructor(object: Record<PropertyKey, T>) {
    this.#entries = Object.entries(object);
  }

  filter(predicate: (entry: [PropertyKey, T]) => boolean) {
    this.#entries = this.#entries.filter(predicate);
  }

  get() {
    return Object.fromEntries(this.#entries);
  }
}

export default (object: Record<PropertyKey, unknown>) => new Entries(object);
