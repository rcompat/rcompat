# @rcompat/fs

Filesystem utilities for JavaScript runtimes.

## What is @rcompat/fs?

A cross-runtime module providing filesystem access with a Python pathlib-inspired
API. Includes file operations, directory traversal, file-based routing, and
project discovery. Works consistently across Node, Deno, and Bun.

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
import FileRef from "@rcompat/fs/FileRef";

const file = new FileRef("./src/config.json");
const absolute = new FileRef("/etc/hosts");

// Resolve relative to cwd
const resolved = FileRef.resolve("./src");
```

#### Path manipulation

```js
import FileRef from "@rcompat/fs/FileRef";

const file = new FileRef("./src/components/Button.tsx");

file.path; // "./src/components/Button.tsx"
file.name; // "Button.tsx"
file.base; // "Button"
file.extension; // ".tsx"
file.directory; // FileRef("./src/components")
file.webpath(); // "./src/components/Button.tsx" (forward slashes)

// Join paths
file.directory.join("Input.tsx"); // FileRef("./src/components/Input.tsx")

// Navigate up
file.up(2); // FileRef("./src")
```

#### Reading files

```js
import FileRef from "@rcompat/fs/FileRef";

const file = new FileRef("./config.json");

// Read as text
const text = await file.text();

// Read and parse JSON
const config = await file.json();

// Read as binary
const bytes = await file.bytes(); // Uint8Array
const buffer = await file.arrayBuffer(); // ArrayBuffer

// Read as stream
const stream = file.stream();

// Get file size
const size = await file.byteLength();
```

#### Writing files

```js
import FileRef from "@rcompat/fs/FileRef";

const file = new FileRef("./output.txt");

// Write text (auto-adds trailing newline)
await file.write("Hello, world!");

// Write JSON (pretty-printed)
await file.writeJSON({ name: "rcompat", version: "1.0.0" });

// Write binary
await file.write(new Uint8Array([0x48, 0x69]));
```

#### File info

```js
import FileRef from "@rcompat/fs/FileRef";

const file = new FileRef("./src");

await file.exists(); // true/false
await file.isFile(); // true if regular file
await file.isDirectory(); // true if directory
await file.modified(); // modification time (ms)
await file.kind(); // "file" | "directory" | "link" | "none"
```

#### Directory operations

```js
import FileRef from "@rcompat/fs/FileRef";

const dir = new FileRef("./src");

// List directory contents
const files = await dir.list();

// List with filter
const tsFiles = await dir.list((file) => file.extension === ".ts");

// Recursively collect all files
const allFiles = await dir.collect();

// Collect with filter
const components = await dir.collect((file) =>
    file.path.includes("components")
);

// Create directory (recursive by default)
await new FileRef("./dist/assets").create();

// Remove directory
await dir.remove();

// Copy directory
await dir.copy(new FileRef("./backup"));
```

#### Other methods

```js
import FileRef from "@rcompat/fs/FileRef";

const file = new FileRef("./src/utils.ts");

// Generate content hash
const hash = await file.hash(); // SHA-256 by default
const md5 = await file.hash("SHA-512");

// Dynamic import
const module = await file.import();
const func = await file.import("default");

// Find project root (walks up looking for package.json)
const root = await file.discover("package.json");
```

### Project utilities

```js
import root from "@rcompat/fs/project/root";
import pkg from "@rcompat/fs/project/package";

// Find project root directory
const projectRoot = await root();
// FileRef("/path/to/project")

// Get path to package.json
const packageJson = await pkg();
// FileRef("/path/to/project/package.json")
```

### glob

Find files matching a pattern.

```js
import glob from "@rcompat/fs/glob";

const files = await glob("\\.tsx?$"); // All .ts and .tsx files
```

### FileRouter

File-system based routing for frameworks.

```js
import FileRouter from "@rcompat/fs/FileRouter";

const router = await FileRouter.load({
    directory: "./routes",
    extensions: [".js", ".ts"],
});

// Match a request
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

// Check if a value is streamable
if (Streamable.is(value)) {
    const stream = Streamable.stream(value);
}

// Check if named (has a name property)
if (Streamable.named(value)) {
    console.log(value.name);
}
```

## API Reference

### FileRef

```ts
class FileRef extends Streamable {
    constructor(path: string | FileRef);

    // Properties
    path: string;
    name: string;
    base: string;
    extension: string;
    fullExtension: string;
    directory: FileRef;

    // Path operations
    join(...paths: (string | FileRef)[]): FileRef;
    up(levels: number): FileRef;
    webpath(): string;
    append(suffix: string): FileRef;
    bare(append?: string): FileRef;
    debase(base: string | FileRef, suffix?: string): FileRef;

    // Reading
    text(): Promise<string>;
    json<T>(): Promise<T>;
    bytes(): Promise<Uint8Array>;
    arrayBuffer(): Promise<ArrayBuffer>;
    stream(): ReadableStream<Uint8Array>;
    byteLength(): Promise<number>;

    // Writing
    write(input: string | Uint8Array): Promise<void>;
    writeJSON(input: JSONValue): Promise<void>;

    // File info
    exists(): Promise<boolean>;
    isFile(): Promise<boolean>;
    isDirectory(): Promise<boolean>;
    kind(): Promise<"file" | "directory" | "link" | "none">;
    modified(): Promise<number>;

    // Directory operations
    list(predicate?: (file: FileRef) => boolean): Promise<FileRef[]>;
    collect(predicate?: (file: FileRef) => boolean): Promise<FileRef[]>;
    create(options?: { recursive?: boolean }): Promise<void>;
    remove(options?: { recursive?: boolean; fail?: boolean }): Promise<void>;
    copy(to: FileRef, predicate?: (file: FileRef) => boolean): Promise<void>;

    // Other
    hash(algorithm?: string): Promise<string>;
    import(name?: string): Promise<unknown>;
    discover(filename: string): Promise<FileRef>;
    glob(pattern: string): Promise<FileRef[]>;

    // Static methods
    static resolve(path?: string): FileRef;
    static join(
        path: string | FileRef,
        ...paths: (string | FileRef)[]
    ): FileRef;
    static exists(path: string | FileRef): Promise<boolean>;
    static text(path: string | FileRef): Promise<string>;
    static json<T>(path: string | FileRef): Promise<T>;
}
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
import FileRef from "@rcompat/fs/FileRef";

const src = new FileRef("./src");
const dist = new FileRef("./dist");

// Clean dist
await dist.remove();

// Copy source files
await src.copy(dist, (file) => file.extension !== ".test.ts");

// Process each file
for (const file of await dist.collect()) {
    const content = await file.text();
    // Transform content...
    await file.write(transformedContent);
}
```

### Config loader

```js
import FileRef from "@rcompat/fs/FileRef";
import root from "@rcompat/fs/project/root";

async function loadConfig() {
    const projectRoot = await root();
    const configPath = projectRoot.join("config.json");

    if (await configPath.exists()) {
        return configPath.json();
    }

    return {
        /* defaults */
    };
}
```

### Asset fingerprinting

```js
import FileRef from "@rcompat/fs/FileRef";

async function fingerprint(file) {
    const hash = await file.hash();
    const name = `${file.base}.${hash}${file.extension}`;
    return file.directory.join(name);
}

const original = new FileRef("./dist/bundle.js");
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
