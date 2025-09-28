import type JSONValue from "#JSONValue";

/**
 * Represents a contract for objects that can be serialized into a
 * JSON-compatible value.
 *
 * Implementing this interface ensures that an object provides a custom
 * {@link Serializable.toJSON | `toJSON`} method, which defines how it should
 * be converted into a plain JSON-safe structure (e.g., `string`, `number`,
 * `boolean`, `null`, arrays, or objects).
 *
 * This is useful when working with `JSON.stringify`, as the returned
 * value from `toJSON` will be used during the stringification process.
 *
 * @example
 * ```ts
 * class User implements Serializable {
 *   #id: number;
 *   #name: string;
 *
 *   constructor(id: number, name: string) {
 *     this.#id = id;
 *     this.#name = name;
 *   }
 *
 *   toJSON() {
 *     return {
 *       id: this.#id,
 *       name: this.#name,
 *     };
 *   }
 * }
 *
 * const user = new User(1, "John");
 * console.log(JSON.stringify(user));
 * // Output: {"id":1,"name":"John"}
 * ```
 */
export default interface Serializable {
  /**
   * Converts the current object into a JSON-compatible value.
   *
   * The returned value must be **safe for JSON serialization**, meaning it
   * should only include primitive values, arrays, or plain objects.
   *
   * This method is invoked by {@link JSON.stringify} when serializing an
   * object that implements this interface.
   *
   * @returns A valid {@link JSONValue} representing the object's serialized
   * form.
   */
  toJSON(): JSONValue;
}
