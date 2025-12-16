import assert from "@rcompat/assert";

class Cache {
  #entries: Record<symbol, unknown> = {};

  get<Contents>(key: symbol, init?: () => Contents) {
    assert.symbol(key);
    assert.maybe.function(init);

    if (this.#entries[key] === undefined && init !== undefined) {
      this.#entries[key] = init();
    }
    return this.#entries[key] as Contents;
  }
}

export default new Cache();
