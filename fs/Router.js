import O from "rcompat/object";
import File from "./File.js";
import to_node from "./router/to-node.js";

const default_extension = ".js";

export default class Router {
  #root;
  #config;

  constructor(config) {
    this.#config = O.defaults(config, {
      directory: undefined,
      extension: default_extension,
      specials: {},
    });
    this.#root = new (to_node(this.#config.specials))(null, "$");
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

  match(path) {
    const [_, ...parts] = path.split("/").map(p => p === "" ? "index" : p);
    const $parts = parts.filter((part, i) => i === 0 || part !== "index");
    const root = this.#root;
    return root.match($parts.concat("index"), false) ?? root.match($parts);
  }

  init(objects) {
    for (const [path, file] of objects) {
      this.#add(this.#root, path.split("/"), file);
    }
    // check for duplicates
    this.#root.check(node => {
      const dynamics = node.dynamics();
      if (dynamics.length > 1) {
        throw new Error("doubled route");
      }
      const [dynamic = {}] = dynamics;
      if (dynamic.optional && !dynamic.leaf) {
        throw new Error("optional routes must be leaves");
      }
      if (dynamic.rest && !dynamic.leaf) {
        throw new Error("rest routes must be leaves");
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
  }
}
