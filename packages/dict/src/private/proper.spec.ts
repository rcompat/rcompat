import non_dicts from "#non-dicts";
import proper from "#proper";
import test from "@rcompat/test";

const dicts = [
  {},
  { foo: "bar" },
  [],
  ["foo", "bar"],
];

test.case("is not", assert => {
  assert(!non_dicts.some(non_dict => proper(non_dict))).true();
});
test.case("is", assert => {
  assert(dicts.every(dict => proper(dict))).true();
});
