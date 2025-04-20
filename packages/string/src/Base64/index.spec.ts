import Base64 from "@rcompat/string/Base64";
import test from "@rcompat/test";

test.case("there and back again", assert => {
  assert(Base64.decode(Base64.encode("Hi"))).equals("Hi");
});
