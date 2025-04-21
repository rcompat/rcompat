import type Native from "#native/type";
import type WritableInput from "#WritableInput";
import fs from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { Readable } from "node:stream";

const text = (path: string) => readFile(path, { encoding: "utf8" });

const node: Native = {
  async arrayBuffer(path: string) {
    return (await readFile(path)).buffer;
  },
  text(path: string) {
    return text(path);
  },
  async json(path: string) {
    return JSON.parse(await text(path));
  },
  stream(path: string) {
    const options = { flags: "r" };
    return Readable.toWeb(fs.createReadStream(path, options));
  },
  async write(path: string, input: WritableInput) {
    await writeFile(path, input instanceof Blob ? input.stream() : input);
  }
}

export default node;
