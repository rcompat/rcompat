import test from "#index";

using math = test.mock("#fixtures/math", () => ({
  add: (a: number, b: number) => 99,
}));

const { add } = await test.import("#fixtures/math");

test.case("returns mocked value", async assert => {
  assert(add(1, 2)).equals(99);
});

test.case("tracks calls", async assert => {
  add(1, 2);
  assert(math.add.calls.length).equals(1);
});

test.case("tracked called", async assert => {
  add(1, 2);
  assert(math.add.called).true();
});
