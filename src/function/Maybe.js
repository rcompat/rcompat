import Nothing from "./Nothing.js";
import Just from "./Just.js";

export default class Maybe {
  #value;

  static nothing() {
    return new Maybe();
  }

  static just(value) {
    return new Maybe(value);
  }

  constructor(value) {
    this.#value = value;
  }

  #try(callback, fallback = Nothing.value) {
    try {
      if (this.isJust()) {
        return callback();
      }
    } catch (error) {}
    return fallback;
  }

  map(mapper) {
    return new Maybe(this.#try(() => mapper(this.#value)));
  }

  flatMap(mapper) {
    return this.map(mapper).get();
  }

  get() {
    return this.#value;
  }

  isNothing() {
    return Nothing.is(this.#value);
  }

  isJust() {
    return Just.is(this.#value);
  }
}
