import type Assert from "#Assert";

type Asserter = <T>(actual?: T) => Assert<T>;

export { Asserter as default };
