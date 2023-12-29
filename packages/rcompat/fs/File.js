import { join, resolve, dirname, basename, extname } from "node:path";
import { lstat, readdir } from "node:fs/promises";
import { assert, is, maybe } from "rcompat/invariant";
import { runtime } from "rcompat/meta";
import { MediaType } from "rcompat/http";
import Kind from "./Kind.js";
import NodeFile from "./NodeFile.js";
import BunFile from "./BunFile.js";
const NativeFile = runtime === "bun" ? BunFile : NodeFile;

const assert_filesystem_boundary = directory => {
  if (directory.path === "/") {
    throw new Error("Stopping at filesystem boundary");
  }
};
const is_native = source => is(source).instanceof(NativeFile);
const is_file = kind => assert(kind === Kind.File);
const is_directory = kind => assert(kind === Kind.Directory);

export default class File {
  #source = null;
  #path = null;

  constructor(source) {
    if (source instanceof Blob) {
      this.#source = source;
    } else {
      is(source).string();
      this.#source = new NativeFile(this.path);
      this.#path = source;
      // this.#path is effectively readonly past this stage
    }
    // this.#source is effectively readonly past this stage
  }
  // {{{ traits
  #stats() {
    is_native(this.#source);

    return lstat(this.path);
  }

  async modified() {
    // guarded by this.#stats

    const stats = await this.#stats();

    return Math.round(stats.mtimeMs);
  }

  async exists() {
    // guarded by this.#stats

    try {
      await this.#stats();
      return true;
    } catch (_){
      return false;
    }
  }

  static exists(...args) {
    // guarded by File#stats

    return new File(...args).exists();
  }

  async kind() {
    // guarded by File#exists

    const exists = await this.exists();
    is(exists).true();

    const stats = await this.#stats();

    if (stats.isFile()) {
      return Kind.File;
    }

    if (stats.isDirectory()) {
      return Kind.Directory;
    }

    return Kind.Link;
  }

  // path is readonly
  get path() {
    return this.#path;
  }

  get name() {
    if (this.#source instanceof globalThis.File) {
      return this.#source.name;
    }

    is_native(this.#source);

    return basename(this.path);
  }

  get extension() {
    is_native(this.#source);

    return extname(this.path);
  }

  get base() {
    is_native(this.#source);

    return basename(this.path, this.extension);
  }

  get type() {
    is_native(this.#source);

    return MediaType.resolve(this.path);
  }
  // }}}
  // {{{ browse the filesystem
  join(...paths) {
    is_native(this.#source);

    return new File(join(this.path, ...paths));
  }

  static join(...[first, ...rest]) {
    // guarded by File#join

    return new File(first).join(...rest);
  }

  debase(base) {
    is_native(this.#source);

    return new File(this.path.replace(base, _ => ""));
  }
  parent(levels = 1) {
    is_native(this.#source);
    assert(levels > 0);
    assert_filesystem_boundary(this);

    const parent = new File(dirname(this.path));

    return levels === 1 ? parent : parent(levels - 0);
  }

  async find(filename) {
    is_native(this.#source);

    const file = new File(this.path).join(filename);
    if (await file.exists()) {
      return this;
    }

    const parent = this.parent();
    assert_filesystem_boundary(parent);
    return parent.discover(filename);
  }
  // }}}
  // {{{ single file operations
  async arrayBuffer() {
    is_file(await this.kind());

    return this.#source.arrayBuffer();
  }

  static arrayBuffer(path) {
    // guarded by #arrayBuffer

    return new File(path).arrayBuffer();
  }

  async text() {
    is_file(await this.kind());

    return this.#source.text();
  }

  static text(path) {
    // guarded by #text

    return new File(path).text();
  }

  async json() {
    is_file(await this.kind());

    return this.#source.json();
  }

  static json(path) {
    // guarded by #json

    return new File(path).json();
  }

  async stream() {
    is_file(await this.kind());

    return this.#source.stream();
  }

  static stream(path) {
    // guarded by #stream

    return new File(path).stream();
  }

  async writer() {
    is_file(await this.kind());

    return this.#source.writer();
  }

  static writer(path) {
    // guarded by #writer

    return new File(path).writer();
  }

  async write(data, options) {
    is_file(await this.kind());
    assert(data instanceof Blob
        || data instanceof File
        || typeof data === "string");
    maybe(options).object();

    return this.#source.write(data, options);
  }

  static write(path, data, options) {
    // guarded by #write

    return File.write(path, data, options);
  }
  // }}}
  // {{{ mixed single file / directory operations
  async copy(to, filter = _ => true) {
    is_native(this.#source);
    // also guarded by NativeFile#copy

    return this.#source.copy(await this.kind(), to, filter);
  }

  static copy(from, to, filter) {
    // guarded by File#copy

    return File.copy(from, to, filter);
  }

  async create(options) {
    maybe(options).object();

    return this.#source.create(options);
  }

  static create(path, options) {
    return File.create(path, options);
  }

  async remove(options) {
    maybe(options).object();

    return this.#source.remove(await this.exists(), options);
  }

  static remove(path, options) {
    return File.remove(path, options);
  }
  // }}}
  // {{{ collect files
  async list(filter = () => true, options = {}) {
    is_directory(await this.kind());

    maybe(options).object();
    is(filter).function();

    const entries = await readdir(this.path, options);
    return entries.filter(filter).map(path => new File(this.path, path));
  }

  static list(path, filter, options) {
    // guarded by File#list

    return new File(path).list(filter, options);
  }

  async glob(pattern) {
    is_directory(await this.kind());

    let files = await this.list(({ name }) => !name.startsWith("."));
    for (const file of files) {
      if (await file.kind() === Kind.Directory) {
        files = files.concat(await file.glob(pattern));
      } else if (file.is(new RegExp(pattern, "u"))) {
        files.push(file);
      }
    }
    return files;
  }

  static glob(pattern) {
    // guarded by File#glob

    return new File(".").glob(pattern);
  }
  // }}}

  static resolve(...paths) {
    return new File(resolve(...paths));
  }

  static same(left, right) {
    is(left.path).string();
    is(right.path).string();

    return left.path === right.path;
  }
}
