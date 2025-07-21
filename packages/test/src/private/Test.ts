import Assert from "#Assert";
import type Body from "#Body";
import Result from "#Result";

export default class Test {
  #name: string;
  #body: Body;
  #results: Result<unknown>[] = [];

  constructor(name: string, body: Body) {
    this.#name = name;
    this.#body = body;
  }

  get name() {
    return this.#name;
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
