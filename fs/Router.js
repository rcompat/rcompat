import o from "rcompat/object";
import { is } from "rcompat/invariant";
import { File } from "rcompat/fs";
import mktree from "./router/tree.js";

const ending = ".js";

export default class FileSystemRouter {
  #config;

  constructor(config) {
    this.#config = o.defaults(config, {
      directory: undefined,
      extensions: [".js"],
      patterns: {
//        special: /^+/u,
        params: /\[(.*)\]/u,
      },
      meta: {
        guard: "recursive",
        error: "recursive",
        layout: "recursive",
      },
    });
    is(this.#config.directory).defined();
  }

  async load() {
    const { directory } = this.#config;
    const objects = directory === undefined ? [] : await Promise.all(
      (await File.collect(directory, /^.*.js$/u, { recursive: true }))
        .map(async file => [
          `${file}`.replace(directory, _ => "").slice(1, -ending.length),
          await file.import(),
        ]));
    const tree = mktree();
    for (const [path, file] of objects) {
      tree.register(path, file);
    }
    //    tree.root.print();
  }
}
