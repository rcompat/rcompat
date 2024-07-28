import type { DebrisTestSuite } from "@rcompat/core";
import upperfirst from "@rcompat/string/upperfirst";

export default (test => {
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
}) satisfies DebrisTestSuite;
