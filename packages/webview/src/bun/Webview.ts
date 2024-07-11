import type { BunFile } from "bun";
import dlopen from "./dlopen.js";
import platform from "./platform.js";
import cstring from "./cstring.js";
import { extend } from "@rcompat/object";

const default_library = `${import.meta.dir}/../platform/${platform}-webview.bin`;

export interface WebviewOptions {
  debug: boolean,
  library?: BunFile,
}

export interface Size {
  width: number,
  height: number,
  hint: 0 | 1 | 2 | 3,
}

const default_size: Size = {
  width: 1280,
  height: 720,
  hint: 0,
};

export default class Webview {
  #handle: any = null;
  #library: any;

  constructor({ debug, library }: WebviewOptions = { debug: false }) {
    this.#library = dlopen(library ?? default_library);
    this.#handle = this.symbol("create")(Number(debug), null);
    this.size = default_size;
  }

  symbol(name: string) {
    return this.#library.symbols[`webview_${name}`];
  }

  navigate(url: string) {
    this.symbol("navigate")(this.#handle, cstring(url));
  }

  set html(html: string) {
    this.symbol("set_html")(this.#handle, cstring(html));
  }

  set size(size: Size) {
    const { width, height, hint } = extend(default_size, size);
    this.symbol("set_size")(this.#handle, width, height, hint);
  }

  run() {
    this.symbol("run")(this.#handle);
    this.destroy();
  }

  destroy() {
    this.symbol("terminate")(this.#handle);
    this.symbol("destroy")(this.#handle);
    this.#handle = null;
  }
}
