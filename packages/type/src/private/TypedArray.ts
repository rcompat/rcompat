type TypedArray =
  | BigInt64Array<ArrayBuffer>
  | BigUint64Array<ArrayBuffer>
  | Float16Array<ArrayBuffer>
  | Float32Array<ArrayBuffer>
  | Float64Array<ArrayBuffer>
  | Int16Array<ArrayBuffer>
  | Int32Array<ArrayBuffer>
  | Int8Array<ArrayBuffer>
  | Uint16Array<ArrayBuffer>
  | Uint32Array<ArrayBuffer>
  | Uint8Array<ArrayBuffer>
  | Uint8ClampedArray<ArrayBuffer>;

export type { TypedArray as default };
