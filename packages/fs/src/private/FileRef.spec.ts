import { Code } from "#errors";
import FileRef from "#FileRef";
import fs from "#index";
import symbol from "@rcompat/symbol";
import test from "@rcompat/test";
import { pathToFileURL } from "node:url";

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

test.group("file URL paths", () => {
  test.case("construct from file URL", assert => {
    const file = new FileRef(pathToFileURL("/tmp/file-url.txt"));
    assert(file.path).equals("/tmp/file-url.txt");
  });

  test.case("fs helpers accept file URL", async assert => {
    const filename = `/tmp/test-${crypto.randomUUID()}.txt`;
    const url = pathToFileURL(filename);

    assert(fs.resolve(url).path).equals(filename);
    await fs.write(url, "test");
    assert(await fs.text(url)).equals("test\n");
    await fs.ref(url).remove();
  });

  test.case("fs helpers reject non-file URL", assert => {
    assert(() => fs.resolve(new URL("https://example.com/file.txt")))
      .throws(Code.invalid_file_url);
  });

  test.case("reject non-file URL", assert => {
    assert(() => new FileRef(new URL("https://example.com/file.txt")))
      .throws(Code.invalid_file_url);
  });
});

test.group("join path contract", () => {
  test.case("accept relative segments", assert => {
    const file = new FileRef("/tmp").join("a", "./b");
    assert(file.path).equals("/tmp/a/b");
  });

  test.case("reject absolute string segment", assert => {
    assert(() => new FileRef("/tmp").join("/etc/passwd"))
      .throws(Code.invalid_join_path);
  });

  test.case("reject absolute FileRef segment", assert => {
    assert(() => new FileRef("/tmp").join(new FileRef("/etc/passwd")))
      .throws(Code.invalid_join_path);
  });

  test.case("reject file URL string segment", assert => {
    assert(() => new FileRef("/tmp").join("file:///etc/passwd"))
      .throws(Code.invalid_join_path);
  });

  test.case("reject file URL segment", assert => {
    assert(() => new FileRef("/tmp").join(pathToFileURL("/etc/passwd")))
      .throws(Code.invalid_join_path);
  });
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
