import maybe from "#maybe";
import test from "@rcompat/test";

test.case("nullish", assert => {
  assert(maybe.number(undefined)).true();
  assert(maybe.string(null)).true();
});

test.case("non-nullish", assert => {
  assert(maybe.number(0)).true();
  assert(maybe.string("0")).true();
});
