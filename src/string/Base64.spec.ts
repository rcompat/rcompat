import Base64 from "./Base64.js";

export default (test => {
  test.case("there and back again", (assert: any) => {
    assert(Base64.decode(Base64.encode("Hi"))).equals("Hi");
  });
}) satisfies DebrisTestSuite
