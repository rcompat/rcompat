import crypto from "rcompat/crypto";
import FlatFile from "./FlatFile.js";

export default (test => {
  test.case("write", async assert => {
    const filename = `/tmp/test-${crypto.randomUUID()}.txt`;
    await FlatFile.write(filename, "test");
    assert(await FlatFile.text(filename)).equals("test");
    await FlatFile.remove(filename);
  });
  test.case("write with path", async assert => {
    const filename = `/tmp/a/b/c/test-${crypto.randomUUID()}.txt`;
    await FlatFile.write(filename, "test");
    assert(await FlatFile.text(filename)).equals("test");
    await FlatFile.remove(filename);
  });
}) satisfies DebrisTestSuite;
