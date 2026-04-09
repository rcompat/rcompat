import TemplateError from "#TemplateError";

const brand = Symbol.for("std:error/CodeError/v0");

export default class CodeError extends TemplateError {
  #code: string;
  [brand] = true;

  constructor(
    code: string,
    strings: TemplateStringsArray,
    ...params: unknown[]) {
    super(strings, ...params);
    this.#code = code;
  }

  get code() {
    return this.#code;
  }

  static is(error: unknown): error is CodeError {
    return typeof error === "object" && error !== null && brand in error;
  }
}
