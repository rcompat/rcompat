import Assert from "#Assert";
import type Body from "#Body";
import Result from "#Result";

export default class Test {
  #name: string;
  #body: Body;
  #results: Result<unknown>[] = [];
  #group?: string;

  constructor(name: string, body: Body, group?: string) {
    this.#name = name;
    this.#body = body;
    this.#group = group;
  }

  get name() {
    return this.#name;
  }

  get group() {
    return this.#group;
  }

  get results() {
    return this.#results;
  }

  report<T>(actual: T, expected: T, passed: boolean) {
    this.#results.push(new Result<T>(actual, expected, passed));
  }

  async run() {
    const asserter = <T>(actual?: T) => new Assert<T>(this, actual);
    await this.#body(asserter);
    return this;
  }
};
