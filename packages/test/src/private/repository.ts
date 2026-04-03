import type Body from "#Body";
import type End from "#End";
import Suite from "#Suite";
import type { FileRef } from "@rcompat/fs";

class Repository {
  #suites: Suite[] = [];
  #current_group: string | undefined;
  #mocks: Map<string, unknown> = new Map();

  get #suite() {
    return this.#suites.at(-1)!;
  }

  get mocks() {
    return this.#mocks;
  }

  put(name: string, body: Body) {
    this.#suite.test(name, body, this.#current_group);
  }

  group(name: string, fn: () => void) {
    this.#current_group = name;
    fn();
    this.#current_group = undefined;
  }

  between(fn: () => void) {
    this.#suite.between(fn);
  }

  ended(end: End) {
    this.#suite.ended(end);
  }

  suite(file: FileRef) {
    this.#suites.push(new Suite(file));
  }

  reset() {
    this.#suites = [];
    this.#mocks = new Map();
  }

  *next() {
    for (const suite of this.#suites) {
      yield suite;
    }
  }
}

export default new Repository();
