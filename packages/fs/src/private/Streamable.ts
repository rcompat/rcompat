type Streamable<T> = { stream: () => ReadableStream<T>; streamable?: symbol }
  | ReadableStream<T>;

export type { Streamable as default };
