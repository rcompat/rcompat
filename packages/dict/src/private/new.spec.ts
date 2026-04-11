import $new from "#new";
import test from "@rcompat/test";

test.case("creates null proto object", assert => {
  const obj = $new({ foo: "bar" });
  assert(Object.getPrototypeOf(obj)).equals(null);
});

test.case("is frozen", assert => {
  const obj = $new({ foo: "bar" });
  assert(Object.isFrozen(obj)).equals(true);
});

test.case("contains the given entries", assert => {
  const obj = $new({ foo: "bar", baz: "qux" });
  assert(obj.foo).equals("bar");
  assert(obj.baz).equals("qux");
});

test.case("empty object", assert => {
  const obj = $new({});
  assert(Object.keys(obj)).equals([]);
  assert(Object.isFrozen(obj)).equals(true);
  assert(Object.getPrototypeOf(obj)).equals(null);
});

test.case("cannot be modified", assert => {
  const obj = $new({ foo: "bar" });
  assert(() => { (obj as any).foo = "baz"; }).throws(TypeError);
});

test.case("types", assert => {
  assert($new({ foo: "bar" })).type<Readonly<{ foo: string }>>();
  assert($new({ foo: "bar", baz: 1 }))
    .type<Readonly<{ foo: string; baz: number }>>();
});
