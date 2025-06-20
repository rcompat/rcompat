import Is from "#Is";
import test from "@rcompat/test";
import never from "@rcompat/test/never";

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

test.case("non objects", assert => {
  fixtures.forEach(([key, values]) => {
    const non_values = fixtures.filter(entry => entry[0] !== key)
      .flatMap(([, value]) => value);
    values.forEach(value => {
      assert(new Is(value)[key]()).equals(never(value));
      non_values.forEach(non_value =>
        assert(() => new Is(non_value)[key]()).throws());
    });
  });
});
