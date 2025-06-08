import FileRef from "#FileRef";
import crypto from "@rcompat/crypto";
import test from "@rcompat/test";

test.case("file doesn't exist", async assert => {
  const filename = "/tmp/1";
  const error = `file does not exists: ${filename}`;
  const file = new FileRef(filename);
  //assert(() => file.copy(new FileRef("/tmp/2"))).throws(error);
});

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
