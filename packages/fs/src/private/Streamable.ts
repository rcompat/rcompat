type Streamable<T = unknown> =
  | Blob
  | ReadableStream<T>
  | { stream(): ReadableStream<T> }
  ;

export type { Streamable as default };
