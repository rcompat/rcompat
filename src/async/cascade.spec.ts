import cascade from "./cascade.js";

const last = -1;
// sync slicer
const s = (_: string) => _.slice(0, last);
// async slicer
const as = async (_: string) => _.slice(0, last);
// sync slicer + next
const sn = (_: string, next: Function) => next(_.slice(0, last));
// async slicer + next
const asn = async (_: string, next: Function) => next(_.slice(0, last));

export default (test => {
  test.case("0 case", async assert => {
    assert(await cascade([])("test")).equals("test");
  });
  test.case("1 case", async assert => {
    // last doesn't call next
    assert(cascade([s])("test")).equals("tes");
    assert(await cascade([as])("test")).equals("tes");
    assert(cascade([sn])("test")).equals("tes");
    assert(await cascade([asn])("test")).equals("tes");
  });
  test.case("n case", async assert => {
    assert(cascade([sn, sn])("test")).equals("te");
    assert(await cascade([asn, asn])("test")).equals("te");
  });
  test.case("initial", async assert => {
    // last doesn't call next
    assert(cascade([sn], s)("test")).equals("te");
    assert(await cascade([asn], s)("test")).equals("te");
    assert(await cascade([sn], as)("test")).equals("te");
    assert(await cascade([asn], as)("test")).equals("te");
  });
}) satisfies DebrisTestSuite;
