type WritableInput =
  | ArrayBuffer
  | Uint8Array
  | Blob
  | ReadableStream
  | Response
  | string
  ;

export type { WritableInput as default };
