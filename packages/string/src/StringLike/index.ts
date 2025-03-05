export type Replacer = ((substring: string, ...args: unknown[]) => string);

export default interface StringLike {
  toString(): string;
  [Symbol.replace](string: string, replacement: string): string;
  [Symbol.replace](string: string, replacement: Replacer): string;
}
