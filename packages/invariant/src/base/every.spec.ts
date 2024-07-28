import type { DebrisTestSuite } from "@rcompat/core";
import Every from "@rcompat/invariant/base/every";

export default (test => {
  test.case("constructor", assert => {
    assert(() => new Every()).nthrows();
  });
  test.case("number", assert => {
    assert(() => new Every("1").number()).throws();
    assert(() => new Every(1).number()).nthrows();
  });
  test.case("function", assert => {
    assert(() => new Every("1").function()).throws();
    assert(() => new Every(() => null).function()).nthrows();
    assert(() => new Every(() => null, undefined).function()).throws();
  });
}) satisfies DebrisTestSuite;
