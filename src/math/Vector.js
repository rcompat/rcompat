import { assert, is, every } from "rcompat/invariant";

export default class Vector {
  #coordinates;

  constructor(...coordinates) {
    every(coordinates).number();
    assert(coordinates.length > 0);

    this.#coordinates = [...coordinates];
  }

  #map(mapper) {
    return new Vector(...this.#coordinates.map(mapper));
  }

  #reduce(reducer, initialValue) {
    return this.#coordinates.reduce(reducer, initialValue);
  }

  get length() {
    return Math.sqrt(this.#reduce((sum, x) => sum + x * x, 0));
  }

  get size() {
    return this.#coordinates.length;
  }

  add(other) {
    assert(this.size === other.size, "vectors must have the same length");
    return this.#map((x, i) => x + other.at(i));
  }

  // dot product
  multiply(by) {
    is(by).instance(Vector);
    return this.#reduce((product, x, i) => product + x * by.at(i), 0);
  }

  at(index) {
    is(index).number();
    return this.#coordinates.at(index);
  }

  toString() {
    return `{${this.#coordinates.join(",")}}`;
  }
}
