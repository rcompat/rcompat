import assert from "@rcompat/invariant/assert";
import sizeOfStringUtf8 from "./sizeof/string/utf8.js";

const SIZE_8 = 1;
const SIZE_16 = 2;
const SIZE_32 = 4;
const SIZE_64 = 8;

class BufferView {
  #view: DataView;
  #buffer: ArrayBufferLike;
  #offset: number;
  #byteLength: number;

  #position: number = 0;
  littleEndian = true;

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
    assert(position >= 0 && position < this.#byteLength, "BufferView position out of bounds.");
    this.#position = position;
  }

  constructor(
    buffer: ArrayBufferLike | ArrayBufferView<ArrayBufferLike>,
    offset: number = 0,
    byteLength: number = buffer.byteLength - offset,
  ) {
    assert(buffer instanceof ArrayBuffer || buffer instanceof SharedArrayBuffer || ArrayBuffer.isView(buffer), "BufferView expects an ArrayBuffer, SharedArrayBuffer, or ArrayBufferView.");
    assert(offset >= 0, "BufferView offset must be positive.");
    assert(byteLength >= 0, "BufferView byteLength must be positive.");

    if (buffer instanceof ArrayBuffer || buffer instanceof SharedArrayBuffer) {
      this.#buffer = buffer;
      this.#offset = offset;
      this.#byteLength = byteLength;
      this.#view = new DataView(buffer, offset, byteLength);
      return this;
    }

    // this is likely a Uint8Array
    const { buffer: arrayBuffer, byteOffset: arrayBufferOffset, byteLength: arrayBufferByteLength } = buffer;
    const computedOffset = arrayBufferOffset + offset;
    assert(arrayBufferByteLength >= computedOffset + byteLength, "BufferView overflow.");

    this.#buffer = arrayBuffer;
    this.#offset = computedOffset;
    this.#byteLength = byteLength;
    this.#view = new DataView(arrayBuffer, computedOffset, byteLength);
    return this;
  }

