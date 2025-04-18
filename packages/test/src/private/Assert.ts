import Case from "#Case";
import equals from "#equals";

export default class Assert<T> {
  #actual: T;
  #case: Case;

  constructor(actual: T, _case: Case) {
    this.#actual = actual;
    this.#case = _case;
  }

  #report(expected: T, passed: boolean) {
    this.#case.report(this.#actual, expected, passed);
  }

  equals(expected: T) {
    this.#report(expected, equals(this.#actual, expected))
  }
};
