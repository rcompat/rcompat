import fs from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { Readable, Writable } from "node:stream";
import { maybe } from "rcompat/invariant";
import CommonFile from "./CommonFile.js";

export default class NodeFile extends CommonFile {
  // {{{ single file operations
  #read(options) {
    maybe(options).object();

    return readFile(this.path, {
      encoding: options?.encoding ?? "utf8",
      ...options,
    });
  }

  arrayBuffer() {
    return this.#read({ encoding: undefined });
  }

  text() {
    return this.#read();
  }

  async json() {
    return JSON.parse(await this.#read());
  }

  stream() {
    return Readable.toWeb(fs.createReadStream(this.path, { flags: "r" }));
  }

  writer() {
    return Writable.toWeb(fs.createWriteStream(this.path));
  }

  write(data, options) {
    maybe(options).object();

    return writeFile(this.path, data);
  }
  // }}}
}
