import assert from "@rcompat/assert";
import type { Dict } from "@rcompat/type";

export interface GetResultType<T, P, D extends number[] = []> {
  result: D["length"] extends 6
  ? unknown
  : P extends `${infer P1}.${infer Rest}`
  ? P1 extends keyof T
  ? GetResultType<Exclude<T[P1], undefined>, Rest, [...D, 0]>["result"] | (T[P1] & undefined)
  : undefined
  : P extends keyof T
  ? T[P]
  : undefined;
}

function get<T extends Dict, P extends string>(dict: T, path: P):
  GetResultType<T, P>["result"] {
  assert.dict(dict);
  assert.string(path);

  return path.split(".").reduce((subobject, key) =>
    (subobject as never)[key], dict) as never;
}

export default get;
