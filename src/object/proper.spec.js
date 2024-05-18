import { proper } from "rcompat/object";
import non_objects from "./non_objects.js";

const objects = [
  {},
  { foo: "bar" },
  [],
  ["foo", "bar"],
];

export default test => {
  test.case("improper", assert => {
    assert(!non_objects.some(non_object => proper(non_object))).true();
  });
  test.case("proper", assert => {
    assert(objects.every(object => proper(object))).true();
  });
};
