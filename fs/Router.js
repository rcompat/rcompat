import O from "rcompat/object";
import File from "./File.js";
import to_node from "./router/to-node.js";
import * as errors from "./router/errors.js";

const default_extension = ".js";

export default class Router {
  static Error = errors;

  #root;
  #config;

  constructor(config) {
    this.#config = O.defaults(config, {
      directory: undefined,
      extension: default_extension,
      specials: {},
      predicate: _ => true,
    });
    this.#root = new (to_node({
      specials: this.#config.specials,
      predicate: this.#config.predicate,
    }))(null, "$");
  }

  #add(node, parts, file) {
    const [first, ...rest] = parts;
    // anchor
    if (parts.length === 1) {
      node.filed(first, file);
    } else {
      this.#add(node.interim(first), rest, file);
    }
  }

  match(request) {
    const path = new URL(request.url).pathname;
    const [_, ...parts] = path.split("/").map(p => p === "" ? "index" : p);
    const $parts = parts.filter((part, i) => i === 0 || part !== "index");
    const root = this.#root;
    return root.match(request, $parts.concat("index"), false)
      ?? root.match(request, $parts);
  }

  init(objects) {
    for (const [path, file] of objects.sort(([a], [b]) => a > b ? 1 : -1)) {
      this.#add(this.#root, File.webpath(path).split("/"), file);
    }

    // check for duplicates
    this.#root.check(node => {
      if (node.doubled) {
        throw new errors.DoubleRoute(node.path);
      }
      const dynamics = node.dynamics();
      if (dynamics.length > 1) {
        throw new errors.DoubleRoute(dynamics[1].path);
      }
      const [dynamic = {}] = dynamics;
      if (dynamic.optional && !dynamic.leaf) {
        throw new errors.OptionalRoute(dynamic.path);
      }
      if (dynamic.rest && !dynamic.leaf) {
        throw new errors.RestRoute(dynamic.path);
      }
    });

    return this;
  }

  static init(config, objects) {
    return new Router(config).init(objects);
  }

  async load() {
    const { directory, extension } = this.#config;
    const re = new RegExp(`^.*${extension}$`, "u");

    this.init(directory === undefined ? [] : await Promise.all(
      (await File.collect(directory, re, { recursive: true }))
        .map(async file => [
          `${file}`.replace(directory, _ => "").slice(1, -extension.length),
          await file.import(),
        ])));

    return this;
  }

  depth(special) {
    return this.#root.max(node => node.specials()
      .filter(({ path }) => path.slice(1) === special).length > 0);
  }

  static load(config) {
    return new Router(config).load();
  }
}
