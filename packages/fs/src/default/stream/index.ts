import streamable from "@rcompat/fs/streamable";

export type Streamable<T> =
  ReadableStream<T> | { stream: () => ReadableStream<T>, streamable?: symbol };

export default <T>(input : Streamable<T>) => {
  if (input instanceof ReadableStream) {
    return input;
  }
  if (input instanceof Blob || input.streamable === streamable) {
    return input.stream();
  }

  throw new Error("input unstreamable");
}
