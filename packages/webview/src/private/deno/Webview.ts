import cstring from "#deno/cstring";
import dlopen from "#deno/dlopen";
import type symbols from "#deno/symbols";

type Symbol = keyof typeof symbols;

interface Init {
  platform: string;
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
  #handle: Deno.PointerValue | null = null;
  #platform: ReturnType<typeof dlopen>;

  constructor(init: Init) {
    this.#platform = dlopen(init.platform);
    this.#handle = this.#symbol("create")(Number(init.debug ?? false), null);
    this.size = default_size;
  }

  #symbol(name: Symbol) {
    // @ts-expect-error: nonsense
    return this.#platform.symbols[`webview_${name}`] as Function;
  }

  navigate(url: string) {
    this.#symbol("navigate")(this.#handle, cstring(url));
  }

  set html(html: string) {
    this.#symbol("set_html")(this.#handle, cstring(html));
  }

  set size(size: Size) {
    const { width, height, hint } = { ...default_size, ...size };
    this.#symbol("set_size")(this.#handle, width, height, hint);
  }

  run() {
    this.#symbol("run")(this.#handle);
    this.destroy();
  }

  destroy() {
    if (this.#handle) {
      this.#symbol("terminate")(this.#handle);
      this.#symbol("destroy")(this.#handle);
      this.#handle = null;
      globalThis.postMessage?.("destroyed");
    }
  }
}
