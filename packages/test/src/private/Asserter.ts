import type Assert from "#Assert";

type Asserter = <const T>(actual?: T) => Assert<T>;

export { Asserter as default };
