import { defined } from "rcompat/function";
import type { ReadableStreamDefaultReader } from "node:stream/web";
import { ReadableStream } from "./exports.js";

const decoder = new TextDecoder();
const read = ({ chunks = [], reader } : { chunks?: string[], reader: ReadableStreamDefaultReader }): Promise<string[]> =>
  reader.read().then(({ done, value }) => done
    ? chunks
    : read({ chunks: [...chunks, decoder.decode(value)], reader }));

export default async (input: ReadableStream | unknown) => input instanceof ReadableStream
  ? (await read({ reader: input.getReader() })).filter(defined).join("")
  : input;
