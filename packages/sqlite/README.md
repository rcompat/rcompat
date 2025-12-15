# @rcompat/sqlite

SQLite client for JavaScript runtimes.

## What is @rcompat/sqlite?

A cross-runtime SQLite client providing a unified API for database operations.
Uses native SQLite implementations (`node:sqlite` on Node.js, `bun:sqlite` on
Bun). Works consistently across Node and Bun.

## Installation

```bash
npm install @rcompat/sqlite
```

```bash
pnpm add @rcompat/sqlite
```

```bash
yarn add @rcompat/sqlite
```

```bash
bun add @rcompat/sqlite
```

## Usage

### Opening a database

```js
import Database from "@rcompat/sqlite";

// file-based database
const db = new Database("./data.db");

// in-memory database
const memDb = new Database(":memory:");

// read-only mode
const readOnly = new Database("./data.db", { readonly: true });

// safe integers (returns BigInt for integers)
const safeDb = new Database("./data.db", { safeIntegers: true });
```

### Executing queries

```js
import Database from "@rcompat/sqlite";

const db = new Database(":memory:");

// create a table
db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT,
    email TEXT
  )
`);

// insert data
db.exec("INSERT INTO users (name, email) VALUES (?, ?)", "Bob", "bob@web.com");
```

### Prepared statements

```js
import Database from "@rcompat/sqlite";

const db = new Database(":memory:");

db.exec("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");

// prepare a statement for reuse
const insert = db.prepare("INSERT INTO users (name) VALUES (?)");

insert.run("John");   // { changes: 1, lastInsertRowid: 1 }
insert.run("Bob");     // { changes: 1, lastInsertRowid: 2 }
insert.run("Charlie"); // { changes: 1, lastInsertRowid: 3 }
```

### Querying data

```js
import Database from "@rcompat/sqlite";

const db = new Database(":memory:");

db.exec("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");
db.exec("INSERT INTO users (name) VALUES (?)", "John");
db.exec("INSERT INTO users (name) VALUES (?)", "Bob");

const query = db.prepare("SELECT * FROM users");

// get first row
query.get();
// { id: 1, name: "John" }

// get all rows
query.all();
// [{ id: 1, name: "John" }, { id: 2, name: "Bob" }]
```

### Parameters

#### Positional parameters

```js
const stmt = db.prepare("SELECT * FROM users WHERE id = ? AND name = ?");
stmt.get(1, "Bob");
```

#### Named parameters

```js
// $-style
const stmt1 = db.prepare("SELECT * FROM users WHERE id = $id AND name = $name");
stmt1.get({ $id: 1, $name: "Bob" });

// @-style
const stmt2 = db.prepare("SELECT * FROM users WHERE id = @id");
stmt2.get({ "@id": 1 });

// :-style
const stmt3 = db.prepare("SELECT * FROM users WHERE id = :id");
stmt3.get({ ":id": 1 });
```

### Closing the database

```js
import Database from "@rcompat/sqlite";

const db = new Database("./data.db");

// ... do work ...

db.close();
```

## API Reference

### `Database`

```ts
class Database {
  constructor(path: string, options?: Options);
  close(): void;
  prepare(sql: string): Statement;
  exec(sql: string, ...params: Param[]): Changes;
}
```

#### Constructor

| Parameter | Type      | Description                          |
|-----------|-----------|--------------------------------------|
| `path`    | `string`  | Database file path or `":memory:"`   |
| `options` | `Options` | Optional configuration               |

#### Options

| Property       | Type      | Default | Description                    |
|----------------|-----------|---------|--------------------------------|
| `readonly`     | `boolean` | `false` | Open in read-only mode         |
| `safeIntegers` | `boolean` | `false` | Return integers as BigInt      |

#### Methods

| Method                 | Returns     | Description                    |
|------------------------|-------------|--------------------------------|
| `close()`              | `void`      | Close the database connection  |
| `prepare(sql)`         | `Statement` | Prepare a SQL statement        |
| `exec(sql, ...params)` | `Changes`   | Execute SQL and return changes |

### `Statement`

```ts
class Statement {
  get(...params: Param[]): unknown | null;
  all(...params: Param[]): unknown[];
  run(...params: Param[]): Changes;
}
```

| Method              | Returns         | Description                     |
|---------------------|-----------------|----------------------------------|
| `get(...params)`    | `unknown\|null` | Get first row or null           |
| `all(...params)`    | `unknown[]`     | Get all rows                    |
| `run(...params)`    | `Changes`       | Execute and return changes info |

### `Changes`

```ts
interface Changes {
  changes: number | bigint;
  lastInsertRowid: number | bigint;
}
```

| Property          | Type              | Description                    |
|-------------------|-------------------|--------------------------------|
| `changes`         | `number\|bigint`  | Number of rows affected        |
| `lastInsertRowid` | `number\|bigint`  | Last inserted row ID           |

### `Param`

```ts
type Param = string | number | bigint | null | Uint8Array | Record<string, Param>;
```

## Examples

### CRUD operations

```js
import Database from "@rcompat/sqlite";

const db = new Database(":memory:");

// create
db.exec(`
  CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL
  )
`);

// insert
const insert = db.prepare("INSERT INTO products (name, price) VALUES (?, ?)");
insert.run("Widget", 9.99);
insert.run("Gadget", 19.99);

// read
const findById = db.prepare("SELECT * FROM products WHERE id = ?");
const product = findById.get(1);
// { id: 1, name: "Widget", price: 9.99 }

// update
const update = db.prepare("UPDATE products SET price = ? WHERE id = ?");
update.run(14.99, 1);

// delete
const remove = db.prepare("DELETE FROM products WHERE id = ?");
remove.run(2);

// list all
const all = db.prepare("SELECT * FROM products").all();
// [{ id: 1, name: "Widget", price: 14.99 }]
```

### Transaction pattern

```js
import Database from "@rcompat/sqlite";

const db = new Database("./app.db");

function transferFunds(fromId, toId, amount) {
  db.exec("BEGIN TRANSACTION");

  try {
    db.exec("UPDATE accounts SET balance = balance - ? WHERE id = ?", amount, fromId);
    db.exec("UPDATE accounts SET balance = balance + ? WHERE id = ?", amount, toId);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
```

### Safe integers for large values

```js
import Database from "@rcompat/sqlite";

const db = new Database(":memory:", { safeIntegers: true });

db.exec("CREATE TABLE big_numbers (id INTEGER PRIMARY KEY, value INTEGER)");
db.exec("INSERT INTO big_numbers (value) VALUES (?)", 9007199254740993n);

const row = db.prepare("SELECT * FROM big_numbers").get();
// { id: 1n, value: 9007199254740993n }
```

## Cross-Runtime Compatibility

| Runtime | Supported | Native Module   |
|---------|-----------|-----------------|
| Node.js | ✓         | `node:sqlite`   |
| Bun     | ✓         | `bun:sqlite`    |
| Deno    | ✓         | `node:sqlite`   |

No configuration required — just import and use.

## License

MIT

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) in the repository root.

