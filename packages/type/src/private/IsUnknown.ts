import type IsAny from "#IsAny";
import type Not from "#Not";

type IsUnknown<T> = [unknown] extends [T] ? Not<IsAny<T>> : false;

export type { IsUnknown as default };
