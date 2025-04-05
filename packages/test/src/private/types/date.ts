const is = (x: unknown): x is Date => x instanceof Date;

const equal = <T extends Date>(x: T, y: T) => x.getTime() === y.getTime();

const partial = equal;

const include = equal;

export default { equal, include, is, partial };
