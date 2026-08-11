import test from "#index";

// A simple extension used across the specs.
const extended = test.extend((assert, subject: number) => ({
  even() {
    assert(subject % 2 === 0).true();
    return this;
  },
}));

extended.case("single extend still asserts", assert => {
  assert(2).even();
});

extended.group("extended-group", () => {
  extended.case("group runs on an extended test", assert => {
    assert(4).even();
  });
});

extended.case("extended test forwards spy", assert => {
  const tracked = extended.spy((a: number, b: number) => a + b);

  assert(tracked.called).false();
  tracked(1, 2);
  assert(tracked.called).true();
  assert(tracked.calls).equals([[1, 2]]);
});

const chained = test.extend((assert, subject: number) => ({
  even() {
    assert(subject % 2 === 0).true();
    return this;
  },
})).extend((assert, subject: number) => ({
  odd() {
    assert(subject % 2 === 1).true();
    return this;
  },
}));

chained.case("chained extend exposes both extensions", assert => {
  assert(2).even();
  assert(3).odd();
});

const overlap = test.extend((_assert, _subject: number) => ({
  marker: "first",
})).extend((_assert, _subject: number) => ({
  marker: "second",
}));

overlap.case("later extend wins on overlapping keys", assert => {
  assert(assert(0).marker).equals("second");
});