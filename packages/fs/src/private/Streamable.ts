import symbol from "@rcompat/symbol";

type Streamable<T = unknown> =
  | Blob
  | ReadableStream<T>
  | { [symbol.stream](): ReadableStream<T> }
  ;

export type { Streamable as default };
