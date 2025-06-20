import is from "@rcompat/assert/is";
import maybe from "@rcompat/assert/maybe";

class Cache {
  #entries: Record<symbol, unknown> = {};

  get<Contents>(key: symbol, init?: () => Contents) {
    is(key).symbol();
    maybe(init).function();

    if (this.#entries[key] === undefined && init !== undefined) {
      this.#entries[key] = init();
    }
    return this.#entries[key] as Contents;
  }
}

export default new Cache();
