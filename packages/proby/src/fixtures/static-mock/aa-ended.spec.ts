import { complete } from "#fixtures/static-mock/end-state";
import test from "@rcompat/test";

test.case("registers async end hook", assert => {
  assert(true).equals(true);
});

test.ended(async () => {
  await new Promise(resolve => setTimeout(resolve, 25));
  complete();
});
