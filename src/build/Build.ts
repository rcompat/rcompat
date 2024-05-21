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

const _modes = modes as any;
export default class Build {
  #started = false;
  #mode;
  #hotreload;
  #options;
  #name;
  #plugins = [];
  #artifacts: any = {};
  #exports = [];

  constructor(options: BuildOptions = {}, mode: any = dev) {
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
      ..._modes[mode](name),
      ...rest,
    };
    this.#mode = mode;
  }

  plugin(plugin: any) {
    this.#plugins.push(plugin as never);
  }

  save(path: any, source: any) {
    this.#artifacts[path] = source;
  }

  load(path: any) {
    return this.#artifacts[path];
  }

  export(code: any) {
    if (this.#exports.includes(code as never)) {
      return;
    }
    this.#exports.push(code as never);
  }

  #hot() {
    const name = this.#name;
    const { host, port } = this.#hotreload;

    return {
      url: `http://${host}:${port}`,
      paths: [`/${name}.js`, `/${name}.css`, hotreload.event_path],
    };
  }

  proxy(request: any, next: any) {
    const hot = this.#hot();

    return hot.paths.includes(request.url.pathname)
      ? request.pass(hot.url)
      : next(request);
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
