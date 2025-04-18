import Assert from "#Assert";

type Body = (asserter: (<T>(actual: T) => Assert<T>)) => void;

export { Body as default };
