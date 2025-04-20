export type UnknownFn = (...params: unknown[]) => unknown;

const is = (x: unknown): x is UnknownFn => typeof x === "function";

const equal = <T extends UnknownFn>(x: T, y: T) => x.length === y.length;

export default { is, equal };
