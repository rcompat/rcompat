# @rcompat/bufferview

Cursor-based binary data reading and writing.

## What is @rcompat/bufferview?

A cross-runtime class for reading and writing binary data with automatic
position tracking. Wraps `DataView` with a fluent API, overflow protection,
and support for multiple data types. Works consistently across Node, Deno,
and Bun.

## Installation

```bash
npm install @rcompat/bufferview
```

```bash
pnpm add @rcompat/bufferview
```

```bash
yarn add @rcompat/bufferview
```

```bash
bun add @rcompat/bufferview
```

## Usage

### Creating a BufferView

```js
import BufferView from "@rcompat/bufferview";

// from an ArrayBuffer
const view = new BufferView(new ArrayBuffer(64));

// from a Uint8Array or other typed array
const bytes = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]);
const view2 = new BufferView(bytes);

// With offset and length
const view3 = new BufferView(buffer, 10, 32);  // start at byte 10, length 32
```

### Writing data

Write methods are chainable and automatically advance the position.

```js
import BufferView from "@rcompat/bufferview";

const view = new BufferView(new ArrayBuffer(32));

view
  .writeU8(0xFF)             // 1 byte
  .writeU16(0x1234)          // 2 bytes
  .writeU32(0xDEADBEEF)      // 4 bytes
  .writeU64(0x123456789ABCn) // 8 bytes (bigint)
  .writeF32(3.14)            // 4 bytes
  .writeF64(2.71828)         // 8 bytes
  .write("Hello");           // UTF-8 string
```

### Reading data

Read methods return the value and advance the position.

```js
import BufferView from "@rcompat/bufferview";

const view = new BufferView(buffer);

const byte = view.readU8();      // read 1 byte
const short = view.readU16();    // read 2 bytes
const int = view.readU32();      // read 4 bytes
const long = view.readU64();     // read 8 bytes (returns bigint)
const float = view.readF32();    // read 4 bytes as float
const double = view.readF64();   // read 8 bytes as double
const text = view.read(5);       // read 5 bytes as UTF-8 string
```

### Endianness

Default is little-endian. Set `littleEndian` or pass it per operation.

```js
import BufferView from "@rcompat/bufferview";

const view = new BufferView(new ArrayBuffer(8));

// set endianness
view.littleEndian = false;  // big-endian

// or specify per operation
view.writeU32(0x12345678, true);   // little-endian
view.writeU32(0x12345678, false);  // big-endian
```

### Position control

```js
import BufferView from "@rcompat/bufferview";

const view = new BufferView(new ArrayBuffer(16));

view.writeU32(100);
console.log(view.position);   // 4

view.position = 0;            // seek to beginning
const value = view.readU32(); // 100

view.position = 8;            // seek to byte 8
```

### Raw bytes

```js
import BufferView from "@rcompat/bufferview";

const view = new BufferView(new ArrayBuffer(16));

// write raw bytes
view.writeBytes(new Uint8Array([1, 2, 3, 4]));

// read raw bytes
view.position = 0;
const bytes = view.readBytes(4);  // Uint8Array [1, 2, 3, 4]
```

### Converting output

```js
import BufferView from "@rcompat/bufferview";

const view = new BufferView(new ArrayBuffer(12));
view.write("Hello World!");

// get as Uint8Array
const bytes = view.bytes();

// get as string (UTF-8 decoded)
const text = view.toString();  // "Hello World!"
```

## API Reference

### Constructor

```ts
new BufferView(
  buffer: ArrayBuffer | SharedArrayBuffer | ArrayBufferView,
  offset?: number,
  byteLength?: number
)
```

| Parameter    | Type                                              | Default              | Description                |
|--------------|---------------------------------------------------|----------------------|----------------------------|
| `buffer`     | `ArrayBuffer \| SharedArrayBuffer \| ArrayBufferView` | —                    | Source buffer              |
| `offset`     | `number`                                          | `0`                  | Starting byte offset       |
| `byteLength` | `number`                                          | remaining bytes      | Number of bytes to use     |

### Properties

| Property       | Type      | Description                                    |
|----------------|-----------|------------------------------------------------|
| `buffer`       | `ArrayBufferLike` | The underlying buffer                   |
| `offset`       | `number`  | Byte offset into the buffer                    |
| `byteLength`   | `number`  | Total length of this view                      |
| `position`     | `number`  | Current read/write position (get/set)          |
| `littleEndian` | `boolean` | Default endianness for multi-byte ops (default: `true`) |

