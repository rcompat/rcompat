type Streamable<T> = ReadableStream<T>
  | { stream: () => ReadableStream<T>; streamable?: symbol };

export type { Streamable as default };
