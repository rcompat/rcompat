import assert from "#assert";
import type ErrorFallbackFunction from "#ErrorFallbackFunction";
import type TypeofTypeMap from "#TypesOfTypeMap";
import newable from "@rcompat/is/newable";
import type Dict from "@rcompat/type/Dict";
import type Newable from "@rcompat/type/Newable";
import type UnknownFunction from "@rcompat/type/UnknownFunction";

interface TestOptions {
  condition: boolean;
  def: string;
  error: ErrorFallbackFunction | string | undefined;
};

const test = ({ condition, def, error }: TestOptions): void =>
  assert(condition, error || def);

function try_instanceof<
  C extends new (...args: never) => unknown,
>(value: unknown, type: C): value is InstanceType<C>;
function try_instanceof<
  T extends keyof TypeofTypeMap,
>(value: unknown, type: T): value is TypeofTypeMap[T];
function try_instanceof(value: unknown, type: UnknownFunction): boolean {
  try {
    return value instanceof (type as UnknownFunction);
  } catch {
    return false;
  }
}

export default class Is {
  #value: unknown;

  constructor(value: unknown) {
    this.#value = value;
  }

  get #stringified() {
    const x = this.#value;

    try {
      const stringified = JSON.stringify(x) as string | undefined;

      // symbol and function will be undefined
      if (stringified !== undefined) {
        return stringified;
      }
    } catch {
      // bigint will throw
    }

    // has a toString method
    if (x?.toString !== undefined) {
      return x!.toString();
    }

