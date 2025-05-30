import test from "@rcompat/test";
import cache from "#cache";
import undef from "@rcompat/test/undef";

test.case("invalid invariants", assert => {
  assert(() => cache.get(undef)).throws("`undefined` must be of type symbol");
});

test.case("valid variants", assert => {
  const s_foo = Symbol("foo");
  const v = cache.get(s_foo, () => 1);
  assert(v).equals(1);
  assert(cache.get(s_foo)).equals(1);
  assert(cache.get(Symbol("foo"))).equals(undefined);
});
