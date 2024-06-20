import { basename, dirname, extname, join, resolve, sep } from "node:path";
import { fileURLToPath as to_path, pathToFileURL as to_url } from "node:url";
import { defined, is, maybe } from "rcompat/invariant";
// direct import because package/exports.js requires FlatFile
import platform from "../package/platform.js";
import { s_streamable } from "./symbols.js";
import type * as Z from "./types.js";

import * as bun from "./bun/exports.js";
import * as deno from "./deno/exports.js";
import * as node from "./node/exports.js";

const native = {
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

const parse = (p: string) => p.startsWith("file://") ? to_path(p) : p;

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
    this.path = parse((path as FlatFile)?.path ?? path);
  }

  toString() {
    return this.path;
  }

  static get separator() {
    return sep;
  }

  webpath() {
    return this.path.replaceAll(FlatFile.separator, "/");
  }

  static webpath(path: Path) {
    return new FlatFile(path).webpath();
  }

  get streamable() {
    return this.#streamable;
  }

  async import(name?: string) {
    maybe(name).string();
    const imported = await import(`${to_url(this.path)}`);
    return name === undefined ? imported : imported[name];
  }

  static import(path: Path, name: string) {
    return new FlatFile(path).import(name);
  }

  join(...paths: Path[]): FlatFile {
    const [first, ...rest] = paths;

    const path = join(this.path, (first as FlatFile)?.path ?? first);
    return paths.length === 1
      ? new FlatFile(path) 
      : new FlatFile(path).join(...rest);
  }

  static join(...[first, ...rest]: [Path, ...Path[]]) {
    return rest.length === 0
      ? new FlatFile(first) 
      : new FlatFile(first).join(...rest);
  }

  kind() {
    return native.kind(this.path);
  }

  list(filter: Z.DirectoryFilter, options: {}) {
    return native.list(this.path, filter, options);
  }

  static list(path: Path, filter: Z.DirectoryFilter, options: {}) {
    return new FlatFile(path).list(filter, options);
  }

  glob(pattern: string) {
    return native.glob(this.path, pattern);
  }

  static glob(pattern: string) {
    return new FlatFile(".").glob(pattern);
  }

  collect(pattern?: Z.CollectPattern, options?: Z.DirectoryOptions) {
    return native.collect(this.path, pattern, options);
  }

  static collect(path: Path, ...args: [Z.CollectPattern, Z.DirectoryOptions]) {
    return new FlatFile(path).collect(...args);
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

  static exists(path: FlatFile) {
    return new FlatFile(path).exists();
  }

  get isFile() {
    return this.exists().then(exists =>
      exists ? this.#stats().then(stats => stats.isFile()) : false);
  }

  get directory() {
    return new FlatFile(dirname(this.path));
  }

  static directory(path: Path) {
    return new FlatFile(path).directory;
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

  static arrayBuffer(path: Path) {
    return new FlatFile(path).arrayBuffer();
  }

  text() {
    return native.text(this.path);
  }

  static text(path: Path) {
    return new FlatFile(path).text();
  }

  json() {
    return native.json(this.path);
  }

  static json(path: Path) {
    return new FlatFile(path).json();
  }

  async copy(to: FlatFile, filter?: Z.DirectoryFilter): Promise<unknown> {
    ensure_parents(to);

    return native.copy(this.path, to, filter);
  }

  static copy(from: Path, ...args: [FlatFile, Z.DirectoryFilter]) {
    return new FlatFile(from).copy(...args);
  }

  async create(options?: Z.DirectoryOptions) {
    maybe(options).object();

    return native.create(this.path, options);
  }

  static create(path: Path, options?: Z.DirectoryOptions) {
    return new FlatFile(path).create(options);
  }

  async remove(options?: {}) {
    maybe(options).object();

    return native.remove(this.path, options);
  }

  static remove(path: Path, options?: Z.RemoveOptions) {
    return new FlatFile(path).remove(options);
  }

  async write(input: Z.WritableInput) {
    ensure_parents(this);

    return native.write(this.path, input);
  }

  static write(path: Path, input: Z.WritableInput) {
    return new FlatFile(path).write(input);
  }

  async discover(filename: string): Promise<FlatFile> {
    const file = FlatFile.join(this.path, filename);
    if (await file.exists()) {
      return this;
    }
    const { directory } = this;
    assert_boundary(directory);
    return directory.discover(filename);
  }

  static discover(path: Path, filename: string) {
    return new FlatFile(path).discover(filename);
  }

  debase(base: Path, suffix = "") {
    const { href: pathed } = to_url(this.path);
    const { href: based } = to_url((base as FlatFile)?.path ?? base);
    const path = decode(pathed).replace(`${decode(based)}${suffix}`, _ => "");
    return new FlatFile(path);
  }

  stream() {
    return native.stream(this.path);
  }

  static stream(path: FlatFile) {
    return new FlatFile(path).stream();
  }

  static resolve(path?: string) {
    maybe(path).string();

    return new FlatFile(path === undefined ? resolve() : resolve(parse(path)));
  }

  static same(left: FlatFile, right: FlatFile) {
    is(left.path).string();
    is(right.path).string();

    return left.path === right.path;
  }
}
