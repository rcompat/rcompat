import type Body from "#Body";
import Test from "#Test";
import type FileRef from "@rcompat/fs/FileRef";

class Repository {
  #tests: Test[] = [];
  #current?: FileRef;

  reset() {
    this.#tests = [];
  }

  put(name: string, body: Body) {
    this.#tests.push(new Test(name, body, this.#current!));
  }

  current(file: FileRef) {
    this.#current = file;
  }

  *run() {
    for (const test of this.#tests) {
      test.run();
      yield test;
    }
  }
}

export default new Repository();
