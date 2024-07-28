import type { ErrorFallbackFunction } from "@rcompat/invariant/#/errored";
import type { AnyConstructibleFunction, TypeofTypeMap }
  from "@rcompat/invariant/#/types";
import assert from "@rcompat/invariant/assert";
import { constructible } from "@rcompat/invariant/construct";

interface TestOptions { condition: boolean, error?: ErrorFallbackFunction | string, def: string }

const test = ({ condition, def, error }: TestOptions): void => assert(condition, error || def);

function try_instanceof<C extends new (...args: never) => unknown>(value: unknown, type: C): value is InstanceType<C>
function try_instanceof<T extends keyof TypeofTypeMap>(value: unknown, type: T): value is TypeofTypeMap[T]; 
function try_instanceof(value: unknown, type: Function | string): boolean {
  try {
    // Todo: Revisit
    return value instanceof (type as Function);
  } catch {
    return typeof value === type;
  }
}

export default class Is {
  #value: unknown;

  constructor(value: unknown) {
    this.#value = value;
  }

  #test<T = unknown>(options: TestOptions): T {
    test(options);
    return this.#value as never;
  }

  #typeof<T extends keyof TypeofTypeMap>(type: T, error?: ErrorFallbackFunction | string): TypeofTypeMap[T] {
    const def = `\`${this.#value}\` must be of type ${type}`;
    const condition = typeof this.#value === type;
    return this.#test({ condition, def, error });
  }

  #eq<T>(value: T, error?: ErrorFallbackFunction | string): T {
    const def = `\`${this.#value}\` must be \`${value}\``;
    const condition = this.#value === value;
    return this.#test({ condition, def, error });
  }

  string(error?: ErrorFallbackFunction | string): string {
    return this.#typeof("string", error);
  }

  number(error?: ErrorFallbackFunction | string): number {
    return this.#typeof("number", error);
  }

  bigint(error?: ErrorFallbackFunction | string): bigint {
    return this.#typeof("bigint", error);
  }

  boolean(error?: ErrorFallbackFunction | string): boolean {
    return this.#typeof("boolean", error);
  }

  symbol(error?:  | string): symbol {
    return this.#typeof("symbol", error);
  }

  function(error?: ErrorFallbackFunction | string): TypeofTypeMap['function'] {
    return this.#typeof("function", error);
  }

  undefined(error?: ErrorFallbackFunction | string): undefined {
    return this.#eq(undefined, error);
  }

  null(error?: ErrorFallbackFunction | string): null {
    return this.#eq(null, error);
  }

  array(error?: ErrorFallbackFunction | string): unknown[] {
    const def = `\`${JSON.stringify(this.#value)}\` must be array`;
    const condition = Array.isArray(this.#value);
    return this.#test({ condition, def, error });
  }

  object(error?: ErrorFallbackFunction | string): Record<PropertyKey, unknown> {
    const string = Object.prototype.toString.call(this.#value);
    const def = `\`${string}\` must be object`;
    const condition = typeof this.#value === "object" && this.#value !== null;
    return this.#test({ condition, def, error });
  }

  defined(error?: ErrorFallbackFunction | string): {} {
    const def = `\`${this.#value}\` must be defined`;
    const condition = this.#value !== undefined;
    return this.#test({ condition, def, error });
  }

  constructible(error?: ErrorFallbackFunction | string): AnyConstructibleFunction {
    const def = `\`${this.#value}\` must be constructible`;
    const condition = constructible(this.#value);
    return this.#test({ condition, def, error });
  }

  instance<C extends AnyConstructibleFunction>(Class: C, error?: ErrorFallbackFunction | string): InstanceType<C> {
    // Todo: Remove any
    const def = `\`${(this.#value as any)?.name}\` must be an instance ${Class.name}`;
    const condition = this.#value instanceof Class;
    return this.#test({ condition, def, error });
  }

  of<C extends AnyConstructibleFunction>(Class: C, error?: ErrorFallbackFunction | string): InstanceType<C> {
    return this.instance(Class, error);
  }

  subclass<C extends AnyConstructibleFunction>(Class: C, error?: ErrorFallbackFunction | string): C {
    // Todo: Remove any
    const def = `\`${(this.#value as any)?.name}\` must subclass ${Class.name}`;
    // Todo: Remove any
    const condition = (this.#value as any)?.prototype instanceof Class;
    return this.#test({ condition, def, error });
  }

  sub<C extends AnyConstructibleFunction>(Class: C, error?: ErrorFallbackFunction): C {
    return this.subclass(Class, error);
  }

  anyOf<T extends AnyConstructibleFunction>(Classes: T[], error?: ErrorFallbackFunction | string): InstanceType<T> {
    const classes = Classes instanceof Array ? Classes : [Classes];
    const classes_str = classes.map(c => `\`${c.name ?? c}\``).join(", ");
    const def = `\`${this.#value}\` must instance any of ${classes_str}`;
    const condition = classes.some(c => try_instanceof(this.#value, c));
    return this.#test({ condition, def, error });
  }

  integer(error?: ErrorFallbackFunction | string): number {
    const def = `\`${this.#value}\` must be integer`;
    const condition = Number.isInteger(this.#value);
    return this.#test({ condition, def, error });
  }

  // (signed) integer
  isize(error?: ErrorFallbackFunction | string): number {
    return this.integer(error);
  }

  // unsigned (positive) integer
  usize(error?: ErrorFallbackFunction | string) {
    const def = `\`${this.#value}\` must be positive integer`;
    const condition = Number.isInteger(this.#value) && this.#value as number >= 0;
    return this.#test({ condition, def, error });
  }

  true(error?: ErrorFallbackFunction | string): true {
    const def = `\`${this.#value}\` must be boolean \`true\``;
    const condition = this.#value === true;
    return this.#test({ condition, def, error });
  }

  false(error?: ErrorFallbackFunction | string): false {
    const def = `\`${this.#value}\` must be boolean \`false\``;
    const condition = this.#value === false;
    return this.#test({ condition, def, error });
  }
}
