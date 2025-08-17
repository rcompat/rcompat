import Is from "#Is";
import test from "@rcompat/test";
import any from "@rcompat/test/any";

const fix = {
  bigint: [0n],
  boolean: [true, false],
  function: [() => undefined, function() {
    return undefined;
  }],
  null: [null],
  number: [0, Number(0)],
  string: ["", String()],
  undefined: [undefined],
} satisfies Partial<Record<keyof Is, unknown[]>>;

const fixtures = Object.entries(fix) as [keyof typeof fix, unknown[]][];

test.case("non objects", assert => {
  fixtures.forEach(([key, values]) => {
    const non_values = fixtures.filter(entry => entry[0] !== key)
      .flatMap(([, value]) => value);
    values.forEach(value => {
      assert(new Is(value)[key]()).equals(any(value));
      non_values.forEach(non_value =>
        assert(() => new Is(non_value)[key]()).throws());
    });
  });
});
