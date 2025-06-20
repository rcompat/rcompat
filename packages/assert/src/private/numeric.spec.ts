import numeric from "#numeric";
import test from "@rcompat/test";
import type Asserter from "@rcompat/test/Asserter";
import never from "@rcompat/test/never";

const trues = (assert: Asserter, strings: unknown, number: number) => {
  const array = Array.isArray(strings) ? strings : [strings];
  array.forEach(string => {
    assert(numeric(string)).true();
    assert(Number(string)).equals(number);
  });
};

const falses = (assert: Asserter, ...strings: unknown[]) => {
  strings.forEach(string => {
    assert(numeric(never(string))).false();
  });
};

test.case("numeric", assert => {
  trues(assert, ["1", "1.0"], 1);
  trues(assert, "1.5", 1.5);
  trues(assert, ["0", "0.0", "-0", "+0", "0x0"], 0);
  trues(assert, "08", 8);
  trues(assert, ["+1", "1"], 1);
  trues(assert, ["0.5", ".5"], 0.5);
  trues(assert, ["5", "5.", "5.0"], 5);
  trues(assert, ["0x10", "16"], 16);
  trues(assert, "123e4", 1230000);
  trues(assert, "-123e4", -1230000);
  trues(assert, "123e-4", 0.0123);
  trues(assert, "-123e-4", -0.0123);

  falses(assert,
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
