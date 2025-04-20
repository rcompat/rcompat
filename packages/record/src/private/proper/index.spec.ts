import non_records from "#non-records";
import proper from "#proper";
import test from "@rcompat/test";

const records = [
  {},
  { foo: "bar" },
  [],
  ["foo", "bar"],
];

test.case("is not", assert => {
  assert(!non_records.some(non_record => proper(non_record))).true();
});
test.case("is", assert => {
  assert(records.every(record => proper(record))).true();
});
