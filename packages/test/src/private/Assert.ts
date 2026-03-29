import E from "#E";
import equals from "#equals";
import type Test from "#Test";
import type { Not, Print, UnknownFunction } from "@rcompat/type";

type Equals<X, Y> =
  (<T>() => T extends X ? true : false) extends <T>() => T extends Y
    ? true
    : false
  ? true
  : false;

export default class Assert<const Actual> {
  #test: Test;
  #actual?: Actual;
  #negate = false;

  constructor(test: Test, actual?: Actual) {
    this.#actual = actual;
    this.#test = test;
  }

  #report(passed: boolean, expected: unknown, actual?: unknown) {
    const negate = this.#negate;
    // reset negation
    this.#negate = false;

    const final_passed = negate ? !passed : passed;
    const final_expected = negate ? { not: expected } : expected;

    this.#test.report(actual ?? this.#actual, final_expected, final_passed);
  }

  #passed() {
    this.#report(true, undefined);
  }

  #failed(expected: unknown, actual?: unknown) {
    this.#report(false, expected, actual);
  }

  get not() {
    this.#negate = !this.#negate;
    return this;
  }

  equals(expected: unknown) {
    this.#report(equals(this.#actual, expected), expected);
    return this;
  }

  nequals(expected: unknown) {
    this.#report(!equals(this.#actual, expected), expected);
    return this;
  }

  includes(expected: unknown) {
    const actual = this.#actual;
    const passed = typeof actual === "string"
      ? actual.includes(expected as string)
      : Array.isArray(actual)
        ? actual.includes(expected)
        : false;
    this.#report(passed, expected);
    return this;
  }

  type<const Expected extends Equals<Actual, Expected> extends true
    ? unknown
    : Print<Actual>>(_expected?: Expected) {
    this.pass();
    return this;
  }

  nottype<const Expected extends Not<Equals<Actual, Expected>> extends true
    ? unknown
    : "actual and expected types are same">(_expected?: Expected) {
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

  defined() {
    return this.not.undefined();
  }

  instance(expected: UnknownFunction) {
    this.#report(this.#actual instanceof expected, expected);
    return this;
  }

  throws(expected: string | (new (...args: any[]) => Error)) {
    try {
      (this.#actual as () => unknown)();
      this.#failed("[did not throw]");
    } catch (error) {
      if (typeof expected === "string") {
        const code = E(error).code;
        code === expected
          ? this.#passed()
          : this.#failed(expected, code ?? "[no code]");
      } else {
        error instanceof expected
          ? this.#passed()
          : this.#failed(expected.name, (error as Error)?.constructor?.name
            ?? "[unknown]");
      }
    }
    return this;
  }

  tries() {
    try {
      (this.#actual as () => unknown)();
      this.#passed();
    } catch (error) {
      const { code, message } = E(error);
      this.#failed(`${code ?? message}`, "[did not throw]");
    }
    return this;
  }

  pass() {
    this.#passed();
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
