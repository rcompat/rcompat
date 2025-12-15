import cstring from "#cstring";
import dlopen from "#dlopen";
import record from "@rcompat/record";
import type { BunFile } from "bun";

interface Init {
  debug: boolean;
  platform: BunFile;
}

interface Size {
  height: number;
  hint: 0 | 1 | 2 | 3;
  width: number;
}

const default_size: Size = {
  height: 720,
  hint: 0,
  width: 1280,
};

export default class Webview {
  #handle: any = null;
  #platform: any;

  constructor(init: Init) {
    this.#platform = dlopen(init.platform);
    this.#handle = this.symbol("create")(Number(init.debug ?? false), null);
    this.size = default_size;
  }

  symbol(name: string) {
    return this.#platform.symbols[`webview_${name}`];
  }

  navigate(url: string) {
    this.symbol("navigate")(this.#handle, cstring(url));
  }

  set html(html: string) {
    this.symbol("set_html")(this.#handle, cstring(html));
  }

  set size(size: Size) {
    const { height, hint, width } = record.override(default_size, size);
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
    globalThis.postMessage("destroyed");
  }
}
