import type { UnknownFunction } from "@rcompat/type";

const is = (x: unknown): x is UnknownFunction => typeof x === "function";

const equal = <T extends UnknownFunction>(x: T, y: T) => x.length === y.length;

export default { equal, is };
