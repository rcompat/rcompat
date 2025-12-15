import nullish from "#nullish";
import test from "@rcompat/test";

test.case("false", assert => {
  const values = [
    0,
    "000",
    true,
    false,
    0n,
    [],
    {},
    new Date(),
  ];
  for (const s of values) assert(nullish(s)).false();
});

test.case("true", assert => {
  const vals = [null, undefined];
  for (const s of vals) assert(nullish(s)).true();
});
