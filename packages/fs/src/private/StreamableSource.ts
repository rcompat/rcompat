import type Streamable from "#Streamable";

type StreamableSource<T = unknown> =
  | Blob
  | ReadableStream<T>
  | Streamable<T>
  ;

export type { StreamableSource as default };
