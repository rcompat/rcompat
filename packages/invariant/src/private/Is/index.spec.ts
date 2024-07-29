import type { DebrisTestSuite } from "@rcompat/core";
import Is from "#Is";

const fixturesMap = {
  string: ["", String()],
  number: [0, Number(0)],
  bigint: [0n],
  boolean: [true, false],
  function: [() => undefined, function() {
    return undefined;
  }],
  null: [null],
  undefined: [undefined],
} satisfies Partial<Record<keyof Is, unknown[]>>;

const fixtures = Object.entries(fixturesMap) as [keyof typeof fixturesMap, unknown[]][];

export default (test => {
  test.case("non objects", assert => {
    fixtures.forEach(([key, values]) => {
      const nonValues = fixtures.filter(entry => entry[0] !== key)
        .flatMap(([, value]) => value as any);
      values.forEach(value => {
        assert(new Is(value)[key]()).equals(value);
        nonValues.forEach(nonValue =>
          assert(() => new Is(nonValue)[key]()).throws());
      });
    });
  });
}) satisfies DebrisTestSuite;