    return `${x}`;
  }

  #test<T = unknown>(options: TestOptions): T {
    test(options);
    return this.#value as T;
  }

  #typeof<
    T extends keyof TypeofTypeMap,
  >(type: T, error?: ErrorFallbackFunction | string): TypeofTypeMap[T] {
    const def = `\`${this.#stringified}\` must be of type ${type}`;
    const condition = typeof this.#value === type;
    return this.#test({ condition, def, error });
  }

  #eq<T>(value: T, error?: ErrorFallbackFunction | string): T {
    const def = `\`${this.#stringified}\` must be \`${value}\``;
    const condition = this.#value === value;
    return this.#test({ condition, def, error });
  }

  /**
   * Ensure the value is a `string`.
   *
   * @param error Optional fallback error (string or function).
   * @returns The value, typed as `string`.
   * @throws If the value is not a string.
   */
  string(error?: ErrorFallbackFunction | string): string {
    return this.#typeof("string", error);
  }

  /**
   * Ensure the value is a `number`.
   *
   * @param error Optional fallback error (string or function).
   * @returns The value, typed as `number`.
   * @throws If the value is not a number.
   */
  number(error?: ErrorFallbackFunction | string): number {
    return this.#typeof("number", error);
  }

  /**
  * Ensure the value is a `bigint`.
  *
  * @param error Optional fallback error (string or function).
  * @returns The value, typed as `bigint`.
  * @throws If the value is not a bigint.
  */
  bigint(error?: ErrorFallbackFunction | string): bigint {
    return this.#typeof("bigint", error);
  }

  /**
   * Ensure the value is a `boolean`.
   *
   * @param error Optional fallback error (string or function).
   * @returns The value, typed as `boolean`.
   * @throws If the value is not a boolean.
   */
  boolean(error?: ErrorFallbackFunction | string): boolean {
    return this.#typeof("boolean", error);
  }

  /**
   * Ensure the value is a `symbol`.
   *
   * @param error Optional fallback error (string or function).
   * @returns The value, typed as `symbol`.
   * @throws If the value is not a symbol.
   */
  symbol(error?: ErrorFallbackFunction | string): symbol {
    return this.#typeof("symbol", error);
  }

  /**
   * Ensure the value is a `function`.
   *
   * @param error Optional fallback error (string or function).
   * @returns The value, typed as a function.
   * @throws If the value is not a function.
   */
  function(error?: ErrorFallbackFunction | string): UnknownFunction {
    return this.#typeof("function", error);
  }

  /**
   * Ensure the value is defined (not `undefined`).
   *
   * @param error Optional fallback error (string or function).
   * @returns The value, typed as `unknown`.
   * @throws If the value is `undefined`.
   */
  defined(error?: ErrorFallbackFunction | string): unknown {
    const def = `\`${this.#stringified}\` must be defined`;
    const condition = this.#value !== undefined;
    return this.#test({ condition, def, error });
  }

  /**
   * Ensure the value is `undefined`.
   *
   * @param error Optional fallback error (string or function).
   * @returns The value, typed as `undefined`.
   * @throws If the value is not undefined.
   */
  undefined(error?: ErrorFallbackFunction | string): undefined {
    return this.#eq(undefined, error);
  }

  /**
   * Ensure the value is `null`.
   *
   * @param error Optional fallback error (string or function).
   * @returns The value, typed as `null`.
   * @throws If the value is not null.
   */
  null(error?: ErrorFallbackFunction | string): null {
    return this.#eq(null, error);
  }

  /**
   * Ensure the value is an array.
   *
   * @param error Optional fallback error (string or function).
   * @returns The value, typed as an array.
   * @throws If the value is not an array.
   */
  array(error?: ErrorFallbackFunction | string): unknown[] {
    const def = `\`${this.#stringified}\` must be an array`;
    const condition = Array.isArray(this.#value);
    return this.#test({ condition, def, error });
  }

  /**
   * Ensure the value is a non-null object.
   *
   * Accepts any non-null object, including arrays and class instances.
   *
   * @param error Optional fallback error (string or function).
   * @returns The value, typed as a generic object.
   * @throws If the value is not an object.
   */
  object(error?: ErrorFallbackFunction | string): Record<PropertyKey, unknown> {
    const def = `\`${this.#stringified}\` must be an object`;
    const condition = typeof this.#value === "object" && this.#value !== null;
    return this.#test({ condition, def, error });
  }

  /**
   * Ensures the value is a **plain object**, parallel to a TypeScript `Record`.
   *
   * Accepts:
   *   - `{}` and other plain objects
   *   - objects with a `null` prototype (`Object.create(null)`)
   *
   * Rejects:
   *   - `null`
   *   - arrays
   *   - class instances
   *   - built-in objects like `Date`, `Map`, `Set`, etc.
   *
   * @param error Optional fallback error (string or function).
   * @returns The value, typed as `Dict`.
   * @throws If the value is not a plain object.
   */
  record(error?: ErrorFallbackFunction | string): Dict {
    const def = `\`${this.#stringified}\` must be a plain object (Record)`;
    const value = this.#value;

    const condition =
      typeof value === "object" &&
      value !== null &&
      // allow Object.prototype or null prototype only
      (Object.getPrototypeOf(value) === Object.prototype ||
        Object.getPrototypeOf(value) === null);

    return this.#test({ condition, def, error });
  }

  /**
   * Ensure the value is a constructable class/function ("newable").
   *
   * @param error Optional fallback error (string or function).
   * @returns The value, typed as `Newable`.
   * @throws If the value is not newable.
   */
  newable(error?: ErrorFallbackFunction | string): Newable {
    const def = `\`${this.#stringified}\` must be newable`;
    const condition = newable(this.#value);
    return this.#test({ condition, def, error });
  }

  /**
   * Ensure the value is an instance of the given class.
   *
   * @param Class The constructor function to check against.
   * @param error Optional fallback error (string or function).
   * @returns The value, typed as an instance of `Class`.
   * @throws If the value is not an instance of `Class`.
   */
  instance<
    C extends Newable,
  >(Class: C, error?: ErrorFallbackFunction | string): InstanceType<C> {
    const value = this.#value;
    const def = `\`${this.#stringified}\` must be an instance of ${Class.name}`;
    const condition = value instanceof Class;
    return this.#test({ condition, def, error });
  }

  /**
   * Ensure the value is a subclass of the given class.
   *
   * @param Class The constructor function to check against.
   * @param error Optional fallback error (string or function).
   * @returns The value, typed as the subclass constructor.
   * @throws If the value is not a subclass of `Class`.
   */
  subclass<
    C extends Newable,
  >(Class: C, error?: ErrorFallbackFunction | string): C {
    const def = `\`${(this.#value as any)?.name}\` must subclass ${Class.name}`;
    const condition = (this.#value as any)?.prototype instanceof Class;
    return this.#test({ condition, def, error });
  }

  /**
   * Ensure the value is an instance of **any** of the given classes.
   *
   * @param Classes A list of constructor functions.
   * @param error Optional fallback error (string or function).
   * @returns The value, typed as an instance of one of the classes.
   * @throws If the value is not an instance of any provided class.
   */
  anyOf<
    T extends Newable,
  >(Classes: T[], error?: ErrorFallbackFunction | string): InstanceType<T> {
    const any = Classes.map(c => `\`${c.name}\``).join(", ");
    const def = `\`${this.#stringified}\` must be an instance of any of ${any}`;
    const condition = Classes.some(c => try_instanceof(this.#value, c));
    return this.#test({ condition, def, error });
  }

  /**
    * Ensures the value is an integer (`Number.isInteger`).
    *
    * @param error Optional fallback error (string or function).
    * @returns The value, typed as `number`.
    * @throws If the value is not an integer.
    */
  integer(error?: ErrorFallbackFunction | string): number {
    const def = `\`${this.#stringified}\` must be an integer`;
    const condition = Number.isInteger(this.#value);
    return this.#test({ condition, def, error });
  }

  /**
   * Ensure the value is a signed integer.
   *
   * Alias for {@link integer}.
   *
   * @param error Optional fallback error (string or function).
   * @returns The value, typed as `number`.
   * @throws If the value is not an integer.
   */
  isize(error?: ErrorFallbackFunction | string): number {
    return this.integer(error);
  }

  /**
   * Ensure the value is an unsigned integer (>= 0).
   *
   * @param error Optional fallback error (string or function).
   * @returns The value, typed as `number`.
   * @throws If the value is not a non-negative integer.
   */
  usize(error?: ErrorFallbackFunction | string): number {
    const def = `\`${this.#value}\` must be a non-negative integer`;
    const value = this.#value;

    const condition = Number.isInteger(value) && value as number >= 0;
    return this.#test({ condition, def, error });
  }

  /**
   * Ensure the value is exactly `true`.
   *
   * @param error Optional fallback error (string or function).
   * @returns The value, typed as the literal `true`.
   * @throws If the value is not `true`.
   */
  true(error?: ErrorFallbackFunction | string): true {
    const def = `\`${this.#value}\` must be boolean \`true\``;
    const condition = this.#value === true;
    return this.#test({ condition, def, error });
  }

  /**
   * Ensure the value is exactly `false`.
   *
   * @param error Optional fallback error (string or function).
   * @returns The value, typed as the literal `false`.
   * @throws If the value is not `false`.
   */
  false(error?: ErrorFallbackFunction | string): false {
    const def = `\`${this.#value}\` must be boolean \`false\``;
    const condition = this.#value === false;
    return this.#test({ condition, def, error });
  }

  /**
   * Ensures the value is a **UUIDv4 string** in the exact format that
   * `crypto.randomUUID()` produces.
   *
   * Pattern: `xxxxxxxx-xxxx-4xxx-[89ab]xxx-xxxxxxxxxxxx`
   *
   * Conditions:
   *   - Lowercase hexadecimal digits only
   *   - Version must be `4`
   *   - Variant must be one of `8`, `9`, `a`, or `b`
   *
   * Rejects:
   *   - Uppercase UUIDs
   *   - Nil UUID (`00000000-0000-0000-0000-000000000000`)
   *   - Other UUID versions
   *   - Non-string values
   *
   * @param error Optional fallback error (string or function).
   * @returns The value, typed as `string`.
   * @throws If the value is not a valid UUIDv4 string.
   */
  uuid(error?: ErrorFallbackFunction | string): string {
    const def = `\`${this.#stringified}\` must be a valid UUIDv4 string`;
    const v = this.#value;

    // crypto.randomUUID(): RFC 4122 v4, lowercase hex only
    const uuidv4 =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

    const condition = typeof v === "string" && uuidv4.test(v);

    return this.#test({ condition, def, error });
  }
}
