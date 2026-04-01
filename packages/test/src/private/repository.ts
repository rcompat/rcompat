import type Body from "#Body";
import type End from "#End";
import Suite from "#Suite";
import type { FileRef } from "@rcompat/fs";

class Repository {
  #suites: Suite[] = [];
  #current_group: string | undefined;

  get #suite() {
    return this.#suites.at(-1)!;
  }

  put(name: string, body: Body) {
    this.#suite.test(name, body, this.#current_group);
  }

  group(name: string, fn: () => void) {
    this.#current_group = name;
    fn();
    this.#current_group = undefined;
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
