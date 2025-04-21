import FileRef from "#FileRef";
import crypto from "@rcompat/crypto";

export default test => {
  test.case("write", async assert => {
    const filename = `/tmp/test-${crypto.randomUUID()}.txt`;
    const file = FileRef.new(filename);
    await file.write("test");
    assert(await file.text()).equals("test");
    await file.remove();
  });
  test.case("write with path", async assert => {
    const filename = `/tmp/a/b/c/test-${crypto.randomUUID()}.txt`;
    const file = FileRef.new(filename);
    await file.write("test");
    assert(await file.text()).equals("test");
    await file.remove();
  });
};
