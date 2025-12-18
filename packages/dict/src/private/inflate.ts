import assert from "@rcompat/assert";
import type { Dict } from "@rcompat/type";

type Impl3<P extends string, T, B extends string> =
  P extends `${infer P1}${B}${infer Rest}` ?
  { [K in P1]: Impl3<Rest, T, B> } :
  { [K in P]: T };

const BY = ".";
type BY = typeof BY;

function inflate<P extends string>(path: P): Impl3<P, Dict, BY>;
function inflate<P extends string, T>(path: P, initial: T): Impl3<P, T, BY>;
function inflate<
  P extends string,
  T,
  B extends string>(path: P, initial: T, by: B): Impl3<P, T, B>;
function inflate(path: string, initial?: unknown, by?: string): Dict {
  assert.string(path);
  assert.maybe.dict(initial);
  assert.maybe.string(by);

  return path.split(by ?? BY).reduceRight<unknown>((depathed, key) =>
    ({ [key]: depathed }), initial ?? {}) as never;
}

export default inflate;
