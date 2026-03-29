const brand = Symbol.for("std:error/template/v0");

export default class TemplateError extends Error {
  readonly strings: TemplateStringsArray;
  readonly params: unknown[];
  readonly [brand] = true;

  constructor(strings: TemplateStringsArray, ...params: unknown[]) {
    super(strings.join("\u2026"));
    this.strings = strings;
    this.params = params;
  }
}
