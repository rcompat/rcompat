export interface ObjectStringifyReplacerFunction {
  (this: unknown, key: string, value: unknown): unknown;
}

export interface ObjectStringifyOptions {
  replacer?: ObjectStringifyReplacerFunction;
  space?: number;
}

export default (value: Record<string, unknown>, {
  replacer = undefined,
  space = 2,
}: ObjectStringifyOptions = {}): string =>
  JSON.stringify(value, replacer, space);
