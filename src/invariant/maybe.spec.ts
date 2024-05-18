import maybe from "./maybe.js";

export default (test => {
  test.case("nullish", assert => {
    assert(maybe(undefined).number()).undefined();
    assert(maybe(null).string()).equals(null);
  });

  test.case("non-nullish", assert => {
    assert(maybe(0).number()).equals(0);
    assert(maybe("0").string()).equals("0");
  });
}) satisfies DebrisTestSuite;
