import type Body from "#Body";
import type End from "#End";
import Test from "#Test";
import type { FileRef } from "@rcompat/fs";

export default class Suite {
  #file: FileRef;
  #tests: Test[] = [];
  #ends: End[] = [];

  constructor(file: FileRef) {
    this.#file = file;
  }

  test(name: string, body: Body) {
    this.#tests.push(new Test(name, body));
  }

  ended(end: End) {
    this.#ends.push(end);
  }

  get file() {
    return this.#file;
  }

  async *run() {
    for (const test of this.#tests) {
      yield await test.run();
    }
  }

  async end() {
    for (const end of this.#ends) {
      await end();
    }
  }
}
