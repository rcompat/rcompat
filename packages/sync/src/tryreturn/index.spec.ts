import identity from "@rcompat/function/identity";
import tryreturn from "@rcompat/sync/tryreturn";
import test from "@rcompat/test";
import _ from "@rcompat/test/mask/any";
import $ from "@rcompat/test/mask/error";

test.case("`try faulty", assert => {
  try {
    _(tryreturn)(undefined).orelse(identity);
  } catch (error) {
    assert($(error).message).equals("`undefined` must be of type functiond");
  }
});

// test.case("no `orelse`", assert => {
//   try {
//     tryreturn(() => 1);
//   } catch (error) {
//     assert($(error).message).equals("`tryreturn` executed without a backup");
//   }
// });
//

test.case("`orelse` faulty", assert => {
  try {
    tryreturn(() => null).orelse(undefined as never);
  } catch (error) {
    assert($(error).message).equals("`undefined` must be of type function");
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
  } catch (error) {
    assert($(error).message).equals("else");
  }
});
