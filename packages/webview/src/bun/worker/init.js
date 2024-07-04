// src/bun/dlopen.ts
import {FFIType as T, dlopen} from "bun:ffi";
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

// src/bun/platform.ts
var platform_default = `${process.platform}-${process.arch}`;

// src/bun/cstring.ts
import {ptr} from "bun:ffi";
var encoder = new TextEncoder;
var cstring_default = (value) => ptr(encoder.encode(`${value}\0`));

// ../invariant/lib/construct.js
var constructible = (value) => {
  try {
    Reflect.construct(String, [], value);
    return true;
  } catch {
    return false;
  }
};

// ../invariant/lib/errored.js
var errored_default = (error) => {
  if (typeof error === "function") {
    error();
  } else {
    throw new TypeError(error ?? "UNKNOWN ERROR");
  }
};

// ../invariant/lib/assert.js
var assert_default = (value, error) => {
  Boolean(value) || errored_default(error);
};

// ../invariant/lib/Is.js
var try_instanceof = function(value, type) {
  try {
    return value instanceof type;
  } catch {
    return typeof value === type;
  }
};
var test = ({ condition, def, error }) => assert_default(condition, error || def);

class Is {
  #value;
  constructor(value) {
    this.#value = value;
  }
  #test(options) {
    test(options);
    return this.#value;
  }
  #typeof(type, error) {
    const def = `\`${this.#value}\` must be of type ${type}`;
    const condition = typeof this.#value === type;
    return this.#test({ condition, def, error });
  }
  #eq(value, error) {
    const def = `\`${this.#value}\` must be \`${value}\``;
    const condition = this.#value === value;
    return this.#test({ condition, def, error });
  }
  string(error) {
    return this.#typeof("string", error);
  }
  number(error) {
    return this.#typeof("number", error);
  }
  bigint(error) {
    return this.#typeof("bigint", error);
  }
  boolean(error) {
    return this.#typeof("boolean", error);
  }
  symbol(error) {
    return this.#typeof("symbol", error);
  }
  function(error) {
    return this.#typeof("function", error);
  }
  undefined(error) {
    return this.#eq(undefined, error);
  }
  null(error) {
    return this.#eq(null, error);
  }
  array(error) {
    const def = `\`${JSON.stringify(this.#value)}\` must be array`;
    const condition = Array.isArray(this.#value);
    return this.#test({ condition, def, error });
  }
  object(error) {
    const string = Object.prototype.toString.call(this.#value);
    const def = `\`${string}\` must be object`;
    const condition = typeof this.#value === "object" && this.#value !== null;
    return this.#test({ condition, def, error });
  }
  defined(error) {
    const def = `\`${this.#value}\` must be defined`;
    const condition = this.#value !== undefined;
    return this.#test({ condition, def, error });
  }
  constructible(error) {
    const def = `\`${this.#value}\` must be constructible`;
    const condition = constructible(this.#value);
    return this.#test({ condition, def, error });
  }
  instance(Class, error) {
    const def = `\`${this.#value?.name}\` must be an instance ${Class.name}`;
    const condition = this.#value instanceof Class;
    return this.#test({ condition, def, error });
  }
  of(Class, error) {
    return this.instance(Class, error);
  }
  subclass(Class, error) {
    const def = `\`${this.#value?.name}\` must subclass ${Class.name}`;
    const condition = this.#value?.prototype instanceof Class;
    return this.#test({ condition, def, error });
  }
  sub(Class, error) {
    return this.subclass(Class, error);
  }
  anyOf(Classes, error) {
    const classes = Classes instanceof Array ? Classes : [Classes];
    const classes_str = classes.map((c) => `\`${c?.name ?? c}\``).join(", ");
    const def = `\`${this.#value}\` must instance any of ${classes_str}`;
    const condition = classes.some((c) => try_instanceof(this.#value, c));
    return this.#test({ condition, def, error });
  }
  integer(error) {
    const def = `\`${this.#value}\` must be integer`;
    const condition = Number.isInteger(this.#value);
    return this.#test({ condition, def, error });
  }
  isize(error) {
    return this.integer(error);
  }
  usize(error) {
    const def = `\`${this.#value}\` must be positive integer`;
    const condition = Number.isInteger(this.#value) && this.#value >= 0;
    return this.#test({ condition, def, error });
  }
  true(error) {
    const def = `\`${this.#value}\` must be boolean \`true\``;
    const condition = this.#value === true;
    return this.#test({ condition, def, error });
  }
  false(error) {
    const def = `\`${this.#value}\` must be boolean \`false\``;
    const condition = this.#value === false;
    return this.#test({ condition, def, error });
  }
}

// ../invariant/lib/Every.js
var test2 = ({ condition, def, error }) => assert_default(condition, error || def);

class Every {
  #values;
  constructor(...values) {
    this.#values = values;
  }
  #test(options) {
    test2(options);
    return this.#values;
  }
  #typeof(type, error) {
    const def = `all the values must be of type ${type}`;
    const condition = this.#values.every((v) => typeof v === type);
    return this.#test({ condition, def, error });
  }
  string(error) {
    return this.#typeof("string", error);
  }
  number(error) {
    return this.#typeof("number", error);
  }
  bigint(error) {
    return this.#typeof("bigint", error);
  }
  boolean(error) {
    return this.#typeof("boolean", error);
  }
  symbol(error) {
    return this.#typeof("symbol", error);
  }
  function(error) {
    return this.#typeof("function", error);
  }
  integer(error) {
    const def = "all the values must be integers";
    const condition = this.#values.every((v) => Number.isInteger(v));
    return this.#test({ condition, def, error });
  }
  isize(error) {
    return this.integer(error);
  }
  usize(error) {
    const def = "all the values must be positive integers";
    const condition = this.#values.every((v) => Number.isInteger(v) && v >= 0);
    return this.#test({ condition, def, error });
  }
}

// /home/pip/projects/rcompat/packages/object/node_modules/@rcompat/invariant/lib/exports.js
var is = (value) => new Is(value);
// ../object/lib/extend.js
var extend = (base, extension) => {
  const base_ = base ?? {};
  const extension_ = extension ?? {};
  if (!(!!base_ && typeof base_ === "object")) {
    return base_;
  }
  is(extension_).object();
  return Object.keys(extension_).reduce((result, property) => {
    const value = extension_[property];
    return {
      ...result,
      [property]: value?.constructor === Object ? extend(base_[property], value) : value
    };
  }, base_);
};
var extend_default = extend;
// ../object/lib/proper.js
var proper_default = (object) => typeof object === "object" && object !== null;

// ../object/lib/defaults.js
var defaults_default = (object, defaults) => {
  const object_ = object ?? {};
  is(defaults).object();
  if (proper_default(object_)) {
    return extend_default(defaults, object_);
  }
  return defaults;
};
// src/bun/Webview.ts
var default_library = `${import.meta.dir}/../platform/${platform_default}-webview.bin`;
var default_size = {
  width: 1280,
  height: 720,
  hint: 0
};

class Webview {
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
    const { width, height, hint } = defaults_default(default_size, size);
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

// src/bun/worker/template.ts
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
