import type Assert from "#Assert";
import type Asserter from "#Asserter";
import type Body from "#Body";
import type { MaybePromise } from "@rcompat/type";
import type import_ from "#import";
import type intercept from "#intercept";
import type mock from "#mock";
import type spy from "#spy";

type ExtendedAssert<T, Extensions> = Assert<T> & Extensions;

type ExtendedAsserter<Extensions> =
  <const T>(actual?: T) => ExtendedAssert<T, Extensions>;

type ExtendedBody<Extensions> =
  (asserter: ExtendedAsserter<Extensions>) => MaybePromise<void>;

export type Factory<Subject, Extensions> =
  (assert: Asserter, subject: Subject) => Extensions;

type Base = {
  case(name: string, body: Body): void;
  ended(end: () => MaybePromise<void>): void;
  group(name: string, fn: () => void): void;
  mock: typeof mock;
  spy: typeof spy;
  import: typeof import_;
  intercept: typeof intercept;
};

type Forwarded = Omit<Base, "case">;

export type ExtendedTest<Extensions> = Forwarded & {
  case(name: string, body: ExtendedBody<Extensions>): void;

  extend<ForwardedSubject, ForwardedExtensions>(
    factory: Factory<ForwardedSubject, ForwardedExtensions>,
  ): ExtendedTest<Extensions & ForwardedExtensions>;
};

const extend = <Subject, Extensions>(
  base: Base,
  factory: Factory<Subject, Extensions>,
): ExtendedTest<Extensions> => {
  const extended_case = (name: string, body: ExtendedBody<Extensions>) =>
    base.case(name, asserter => {
      const extended = <T>(actual?: T) => {
        const a = asserter(actual);
        const extra = factory(asserter, actual as Subject);
        return Object.assign(a, extra) as Assert<T> & Extensions;
      };
      return body(extended as ExtendedAsserter<Extensions>);
    });

  return {
    ...base, // forwards ended, group, mock, spy, import, intercept
    case: extended_case, // overrides base.case with the wrapping variant
    extend<ForwardedSubject, ForwardedExtensions>(forwardedFactory: Factory<ForwardedSubject, ForwardedExtensions>) {
      const combined: Factory<ForwardedSubject | Subject, Extensions & ForwardedExtensions> =
        (assert, subject) => ({
          ...factory(assert, subject as Subject),
          ...forwardedFactory(assert, subject as ForwardedSubject),
        });

      return extend(base, combined);
    },
  };
};

export default extend;
