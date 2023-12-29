import { is, maybe } from "rcompat/invariant";
import create from "./create.js";
import copy from "./copy.js";
import remove from "./remove.js";

const though_not_forced = (predicate, error) => {
  if (predicate) {
    throw new Error(error);
  }
};

export default class CommonFile {
  #path;

  constructor(path) {
    this.#path = path;
  }

  // readonly
  get path() {
    return this.#path;
  }

  // {{{ mixed single file / directory operations
  async create(exists, options) {
    maybe(options).object();

    // if exists and not forced, throw
    though_not_forced(exists && !options.force,
      "create: file already exists, use `force` to suppress error");

    if (exists) {
      return;
    }

    await create(this.path, options);
  }

  async copy(kind, to, filter = () => true) {
    is(to).anyOf(["string", File]);
    is(filter).function();

    return copy[kind](this.path, to, filter);
  }

  async remove(exists, options = {}) {
    maybe(options).object();

    // if exists not forced, throw
    if (exists && !options.force) {
      throw new Error("remove: trying to remove an existing file without `force`");
    }

    await remove(this.path, options);
  }
  // }}}
}
