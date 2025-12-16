import numbers from "#numbers";
import test from "@rcompat/test";

const { isFinite, isInt, isNaN, isSafeint, isUint } = numbers;

test.case("isInt - true", assert => {
  assert(isInt(0)).true();
  assert(isInt(-1)).true();
  assert(isInt(42)).true();
  assert(isInt(-42)).true();
  assert(isInt(0n)).true();
  assert(isInt(42n)).true();
  assert(isInt(-42n)).true();
});

test.case("isInt - false", assert => {
  assert(isInt(3.14)).false();
  assert(isInt(-3.14)).false();
  assert(isInt(NaN)).false();
  assert(isInt(Infinity)).false();
  assert(isInt(-Infinity)).false();
  assert(isInt("42")).false();
  assert(isInt(null)).false();
  assert(isInt(undefined)).false();
  assert(isInt({})).false();
  assert(isInt([])).false();
});

test.case("isUint - true", assert => {
  assert(isUint(0)).true();
  assert(isUint(1)).true();
  assert(isUint(42)).true();
  assert(isUint(0n)).true();
  assert(isUint(42n)).true();
});

test.case("isUint - false", assert => {
  assert(isUint(-1)).false();
  assert(isUint(-42)).false();
  assert(isUint(-1n)).false();
  assert(isUint(-42n)).false();
  assert(isUint(3.14)).false();
  assert(isUint(-3.14)).false();
  assert(isUint(NaN)).false();
  assert(isUint(Infinity)).false();
  assert(isUint("42")).false();
  assert(isUint(null)).false();
  assert(isUint(undefined)).false();
});

test.case("isFinite - true", assert => {
  assert(isFinite(0)).true();
  assert(isFinite(42)).true();
  assert(isFinite(-42)).true();
  assert(isFinite(3.14)).true();
  assert(isFinite(0n)).true();
  assert(isFinite(42n)).true();
  assert(isFinite(-42n)).true();
});

test.case("isFinite - false", assert => {
  assert(isFinite(NaN)).false();
  assert(isFinite(Infinity)).false();
  assert(isFinite(-Infinity)).false();
  assert(isFinite("42")).false();
  assert(isFinite(null)).false();
  assert(isFinite(undefined)).false();
});

test.case("isNaN - true", assert => {
  assert(isNaN(NaN)).true();
  assert(isNaN(Number.NaN)).true();
  assert(isNaN(0 / 0)).true();
});

test.case("isNaN - false", assert => {
  assert(isNaN(0)).false();
  assert(isNaN(42)).false();
  assert(isNaN(Infinity)).false();
  assert(isNaN("NaN")).false();
  assert(isNaN(undefined)).false();
  assert(isNaN(null)).false();
  assert(isNaN({})).false();
});

test.case("isSafeint - true", assert => {
  assert(isSafeint(0)).true();
  assert(isSafeint(42)).true();
  assert(isSafeint(-42)).true();
  assert(isSafeint(Number.MAX_SAFE_INTEGER)).true();
  assert(isSafeint(Number.MIN_SAFE_INTEGER)).true();
});

test.case("isSafeint - false", assert => {
  assert(isSafeint(Number.MAX_SAFE_INTEGER + 1)).false();
  assert(isSafeint(Number.MIN_SAFE_INTEGER - 1)).false();
  assert(isSafeint(3.14)).false();
  assert(isSafeint(NaN)).false();
  assert(isSafeint(Infinity)).false();
  assert(isSafeint(42n)).false(); // bigint not safe integer
  assert(isSafeint("42")).false();
  assert(isSafeint(null)).false();
});
