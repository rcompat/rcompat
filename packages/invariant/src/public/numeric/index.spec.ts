import type { DebrisTestSuite } from "@rcompat/core";
import numeric from "@rcompat/invariant/numeric";

export default (test => {
  // Todo: Figure a way to properly type reassert
  test.reassert(assert => {
    return {
      trues(strings: any, number: any) {
        const array = Array.isArray(strings) ? strings : [strings];
        array.forEach(string => {
          assert(numeric(string)).true();
          assert(Number(string)).equals(number);
        });
      },
      falses(...strings: any[]) {
        strings.forEach(string => {
          assert(numeric(string)).false();
        });
      },
    };
  });
  test.case("numeric", ({ trues, falses }: any) => {
    trues(["1", "1.0"], 1);
    trues("1.5", 1.5);
    trues(["0", "0.0", "-0", "+0", "0x0"], 0);
    trues("08", 8);
    trues(["+1", "1"], 1);
    trues(["0.5", ".5"], 0.5);
    trues(["5", "5.", "5.0"], 5);
    trues(["0x10", "16"], 16);
    trues("123e4", 1230000);
    trues("-123e4", -1230000);
    trues("123e-4", 0.0123);
    trues("-123e-4", -0.0123);

    falses(
      "1n", "1,0",
      "Infinity", "-Infinity",
      "NaN", "-NaN",
      "", " ",
      "5..", "..5",
      1, 1n,
      Symbol("1"),
      [], {},
      null, undefined,
      true, false,
    );
  });
}) satisfies DebrisTestSuite;
