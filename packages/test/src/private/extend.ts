import type Assert from "#Assert";
import type Asserter from "#Asserter";
import type Body from "#Body";
import type { MaybePromise } from "@rcompat/type";

type ExtendedAssert<T, Extensions> = Assert<T> & Extensions;

type ExtendedAsserter<Extensions> =
  <const T>(actual?: T) => ExtendedAssert<T, Extensions>;

type ExtendedBody<Extensions> =
  (asserter: ExtendedAsserter<Extensions>) => MaybePromise<void>;

export type Factory<Subject, Extensions> =
  (assert: Asserter, subject: Subject) => Extensions;

export type ExtendedTest<Extensions> = {
  case(name: string, body: ExtendedBody<Extensions>): void;
  ended(end: () => MaybePromise<void>): void;
};

type Base = {
  case(name: string, body: Body): void;
  ended(end: () => MaybePromise<void>): void;
};

export default <Subject, Extensions>(
  base: Base,
  factory: Factory<Subject, Extensions>,
): ExtendedTest<Extensions> => ({
  case(name, body) {
    base.case(name, asserter => {
      const extended = <T>(actual?: T) => {
        const a = asserter(actual);
        const extra = factory(asserter, actual as Subject);
        return Object.assign(Object.create(a) as Assert<T>, extra);
      };
      return body(extended as ExtendedAsserter<Extensions>);
    });
  },
  ended: base.ended.bind(base),
});
