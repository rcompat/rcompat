import { defined } from "rcompat/function";
import { ReadableStream } from "./exports.js";

const decoder = new TextDecoder();
const read = ({ chunks = [], reader }) =>
  reader.read().then(({ done, value }) => done
    ? chunks
    : read({ chunks: [...chunks, decoder.decode(value)], reader }));

export default async input => input instanceof ReadableStream
  ? (await read({ reader: input.getReader() })).filter(defined).join("")
  : input;
