const scalars = ["bigint", "boolean", "number", "string", "symbol", "undefined"];
type Scalar = typeof scalars[number];

const is = (x: unknown): x is Scalar => scalars.includes(typeof x as Scalar);

const equal = <T>(x: T, y: T) => x === y || Object.is(x, y);

const include = equal;

const partial = equal;

export default { equal, include, is, partial };
