import type Native from "#native/type";
import type WritableInput from "#WritableInput";
import fs from "node:fs";
import { readFile, stat, writeFile } from "node:fs/promises";
import { Readable } from "node:stream";

const text = (path: string) => readFile(path, { encoding: "utf8" });

const node: Native = {
  async arrayBuffer(path: string) {
    const u8 = await readFile(path);
    return u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength);
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
    return (await stat(path)).size;
  },
  async write(path: string, input: WritableInput) {
    // normalise to string | Uint8Array
    let out: string | Uint8Array;

    if (input instanceof ReadableStream) {
      out = await new Response(input).bytes();
    } else if (input instanceof Blob || input instanceof Response) {
      out = await input.bytes();
    } else if (input instanceof ArrayBuffer) {
      out = new Uint8Array(input);
    } else {
      // unnormalised string | Uint8Array
      out = input;
    }

    await writeFile(path, out);
  },
};

export default node;
