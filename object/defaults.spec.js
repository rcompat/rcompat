import { defaults } from "rcompat/object";
import non_objects from "./non_objects.js";

export default test => {
  test.case("non-object", assert => {
    non_objects.forEach(non_object => {
      assert(defaults(non_object, { foo: "bar" })).equals({ foo: "bar" });
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
};
