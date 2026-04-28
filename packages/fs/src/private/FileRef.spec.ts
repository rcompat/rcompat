import FileRef from "#FileRef";
import symbol from "@rcompat/symbol";
import test from "@rcompat/test";

test.case("exists", async assert => {
  assert(await new FileRef("/tmp").exists()).true();
  assert(await new FileRef("/tmp/tmp/tmp").exists()).false();
});

test.case("bare", assert => {
  const filename = "/tmp/1.ts";
  const file = new FileRef(filename);
  assert(file.bare().path).equals("/tmp/1");
  assert(file.bare(".js").path).equals("/tmp/1.js");
});

test.case("file doesn't exist", async assert => {
  const filename = "/tmp/1";
  const error = `file does not exists: ${filename}`;
  const file = new FileRef(filename);
  //assert(() => file.copy(new FileRef("/tmp/2"))).throws(error);
});

test.case("byte length", async assert => {
  const filename = `/tmp/test-${crypto.randomUUID()}.txt`;
  const file = new FileRef(filename);
  await file.write("hello, world.");
  const length = await file.size();
  assert(length).equals(14);
  await file.remove();
});

test.case("write", async assert => {
  const filename = `/tmp/test-${crypto.randomUUID()}.txt`;
  const file = new FileRef(filename);
  await file.write("test");
  assert(await file.text()).equals("test\n");
  await file.remove();
});

test.case("write with path", async assert => {
  const filename = `/tmp/a/b/c/test-${crypto.randomUUID()}.txt`;
  const file = new FileRef(filename);
  await file.directory.create();
  await file.write("test");
  assert(await file.text()).equals("test\n");
  await file.remove();
  await file.directory.remove();
});

test.group("symbol.stream", () => {
  test.case("match", assert => {
    const file = new FileRef("/tmp");
    assert(symbol.stream in file).true();
    const stream = file[symbol.stream]();
    assert(stream instanceof ReadableStream).true();
  });

  test.case("no match", assert => {
    const fake = { foo: true };
    assert(FileRef.is(fake)).false();
  });

  test.case("version mismatch", assert => {
    const fake = { [Symbol.for("std:fs/FileRef/v1")]: true };
    assert(() => FileRef.is(fake)).throws(Error);
  });
});
