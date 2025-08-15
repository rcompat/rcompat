import isNumeric from "#numeric";
import test from "@rcompat/test";

test.case("valid decimal numeric strings", (assert) => {
  const values = [
    "0",
    "000",
    "-3",
    "+4.5",
    "1.",
    ".5",
    "6e-2",
    "6E+2",
    "1.e3",
    "+.5e10",
    "  42 ",
    " +0.0 ",
    " .0 ",
  ];
  for (const s of values) assert(isNumeric(s)).true();
});

test.case("invalid numeric strings (syntax)", (assert) => {
  const vals = [
    "",          // empty
    "   ",       // whitespace only
    "+", "-",    // sign only
    ".", " . ",  // bare dot
    "+.", "-.",  // sign + dot but no digits
    "1e", "e10", // incomplete exponent / missing significand
    "--1", "++1",
    "1..0",
    ".e1",
    "1 2", " 1 2 ",
    "NaN", "Infinity", "-Infinity",
    "0x10",      // hex not allowed in decimal-only
    "1_000",     // underscores not allowed
    "1,000",     // commas not allowed
    "123n",      // BigInt literal as string
    "−1",        // Unicode minus (U+2212)
  ];
  for (const s of vals) assert(isNumeric(s)).false();
});

test.case("trimming behavior", (assert) => {
  assert(isNumeric("  \t\n3.14  ")).true();
  assert(isNumeric("  \n  ")).false();
});

test.case("non-string inputs are rejected", (assert) => {
  const vals: unknown[] = [
    123, -0, 3.14, Number.NaN, Number.POSITIVE_INFINITY,
    10n,
    null, undefined,
    true, false,
    {}, [], () => { },
  ];
  for (const v of vals) assert(isNumeric(v)).false();
});

test.case("very large exponents are still syntactically numeric", (assert) => {
  // NB: string is syntactically numeric even if Number("1e309") is Infinity
  assert(isNumeric("1e309")).true();
});
