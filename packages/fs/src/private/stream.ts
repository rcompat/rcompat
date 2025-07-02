import s_streamable from "#s_streamable";
import type Streamable from "#Streamable";

export default <T>(input : Streamable<T>): ReadableStream => {
  if (input instanceof ReadableStream) {
    return input;
  }

  if (input instanceof Blob || input.streamable === s_streamable) {
    return input.stream();
  }

  throw new Error("input unstreamable");
};
