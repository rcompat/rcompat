import { join, resolve, dirname, basename, extname } from "node:path";
import { lstat, readdir } from "node:fs/promises";
import { assert, is, defined, maybe } from "rcompat/invariant";
import { EagerEither } from "rcompat/function";
import File from "./File.js";

const file_prefix = 7;
const parse = p => p.startsWith("file://") ? p.slice(file_prefix) : p;

const assert_boundary = directory => {
  is(directory).instance(Path);
  if (`${directory}` === "/") {
    throw new Error("Stopping at filesystem boundary");
  }
};

export default class Path {
  constructor(...paths) {
    const [path] = paths;
    defined(path);
    return paths.length === 1 ? this.#new1(path) : this.#newN(...paths);
  }

  toString() {
    return this.path;
  }

  #new1(path) {
    is(path).anyOf(["string", Path, File]);
    this.path = parse(path?.path ?? path);
    return this;
  }

  #newN(...paths) {
    assert(paths.length > 1);
    const [path, ...more] = paths;
    this.#new1(path);
    return this.join(...more);
  }

  join(...paths) {
    const path = join(this.path, paths[0]?.path ?? paths[0]);
    return paths.length === 1
      ? new Path(path)
      : new Path(path, ...paths.slice(1));
  }

  list(filter = () => true, options = {}) {
    maybe(options).object();
    is(filter).function();

    return readdir(this.path, options).then(paths => paths
      .filter(filter)
      .map(path => new Path(this.path, path)));
  }

  static list(path, filter, options) {
    return new Path(path).list(filter, options);
  }

  async glob(pattern) {
    let paths = await this.list(({ name }) => !name.startsWith("."));
    for (const path of paths) {
      if (await path.isDirectory) {
        paths = paths.concat(await path.glob(pattern));
      } else if (path.is(new RegExp(pattern, "u"))) {
        paths.push(path);
      }
    }
    return paths;
  }

  static glob(pattern) {
    return new Path(".").glob(pattern);
  }

  async #collect(pattern, options) {
    return EagerEither
      .try(() => this.list(() => true))
      .match({ left: () => [] })
      .map(async list => {
        let paths = [];
        for (const path of list) {
          if (path.name.startsWith(".")) {
            continue;
          }
          if (options?.recursive && await path.isDirectory) {
            paths = paths.concat(await path.#collect(pattern, options));
          } else if (pattern === undefined ||
              path.is(new RegExp(pattern, "u"))) {
            paths.push(path);
          }
        }
        return paths;
      })
      .get();
  }

  collect(pattern, options) {
    maybe(pattern).anyOf(["string", RegExp]);
    maybe(options).object();

    return this.#collect(pattern, {
      ...options,
      recursive: options?.recursive ?? true,
    });
  }

  static collect(path, pattern, options) {
    return new Path(path).collect(pattern, options);
  }

  #stats() {
    return lstat(this.path);
  }

  async modified() {
    return Math.round((await this.#stats()).mtimeMs);
  }

  exists() {
    return this.#stats().then(() => true, () => false);
  }

  static exists(...args) {
    return new Path(...args).exists();
  }

  get isFile() {
    return this.exists.then(exists =>
      exists ? this.#stats.then(stats => stats.isFile()) : false);
  }

  get isDirectory() {
    return this.exists.then(exists =>
      exists ? this.#stats.then(stats => stats.isDirectory()) : false);
  }

  get isSymlink() {
    return this.exists.then(exists =>
      exists ? this.#stats.then(stats => stats.isSymbolicLink()) : false);
  }

  get directory() {
    return new Path(dirname(this.path));
  }

  static directory(path) {
    return new Path(path).directory;
  }

  get name() {
    return basename(this.path);
  }

  get base() {
    return basename(this.path, this.extension);
  }

  get extension() {
    return extname(this.path);
  }

  get file() {
    return new File(this.path);
  }

  is(pattern) {
    is(pattern).of(RegExp);

    return pattern.test(this.path);
  }

  up(levels) {
    if (levels === 0) {
      return this;
    }
    const { directory } = this;
    assert_boundary(directory, "Stopping at filesystem boundary");
    return directory.up(levels - 1);
  }

  text() {
    return this.file.text();
  }

  json() {
    return this.file.json();
  }

  async discover(filename) {
    const file = new Path(this.path, filename);
    if (await file.exists()) {
      return this;
    }
    const { directory } = this;
    assert_boundary(directory);
    return directory.discover(filename);
  }

  root() {
    return this.discover("package.json");
  }

  debase(base) {
    return new Path(this.path.replace(base, _ => ""));
  }

  // return the first directory where package.json is found, starting at cwd
  static root() {
    return Path.resolve().root();
  }

  static is(path, pattern) {
    return new Path(path).is(pattern);
  }

  static resolve(...paths) {
    return new Path(resolve(...paths));
  }

  static join(...[first, ...rest]) {
    return new Path(first).join(...rest);
  }

  static same(left, right) {
    is(left.path).string();
    is(right.path).string();

    return left.path === right.path;
  }
}
