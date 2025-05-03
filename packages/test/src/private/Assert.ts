import E from "#E";
import equals from "#equals";
import type Test from "#Test";
import type Not from "@rcompat/type/Not";
import type Print from "@rcompat/type/Print";
import type UnknownFunction from "@rcompat/type/UnknownFunction";

type Equals<X, Y> =
  (<T>() => T extends X ? true : false) extends <T>() => T extends Y
    ? true
    : false
    ? true
    : false;

export default class Assert<const Actual> {
  #test: Test;
  #actual?: Actual;

  constructor(test: Test, actual?: Actual) {
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

  type<const Expected extends Equals<Actual, Expected> extends true
    ? unknown
    : Print<Actual>>(_expected?: Expected) {
    return this;
  }

  nottype<const Expected extends Not<Equals<Actual, Expected>> extends true
    ? unknown
    : "actual and expected types are same">() {
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

  fail<const Expected extends Not<Equals<Actual, Expected>> extends true
    ? unknown
    : "was supposed to fail but didn't">(): void;
  fail(reason: string): void;

  fail(reason?: string) {
    if (reason !== undefined) {
      this.#failed(reason);
    }
  }
};
