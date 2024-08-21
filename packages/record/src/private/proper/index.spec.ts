import proper from "#proper";
import non_records from "#non-records";
import type { DebrisTestSuite } from "@rcompat/core";

const records = [
  {},
  { foo: "bar" },
  [],
  ["foo", "bar"],
];

export default (test => {
  test.case("is not", assert => {
    assert(!non_records.some(non_record => proper(non_record))).true();
  });
  test.case("is", assert => {
    assert(records.every(record => proper(record))).true();
  });
}) satisfies DebrisTestSuite;
