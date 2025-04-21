import type StringReplacer from "#string/Replacer";

type StringClass = {
  toString(): string;
  [Symbol.replace](string: string, replacement: string): string;
  [Symbol.replace](string: string, replacement: StringReplacer): string;
};

export type { StringClass as default };
