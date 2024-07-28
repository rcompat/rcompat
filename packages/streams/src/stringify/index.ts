import defined from "@rcompat/function/defined";
import is from "@rcompat/invariant/is";
import type { ReadableStreamDefaultReader } from "node:stream/web";

const decoder = new TextDecoder();
const read = ({ chunks = [], reader } : { chunks?: string[], reader: ReadableStreamDefaultReader }): Promise<string[]> =>
  reader.read().then(({ done, value }) => done
    ? chunks
    : read({ chunks: [...chunks, decoder.decode(value)], reader }));

export default async (input: ReadableStream): Promise<string> => {
  is(input).instance(ReadableStream);
  return (await read({ reader: input.getReader() })).filter(defined).join("");
}
