import Database from "#Database";
import FileRef from "@rcompat/fs/FileRef";
import test from "@rcompat/test";

const USER_TABLE = `
  CREATE TABLE user(
    id INTEGER PRIMARY KEY,
    name TEXT
  ) STRICT
`;

test.case("constructor", async assert => {
  const file = new FileRef("/tmp/test-primate-sqlite.db");
  if (await file.exists()) {
    await file.remove();
  }
  new Database(file.path);
  assert(await file.exists()).true();
});

test.case("insert", assert => {
  const db = new Database(":memory:");

  db.exec(USER_TABLE);
  const insert = db.prepare("INSERT INTO user (id, name) VALUES (?, ?)");

  assert(insert.run(1, "Donald")).equals({
    changes: 1,
    lastInsertRowid: 1,
  });

  assert(insert.run(2, "Ryan")).equals({
    changes: 1,
    lastInsertRowid: 2,
  });
});

test.case("get", assert => {
  const db = new Database(":memory:");

  db.exec(USER_TABLE);
  const insert = db.prepare("INSERT INTO user (id, name) VALUES (?, ?)");
  insert.run(1, "Donald");
  insert.run(2, "Ryan");

  const query = db.prepare("SELECT * FROM user ORDER BY id");

  assert(query.get()).equals(
    { id: 1, name: "Donald" },
  );
});

test.case("all", assert => {
  const db = new Database(":memory:");

  db.exec(USER_TABLE);
  const insert = db.prepare("INSERT INTO user (id, name) VALUES (?, ?)");
  insert.run(1, "Donald");
  insert.run(2, "Ryan");

  const query = db.prepare("SELECT * FROM user ORDER BY id");

  assert(query.all()).equals([
    { id: 1, name: "Donald" },
    { id: 2, name: "Ryan" },
  ]);
});

test.case("named parameters ($)", assert => {
  const db = new Database(":memory:");

  db.exec(USER_TABLE);
  const insert1 = db.prepare("INSERT INTO user (id, name) VALUES ($id, $name)");
  insert1.run({ $id: 1, $name: "Donald" });

  assert(db.prepare("SELECT * FROM user ORDER by id DESC").get()).equals({
    id: 1, name: "Donald",
  });
});

test.case("named parameters (@)", assert => {
  const db = new Database(":memory:");

  db.exec(USER_TABLE);
  const insert1 = db.prepare("INSERT INTO user (id, name) VALUES (@id, @name)");
  insert1.run({ "@id": 1, "@name": "Donald" });

  assert(db.prepare("SELECT * FROM user ORDER by id DESC").get()).equals({
    id: 1, name: "Donald",
  });
});

test.case("named parameters (:)", assert => {
  const db = new Database(":memory:");

  db.exec(USER_TABLE);
  const insert1 = db.prepare("INSERT INTO user (id, name) VALUES (:id, :name)");
  insert1.run({ ":id": 1, ":name": "Donald" });

  assert(db.prepare("SELECT * FROM user ORDER by id DESC").get()).equals({
    id: 1, name: "Donald",
  });
});

test.case("safe integers", assert => {
  const db = new Database(":memory:", { safeIntegers: true });

  db.exec(USER_TABLE);
  const insert1 = db.prepare("INSERT INTO user (id, name) VALUES ($id, $name)");
  insert1.run({ $id: 1, $name: "Donald" });

  assert(db.prepare("SELECT * FROM user ORDER by id DESC").get()).equals({
    id: 1n, name: "Donald",
  });
});
