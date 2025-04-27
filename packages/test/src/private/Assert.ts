import E from "#E";
import type Test from "#Test";
import equals from "#equals";
import type UnknownFunction from "@rcompat/type/UnknownFunction";

export default class Assert<T> {
  #actual: T;
  #test: Test;

  constructor(actual: T, test: Test) {
    this.#actual = actual;
    this.#test = test;
  }

  #report(passed: boolean, expected: unknown, actual?: unknown) {
    this.#test.report(actual ?? this.#actual, expected, passed);
  }

  #passed() {
    this.#report(true, undefined);
  }

  #failed(expected: unknown, actual?: unknown) {
    this.#report(false, expected, actual);
 }

  equals(expected: unknown) {
    this.#report(equals(this.#actual, expected), expected);
    return this;
  }

  nequals(expected: unknown) {
    this.#report(!equals(this.#actual, expected), expected)
    return this;
  }

  type<_Expected extends T>() {
    // noop
    return this;
  }

  #static(expected: unknown) {
    this.#report(equals(this.#actual as boolean, expected), expected);
    return this;
  }

  true() {
    return this.#static(true);
  }

  false() {
    return this.#static(false);
  }

  null() {
    return this.#static(null);
  }

  undefined() {
    return this.#static(undefined);
  }

  instance(expected: UnknownFunction) {
    this.#report(this.#actual instanceof expected, expected);
    return this;
  }

  throws(expected?: string) {
    try {
      (this.#actual as () => unknown)();
      this.#failed("[did not throw]");
    } catch (error) {
      const { message } = E(error);

      if (expected === undefined || expected === message) {
        this.#passed();
      } else {
        this.#failed(expected, message);
      }
    }
    return this;
  }

  tries() {
    try {
      (this.#actual as () => unknown)();
      this.#passed();
    } catch (error) {
      this.#failed(E(error).message, "[did not throw]");
    }
    return this;
  }

  fail(reason: string) {
    this.#failed(reason);
  }
};
