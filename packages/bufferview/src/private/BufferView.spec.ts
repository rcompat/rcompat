import BufferView from "#BufferView";
import test from "@rcompat/test";
import type Asserter from "@rcompat/test/Asserter";

const equals = (
  assert: Asserter,
  buffer: Uint8Array,
  bytes: ArrayLike<number>,
) => {
  assert(buffer.length === bytes.length).true();
  for (let i = 0; i < buffer.length; i++) {
    assert(buffer[i] === bytes[i]).true();
  }
};

test.case("i8", assert => {
  const view = new BufferView(new ArrayBuffer(3))
    .writeI8(-1)
    .writeI8(2)
    .writeI8(100);

  equals(assert, view.toBytes(), [
    255,
    2,
    100,
  ]);

  view.position = 1;
  const byte = view.readI8();

  assert(
    byte === 2 && view.position === 2,
  ).true();
});


test.case("u8", assert => {
  const view = new BufferView(new ArrayBuffer(3))
    .writeU8(255)
    .writeU8(2)
    .writeU8(100);
  equals(assert, view.toBytes(), [
    255,
    2,
    100,
  ]);

  view.position = 1;
  const byte = view.readU8();

  assert(
    byte === 2 && view.position === 2,
  ).true();
});

test.case("i16", assert => {
  const view = new BufferView(new ArrayBuffer(4))
    .writeI16(0x1234)
    .writeI16(0x5678);

  equals(assert, view.toBytes(), [
    0x34,
    0x12,
    0x78,
    0x56,
  ]);

  view.position = 0;
  view.littleEndian = false;
  view.writeI16(0x1234).writeI16(0x5678);

  equals(assert, view.toBytes(), [
    0x12,
    0x34,
    0x56,
    0x78,
  ]);

  view.position = 2;
  view.littleEndian = true;
  view.writeI16(0x1234);

  view.position = 2;
  view.littleEndian = false;
  const byte = view.readI16();

  assert(byte === 0x3412 && view.position === 4).true();
});


test.case("u16", assert => {
  const view = new BufferView(new ArrayBuffer(4))
    .writeU16(0x1234)
    .writeU16(0x5678);

  equals(assert, view.toBytes(), [
    0x34,
    0x12,
    0x78,
    0x56,
  ]);

  view.position = 0;
  view.littleEndian = false;
  view.writeI16(0x1234).writeI16(0x5678);

  equals(assert, view.toBytes(), [
    0x12,
    0x34,
    0x56,
    0x78,
  ]);

  view.position = 2;
  view.littleEndian = true;
  view.writeU16(0x1234);

  view.position = 2;
  view.littleEndian = false;
  const byte = view.readU16();

  assert(byte === 0x3412 && view.position === 4).true();
});

test.case("i32", assert => {
  const view = new BufferView(new ArrayBuffer(8))
    .writeI32(0x12345678)
    .writeI32(0x9ABCDEF0);

  equals(assert, view.toBytes(), [
    0x78,
    0x56,
    0x34,
    0x12,
    0xF0,
    0xDE,
    0xBC,
    0x9A,
  ]);

  view.position = 0;
  view.littleEndian = false;
  view.writeI32(0x12345678).writeI32(0x9ABCDEF0);

  equals(assert, view.toBytes(), [
    0x12,
    0x34,
    0x56,
    0x78,
    0x9A,
    0xBC,
    0xDE,
    0xF0,
  ]);

  view.position = 4;
  view.littleEndian = true;
  view.writeI32(0x12345678);

  view.position = 4;
  view.littleEndian = false;
  const byte = view.readI32();

  assert(byte === 0x78563412 && view.position === 8).true();
});

test.case("u32", assert => {
  const view = new BufferView(new ArrayBuffer(8))
    .writeU32(0x12345678)
    .writeU32(0x9ABCDEF0);

  equals(assert, view.toBytes(), [
    0x78,
    0x56,
    0x34,
    0x12,
    0xF0,
    0xDE,
    0xBC,
    0x9A,
  ]);

  view.position = 0;
  view.littleEndian = false;
  view.writeU32(0x12345678).writeU32(0x9ABCDEF0);

  equals(assert, view.toBytes(), [
    0x12,
    0x34,
    0x56,
    0x78,
    0x9A,
    0xBC,
    0xDE,
    0xF0,
  ]);

  view.position = 4;
  view.littleEndian = true;
  view.writeU32(0x12345678);

  view.position = 4;
  view.littleEndian = false;
  const byte = view.readU32();

  assert(byte === 0x78563412 && view.position === 8).true();
});

