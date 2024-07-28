import type { DebrisTestSuite } from "@rcompat/core";
import Base64 from "@rcompat/string/base64";

export default (test => {
  test.case("there and back again", assert => {
    assert(Base64.decode(Base64.encode("Hi"))).equals("Hi");
  });
}) satisfies DebrisTestSuite
