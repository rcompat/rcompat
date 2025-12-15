import FileRef from "#FileRef";
import type Config from "#router/Config";
import * as errors from "#router/errors";
import Node from "#router/Node";
import record from "@rcompat/record";

const defaults: Config = {
  directory: undefined,
  extensions: [".js"],
  specials: {},
};

export default class FileRouter {
  static Error = errors;

  #root: Node;
  #config: Config;

  constructor(config: Config) {
    this.#config = record.override(defaults, config);
    Node.config = {
      specials: this.#config.specials,
    };
    this.#root = new Node(null, "$");
  }

  #add(node: Node, parts: string[], path: string) {
    const names = parts
      .filter(p => p.startsWith("["))
      .map(p => p.replace(/\[|\]|\.{3}/g, ""));

    const seen = new Set<string>();
    for (const name of names) {
      if (seen.has(name)) {
        throw new errors.DoubleParam(name);
      }
      seen.add(name);
    }

    const [first, ...rest] = parts;
    // leaves
    if (parts.length === 1) {
      node.filed(first, path);
    } else {
      this.#add(node.interim(first), rest, path);
    }
  }

  #normalize(pathname: string): string[] {
    const deslashed = pathname.replace(/\/{2,}/g, "/");
    const detrailed = deslashed !== "/" && deslashed.endsWith("/")
      ? deslashed.slice(0, -1)
      : deslashed;

    const segments = detrailed.split("/").filter(Boolean);

    if (segments.at(-1) === "index" && segments.at(-2) !== "index") {
      return segments.slice(0, -1);
    }
    return segments;
  }

  match(request: Request) {
    const root = this.#root;
    const segments = this.#normalize(new URL(request.url).pathname);

    // 1) Try exact parts first (static or dynamic)
    const exact = root.match(segments);
    if (exact !== undefined) return exact;

    // 2) If no exact, try appending "index"
    const index_segments = [...segments, "index"];
    const index_match = root.match(index_segments);
    if (index_match && index_match.segment === "index") return index_match;
  }

  init(objects: string[]) {
    for (const path of objects.toSorted((a, b) => a.localeCompare(b))) {
      this.#add(this.#root, FileRef.webpath(path).split("/"), path);
    }

    // check for duplicates
    this.#root.check((node: Node) => {
      node.unique();

      const dynamics = node.dynamics();
      if (dynamics.length > 1) {
        throw new errors.DoubleRoute(dynamics[1].segment);
      }
      if (dynamics.length === 0) {
        return true;
      }
      const [dynamic] = dynamics;
      if (dynamic.optional && !dynamic.leaf) {
        throw new errors.OptionalRoute(dynamic.segment);
      }
      if (dynamic.rest && !dynamic.leaf) {
        throw new errors.RestRoute(dynamic.segment);
      }

      return true;
    });

    return this;
  }

  async load() {
    const { directory, extensions } = this.#config;
    const re = new RegExp(`^.*${extensions.join("|")}$`, "u");

    return this.init(directory === undefined ? [] : await Promise.all(
      (await FileRef.collect(directory, file => re.test(file.path)))
        .map(file =>
          `${file}`.replace(directory, _ => "").slice(1, -file.extension.length),
        )));
  }

  all() {
    return this.#root.flatten();
  }

  depth(special: string) {
    return this.#root.max((node: Node) => node.specials()
      .filter(({ segment }: { segment: string }) =>
        segment.slice(1) === special).length > 0);
  }

  static init(config: Config, objects: string[]) {
    return new FileRouter(config).init(objects);
  }

  static load(config: Config) {
    return new FileRouter(config).load();
  }
}
