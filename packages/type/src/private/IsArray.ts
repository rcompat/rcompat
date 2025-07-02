import type IsAny from "#IsAny";
import type IsNever from "#IsNever";
import type IsTuple from "#IsTuple";
import type Some from "#Some";

type IsArray<T> =
  Some<[IsNever<T>, IsAny<T>]> extends true ? false :
    [T] extends [readonly unknown[]]
      ? IsTuple<T> extends true ? false : true
      : false;

export type { IsArray as default };
