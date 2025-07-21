import type Body from "#Body";
import type End from "#End";
import Suite from "#Suite";
import type FileRef from "@rcompat/fs/FileRef";

class Repository {
  #suites: Suite[] = [];

  get #suite() {
    return this.#suites.at(-1)!;
  }

  put(name: string, body: Body) {
    this.#suite.test(name, body);
  }

  ended(end: End) {
    this.#suite.ended(end);
  }

  suite(file: FileRef) {
    this.#suites.push(new Suite(file));
  }

  reset() {
    this.#suites = [];
  }

  *next() {
    for (const suite of this.#suites) {
      yield suite;
    }
  }
}

export default new Repository();
