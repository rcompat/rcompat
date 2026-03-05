import test from "#index";

declare global {
  var secret: number;
}

test.case("environment globals are accessible", assert => {
  assert(globalThis.secret).equals(123);
});
