import { add } from "#fixtures/static-mock/math";
import test from "@rcompat/test";

test.case("static mock is preloaded before spec imports", assert => {
  assert(add(1, 2)).equals(99);
});
