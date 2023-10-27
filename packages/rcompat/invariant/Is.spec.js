import Is from "./Is.js";

const fixtures = Object.entries({
  string: ["", String()],
  number: [0, Number(0)],
  bigint: [0n],
  boolean: [true, false],
  function: [() => undefined, function func() {
    return undefined;
  }],
  null: [null],
  undefined: [undefined],
});

export default test => {
  test.case("non objects", assert => {
    fixtures.forEach(([key, values]) => {
      const nonValues = fixtures.filter(entry => entry[0] !== key)
        .flatMap(([, value]) => value);
      values.forEach(value => {
        assert(new Is(value)[key]()).equals(value);
        nonValues.forEach(nonValue =>
          assert(() => new Is(nonValue)[key]()).throws());
      });
    });
  });
};
