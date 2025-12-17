import type Dict from "@rcompat/type/Dict";

type GetResultType<T, P, D extends number[] = []> =
  D["length"] extends 6
  ? unknown
  : P extends `${infer P1}.${infer Rest}`
  ? P1 extends keyof T
  ? GetResultType<Exclude<T[P1], undefined>, Rest, [...D, 0]> | (T[P1] & undefined)
  : undefined
  : P extends keyof T
  ? T[P]
  : undefined;

export default <T extends Dict, P extends string>(dict: T, path: P):
  GetResultType<T, P> =>
  path.split(".").reduce((subobject, key) =>
    (subobject as never)[key], dict) as never;