test.case("i64", assert => {
  const view = new BufferView(new ArrayBuffer(16))
    .writeI64(0x123456789ABCDEF0n)
    .writeI64(0x123456789ABCDEF0n);

  equals(assert, view.toBytes(), [
    0xF0,
    0xDE,
    0xBC,
    0x9A,
    0x78,
    0x56,
    0x34,
    0x12,
    0xF0,
    0xDE,
    0xBC,
    0x9A,
    0x78,
    0x56,
    0x34,
    0x12,
  ]);

  view.position = 0;
  view.littleEndian = false;
  view.writeI64(0x123456789ABCDEF0n);

  equals(assert, view.toBytes(), [
    0x12,
    0x34,
    0x56,
    0x78,
    0x9A,
    0xBC,
    0xDE,
    0xF0,
    0xF0,
    0xDE,
    0xBC,
    0x9A,
    0x78,
    0x56,
    0x34,
    0x12,
  ]);

  view.position = 8;
  view.littleEndian = true;
  view.writeI64(0x123456789ABCDEF0n);

  view.position = 8;
  view.littleEndian = false;
  const byte = view.readI64();

  assert(byte === -0xf21436587a9cbeen && view.position === 16).true();
});


test.case("u64", assert => {
  const view = new BufferView(new ArrayBuffer(16))
    .writeU64(0x123456789ABCDEF0n)
    .writeU64(0x123456789ABCDEF0n);

  equals(assert, view.toBytes(), [
    0xF0,
    0xDE,
    0xBC,
    0x9A,
    0x78,
    0x56,
    0x34,
    0x12,
    0xF0,
    0xDE,
    0xBC,
    0x9A,
    0x78,
    0x56,
    0x34,
    0x12,
  ]);

  view.position = 0;
  view.littleEndian = false;
  view.writeI64(0x123456789ABCDEF0n);

  equals(assert, view.toBytes(), [
    0x12,
    0x34,
    0x56,
    0x78,
    0x9A,
    0xBC,
    0xDE,
    0xF0,
    0xF0,
    0xDE,
    0xBC,
    0x9A,
    0x78,
    0x56,
    0x34,
    0x12,
  ]);

  view.position = 8;
  view.littleEndian = true;
  view.writeI64(0x123456789ABCDEF0n);

  view.position = 8;
  view.littleEndian = false;
  const value = view.readI64();

  assert(value === -0xf21436587a9cbeen && view.position === 16).true();

  view.position = 0;
  view.littleEndian = false;
  view.writeI64(0x123456789ABCDEF0n);

  equals(assert, view.toBytes(), [
    0x12,
    0x34,
    0x56,
    0x78,
    0x9A,
    0xBC,
    0xDE,
    0xF0,
    0xF0,
    0xDE,
    0xBC,
    0x9A,
    0x78,
    0x56,
    0x34,
    0x12,
  ]);

  view.position = 0;
  view.littleEndian = false;
  view.writeI64(0x123456789ABCDEF0n);

  equals(assert, view.toBytes(), [
    0x12,
    0x34,
    0x56,
    0x78,
    0x9A,
    0xBC,
    0xDE,
    0xF0,
    0xF0,
    0xDE,
    0xBC,
    0x9A,
    0x78,
    0x56,
    0x34,
    0x12,
  ]);

  view.position = 8;
  view.littleEndian = true;
  view.writeI64(0x123456789ABCDEF0n);

  view.position = 8;
  view.littleEndian = false;
  const byte = view.readI64();

  assert(byte === -0xf21436587a9cbeen && view.position === 16).true();
});


