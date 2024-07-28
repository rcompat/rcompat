import parse from "@rcompat/fs/#/parse";
import type * as Z from "@rcompat/fs/#/types";
import * as native from "@rcompat/fs/native";
import separator from "@rcompat/fs/separator";
import streamable from "@rcompat/fs/streamable";
import defined from "@rcompat/invariant/defined";
import is from "@rcompat/invariant/is";
import maybe from "@rcompat/invariant/maybe";
import { basename, dirname, extname, join } from "node:path";
import { pathToFileURL as to_url } from "node:url";

const ensure_parents = async (file: FileRef) => {
  const { directory } = file;
  // make sure the directory exists
  !await directory.exists() && await directory.create();
};

const { decodeURIComponent: decode } = globalThis;

const assert_boundary = (directory: FileRef) => {
  is(directory).instance(FileRef);

  if (`${directory}` === "/") {
    throw new Error("Stopping at filesystem boundary");
  }
};

export type Path = FileRef | string;

const as_string = (path: Path) => typeof path === "string" ? path : path.path;

export default class FileRef {
  path: string;
  #streamable = streamable;

  constructor(path: Path) {
    defined(path);
    this.path = parse(as_string(path));
  }

  static new(path: Path) {
    return new FileRef(path);
  }

  toString() {
    return this.path;
  }

  webpath() {
    return this.path.replaceAll(separator, "/");
  }

  get streamable() {
    return this.#streamable;
  }

  async import(name?: string) {
    maybe(name).string();
    const imported = await import(`${to_url(this.path)}`);
    return name === undefined ? imported : imported[name];
  }

  join(...paths: Path[]): FileRef {
    const [first, ...rest] = paths;

    const path = join(this.path, as_string(first));
    const file = new FileRef(path);
    return paths.length === 1 ? file : file.join(...rest);
  }

  kind() {
    return native.kind(this.path);
  }

  list(filter: Z.DirectoryFilter, options: {}) {
    return native.list(this.path, filter, options);
  }

  glob(pattern: string) {
    return native.glob(this.path, pattern);
  }

  collect(pattern?: Z.CollectPattern, options?: Z.DirectoryOptions) {
    return native.collect(this.path, pattern, options);
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

  get isFile() {
    return this.exists().then((exists: any) =>
      exists ? this.#stats().then((stats: any) => stats.isFile()) : false);
  }

  get directory() {
    return new FileRef(dirname(this.path));
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
    const name = this.path.split("/").at(-1)!;
    return name.slice(name.indexOf("."));
  }

  up(levels: number): FileRef {
    if (levels === 0) {
      return this;
    }
    const { directory } = this;
    assert_boundary(directory);
    return directory.up(levels - 1);
  }

  arrayBuffer() {
    return native.arrayBuffer(this.path);
  }

  text() {
    return native.text(this.path);
  }

  json() {
    return native.json(this.path);
  }

  async copy(to: FileRef, filter?: Z.DirectoryFilter): Promise<unknown> {
    ensure_parents(to);

    return native.copy(this.path, to, filter);
  }

  async create(options?: Z.DirectoryOptions) {
    maybe(options).object();

    return native.create(this.path, options);
  }

  async remove(options?: {}) {
    maybe(options).object();

    return native.remove(this.path, options);
  }

  async write(input: Z.WritableInput) {
    ensure_parents(this);

    return native.write(this.path, input);
  }

  async discover(filename: string): Promise<FileRef> {
    const file = new FileRef(this.path).join(filename);
    if (await file.exists()) {
      return this;
    }
    const { directory } = this;
    assert_boundary(directory);
    return directory.discover(filename);
  }

  debase(base: Path, suffix = "") {
    const { href: pathed } = to_url(this.path);
    const { href: based } = to_url(as_string(base));
    const path = decode(pathed).replace(`${decode(based)}${suffix}`, _ => "");
    return new FileRef(path);
  }

  stream() {
    return native.stream(this.path);
  }
}
