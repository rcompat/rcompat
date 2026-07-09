import { is_complete } from "#fixtures/static-mock/end-state";
import test from "@rcompat/test";

test.case("awaits async end hook before next spec", assert => {
  assert(is_complete()).equals(true);
});
