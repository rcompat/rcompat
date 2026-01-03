# @rcompat/fs

Filesystem utilities for JavaScript runtimes.

## What is @rcompat/fs?

A cross-runtime module providing filesystem access with a Python
pathlib-inspired API. Includes file operations, directory traversal, file-based
routing, and project discovery. Works consistently across Node, Deno, and Bun.

## Installation

```bash
npm install @rcompat/fs
```

```bash
pnpm add @rcompat/fs
```

```bash
yarn add @rcompat/fs
```

```bash
bun add @rcompat/fs
```

## Usage

### FileRef

A pathlib-like class for file and directory operations.

#### Creating a FileRef

```js
import fs from "@rcompat/fs";

const file = new fs.FileRef("./src/config.json");
const absolute = new fs.FileRef("/etc/hosts");

// resolve relative to cwd
const resolved = fs.resolve("./src");
```

#### Path manipulation

```js
import fs from "@rcompat/fs";

const file = new fs.FileRef("./src/components/Button.tsx");

file.path; // "./src/components/Button.tsx"
file.name; // "Button.tsx"
file.base; // "Button"
file.extension; // ".tsx"
file.directory; // FileRef("./src/components")
file.webpath(); // "./src/components/Button.tsx" (forward slashes)

// join paths
file.directory.join("Input.tsx"); // FileRef("./src/components/Input.tsx")

// navigate up
file.up(2); // FileRef("./src")
```

#### Reading files

```js
import fs from "@rcompat/fs";

const file = new fs.FileRef("./config.json");

// read as text
const text = await file.text();

// read and parse JSON
const config = await file.json();

// read as binary
const bytes = await file.bytes(); // Uint8Array
const buffer = await file.arrayBuffer(); // ArrayBuffer

// read as stream
const stream = file.stream();

// get file size
const size = await file.size();
```

#### Writing files

```js
import fs from "@rcompat/fs";

const file = new fs.FileRef("./output.txt");

// write text (auto-adds trailing newline)
await file.write("Hello, world!");

// write JSON (pretty-printed)
await file.writeJSON({ name: "rcompat", version: "1.0.0" });

// write binary
await file.write(new Uint8Array([0x48, 0x69]));
```

#### File info

```js
import fs from "@rcompat/fs";

const file = new fs.FileRef("./src");

await file.exists(); // true/false
await file.modified(); // modification time (ms)
await file.kind(); // "file" | "directory" | "link" | null
```

#### Directory operations

```js
import fs from "@rcompat/fs";

const src = new fs.FileRef("./src");

// list directory contents
const files = await src.files();

// list with filter (shallow, non-recursive)
const ts_files = await src.files({ filter: info => info.extension === ".ts" });

// recursive, with regex matcher
const all_ts_files = await src.files({
  recursive: true,
  filter: /\.ts$/
});

// create directory (recursive by default)
await new fs.FileRef("./dist/assets").create();

// remove directory
await dir.remove();

// copy directory
await dir.copy(new fs.FileRef("./backup"));
```

#### Other methods

```js
import fs from "@rcompat/fs";

const file = new fs.FileRef("./src/utils.ts");

// generate content hash
const hash = await file.hash(); // SHA-256 by default
const md5 = await file.hash("SHA-512");

// dynamic import
const module = await file.import();
const func = await file.import("default");

// find project root (walks up looking for package.json)
const root = await file.discover("package.json");
```

### Project utilities

```js
import fs from "@rcompat/fs";

// find project root directory
const project_root = await fs.project.root();
// FileRef("/path/to/project")

// get path to package.json
const package_json = await fs.project.package();
// FileRef("/path/to/project/package.json")
```

### FileRouter

File-system based routing for frameworks.

```js
import FileRouter from "@rcompat/fs/FileRouter";

const router = await FileRouter.load({
  directory: "./routes",
  extensions: [".js", ".ts"],
});

// match a request
const match = router.match(request);
if (match) {
  console.log(match.path); // "./routes/users/[id].js"
  console.log(match.params); // { id: "123" }
}
```

