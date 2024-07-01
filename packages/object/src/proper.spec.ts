import type { DebrisTestSuite } from "@rcompat/core";
import proper from "./proper.js";
import non_objects from "./non-objects.js";

const objects = [
  {},
  { foo: "bar" },
  [],
  ["foo", "bar"],
];

export default (test => {
  test.case("improper", assert => {
    assert(!non_objects.some(non_object => proper(non_object))).true();
  });
  test.case("proper", assert => {
    assert(objects.every(object => proper(object))).true();
  });
}) satisfies DebrisTestSuite;
