import { maybe } from "rcompat/invariant";
import CommonFile from "./CommonFile.js";

const { file, write } = Bun;

export default class BunFile extends CommonFile {
  // {{{ single file operations
  arraybuffer() {
    return file(this.path).arrayBuffer();
  }

  text() {
    return file(this.path).text();
  }

  json() {
    return file(this.path).json();
  }

  stream() {
    return file(this.path).stream();
  }

  writer() {
    return file(this.path).writer();
  }

  write(data, options) {
    maybe(options).object();

    return write(this.path, data);
  }
  // }}}
}
