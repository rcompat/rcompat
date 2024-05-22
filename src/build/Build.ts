import { is, assert } from "rcompat/invariant";
import * as o from "rcompat/object";
import * as esbuild from "esbuild";
import * as hotreload from "./hotreload.js";
import { default as modes, dev, prod } from "./modes.js";
const mode_keys = Object.keys(modes);

export interface BuildOptions extends esbuild.BuildOptions {
  hotreload?: {
    host: string,
    port: number
  },
  excludes?: string[],
  name?: string,
}
type PluginPath = string;

export default class Build {
  #started = false;
  #mode;
  #hotreload;
  #options;
  #name;
  #plugins: esbuild.Plugin[] = [];
  #artifacts: Record<string, unknown> = {};
  #exports: string[] = [];

  constructor(options: BuildOptions = {}, mode: typeof dev | typeof prod = dev) {
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
      format: "esm" as const,
      external: excludes,
      ...modes[mode](name),
      ...rest,
    };
    this.#mode = mode;
  }

  plugin(plugin: esbuild.Plugin) {
    this.#plugins.push(plugin);
  }

  save(path: PluginPath, source: string) {
    this.#artifacts[path] = source;
  }

  load(path: PluginPath) {
    return this.#artifacts[path];
  }

  export(code: string) {
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

  proxy(request: Request, fallback: Function) {
    const { paths, url } = this.#hot();
    const { pathname } = new URL(request.url);
    const { method, headers, body } = request;

    return paths.includes(pathname)
      ? fetch(`${url}${pathname}`, { headers, method, body, duplex: "half" })
      : fallback();
  }

  async start() {
    is(this.#started).false("build already started");

    const { stdin, ...options } = this.#options;

    const context = await esbuild.context({
      stdin: {
        ...stdin,
        contents: this.#exports.join("\n"),
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
