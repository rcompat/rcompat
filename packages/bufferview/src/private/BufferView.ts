import assert from "@rcompat/assert";
import utf8 from "@rcompat/string/utf8";

const OVERFLOW_ERROR = "BufferView overflow.";

const SIZE_8 = 1;
const SIZE_16 = 2;
const SIZE_32 = 4;
const SIZE_64 = 8;

export default class BufferView {
  #view: DataView;
  #buffer: ArrayBufferLike;
  #offset: number;
  #byteLength: number;
  #position: number = 0;
  littleEndian = true;

  constructor(
    buffer: ArrayBufferLike | ArrayBufferView<ArrayBufferLike>,
    offset: number = 0,
    byteLength: number = buffer.byteLength - offset,
  ) {
    assert(
      buffer instanceof ArrayBuffer
      || buffer instanceof SharedArrayBuffer
      || ArrayBuffer.isView(buffer),
      "BufferView expects an ArrayBuffer, SharedArrayBuffer, or "
      + "ArrayBufferView.",
    );
    assert(offset >= 0, "BufferView offset must be positive.");
    assert(byteLength >= 0, "BufferView byteLength must be positive.");

    if (buffer instanceof ArrayBuffer || buffer instanceof SharedArrayBuffer) {
      this.#buffer = buffer;
      this.#offset = offset;
      this.#byteLength = byteLength;
      this.#view = new DataView(buffer, offset, byteLength);
      return this;
    }

    // all of the bounds checks are done by DataView itself
    const view = new DataView(
      buffer.buffer,
      buffer.byteOffset + offset,
      byteLength,
    );

    this.#buffer = view.buffer;
    this.#offset = view.byteOffset;
    this.#byteLength = view.byteLength;
    this.#view = view;
    return this;
  }

  #check_overflow(length: number) {
    assert(this.#position + length <= this.#byteLength, OVERFLOW_ERROR);
  }

  get buffer() {
    return this.#buffer;
  }

  get offset() {
    return this.#offset;
  }

  get byteLength() {
    return this.#byteLength;
  }

  get position() {
    return this.#position;
  }

  set position(position: number) {
    assert(
      position >= 0 && position < this.#byteLength,
      "BufferView position out of bounds.",
    );

    this.#position = position;
  }

