import E from "#errors";
import type Streamable from "#Streamable";
import is from "@rcompat/is";

const brand = Symbol.for("std:fs/Streamable/v0");

function is_stream<T>(x: any): x is ReadableStream<T> {
  return !is.null(x) && is.function(x.getReader);
}

function is_blob(x: any): x is Blob {
  return !is.null(x) && is.function(x.arrayBuffer) && is.function(x.stream);
}

type NamedStreamable<T = unknown> = { name: string } & Streamable<T>;

type HasStream<T> = { stream(): ReadableStream<T> };

export default class StreamSource {
  static get brand() {
    return brand;
  }

  static is<T>(x: unknown): x is Blob | ReadableStream<T> | Streamable<T> {
    return is.branded(x, brand) || is_stream(x) || is_blob(x);
  }

  static named<T>(x: unknown): x is NamedStreamable<T> {
    return StreamSource.is<T>(x) && typeof (x as any).name === "string";
  }

  static stream<T>(x: unknown): ReadableStream<T> {
    if (is.branded(x, brand)) return (x as HasStream<T>).stream();
    if (is_blob(x)) return x.stream() as ReadableStream<T>;
    if (is_stream<T>(x)) return x;
    throw E.value_not_streamable(x);
  }
}
