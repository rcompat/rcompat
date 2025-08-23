import type Streamable from "#Streamable";

type StreamSource<T = unknown> =
  | Blob
  | ReadableStream<T>
  | Streamable<T>
  ;

export type { StreamSource as default };
