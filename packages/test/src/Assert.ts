import { maybe } from "@rcompat/invariant";
import type Case from "./Case.js";
import equals from "./equals.js";

export default class Assert {
  actual: any;
  expected: any;
  id: number;
  case: Case;
  passed: boolean = false;

  constructor(actual: any, id: number, c: Case) {
    this.actual = actual;
    this.id = id;
    this.case = c;
  }

  same(expected: any) {
    this.report(this.actual === expected, expected);
  }

  equals(expected: any) {
    this.report(equals(this.actual, expected), expected);
  }

  eq(expected: any) {
    this.equals(expected);
  }

  nequals(expected: any) {
    this.report(!equals(this.actual, expected), `different from ${expected}`);
  }

  neq(expected: any) {
    this.nequals(expected);
  }

  true() {
    return this.equals(true as never);
  }

  false() {
    return this.equals(false as never);
  }

  undefined() {
    return this.equals(undefined as never);
  }

  defined() {
    this.report(this.actual !== undefined, "(to be defined)");
  }

  null() {
    return this.equals(null as never);
  }

  typeof(expected: any) {
    this.report(typeof this.actual === expected, expected);
  }

  instanceof(expected: any) {
    this.report(this.actual instanceof expected, expected);
  }

  async throws(message?: string) {
    maybe(message).string();
    try {
      await this.actual();
      this.actual = "(did not throw)";
      this.report(false, message === undefined ? "(to throw)" : message);
    } catch (error: any) {
      const { message: actualMessage } = error;
      this.actual = `(Error) ${actualMessage}`;
      const expected = `(Error) ${message}`;
      this.report(message === undefined || message === actualMessage,
        expected);
    }
  }

  async nthrows() {
    let result = true;
    try {
      await this.actual();
      this.actual = "(did not throw)";
    } catch (error: any) {
      this.actual = error.message;
      result = false;
    } finally {
      this.report(result, "(did not throw)");
    }
  }

  report(passed: boolean, expected?: any) {
    this.passed = passed;
    this.expected = expected;
  }

  atleast(number: number) {
    this.report(Number(this.actual) >= number, `>=${number}`);
  }

  get serialized() {
    return JSON.stringify(this.actual);
  }
}
