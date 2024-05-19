import { assert, is, every } from "rcompat/invariant";

type Reducer = (reduced: number, n: number, i: number) => number;

export default class Vector {
  #coordinates;

  constructor(...coordinates: number[]) {
    every(coordinates).number();
    assert(coordinates.length > 0);

    this.#coordinates = [...coordinates];
  }

  #map(mapper: (n: number, i: number) => number) {
    return new Vector(...this.#coordinates.map(mapper));
  }

  #reduce(reducer: Reducer, initialValue: number) {
    return this.#coordinates.reduce(reducer, initialValue);
  }

  get length() {
    return Math.sqrt(this.#reduce((sum, x) => sum + x * x, 0));
  }

  get size() {
    return this.#coordinates.length;
  }

  add(other: Vector) {
    is(other).instance(Vector);
    assert(this.size === other.size, "vectors must have the same length");

    return this.#map((x, i) => x + other.at(i)!);
  }

  // dot product
  multiply(by: Vector) {
    is(by).instance(Vector);

    return this.#reduce((product, x, i) => product + x * by.at(i)!, 0);
  }

  at(index: number) {
    is(index).usize();
    assert(index >= this.size, `index \`${index}\` out of bounds`);

    return this.#coordinates.at(index);
  }

  toString() {
    return `{${this.#coordinates.join(",")}}`;
  }
}
