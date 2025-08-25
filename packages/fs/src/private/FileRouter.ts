import FileRef from "#FileRef";
import type Config from "#router/Config";
import * as errors from "#router/errors";
import Node from "#router/Node";
import override from "@rcompat/record/override";

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
    this.#config = override(defaults, config);
    Node.config = {
      specials: this.#config.specials,
    };
    this.#root = new Node(null, "$");
  }

  #add(node: Node, parts: string[], fullpath: string) {
    const [first, ...rest] = parts;
    // leaves
    if (parts.length === 1) {
      node.filed(first, fullpath);
    } else {
      this.#add(node.interim(first), rest, fullpath);
    }
  }

  match(request: Request) {
    const pathname = new URL(request.url).pathname;
    const deslashed = pathname.replace(/\/{2,}/g, "/");
    const detrailed = deslashed !== "/" && deslashed.endsWith("/")
      ? deslashed.slice(0, -1)
      : deslashed;

    const segments = detrailed.split("/").filter(Boolean);
    if (segments.at(-1) === "index") segments.pop();

    const root = this.#root;

    // 1) Prefer static ".../index"
    const index = root.match(request, [...segments, "index"], false);
    if (index) return index;

    // 2) If root, optionally support routes/[[...]].ts or routes/[[id]].ts
    // with empty param
    if (segments.length === 0) {
      const optional = root.dynamics().find(d => d.optional);
      if (optional?.fullpath) {
        return {
          fullpath: optional.fullpath,
          params: {},
          path: optional.path,
          specials: optional.collect(),
        };
      }
      return undefined;
    }

    // 3) Fallback to exact parts (static or dynamic)
    return root.match(request, segments);
  }

  init(objects: string[]) {
    for (const path of objects.toSorted(([a], [b]) => a > b ? 1 : -1)) {
      this.#add(this.#root, FileRef.webpath(path).split("/"), path);
    }

    // check for duplicates
    this.#root.check((node: Node) => {
      node.unique();

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
      .filter(({ path }: { path: string }) => path.slice(1) === special).length > 0);
  }

  static init(config: Config, objects: string[]) {
    return new FileRouter(config).init(objects);
  }

  static load(config: Config) {
    return new FileRouter(config).load();
  }
}
