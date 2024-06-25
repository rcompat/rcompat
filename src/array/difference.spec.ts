import difference from "./difference.js";

export default (test => {
  test.case("default", assert => {
    assert(difference([], [])).equals([]);
    assert(difference([], [0, 1])).equals([]);
    assert(difference([0, 1], [])).equals([0, 1]);
    assert(difference([1, 0], [0, 1])).equals([1, 0]);
    assert(difference([0, 1, 2], [1])).equals([0, 2]);
  });

}) satisfies DebrisTestSuite;
