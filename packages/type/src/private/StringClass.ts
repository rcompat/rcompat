import type StringReplacer from "#StringReplacer";

type StringClass = {
  [Symbol.replace](string: string, replacement: string): string;
  [Symbol.replace](string: string, replacement: StringReplacer): string;
  toString(): string;
};

export type { StringClass as default };
