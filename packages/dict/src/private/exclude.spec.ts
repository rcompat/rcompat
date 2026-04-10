import exclude from "#exclude";
import non_dicts from "#non-dicts";
import { Code } from "@rcompat/assert";
import test from "@rcompat/test";
import any from "@rcompat/test/any";
import undef from "@rcompat/test/undef";
import type { EmptyDict } from "@rcompat/type";

test.case("typedoc", assert => {
  const user = { id: 1, name: "Bob", password: "secret" };
  assert(exclude(user, ["password"])).equals({ id: 1, name: "Bob" });
  assert(exclude(user, ["id", "password"])).equals({ name: "Bob" });
});

test.case("faulty params", assert => {
  non_dicts.forEach(non => {
    assert(() => exclude(any(non), [])).throws(Code.invalid_dict);
  });
  assert(() => exclude(undef, [])).throws(Code.invalid_dict);
  assert(() => exclude({ foo: "bar" }, undef)).throws(Code.invalid_array);
});

test.case("exclude nothing", assert => {
  const obj = { a: 1, b: 2 };
  assert(exclude(obj, [])).equals(obj);
});

test.case("exclude single key", assert => {
  assert(exclude({ a: 1, b: 2, c: 3 }, ["b"])).equals({ a: 1, c: 3 });
});

test.case("exclude all keys", assert => {
  assert(exclude({ a: 1, b: 2 }, ["a", "b"])).equals({});
});

test.case("readonly excludes", assert => {
  const keys = ["a", "b"] as const;
  assert(exclude({ a: 1, b: 2, c: 3 }, keys)).equals({ c: 3 });
});

test.case("types", assert => {
  const obj = { name: "Alice", age: 30, active: true };
  assert(exclude(obj, ["age"])).type<Omit<typeof obj, "age">>();
  assert(exclude(obj, ["name", "active"]))
    .type<Omit<typeof obj, "name" | "active">>();
  assert(exclude({}, [])).type<Omit<EmptyDict, never>>();
});
