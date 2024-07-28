import type { ErrorFallbackFunction } from "@rcompat/invariant/#/errored";
import type { AnyFunction, TypeofTypeMap } from "@rcompat/invariant/#/types";
import assert from "@rcompat/invariant/assert";

interface TestOptions { condition: boolean, error?: ErrorFallbackFunction, def: string }

const test = ({ condition, def, error }: TestOptions): void => assert(condition, error || def);


export default class Every {
  #values;

  constructor(...values: unknown[]) {
    this.#values = values;
  }

  #test<T>(options: TestOptions): T[] {
    test(options);
    return this.#values as never;
  }

  #typeof<T extends keyof TypeofTypeMap>(type: T, error?: ErrorFallbackFunction) {
    const def = `all the values must be of type ${type}`;
    const condition = this.#values.every(v => typeof v === type);
    return this.#test<TypeofTypeMap[T]>({ condition, def, error });
  }

  string(error?: ErrorFallbackFunction): string[] {
    return this.#typeof("string", error);
  }

  number(error?: ErrorFallbackFunction): number[] {
    return this.#typeof("number", error);
  }

  bigint(error?: ErrorFallbackFunction): bigint[] {
    return this.#typeof("bigint", error);
  }

  boolean(error?: ErrorFallbackFunction): boolean[] {
    return this.#typeof("boolean", error);
  }

  symbol(error?: ErrorFallbackFunction): symbol[] {
    return this.#typeof("symbol", error);
  }

  function(error?: ErrorFallbackFunction): AnyFunction[] {
    return this.#typeof("function", error);
  }

  integer(error?: ErrorFallbackFunction): number[] {
    const def = "all the values must be integers";
    const condition = this.#values.every(v => Number.isInteger(v));
    return this.#test({ condition, def, error });
  }

  // (signed) integers
  isize(error?: ErrorFallbackFunction): number[] {
    return this.integer(error);
  }

  // unsigned (positive) integer
  usize(error?: ErrorFallbackFunction): number[] {
    const def = "all the values must be positive integers";
    const condition = this.#values.every(v => Number.isInteger(v) && v as number >= 0);
    return this.#test({ condition, def, error });
  }
}
