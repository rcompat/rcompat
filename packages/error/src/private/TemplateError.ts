import is from "@rcompat/is";

const brand = Symbol.for("std:error/TemplateError/v0");

export default class TemplateError extends Error {
  #strings: TemplateStringsArray;
  #params: unknown[];
  [brand] = true;

  constructor(strings: TemplateStringsArray, ...params: unknown[]) {
    super(strings.reduce((acc, str, i) => acc + (params[i - 1] ?? "") + str));
    this.#strings = strings;
    this.#params = params;
  }

  static is(x: unknown): x is TemplateError {
    return is.branded(x, brand);
  }

  get strings() {
    return this.#strings;
  }

  get params() {
    return this.#params;
  }
}