Supports dynamic routes:

-   `[param]` - Required parameter
-   `[[optional]]` - Optional parameter
-   `[...rest]` - Rest/catch-all parameter

### Streamable

Abstract class for objects that can be streamed.

```js
import Streamable from "@rcompat/fs/Streamable";

// check if a value is streamable
if (Streamable.is(value)) {
  const stream = Streamable.stream(value);
}

// check if named (has a name property)
if (Streamable.named(value)) {
  console.log(value.name);
}
```

## API Reference

### FileRef

```ts
class FileRef extends Streamable {
  constructor(path: string | FileRef);

  path: string;
  name: string;
  base: string;
  extension: string;
  fullExtension: string;
  directory: FileRef;

  // path operations
  join(...paths: (string | FileRef)[]): FileRef;
  up(levels: number): FileRef;
  webpath(): string;
  append(suffix: string): FileRef;
  bare(append?: string): FileRef;
  debase(base: string | FileRef, suffix?: string): FileRef;

  // reading
  text(): Promise<string>;
  json<T>(): Promise<T>;
  bytes(): Promise<Uint8Array>;
  arrayBuffer(): Promise<ArrayBuffer>;
  stream(): ReadableStream<Uint8Array>;
  size(): Promise<number>;

  // writing
  write(input: string | Uint8Array): Promise<void>;
  writeJSON(input: JSONValue): Promise<void>;

  // file info
  exists(): Promise<boolean>;
  kind(): Promise<"file" | "directory" | "link" | null>;
  modified(): Promise<number>;

  // directory operations
  list(options?: {
    recursive?: boolean;
    filter?: RegExp | ((info: FileInfo) => MaybePromise<boolean>);
  }): Promise<FileRef[]>
  create(options?: { recursive?: boolean }): Promise<void>;
  remove(options?: { recursive?: boolean; fail?: boolean }): Promise<void>;
  copy(to: FileRef, filter?: (info: FileInfo) => MaybePromise<boolean>):
    Promise<void>;


  // other
  hash(algorithm?: string): Promise<string>;
  import(name?: string): Promise<unknown>;
  discover(filename: string): Promise<FileRef>;
}
```

### FileInfo

```ts
type FileInfo = {
  path: string;
  name: string;
  extension: string;
  kind: "file" | "directory" | "link";
};
```

### FileRouter

```ts
class FileRouter {
  constructor(config: {
    directory?: string;
    extensions?: string[];
    specials?: Record<string, boolean>;
  });

  load(): Promise<FileRouter>;
  init(paths: string[]): FileRouter;
  match(request: Request): MatchedRoute | undefined;
  all(): string[];

  static load(config: Config): Promise<FileRouter>;
  static init(config: Config, paths: string[]): FileRouter;
}
```

## Examples

### Build script

```js
import fs from "@rcompat/fs";

const src = new fs.FileRef("./src");
const dist = new fs.FileRef("./dist");

// clean dist
await dist.remove();

// copy source files
await src.copy(dist, info => info.extension !== ".test.ts");

// process each file
for (const file of await dist.list()) {
  const content = await file.text();
   // transform content...
  await file.write(transformedContent);
}
```

### Config loader

```js
import fs from "@rcompat/fs";

async function loadConfig() {
  const root = await fs.project.root();
  const config_path = root.join("config.json");

  if (await config_path.exists()) return config_path.json();

  return { /* defaults */ };
}
```

### Asset fingerprinting

```js
import fs from "@rcompat/fs";

async function fingerprint(file) {
  const hash = await file.hash();
  const name = `${file.base}.${hash}${file.extension}`;
  return file.directory.join(name);
}

const original = new fs.FileRef("./dist/bundle.js");
const fingerprinted = await fingerprint(original);
await original.copy(fingerprinted);
```

## Cross-Runtime Compatibility

| Runtime | Supported |
| ------- | --------- |
| Node.js | ✓         |
| Deno    | ✓         |
| Bun     | ✓         |

No configuration required — just import and use.

## License

MIT

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) in the repository root.
