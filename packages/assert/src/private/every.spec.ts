import every from "#every";
import test from "@rcompat/test";

test.case("number", assert => {
  assert(() => every.number(["1"])).throws();
  assert(() => every.number([1])).tries();
});
test.case("function", assert => {
  assert(() => every.function(["1"])).throws();
  assert(() => every.function([() => null])).tries();
  assert(() => every.function([() => null, undefined])).throws();
});
