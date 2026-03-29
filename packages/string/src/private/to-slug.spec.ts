import toSlug from "#to-slug";
import test from "@rcompat/test";

test.case("ascii", assert => {
  assert(toSlug("Hello World")).equals("hello-world");
  assert(toSlug("  foo  bar  ")).equals("foo-bar");
});

test.case("diacritics are reduced", assert => {
  assert(toSlug("Héllo Wörld")).equals("hello-world");
  assert(toSlug("café")).equals("cafe");
  assert(toSlug("naïve")).equals("naive");
});

test.case("non-latin characters are stripped", assert => {
  assert(toSlug("日本語")).equals("");  // or should this throw?
});
