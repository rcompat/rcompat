import type StreamSource from "#StreamSource";

const STREAMABLE = Symbol.for("std:Streamable");

function isStream<T>(x: any): x is ReadableStream<T> {
  return x != null && typeof x.getReader === "function";
}

function isBlob(x: any): x is Blob {
  return x != null
    && typeof x.arrayBuffer === "function"
    && typeof x.stream === "function"
    ;
}

type NamedStreamSource<T = unknown> = { name: string } & StreamSource<T>;

export default abstract class Streamable<T = unknown> {
  constructor() {
    Object.defineProperty(this, STREAMABLE, { value: true });
  }

  abstract stream(): ReadableStream<T>;

  static [Symbol.hasInstance](x: unknown): x is Streamable<unknown> {
    return typeof x === "object" && x !== null && Object.hasOwn(x, STREAMABLE);
  }

  static is<T>(x: unknown): x is Blob | ReadableStream<T> | Streamable<T> {
    return Streamable[Symbol.hasInstance](x) || isStream(x) || isBlob(x);
  }

  static named<T>(x: unknown): x is NamedStreamSource<T> {
    return Streamable.is<T>(x) && typeof (x as any).name === "string";
  }

  static stream<T>(x: unknown) {
    if (Streamable[Symbol.hasInstance](x) || isBlob(x)) {
      return x.stream();
    }
    if (isStream<T>(x)) {
      return x;
    }
    throw new TypeError("Value is not Blob | ReadableStream | Streamable");
  }
}
