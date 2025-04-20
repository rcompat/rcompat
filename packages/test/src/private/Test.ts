import Assert from "#Assert";
import Body from "#Body";
import Result from "#Result";
import type FileRef from "@rcompat/fs/FileRef";

export default class Test {
  #name: string;
  #body: Body;
  #results: Result<unknown>[] = [];
  #file: FileRef;

  constructor(name: string, body: Body, file: FileRef) {
    this.#name = name;
    this.#body = body;
    this.#file = file;
  }

  get name() {
    return this.#name;
  }

  get file() {
    return this.#file;
  }

  get results() {
    return this.#results;
  }

  report<T>(actual: T, expected: T, passed: boolean) {
    this.#results.push(new Result<T>(actual, expected, passed));
  }

  run() {
    this.#body(<T>(actual: T) => new Assert<T>(actual, this));
  }
};
