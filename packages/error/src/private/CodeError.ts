import TemplateError from "#TemplateError";

const brand = Symbol.for("std:error/code/v0");

export default class CodeError extends TemplateError {
  readonly code: string;
  readonly [brand] = true;

  constructor(
    code: string,
    strings: TemplateStringsArray,
    ...params: unknown[]) {
    super(strings, ...params);
    this.code = code;
  }

  static is(error: unknown): error is CodeError {
    return typeof error === "object" && error !== null && brand in error;
  }
}
