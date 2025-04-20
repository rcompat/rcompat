import upperfirst from "@rcompat/string/upperfirst";
import test from "@rcompat/test";

test.case("empty string", assert => {
  assert(upperfirst("")).equals("");
});
test.case("uppercased -> unchanged", assert => {
  assert(upperfirst("Hi")).equals("Hi");
  assert(upperfirst("HI")).equals("HI");
});
test.case("lowercased", assert => {
  assert(upperfirst("hi")).equals("Hi");
});
