import TemplateError from "#TemplateError";
import is from "@rcompat/is";

const brand = Symbol.for("std:error/CodeError/v0");

type Code = string;

export default class CodeError extends TemplateError {
  #code: Code;
  [brand] = true;

  constructor(code: Code, strings: TemplateStringsArray, ...params: unknown[]) {
    super(strings, ...params);
    this.#code = code;
  }

  static is(x: unknown): x is CodeError {
    return is.branded(x, brand);
  }

  static matches(x: unknown, code: Code): x is CodeError {
    return CodeError.is(x) && x.code === code;
  }

  get code() {
    return this.#code;
  }
}
