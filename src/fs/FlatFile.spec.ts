import crypto from "rcompat/crypto";
import { write, text, remove } from "rcompat/fs";

export default (test => {
  test.case("write", async assert => {
    const filename = `/tmp/test-${crypto.randomUUID()}.txt`;
    await write(filename, "test");
    assert(await text(filename)).equals("test");
    await remove(filename);
  });
  test.case("write with path", async assert => {
    const filename = `/tmp/a/b/c/test-${crypto.randomUUID()}.txt`;
    await write(filename, "test");
    assert(await text(filename)).equals("test");
    await remove(filename);
  });
}) satisfies DebrisTestSuite;
