import map from "#async/map";
import test from "@rcompat/test";

test.case("0 case", async assert => {
  assert(await map([], _ => _)).equals([]);
});
test.case("1 case", async assert => {
  assert(await map([Promise.resolve(1)], _ => _)).equals([1]);
});
test.case("n case", async assert => {
  const p = <T>(val: T) => Promise.resolve(val);
  assert(await map([p(0), p(1)], _ => _)).equals([0, 1]);
});
