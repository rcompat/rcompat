import type Dict from "#Dict";

export default interface Bag<V = string> {
  get(key: string): V;
  try(key: string): V | undefined;
  has(key: string): boolean;
  [Symbol.iterator](): IterableIterator<readonly [string, V]>;
  all(): Dict<V>;
  toJSON(): Dict<V>;
  toString(): string;
}
