import type { DebrisTestSuite } from "@rcompat/core";
import { identity } from "@rcompat/function";
import tryreturn from "./tryreturn.js";

export default (test => {
  test.case("`try` faulty", assert => {
    try {
      tryreturn(undefined as never).orelse(identity);
    } catch (error: any) {
      assert(error.message).equals("`undefined` must be of type function");
    }
  });
  // test.case("no `orelse`", assert => {
  //   try {
  //     tryreturn(() => 1);
  //   } catch (error) {
  //     assert(error.message).equals("`tryreturn` executed without a backup");
  //   }
  // });
  test.case("`orelse` faulty", assert => {
    try {
      tryreturn(() => null).orelse(undefined as never);
    } catch (error: any) {
      assert(error.message).equals("`undefined` must be of type function");
    }
  });
  test.case("`try` doesn't throw", assert => {
    const value = tryreturn(() => 0).orelse(_ => 1);
    assert(value).equals(0);
  });
  test.case("if throws", assert => {
    const value = tryreturn(() => {
      throw new Error();
    }).orelse(_ => 1);
    assert(value).equals(1);
  });
  test.case("else throws", assert => {
    try {
      tryreturn(() => {
        throw new Error();
      }).orelse(_ => {
        throw new Error("else");
      });
    } catch (error: any) {
      assert(error.message).equals("else");
    }
  });
}) satisfies DebrisTestSuite;
