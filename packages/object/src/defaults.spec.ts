import type { DebrisTestSuite } from "@rcompat/core";
import defaults from "./defaults.js";
import non_objects from "./non-objects.js";

const INVALID_VALUE = (val: unknown) => { return val as never };

export default (test => {
  test.case("non-object", assert => {
    non_objects.forEach(non_object => {
      assert(() => defaults(INVALID_VALUE(non_object), { foo: "bar" })).throws();
    });
  });
  test.case("simple object", assert => {
    assert(defaults({}, { foo: "bar" })).equals({ foo: "bar" });
    assert(defaults({ foo: "baz" }, { foo: "bar" })).equals({ foo: "baz" });
    assert(defaults({ bar: "baz" }, { foo: "bar" }))
      .equals({ foo: "bar", bar: "baz" });
  });
  test.case("deep object", assert => {
    assert(defaults({ foo: "bar" }, { baz: { x: "y" } }))
      .equals({ foo: "bar", baz: { x: "y" } });
  });
}) satisfies DebrisTestSuite;
