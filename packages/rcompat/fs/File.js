import { join, resolve, dirname, basename, extname } from "node:path";
import url from "node:url";
import { is, defined, maybe } from "rcompat/invariant";
import { runtime } from "rcompat/meta";

import * as bun from "./bun/exports.js";
import * as node from "./node/exports.js";

const native = runtime === "bun" ? bun : node;

const parse = p => p.startsWith("file://") ? url.fileURLToPath(p) : p;

const assert_boundary = directory => {
  is(directory).instance(File);
  if (`${directory}` === "/") {
    throw new Error("Stopping at filesystem boundary");
  }
};

export default class File extends Blob {
  constructor(path) {
    super();
    defined(path);
    this.path = parse(path?.path ?? path);
  }

  toString() {
    return this.path;
  }

  async import(name) {
    maybe(name).string();
    const imported = await import(url.pathToFileURL(this.path));
    return name === undefined ? imported : imported[name];
  }

  static import(path, name) {
    return new File(path).import(name);
  }

  join(...paths) {
    const [first, ...rest] = paths;

    const path = join(this.path, first?.path ?? first);
    return paths.length === 1 ? new File(path) : new File(path).join(...rest);
  }

  static join(...[first, ...rest]) {
    return rest.length === 0 ? new File(first) : new File(first).join(...rest);
  }

  kind() {
    return native.kind(this.path);
  }

  list(filter, options) {
    return native.list(this.path, filter, options);
  }

  static list(path, filter, options) {
    return new File(path).list(filter, options);
  }

  glob(pattern) {
    return native.glob(this.path, pattern);
  }

  static glob(pattern) {
    return new File(".").glob(pattern);
  }

  collect(pattern, options) {
    return native.collect(this.path, pattern, options);
  }

  static collect(path, pattern, options) {
    return new File(path).collect(pattern, options);
  }

  #stats() {
    return native.stats(this.path);
  }

  modified() {
    return native.modified(this.path);
  }

  exists() {
    return native.exists(this.path);
  }

  static exists(...args) {
    return File.join(...args).exists();
  }

  get isFile() {
    return this.exists().then(exists =>
      exists ? this.#stats().then(stats => stats.isFile()) : false);
  }

  get directory() {
    return new File(dirname(this.path));
  }

  static directory(path) {
    return new File(path).directory;
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

  get fullExtension() {
    const name = this.path.split("/").at(-1);
    return name.slice(name.indexOf("."));
  }

  up(levels) {
    if (levels === 0) {
      return this;
    }
    const { directory } = this;
    assert_boundary(directory, "Stopping at filesystem boundary");
    return directory.up(levels - 1);
  }

  arrayBuffer() {
    return native.arrayBuffer(this.path);
  }

  static arrayBuffer(path) {
    return new File(path).arrayBuffer();
  }

  text(options) {
    maybe(options).object();

    return native.text(this.path, options);
  }

  static text(path, options) {
    return new File(path).text(options);
  }

  json() {
    return native.json(this.path);
  }

  static json(path) {
    return new File(path).json();
  }

  copy(to, filter) {
    return native.copy(this.path, to, filter);
  }

  static copy(from, to, filter) {
    return new File(from).copy(to, filter);
  }

  async create(options) {
    maybe(options).object();

    return native.create(this.path, options);
  }

  static create(path, options) {
    return new File(path).create(options);
  }

  async remove(options) {
    maybe(options).object();

    return native.remove(this.path, options);
  }

  static remove(path, options) {
    return new File(path).remove(options);
  }

  write(data, options) {
    maybe(options).object();

    return native.write(this.path, data, options);
  }

  static write(path, data, options) {
    return new File(path).write(data, options);
  }

  async discover(filename) {
    const file = File.join(this.path, filename);
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
    return new File(this.path.replace(base, _ => ""));
  }

  stream() {
    return native.stream(this.path);
  }

  static stream(path) {
    return new File(path).stream();
  }

  // return the first directory where package.json is found, starting at cwd
  static root() {
    return File.resolve().root();
  }

  static resolve(...paths) {
    return new File(resolve(...paths));
  }

  static same(left, right) {
    is(left.path).string();
    is(right.path).string();

    return left.path === right.path;
  }
}
