import is from "#index";
import test from "@rcompat/test";

test.case("is.f32", assert => {
  assert(is.f32(1)).true();
  assert(is.f32(0.5)).true();
  assert(is.f32(Math.fround(0.1))).true();
  assert(is.f32(0.1)).false();
  assert(is.f32(NaN)).false();
  assert(is.f32("1")).false();
});

test.case("is.f32array", assert => {
  assert(is.f32array(new Float32Array())).true();
  assert(is.f32array(new Float64Array())).false();
  assert(is.f32array(new Uint8Array())).false();
  assert(is.f32array([])).false();
});

test.case("is.f64array", assert => {
  assert(is.f64array(new Float64Array())).true();
  assert(is.f64array(new Float32Array())).false();
  assert(is.f64array(new Uint8Array())).false();
  assert(is.f64array([])).false();
});
