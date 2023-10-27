import assert from "./assert.js";

const test = ({ condition, def, error }) => assert(condition, error || def);

export default class Every {
  #values;

  constructor(...values) {
    this.#values = values;
  }

  #test(...args) {
    test(...args);
    return this.#values;
  }

  #typeof(type, error) {
    const def = `all the values must be of type ${type}`;
    const condition = this.#values.every(v => typeof v === type);
    return this.#test({ condition, def, error });
  }

  string(error) {
    return this.#typeof("string", error);
  }

  number(error) {
    return this.#typeof("number", error);
  }

  bigint(error) {
    return this.#typeof("bigint", error);
  }

  boolean(error) {
    return this.#typeof("boolean", error);
  }

  symbol(error) {
    return this.#typeof("symbol", error);
  }

  function(error) {
    return this.#typeof("function", error);
  }

  integer(error) {
    const def = "all the values must be integers";
    const condition = this.#values.every(v => Number.isInteger(v));
    return this.#test({ condition, def, error });
  }

  // (signed) integers
  isize(error) {
    return this.integer(error);
  }

  // unsigned (positive) integer
  usize(error) {
    const def = "all the values must be positive integers";
    const condition = this.#values.every(v => Number.isInteger(v) && v > 0);
    return this.#test({ condition, def, error });
  }
}
