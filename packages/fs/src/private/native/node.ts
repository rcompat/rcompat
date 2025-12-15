import type Native from "#native/type";
import type WritableInput from "#WritableInput";
import fs from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { Readable } from "node:stream";

const text = (path: string) => readFile(path, { encoding: "utf8" });

const node: Native = {
  async arrayBuffer(path: string) {
    return (await readFile(path)).buffer as ArrayBuffer;
  },
  async json(path: string) {
    return JSON.parse(await text(path));
  },
  stream(path: string) {
    const options = { flags: "r" };
    return Readable.toWeb(fs.createReadStream(path, options)) as
      unknown as ReadableStream<Uint8Array>;
  },
  text(path: string) {
    return text(path);
  },
  async size(path: string) {
    return Buffer.byteLength(await readFile(path));
  },
  async write(path: string, input: WritableInput) {
    if (input instanceof Blob || input instanceof Response) {
      return writeFile(path, new Uint8Array(await input.arrayBuffer()));
    }
    if (input instanceof ArrayBuffer) {
      return writeFile(path, new Uint8Array(input));
    }
    return writeFile(path, input);
  },
};

export default node;
