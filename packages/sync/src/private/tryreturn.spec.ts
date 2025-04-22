import tryreturn from "#tryreturn";
import identity from "@rcompat/function/identity";
import test from "@rcompat/test";
import E from "@rcompat/test/E";
import undef from "@rcompat/test/undef";

test.case("`try` faulty", assert => {
  try {
    tryreturn(undef).orelse(identity);
  } catch (error) {
    assert(E(error).message).equals("`undefined` must be of type function");
  }
});

// test.case("no `orelse`", assert => {
//   try {
//     tryreturn(() => 1);
//   } catch (error) {
//     assert(E(error).message).equals("`tryreturn` executed without a backup");
//   }
// });
//

test.case("`orelse` faulty", assert => {
  try {
    tryreturn(() => null).orelse(undef);
  } catch (error) {
    assert(E(error).message).equals("`undefined` must be of type function");
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
    assert(E(error).message).equals("else");
  }
});
