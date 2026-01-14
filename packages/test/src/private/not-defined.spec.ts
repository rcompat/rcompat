
import test from "@rcompat/test";

test.case("defined()", assert => {
  assert("x").defined();
  assert(null).defined();
  assert(undefined).not.defined();
});

test.case(".not (negates next assertion)", assert => {
  assert(1).not.null();
  assert(null).not.undefined();
  assert(1).not.equals(2);
});

test.case(".not resets after one assertion", assert => {
  assert(1).not.null().equals(1);
});

test.case(".not toggles", assert => {
  assert(null).not.not.null();
});
