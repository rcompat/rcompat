import FileRef from "#FileRef";
import type Config from "#router/Config";
import type Import from "#router/Import";
import Node from "#router/Node";
import override from "@rcompat/record/override";
import * as errors from "./errors.js";

const defaults = {
  directory: undefined,
  extensions: [".js"],
  specials: {},
  predicate: () => true,
  import: true,
} satisfies Config;

export default class Router<Route extends Import, Special extends Import> {
  static Error = errors;

  #root: Node<Route, Special>;
  #config: Config;

  constructor(config: Config) {
    this.#config = override(defaults, config);
    Node.config = {
      specials: this.#config.specials,
      predicate: this.#config.predicate,
    };
    this.#root = new Node(null, "$");
  }

  #add(node: Node<Route, Special>, parts: string[], file: Route | Special) {
    const [first, ...rest] = parts;
    // leaves
    if (parts.length === 1) {
      node.filed(first, file);
    } else {
      this.#add(node.interim(first), rest, file);
    }
  }

  match(request: Request) {
    const path = new URL(request.url).pathname;
    const [_, ...parts] = path.split("/").map(p => p === "" ? "index" : p);
    const $parts = parts.filter((part, i) => i === 0 || part !== "index");
    const root = this.#root;
    return root.match(request, $parts.concat("index"), false)
      ?? root.match(request, $parts);
  }

  init(objects: [string, Route | Special][]) {
    for (const [path, file] of objects.sort(([a], [b]) => a > b ? 1 : -1)) {
      this.#add(this.#root, FileRef.webpath(path).split("/"), file);
    }

    // check for duplicates
    this.#root.check((node: Node<Route, Special>) => {
      if (node.doubled) {
        throw new errors.DoubleRoute(node.path);
      }
      const dynamics = node.dynamics();
      if (dynamics.length > 1) {
        throw new errors.DoubleRoute(dynamics[1].path);
      }
      if (dynamics.length === 0) {
        return true;
      }
      const [dynamic] = dynamics;
      if (dynamic.optional && !dynamic.leaf) {
        throw new errors.OptionalRoute(dynamic.path);
      }
      if (dynamic.rest && !dynamic.leaf) {
        throw new errors.RestRoute(dynamic.path);
      }

      return true;
    });

    return this;
  }

  async load() {
    const { directory, extensions } = this.#config;
    const re = new RegExp(`^.*${extensions.join("|")}$`, "u");

    this.init(directory === undefined ? [] : await Promise.all(
      (await FileRef.collect(directory, { recursive: true }, re))
        .map(async (file: FileRef) => [
          `${file}`.replace(directory, _ => "").slice(1, -file.extension.length),
          this.#config.import && await file.import(),
        ])));

    return this;
  }

  depth(special: string) {
    return this.#root.max((node: Node<Route, Special>) => node.specials()
      .filter(({ path }: { path: string }) => path.slice(1) === special).length > 0);
  }

  static init<Route extends Import, Special extends Import>(config: Config, objects: [string, Route | Special][]) {
    return new Router<Route, Special>(config).init(objects);
  }

  static load(config: Config) {
    return new Router(config).load();
  }
}
