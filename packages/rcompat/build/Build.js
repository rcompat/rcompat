import { is, assert } from "rcompat/invariant";
import * as o from "rcompat/object";
import * as esbuild from "esbuild";
import * as hotreload from "./hotreload.js";
import { default as modes, dev, prod } from "./modes.js";
const mode_keys = Object.keys(modes);

export default class Build {
  #started = false;
  #mode;
  #hotreload;
  #options;
  #name;
  #plugins = [];
  #artifacts = {};
  #exports = [];

  constructor(options = {}, mode = dev) {
    is(options).object();
    assert(mode_keys.includes(mode), `mode must be one of "${dev}", "${prod}"`);

    const { excludes, name, ...rest } = o.exclude(options, ["hotreload"]);

    this.#name = name;
    this.#hotreload = {
      ...hotreload.defaults,
      ...options.hotreload,
    };
    this.#options = {
      // defaults
      bundle: true,
      format: "esm",
      external: excludes,
      ...modes[mode](name),
      ...rest,
    };
    this.#mode = mode;
  }

  plugin(plugin) {
    this.#plugins.push(plugin);
  }

  save(path, source) {
    this.#artifacts[path] = source;
  }

  load(path) {
    return this.#artifacts[path];
  }

  export(code) {
    if (this.#exports.includes(code)) {
      return;
    }
    this.#exports.push(code);
  }

  #hot() {
    const name = this.#name;
    const { host, port } = this.#hotreload;

    return {
      url: `http://${host}:${port}`,
      paths: [`/${name}.js`, `/${name}.css`, hotreload.event_path],
    };
  }

  proxy(request, next) {
    const hot = this.#hot();

    return hot.paths.includes(request.url.pathname)
      ? request.pass(hot.url)
      : next(request);
  }

  async start() {
    is(this.#started).false("build already started");

    const { resolveDir, ...options } = this.#options;

    const context = await esbuild.context({
      stdin: {
        contents: this.#exports.join("\n"),
        resolveDir,
      },
      plugins: this.#plugins,
      ...options,
    });
    await context.rebuild();

    if (this.development) {
      await context.watch();
      await context.serve(this.#hotreload);
    }

    this.#started = true;
  }

  get development() {
    return this.#mode === dev;
  }
}
