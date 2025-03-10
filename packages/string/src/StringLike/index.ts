export type Replacer = ((substring: string, ...args: unknown[]) => string);

export type StringClass = {
  toString(): string;
  [Symbol.replace](string: string, replacement: string): string;
  [Symbol.replace](string: string, replacement: Replacer): string;
};

type StringLike = string | StringClass;

export { StringLike as default };
