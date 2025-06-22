import Database from "#Database";
import FileRef from "@rcompat/fs/FileRef";
import test from "@rcompat/test";

test.case("constructor", async assert => {
  const file = new FileRef("/tmp/test-primate-sqlite.db");
  if (await file.exists()) {
    await file.remove();
  }
  const db = new Database(file.path);
  assert(await file.exists()).true();
});
