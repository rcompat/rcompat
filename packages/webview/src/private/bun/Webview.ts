import cstring from "#cstring";
import dlopen from "#dlopen";
import override from "@rcompat/record/override";
import type { BunFile } from "bun";

interface Init {
  platform: BunFile;
  debug: boolean;
}

interface Size {
  width: number;
  height: number;
  hint: 0 | 1 | 2 | 3;
}

const default_size: Size = {
  width: 1280,
  height: 720,
  hint: 0,
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
    const { width, height, hint } = override(default_size, size);
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
