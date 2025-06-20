import defined from "@rcompat/function/defined";
import is from "@rcompat/assert/is";
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
  is(input).instance(ReadableStream);
  return (await read({ reader: input.getReader() })).filter(defined).join("");
};
