import maybe from "#maybe";
import test from "@rcompat/test";

test.case("nullish", assert => {
  assert(maybe.number(undefined)).equals(undefined);
  assert(maybe.string(null)).equals(null);
});

test.case("non-nullish", assert => {
  assert(maybe.number(0)).equals(0);
  assert(maybe.string("0")).equals("0");
});

test.case("non-nullish invalid", assert => {
  assert(() => maybe.number("0")).throws();
  assert(() => maybe.string(0)).throws();
});

test.case("instance", assert => {
  class C { }
  const c = new C();

  assert(maybe.instance(null, C)).equals(null);
  assert(maybe.instance(undefined, C)).equals(undefined);
  assert(maybe.instance(c, C)).equals(c);
  assert(() => maybe.instance({}, C)).throws();
});
