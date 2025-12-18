import is from "#index";
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
  for (const s of values) assert(is.nullish(s)).false();
});

test.case("true", assert => {
  const vals = [null, undefined];
  for (const s of vals) assert(is.nullish(s)).true();
});
