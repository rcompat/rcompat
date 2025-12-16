import assert from "@rcompat/assert";
import fn from "@rcompat/fn";
import type { ReadableStreamDefaultReader } from "node:stream/web";

const decoder = new TextDecoder();

interface Options {
  chunks?: string[];
  reader: ReadableStreamDefaultReader;
};

const read = ({ chunks = [], reader }: Options): Promise<string[]> =>
  reader.read().then(({ done, value }) => done
    ? chunks
    : read({ chunks: [...chunks, decoder.decode(value)], reader }));

export default async (input: ReadableStream): Promise<string> => {
  assert.instance(input, ReadableStream);
  return (await read({ reader: input.getReader() })).filter(fn.defined).join("");
};
