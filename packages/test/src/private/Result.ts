export default class Result<T> {
  #actual: T;
  #expected: T;
  #passed: boolean;

  constructor(actual: T, expected: T, passed: boolean) {
    this.#actual = actual;
    this.#expected = expected;
    this.#passed = passed;
  }

  get actual() {
    return this.#actual;
  }

  get expected() {
    return this.#expected;
  }

  get passed() {
    return this.#passed;
  }
};
