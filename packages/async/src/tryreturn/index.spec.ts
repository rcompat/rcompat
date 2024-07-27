import type { DebrisTestSuite } from "@rcompat/core";
import tryreturn from "./tryreturn.js";

export default (test => {
  test.case("`try` faulty", async assert => {
    try {
      await tryreturn(undefined as never).orelse(async () => null);
    } catch (error: any) {
      assert(error.message).equals("`undefined` must be of type function");
    }
  });
  test.case("no `orelse`", async assert => {
    try {
      await tryreturn(async () => 1);
    } catch (error: any) {
      assert(error.message).equals("`tryreturn` executed without a backup");
    }
  });
  test.case("`orelse` faulty", async assert => {
    try {
      await tryreturn(async () => null).orelse(undefined as never);
    } catch (error: any) {
      assert(error.message).equals("`undefined` must be of type function");
    }
  });
  test.case("`try` doesn't throw", async assert => {
    const value2 = await tryreturn(async () => 0).orelse(async () => 1);
    assert(value2).equals(0);
  });
  test.case("if throws", async assert => {
    const value = await tryreturn(async () => {
      throw new Error();
    }).orelse(async  _=> 1);
    assert(value).equals(1);
  });
  test.case("else throws", async assert => {
    try {
      await tryreturn(async () => {
        throw new Error();
      }).orelse(async _ => {
        throw new Error("else");
      });
    } catch (error: any) {
      assert(error.message).equals("else");
    }
  });
}) satisfies DebrisTestSuite;
