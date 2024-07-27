import type { DebrisTestSuite } from "@rcompat/core";
import difference from "./difference.js";

export default (test => {
  test.case("default", assert => {
    assert(difference([], [])).equals([]);
    assert(difference([], [0, 1])).equals([]);
    assert(difference([0, 1], [])).equals([0, 1]);
    assert(difference([1, 0], [0, 1])).equals([1, 0]);
    assert(difference([0, 1, 2], [1])).equals([0, 2]);
    assert(difference([1, 3, 5, 7, 9], [1, 4, 9])).equals([3, 5, 7]);
  });

}) satisfies DebrisTestSuite;
