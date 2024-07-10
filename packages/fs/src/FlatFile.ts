import { basename, dirname, extname, join, sep } from "node:path";
import { fileURLToPath as to_path, pathToFileURL as to_url } from "node:url";
import { defined, is, maybe } from "@rcompat/invariant";
import { platform } from "@rcompat/core";
import { s_streamable } from "./symbols.js";
import type * as Z from "./types.js";

import * as bun from "./bun/exports.js";
import * as deno from "./deno/exports.js";
import * as node from "./node/exports.js";

const native: any = {
  node,
  deno,
  bun,
}[platform()];

const ensure_parents = async (file: FlatFile) => {
  const { directory } = file;
  // make sure the directory exists
  !await directory.exists() && await directory.create();
};

const { decodeURIComponent: decode } = globalThis;

export const parse = (p: string) => p.startsWith("file://") ? to_path(p) : p;

const assert_boundary = (directory: FlatFile) => {
  is(directory).instance(FlatFile);

  if (`${directory}` === "/") {
    throw new Error("Stopping at filesystem boundary");
  }
};

export type Path = FlatFile | string;

export default class FlatFile {
  path: string;
  #streamable = s_streamable;

  constructor(path: Path) {
    defined(path);
    this.path = parse((path as FlatFile).path ?? path);
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

  join(...paths: Path[]): FlatFile {
    const [first, ...rest] = paths;

    const path = join(this.path, (first as FlatFile).path ?? first);
    return paths.length === 1 ? file(path) : file(path).join(...rest);
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
    return file(dirname(this.path));
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

  up(levels: number): FlatFile {
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

  async copy(to: FlatFile, filter?: Z.DirectoryFilter): Promise<unknown> {
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

  async discover(filename: string): Promise<FlatFile> {
    const file = new FlatFile(this.path).join(filename);
    if (await file.exists()) {
      return this;
    }
    const { directory } = this;
    assert_boundary(directory);
    return directory.discover(filename);
  }

  debase(base: Path, suffix = "") {
    const { href: pathed } = to_url(this.path);
    const { href: based } = to_url((base as FlatFile).path ?? base);
    const path = decode(pathed).replace(`${decode(based)}${suffix}`, _ => "");
    return file(path);
  }

  stream() {
    return native.stream(this.path);
  }
}

export const file = (path: Path) => new FlatFile(path);

export const separator = sep;