  subarray(offset: number, byteLength: number) {
    assert(offset >= 0, "BufferView offset must be positive.");
    assert(offset + byteLength <= this.#byteLength, OVERFLOW_ERROR);

    return new BufferView(this.#buffer, this.#offset + offset, byteLength);
  }

  readBytes(length: number) {
    this.#check_overflow(length);

    const value = new Uint8Array(
      this.#buffer,
      this.#offset + this.#position,
      length,
    );
    const output = new Uint8Array(length);
    output.set(value);
    this.#position += length;
    return value;
  }

  read(length: number) {
    this.#check_overflow(length);

    const value = new TextDecoder().decode(
      new Uint8Array(this.#buffer, this.#offset + this.#position, length));
    this.#position += length;
    return value;
  }

  readI8() {
    this.#check_overflow(SIZE_8);

    return this.#view.getInt8(this.#position++);
  }

  readU8() {
    this.#check_overflow(SIZE_8);

    return this.#view.getUint8(this.#position++);
  }

  readI16(littleEndian = this.littleEndian) {
    this.#check_overflow(SIZE_16);

    const value = this.#view.getInt16(this.#position, littleEndian);
    this.#position += SIZE_16;
    return value;
  }

  readU16(littleEndian = this.littleEndian) {
    this.#check_overflow(SIZE_16);

    const value = this.#view.getUint16(this.#position, littleEndian);
    this.#position += SIZE_16;
    return value;
  }

  readI32(littleEndian = this.littleEndian) {
    this.#check_overflow(SIZE_32);

    const value = this.#view.getInt32(this.#position, littleEndian);
    this.#position += SIZE_32;
    return value;
  }

  readU32(littleEndian = this.littleEndian) {
    this.#check_overflow(SIZE_32);

    const value = this.#view.getUint32(this.#position, littleEndian);
    this.#position += SIZE_32;
    return value;
  }

  readI64(littleEndian = this.littleEndian) {
    this.#check_overflow(SIZE_64);

    const value = this.#view.getBigInt64(this.#position, littleEndian);
    this.#position += SIZE_64;
    return value;
  }

  readU64(littleEndian = this.littleEndian) {
    this.#check_overflow(SIZE_64);

    const value = this.#view.getBigUint64(this.#position, littleEndian);
    this.#position += SIZE_64;
    return value;
  }

  readF32(littleEndian = this.littleEndian) {
    this.#check_overflow(SIZE_32);

    const value = this.#view.getFloat32(this.#position, littleEndian);
    this.#position += SIZE_32;
    return value;
  }

  readF64(littleEndian = this.littleEndian) {
    this.#check_overflow(SIZE_64);

    const value = this.#view.getFloat64(this.#position, littleEndian);
    this.#position += SIZE_64;
    return value;
  }

  write(value: string) {
    const encoder = new TextEncoder();
    const size = utf8.size(value);
    assert(this.#position + size <= this.#byteLength, OVERFLOW_ERROR);

    encoder.encodeInto(
      value,
      new Uint8Array(this.#buffer, this.#offset + this.#position, size),
    );
    this.#position += size;

    return this;
  }

  writeBytes(value: Uint8Array) {
    this.#check_overflow(value.length);

    new Uint8Array(this.#buffer, this.#offset + this.#position, value.length)
      .set(value);
    this.#position += value.length;
    return this;
  }

  writeI8(value: number) {
    this.#check_overflow(SIZE_8);

    this.#view.setInt8(this.#position++, value);
    return this;
  }

  writeU8(value: number) {
    this.#check_overflow(SIZE_8);

    this.#view.setUint8(this.#position++, value);
    return this;
  }

  writeI16(value: number, littleEndian = this.littleEndian) {
    this.#check_overflow(SIZE_16);

    this.#view.setInt16(this.#position, value, littleEndian);
    this.#position += SIZE_16;
    return this;
  }

  writeU16(value: number, littleEndian = this.littleEndian) {
    this.#check_overflow(SIZE_16);

    this.#view.setUint16(this.#position, value, littleEndian);
    this.#position += SIZE_16;
    return this;
  }

  writeI32(value: number, littleEndian = this.littleEndian) {
    this.#check_overflow(SIZE_32);

    this.#view.setInt32(this.#position, value, littleEndian);
    this.#position += SIZE_32;
    return this;
  }

  writeU32(value: number, littleEndian = this.littleEndian) {
    this.#check_overflow(SIZE_32);

    this.#view.setUint32(this.#position, value, littleEndian);
    this.#position += SIZE_32;
    return this;
  }

  writeI64(value: bigint, littleEndian = this.littleEndian) {
    this.#check_overflow(SIZE_64);

    this.#view.setBigInt64(this.#position, value, littleEndian);
    this.#position += SIZE_64;
    return this;
  }

  writeU64(value: bigint, littleEndian = this.littleEndian) {
    this.#check_overflow(SIZE_64);

    this.#view.setBigUint64(this.#position, value, littleEndian);
    this.#position += SIZE_64;
    return this;
  }

  writeF32(value: number, littleEndian = this.littleEndian) {
    this.#check_overflow(SIZE_32);

    this.#view.setFloat32(this.#position, value, littleEndian);
    this.#position += SIZE_32;
    return this;
  }

  writeF64(value: number, littleEndian = this.littleEndian) {
    this.#check_overflow(SIZE_64);

    this.#view.setFloat64(this.#position, value, littleEndian);
    this.#position += SIZE_64;
    return this;
  }

  toBytes() {
    const bytes = new Uint8Array(this.#byteLength);
    bytes.set(new Uint8Array(this.#buffer, this.#offset, this.#byteLength));
    return bytes;
  }

  toString() {
    return new TextDecoder()
      .decode(new Uint8Array(this.#buffer, this.#offset, this.#byteLength));
  }
}
