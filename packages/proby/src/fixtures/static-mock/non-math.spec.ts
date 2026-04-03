import { add } from "#fixtures/static-mock/math";
import test from "@rcompat/test";

test.case("no static mock", assert => {
  assert(add(1, 2)).equals(3);
});
