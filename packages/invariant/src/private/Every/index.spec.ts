import Every from "#Every";
import test from "@rcompat/test";

test.case("constructor", assert => {
  assert(() => new Every()).tries();
});
test.case("number", assert => {
  assert(() => new Every("1").number()).throws();
  assert(() => new Every(1).number()).tries();
});
test.case("function", assert => {
  assert(() => new Every("1").function()).throws();
  assert(() => new Every(() => null).function()).tries();
  assert(() => new Every(() => null, undefined).function()).throws();
});
