const is = (x: unknown): x is string => typeof x === "string";

const include = <T extends string>(x: T, y: T) => x.includes(y);

const equal = <T extends string>(x: T, y: T) => x === y;

const partial = equal;

export default { equal, include, is, partial };
