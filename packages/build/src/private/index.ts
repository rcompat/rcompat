import reload_defaults from "#reload/defaults";
import reload_path from "#reload/path";
import assert from "@rcompat/invariant/assert";
import is from "@rcompat/invariant/is";
import type Dictionary from "@rcompat/record/Dictionary";
import exclude from "@rcompat/record/exclude";
import type UnknownFunction from "@rcompat/type/UnknownFunction";
import * as esbuild from "esbuild";
import { dev, default as modes, prod } from "./modes.js";

const mode_keys = Object.keys(modes);

export interface BuildOptions extends esbuild.BuildOptions {
  hotreload?: {
    host: string,
    port: number
  } | undefined,
  excludes?: string[] | undefined,
  name?: string | undefined,
}
type PluginPath = string;

export default class Build {
  #started = false;
  #mode;
  #hotreload;
  #options;
  #name;
  #plugins: esbuild.Plugin[] = [];
  #artifacts: Dictionary<string> = {};
  #exports: string[] = [];
  #context?: esbuild.BuildContext;

  constructor(options: BuildOptions = {}, mode: typeof dev | typeof prod = dev) {
    is(options).object();
    assert(mode_keys.includes(mode), `mode must be one of "${dev}", "${prod}"`);

    const { excludes, name, ...rest } = exclude(options, ["hotreload"]);

    this.#name = name;
    this.#hotreload = {
      ...reload_defaults,
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
      paths: [`/${name}.js`, `/${name}.css`, reload_path],
    };
  }

  proxy(request: Request, fallback: UnknownFunction) {
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
    const build_options = {
      stdin: {
        ...stdin,
        contents: this.#exports.join("\n"),
      },
      plugins: this.#plugins,
      ...options,
    }

    if (this.development) {
      const context = await esbuild.context(build_options as never);
      await context.rebuild();
      await context.watch();
      await context.serve(this.#hotreload);
      this.#context = context;
    } else {
      await esbuild.build(build_options as never);
    }
    this.#started = true;
  }

  stop() {
    if (this.#context !== undefined) {
      this.#context.dispose();
    }
  }

  get development() {
    return this.#mode === dev;
  }
}
