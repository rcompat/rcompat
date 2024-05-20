import { is } from "rcompat/invariant";

export type InflateImpl3Result<P extends string, T, B extends string> =
  P extends `${infer P1}${B}${infer Rest}` ?
    { [K in P1]: InflateImpl3Result<Rest, T, B> } :
    { [K in P]: T };

const DEFAULT_BY = '.';
type DEFAULT_BY = typeof DEFAULT_BY;

function inflate<P extends string, T, B extends string>(path: P): InflateImpl3Result<P, {}, DEFAULT_BY>
function inflate<P extends string, T, B extends string>(path: P, initial: T): InflateImpl3Result<P, T, DEFAULT_BY>
function inflate<P extends string, T, B extends string>(path: P, initial: T, by: B): InflateImpl3Result<P, T, B>
function inflate(path: string, initial?: unknown, by?: string): Record<PropertyKey, unknown> {
  is(path).string();
  is(initial).object();
  is(by).string();
  return path.split(by ?? DEFAULT_BY).reduceRight<unknown>((depathed, key) =>
    ({ [key]: depathed }), initial ?? {}) as never;
};

export default inflate;