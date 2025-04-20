import E from "#E";
import Test from "#Test";
import equals from "#equals";
import { UnknownFn } from "#types/fn";

export default class Assert<T> {
  #actual: T;
  #test: Test;

  constructor(actual: T, test: Test) {
    this.#actual = actual;
    this.#test = test;
  }

  #report(expected: unknown, passed: boolean) {
    this.#test.report(this.#actual, expected, passed);
  }

  equals(expected: T) {
    this.#report(expected, equals(this.#actual, expected))
  }

  nequals(expected: unknown) {
    this.#report(expected, !equals(this.#actual, expected))
  }

  #static(expected: unknown) {
    this.#report(expected as T, equals(this.#actual as boolean, expected));
  }

  true() {
    this.#static(true);
  }

  false() {
    this.#static(false);
  }

  null() {
    this.#static(null);
  }

  undefined() {
    this.#static(undefined);
  }

  instance(expected: UnknownFn) {
    this.#report(expected, this.#actual instanceof expected);
  }

  throws(expected?: string) {
    try {
      (this.#actual as () => unknown)();
      this.#report("[void]" as T, false);
    } catch (error) {
      const { message } = E(error);
      const messaged = expected !== undefined;

      this.#report(message as T, messaged ? equals(message, expected) : true);
    }
  }

  tries() {
    try {
      (this.#actual as () => unknown)();
      this.#report("[void]" as T, true);
    } catch (error) {
      const { message } = E(error);

      this.#report(`[threw] ${message}` as T, false);
    }
  }
};