test.case("u64", assert => {
  const view = new BufferView(new ArrayBuffer(16))
    .writeU64(0x123456789ABCDEF0n)
    .writeU64(0x123456789ABCDEF0n);

  equals(assert, view.toBytes(), [
    0xF0,
    0xDE,
    0xBC,
    0x9A,
    0x78,
    0x56,
    0x34,
    0x12,
    0xF0,
    0xDE,
    0xBC,
    0x9A,
    0x78,
    0x56,
    0x34,
    0x12,
  ]);

  view.position = 0;
  view.littleEndian = false;
  view.writeI64(0x123456789ABCDEF0n);

  equals(assert, view.toBytes(), [
    0x12,
    0x34,
    0x56,
    0x78,
    0x9A,
    0xBC,
    0xDE,
    0xF0,
    0xF0,
    0xDE,
    0xBC,
    0x9A,
    0x78,
    0x56,
    0x34,
    0x12,
  ]);

  view.position = 8;
  view.littleEndian = true;
  view.writeI64(0x123456789ABCDEF0n);

  view.position = 8;
  view.littleEndian = false;
  const byte = view.readU64();

  assert(byte === 0xF0DEBC9A78563412n && view.position === 16).true();
});


test.case("string", assert => {
  const helloWorld = new TextEncoder().encode("Hello World");
  const view = new BufferView(new ArrayBuffer(helloWorld.length))
    .write("Hello World");

  equals(assert, view.toBytes(), helloWorld);
  assert(view.position === helloWorld.length).true();

  view.position = 0;
  const string = view.read(helloWorld.length);

  assert(
    string === "Hello World"
    && view.position === helloWorld.length,
  ).true();
});

test.case("bytes", assert => {
  const bytes = [1, 2, 3];
  const expected = new Uint8Array(bytes);
  const view = new BufferView(new ArrayBuffer(bytes.length));

  view.writeBytes(expected);

  equals(assert, view.toBytes(), bytes);

  view.position = 0;
  const read = view.readBytes(bytes.length);

  assert(read.length === bytes.length && view.position === bytes.length).true();
});

test.case("Hello world!", assert => {
  const codes = [
    0x48, 0x65,
    0x6c, 0x6c,
    0x6f, 0x20,
    0x77, 0x6f,
    0x72, 0x6c,
    0x64, 0x21,
  ];
  const view = new BufferView(new ArrayBuffer(codes.length));

  codes.forEach(e => {
    view.writeU8(e);
  });
  const str = view.toString();
  assert(str === "Hello world!").true();
});

test.case("float32", assert => {
  const f32 = new Float32Array(1);
  f32[0] = 789.123;
  const testValue = f32[0];

  const view = new BufferView(new ArrayBuffer(8))
    .writeF32(testValue, true)
    .writeF32(testValue, false);

  equals(assert, view.toBytes(), [
    0xdf,
    0x47,
    0x45,
    0x44,
    0x44,
    0x45,
    0x47,
    0xdf,
  ]);

  view.position = 0;
  assert(view.readF32() === testValue).true();
  assert(view.readF32(false) === testValue).true();
});

test.case("float64", assert => {
  const testValue = 1234.5678;
  const view = new BufferView(new ArrayBuffer(16))
    .writeF64(testValue)
    .writeF64(testValue, false);
  equals(assert, view.toBytes(), [
    0xad,
    0xfa,
    0x5c,
    0x6d,
    0x45,
    0x4a,
    0x93,
    0x40,
    0x40,
    0x93,
    0x4a,
    0x45,
    0x6d,
    0x5c,
    0xfa,
    0xad,
  ]);

  view.position = 0;
  assert(view.readF64() === testValue).true();
  assert(view.readF64(false) === testValue).true();
});

test.case("constructor", assert => {
  const example = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]);

  assert(() => new BufferView(example, 0, 8)).tries();
  assert(() => new BufferView(example, 1, 8)).throws();
  assert(() => new BufferView(example, 0, 9)).throws();


  assert(() => new BufferView(example, 1, 7)).tries();
  assert(() => new BufferView(example, 2, 6)).tries();
  assert(() => new BufferView(example, 3, 5)).tries();

  assert(() => new BufferView (example, 7, 1)).tries();

  assert(() => new BufferView(example, 0, 0)).tries();


  assert(new BufferView(example, 4).byteLength === 4).true();

  assert(() => new BufferView(example, 1000)).throws();
  // Believe it or not, this is a valid case.
  // new Uint8Array(new ArrayBuffer(8), 8).byteLength === 0
  assert(() => new BufferView(example, 8)).tries();

  assert(new BufferView(example, 0, 0).byteLength === 0).true();
  assert(new BufferView(example, 1, 7).byteLength === 7).true();

  equals(assert, new BufferView(example, 3, 4).toBytes(), [3, 4, 5, 6]);
});
