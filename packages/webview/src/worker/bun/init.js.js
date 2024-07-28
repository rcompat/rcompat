// ../invariant/lib/base/errored.js
var errored_default = (error) => {
  if (typeof error === "function") {
    error();
  } else {
    throw new TypeError(error ?? "UNKNOWN ERROR");
  }
};

// ../invariant/lib/assert/index.js
var assert_default = (value, error) => {
  Boolean(value) || errored_default(error);
};

// ../object/lib/proper/index.js
var proper_default = (object) => typeof object === "object" && object !== null;

// ../object/lib/override/index.js
var recurse = (t, u) => (proper_default(t) && proper_default(u) ? override(t, u) : u) ?? t;
var override = (base, over) => {
  assert_default(proper_default(base));
  assert_default(proper_default(over));
  return Object.keys(over).reduce((overridden, key) => ({
    ...overridden,
    [key]: recurse(base[key], over[key])
  }), base);
};
var override_default = override;

// src/default/bun/cstring.ts
import { ptr } from "bun:ffi";
var encoder = new TextEncoder();
var cstring_default = (value) => ptr(encoder.encode(`${value}\0`));

// src/default/bun/dlopen.ts
import { FFIType as T, dlopen } from "bun:ffi";
var dlopen_default = (name) => dlopen(name, {
  webview_create: { returns: T.ptr, args: [T.i32, T.ptr] },
  webview_destroy: { returns: T.void, args: [T.ptr] },
  webview_run: { returns: T.void, args: [T.ptr] },
  webview_terminate: { returns: T.void, args: [T.ptr] },
  webview_navigate: { returns: T.void, args: [T.ptr, T.ptr] },
  webview_set_title: { returns: T.void, args: [T.ptr, T.ptr] },
  webview_set_size: { returns: T.void, args: [T.ptr, T.i32, T.i32, T.i32] },
  webview_set_html: { returns: T.void, args: [T.ptr, T.ptr] }
});

// src/default/bun/platform.ts
var platform_default = `${process.platform}-${process.arch}`;

// src/default/bun/Webview.ts
var default_library = `${import.meta.dir}/../../platform/${platform_default}-webview.bin`;
var default_size = {
  width: 1280,
  height: 720,
  hint: 0
};
var Webview = class {
  #handle = null;
  #library;
  constructor({ debug, library } = { debug: false }) {
    this.#library = dlopen_default(library ?? default_library);
    this.#handle = this.symbol("create")(Number(debug), null);
    this.size = default_size;
  }
  symbol(name) {
    return this.#library.symbols[`webview_${name}`];
  }
  navigate(url) {
    this.symbol("navigate")(this.#handle, cstring_default(url));
  }
  set html(html) {
    this.symbol("set_html")(this.#handle, cstring_default(html));
  }
  set size(size) {
    const { width, height, hint } = override_default(default_size, size);
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
};

// src/worker/bun/template.ts
var webview;
var events = {
  construct(debug, library) {
    webview = new Webview({ debug, library: Bun.file(library) });
  },
  navigate(url) {
    webview.navigate(url);
  },
  run() {
    webview.run();
  },
  destroy() {
    webview.destroy();
  },
  set_html(html) {
    webview.html = html;
  },
  set_size(size) {
    webview.size = size;
  }
};
self.addEventListener("message", (event) => {
  const { name, params = [] } = event.data;
  events[name](...params);
});