  subarray(offset: number, byteLength: number) {
    assert(offset >= 0, "BufferView offset must be positive.");
    assert(offset + byteLength <= this.#byteLength, "BufferView overflow.");
    return new BufferView(this.#buffer, this.#offset + offset, byteLength);
  }

  readBytes(length: number) {
    assert(this.#position + length <= this.#byteLength, "BufferView overflow.");
    const value = new Uint8Array(this.#buffer, this.#offset + this.#position, length);
    const output = new Uint8Array(length);
    output.set(value);
    this.#position += length;
    return value;
  }

  read(length: number) {
    assert(this.#position + length <= this.#byteLength, "BufferView overflow.");
    const value = new TextDecoder().decode(
      new Uint8Array(this.#buffer, this.#offset + this.#position, length));
    this.#position += length;
    return value;
  }

  readI8() {
    assert(this.#position + SIZE_8 <= this.#byteLength, "BufferView overflow.");
    return this.#view.getInt8(this.#position++);
  }

  readU8() {
    assert(this.#position + SIZE_8 <= this.#byteLength, "BufferView overflow.");
    return this.#view.getUint8(this.#position++);
  }

  readI16(littleEndian = this.littleEndian) {
    assert(this.#position + SIZE_16 <= this.#byteLength, "BufferView overflow.");
    const value = this.#view.getInt16(this.#position, littleEndian);
    this.#position += SIZE_16;
    return value;
  }

  readU16(littleEndian = this.littleEndian) {
    assert(this.#position + SIZE_16 <= this.#byteLength, "BufferView overflow.");
    const value = this.#view.getUint16(this.#position, littleEndian);
    this.#position += SIZE_16;
    return value;
  }

  readI32(littleEndian = this.littleEndian) {
    assert(this.#position + SIZE_32 <= this.#byteLength, "BufferView overflow.");
    const value = this.#view.getInt32(this.#position, littleEndian);
    this.#position += SIZE_32;
    return value;
  }

  readU32(littleEndian = this.littleEndian) {
    assert(this.#position + SIZE_32 <= this.#byteLength, "BufferView overflow.");
    const value = this.#view.getUint32(this.#position, littleEndian);
    this.#position += SIZE_32;
    return value;
  }

  readI64(littleEndian = this.littleEndian) {
    assert(this.#position + SIZE_64 <= this.#byteLength, "BufferView overflow.");
    const value = this.#view.getBigInt64(this.#position, littleEndian);
    this.#position += SIZE_64;
    return value;
  }

  readU64(littleEndian = this.littleEndian) {
    assert(this.#position + SIZE_64 <= this.#byteLength, "BufferView overflow.");
    const value = this.#view.getBigUint64(this.#position, littleEndian);
    this.#position += SIZE_64;
    return value;
  }

  readF32(littleEndian = this.littleEndian) {
    assert(this.#position + SIZE_32 <= this.#byteLength, "BufferView overflow.");
    const value = this.#view.getFloat32(this.#position, littleEndian);
    this.#position += SIZE_32;
    return value;
  }

  readF64(littleEndian = this.littleEndian) {
    assert(this.#position + SIZE_64 <= this.#byteLength, "BufferView overflow.");
    const value = this.#view.getFloat64(this.#position, littleEndian);
    this.#position += SIZE_64;
    return value;
  }

  write(value: string) {
    const encoder = new TextEncoder();
    const stringLength = sizeOfStringUtf8(value);
    assert(this.#position + stringLength <= this.#byteLength, "BufferView overflow.");
    encoder.encodeInto(value, new Uint8Array(this.#buffer, this.#offset + this.#position, stringLength));
    return this;
  }

  writeBytes(value: Uint8Array) {
    assert(this.#position + value.length <= this.#byteLength, "BufferView overflow.");
    new Uint8Array(this.#buffer, this.#offset + this.#position, value.length).set(value);
    this.#position += value.length;
    return this;
  }

  writeI8(value: number) {
    assert(this.#position + SIZE_8 <= this.#byteLength, "BufferView overflow.");
    this.#view.setInt8(this.#position++, value);
    return this;
  }

  writeU8(value: number) {
    assert(this.#position + SIZE_8 <= this.#byteLength, "BufferView overflow.");
    this.#view.setUint8(this.#position++, value);
    return this;
  }

  writeI16(value: number, littleEndian = this.littleEndian) {
    assert(this.#position + SIZE_16 <= this.#byteLength, "BufferView overflow.");
    this.#view.setInt16(this.#position, value, littleEndian);
    this.#position += SIZE_16;
    return this;
  }

  writeU16(value: number, littleEndian = this.littleEndian) {
    assert(this.#position + SIZE_16 <= this.#byteLength, "BufferView overflow.");
    this.#view.setUint16(this.#position, value, littleEndian);
    this.#position += SIZE_16;
    return this;
  }

  writeI32(value: number, littleEndian = this.littleEndian) {
    assert(this.#position + SIZE_32 <= this.#byteLength, "BufferView overflow.");
    this.#view.setInt32(this.#position, value, littleEndian);
    this.#position += SIZE_32;
    return this;
  }

  writeU32(value: number, littleEndian = this.littleEndian) {
    assert(this.#position + SIZE_32 <= this.#byteLength, "BufferView overflow.");
    this.#view.setUint32(this.#position, value, littleEndian);
    this.#position += SIZE_32;
    return this;
  }

  writeI64(value: bigint, littleEndian = this.littleEndian) {
    assert(this.#position + SIZE_64 <= this.#byteLength, "BufferView overflow.");
    this.#view.setBigInt64(this.#position, value, littleEndian);
    this.#position += SIZE_64;
    return this;
  }

  writeU64(value: bigint, littleEndian = this.littleEndian) {
    assert(this.#position + SIZE_64 <= this.#byteLength, "BufferView overflow.");
    this.#view.setBigUint64(this.#position, value, littleEndian);
    this.#position += SIZE_64;
    return this;
  }

  writeF32(value: number, littleEndian = this.littleEndian) {
    assert(this.#position + SIZE_32 <= this.#byteLength, "BufferView overflow.");
    this.#view.setFloat32(this.#position, value, littleEndian);
    this.#position += SIZE_32;
    return this;
  }

  writeF64(value: number, littleEndian = this.littleEndian) {
    assert(this.#position + SIZE_64 <= this.#byteLength, "BufferView overflow.");
    this.#view.setFloat64(this.#position, value, littleEndian);
    this.#position += SIZE_64;
    return this;
  }

  toBytes() {
    const bytes = new Uint8Array(this.#byteLength);
    bytes.set(new Uint8Array(this.#buffer, this.#offset, this.#byteLength));
    return bytes;
  }
}

export default BufferView;
