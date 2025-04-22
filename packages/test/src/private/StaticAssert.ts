export default class StaticAssert<T> {
  constructor(_actual: T) {}

  // type check, no body
  equals<_Expected extends T>() {}
};
