import type StaticAssert from "#StaticAssert";

type StaticAsserter = <T>(actual: T) => StaticAssert<T>;

export { StaticAsserter as default };
