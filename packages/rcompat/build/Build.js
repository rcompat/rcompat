import { is, assert } from "rcompat/invariant";
import * as esbuild from "esbuild";

const hotreload_event_path = "/esbuild";
const default_name = "app";
const dev = "development";
const prod = "production";
const modes = {
  [dev]: (name = default_name) => ({
    minify: false,
    splitting: false,
    banner: {
      js: `new EventSource("${hotreload_event_path}").addEventListener("change",
        () => globalThis.location.reload());`,
    },
    entryNames: name,
  }),
  [prod]: (name = default_name) => ({
    minify: true,
    splitting: true,
    banner: {},
    entryNames: `${name}-[hash]`,
  }),
};
const mode_keys = Object.keys(modes);
const defaults_hotreload = {
  host: "localhost",
  port: 6262,
};

export default class Build {
  #name;
  #options;
  #hotreload;
  #started = false;
  #mode;
  #plugins = [];
  #artifacts = {};
  #exports = [];

  get development() {
    return this.#mode === dev;
  }

  constructor(options = {}, mode = dev) {
    is(options).object();
    assert(mode_keys.includes(mode), `mode must be one of "${dev}", "${prod}"`);

    const { excludes, hotreload, name, ...rest } = options;

    this.#name = name;

    this.#hotreload = {
      ...defaults_hotreload,
      ...hotreload,
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
      paths: [`/${name}.js`, `/${name}.css`, hotreload_event_path],
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
}
