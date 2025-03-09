import s_streamable from "#symbols/streamable";

export type Streamable<T> =
  ReadableStream<T> | { stream: () => ReadableStream<T>, streamable?: symbol };

export default <T>(input : Streamable<T>): ReadableStream => {
  if (input instanceof ReadableStream) {
    return input;
  }

  if (input instanceof Blob || input.streamable === s_streamable) {
    return input.stream();
  }

  throw new Error("input unstreamable");
}
