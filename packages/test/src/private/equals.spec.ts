import fn from "#equals";
import test from "#index";
import type Dict from "@rcompat/type/Dict";

test.case("string", assert => {
  assert(fn("", "")).true();
  assert(fn("foo", "foo")).true();

  assert(fn("foo", "bar")).false();
  assert(fn("foo", "")).false();
  assert(fn("", "foo")).false();
});

test.case("number", assert => {
  assert(fn(0, 0)).true();
  assert(fn(0, -0)).true();
  assert(fn(1, 1)).true();
  assert(fn(Infinity, Infinity)).true();
  assert(fn(-Infinity, -Infinity)).true();
  assert(fn(NaN, NaN)).true();

  assert(fn(1, 0)).false();
  assert(fn(0, 1)).false();
});

test.case("bigint", assert => {
  assert(fn(0n, 0n)).true();
  assert(fn(0n, -0n)).true();
  assert(fn(1n, 1n)).true();

  assert(fn(1n, 0n)).false();
  assert(fn(0n, 1n)).false();
});

test.case("boolean", assert => {
  assert(fn(true, true)).true();
  assert(fn(false, false)).true();

  assert(fn(true, false)).false();
  assert(fn(false, true)).false();
});

test.case("symbol", assert => {
  assert(fn(Symbol.for("foo"), Symbol.for("foo"))).true();

  assert(fn(Symbol("foo"), Symbol("foo"))).false();
  assert(fn(Symbol("foo"), Symbol("bar"))).false();
  assert(fn(Symbol.for("foo"), Symbol.for("baz"))).false();
});

test.case("undefined", assert => {
  assert(fn(undefined, undefined)).true();

  assert(fn(undefined, null)).false();
  assert(fn(null, undefined)).false();
});

test.case("null", assert => {
  assert(fn(null, null)).true();

  assert(fn(null, {})).false();
  assert(fn({}, null)).false();
});

test.case("object", assert => {
  assert(fn({}, {})).true();
  assert(fn({ foo: "bar" }, { foo: "bar" })).true();

  assert(fn({}, { foo: "bar" })).false();
  assert(fn({ foo: "bar" }, {})).false();
  assert(fn({ foo: "bar"}, { foo: "baz" })).false();
  assert(fn({ foo: "bar"}, { bar: "baz" })).false();
  assert(fn({ foo: "bar"}, { bar: [], foo: "bar" })).false();
});

test.case("Array", assert => {
  assert(fn([], [])).true();
  assert(fn(["" ], ["" ])).true();
  assert(fn(["",, ""], ["",, ""])).true();
  assert(fn([ { foo: "bar" }], [ { foo: "bar" }])).true();

  assert(fn([], ["foo"])).false();
  assert(fn(["foo"], [])).false();
  assert(fn(["" ], ["", "foo"])).false();
  assert(fn(["", "foo"], [, "" ])).false();
  assert(fn(["" ], [, ""])).false();
});

test.case("Date", assert => {
  const now = Date.now();
  const d0 = new Date(now);
  const d1 = new Date(now);

  assert(fn(d0, d0)).true();
  assert(fn(d0, d1)).true();

  assert(fn(d0, new Date(now+1))).false();
});

test.case("Set", assert => {
  const s0 = new Set(["foo"]);

  assert(fn(s0, s0)).true();
  assert(fn(s0, new Set(["foo"]))).true();
  assert(fn(new Set([1, 2]), new Set([2, 1]))).true();
  assert(fn(new Set([2, 1, 2]), new Set([2, 1]))).true();
  assert(fn(new Set([0]), new Set(Array.from({ length: 10 }, _ => 0)))).true();
  assert(fn(new Set([{ foo: "bar" }]), new Set([{ foo: "bar" }]))).true();
  assert(fn(new Set([{ foo: "bar" }, { bar: "baz" }]),
    new Set([{ bar: "baz" }, { foo: "bar" }]))).true();

  assert(fn(s0, new Set(["bar"]))).false();
  assert(fn(new Set([1, 2]), new Set([1, 2, 3]))).false();
  assert(fn(new Set([1, 2, 3]), new Set([1, 2]))).false();
  assert(fn(new Set([]), new Set([1]))).false();
  assert(fn(new Set([1]), new Set([0]))).false();
});

test.case("Map", assert => {
  const map = (o: Dict) => new Map(Object.entries(o));

  const o0 = { foo: "bar" };
  const o1 = { foo: { bar: "baz" }};
  const o2 = { bar: "baz", foo: "bar" };
  const m0 = map(o0);

  assert(fn(new Map(), new Map())).true();
  assert(fn(m0, m0)).true();
  assert(fn(m0, map(o0))).true();
  assert(fn(map(o1), map(o1))).true();

  assert(fn(map(o0), map(o1))).false();
  assert(fn(new Map(), map(o0))).false();
  assert(fn(map(o2), map(o1))).false();
  assert(fn(map({ foo: "bar"}), map({ foo: "baz" }))).false();
  assert(fn(map({ foo: "bar"}), map({ bar: "baz" }))).false();
  assert(fn(map({ foo: "bar"}), map({ bar: [], foo: "bar" }))).false();
  assert(fn(map({ bar: [], foo: "bar"}), map({ foo: "bar" }))).false();
});

test.case("function", assert => {
  const fn0 = () => true;
  const fn1 = () => true;
  const fn2 = (_: unknown) => true;
  const fn3 = (_: unknown) => true;
  const fn4 = (_: unknown, __: unknown) => true;

  assert(fn0).equals(fn1);
  assert(fn0).nequals(fn2);
  assert(fn2).nequals(fn1);
  assert(fn2).equals(fn3);
  assert(fn0).nequals(fn3);
  assert(fn0).nequals(fn4);
});
