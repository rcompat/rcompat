import FileRef from "#FileRef";
import crypto from "@rcompat/crypto";
import test from "@rcompat/test";

test.case("write", async assert => {
  const filename = `/tmp/test-${crypto.randomUUID()}.txt`;
  const file = new FileRef(filename);
  await file.write("test");
  assert(await file.text()).equals("test");
  await file.remove();
});
test.case("write with path", async assert => {
  const filename = `/tmp/a/b/c/test-${crypto.randomUUID()}.txt`;
  const file = new FileRef(filename);
  await file.directory.create();
  await file.write("test");
  assert(await file.text()).equals("test");
  await file.remove();
  await file.directory.remove();
});
