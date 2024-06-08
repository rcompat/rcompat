import crypto from "rcompat/crypto";
import File from "./File.js";

export default (test => {
  test.case("write", async assert => {
    const filename = `/tmp/test-${crypto.randomUUID()}.txt`;
    await File.write(filename, "test");
    assert(await File.text(filename)).equals("test");
    await File.remove(filename);
  });
  test.case("write with path", async assert => {
    const filename = `/tmp/a/b/c/test-${crypto.randomUUID()}.txt`;
    await File.write(filename, "test");
    assert(await File.text(filename)).equals("test");
    await File.remove(filename);
  });
}) satisfies DebrisTestSuite;