### Read Methods

| Method                        | Returns      | Description                    |
|-------------------------------|--------------|--------------------------------|
| `readI8()`                    | `number`     | Signed 8-bit integer           |
| `readU8()`                    | `number`     | Unsigned 8-bit integer         |
| `readI16(littleEndian?)`      | `number`     | Signed 16-bit integer          |
| `readU16(littleEndian?)`      | `number`     | Unsigned 16-bit integer        |
| `readI32(littleEndian?)`      | `number`     | Signed 32-bit integer          |
| `readU32(littleEndian?)`      | `number`     | Unsigned 32-bit integer        |
| `readI64(littleEndian?)`      | `bigint`     | Signed 64-bit integer          |
| `readU64(littleEndian?)`      | `bigint`     | Unsigned 64-bit integer        |
| `readF32(littleEndian?)`      | `number`     | 32-bit float                   |
| `readF64(littleEndian?)`      | `number`     | 64-bit double                  |
| `read(length)`                | `string`     | UTF-8 string of `length` bytes |
| `readBytes(length)`           | `Uint8Array` | Raw bytes                      |

### Write Methods

All write methods return `this` for chaining.

| Method                          | Parameter    | Description                    |
|---------------------------------|--------------|--------------------------------|
| `writeI8(value)`                | `number`     | Signed 8-bit integer           |
| `writeU8(value)`                | `number`     | Unsigned 8-bit integer         |
| `writeI16(value, littleEndian?)`| `number`     | Signed 16-bit integer          |
| `writeU16(value, littleEndian?)`| `number`     | Unsigned 16-bit integer        |
| `writeI32(value, littleEndian?)`| `number`     | Signed 32-bit integer          |
| `writeU32(value, littleEndian?)`| `number`     | Unsigned 32-bit integer        |
| `writeI64(value, littleEndian?)`| `bigint`     | Signed 64-bit integer          |
| `writeU64(value, littleEndian?)`| `bigint`     | Unsigned 64-bit integer        |
| `writeF32(value, littleEndian?)`| `number`     | 32-bit float                   |
| `writeF64(value, littleEndian?)`| `number`     | 64-bit double                  |
| `write(value)`                  | `string`     | UTF-8 encoded string           |
| `writeBytes(value)`             | `Uint8Array` | Raw bytes                      |

### Other Methods

| Method                     | Returns      | Description                         |
|----------------------------|--------------|-------------------------------------|
| `subarray(offset, length)` | `BufferView` | Create a new view into the buffer   |
| `bytes()`                  | `Uint8Array` | Copy buffer contents to Uint8Array  |
| `toString()`               | `string`     | Decode buffer contents as UTF-8     |

## Examples

### Parsing a binary file header

```js
import BufferView from "@rcompat/bufferview";

function parseHeader(buffer) {
  const view = new BufferView(buffer);

  return {
    magic: view.read(4),        // "PNG\x00" etc.
    version: view.readU16(),
    flags: view.readU32(),
    dataOffset: view.readU64(),
  };
}
```

### Building a binary packet

```js
import BufferView from "@rcompat/bufferview";

function buildPacket(type, payload) {
  const payloadBytes = new TextEncoder().encode(payload);
  const view = new BufferView(new ArrayBuffer(8 + payloadBytes.length));

  view
    .writeU16(type)
    .writeU16(0)                 // reserved
    .writeU32(payloadBytes.length)
    .writeBytes(payloadBytes);

  return view.bytes();
}
```

### Reading structured data

```js
import BufferView from "@rcompat/bufferview";

function readRecords(buffer, count) {
  const view = new BufferView(buffer);
  const records = [];

  for (let i = 0; i < count; i++) {
    records.push({
      id: view.readU32(),
      x: view.readF32(),
      y: view.readF32(),
      name: view.read(16).replace(/\0+$/, ""),  // null-terminated string
    });
  }

  return records;
}
```

## Cross-Runtime Compatibility

| Runtime | Supported |
|---------|-----------|
| Node.js | ✓         |
| Deno    | ✓         |
| Bun     | ✓         |

No configuration required — just import and use.

## License

MIT

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) in the repository root.

