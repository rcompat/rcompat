import { basename, dirname, extname, join, resolve, sep } from "node:path";
import { fileURLToPath as to_path, pathToFileURL as to_url } from "node:url";
import { defined, is, maybe } from "rcompat/invariant";
// direct import because package/exports.js requires File
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

const { decodeURIComponent: decode } = globalThis;

const parse = (p: string) => p.startsWith("file://") ? to_path(p) : p;

const assert_boundary = (directory: File) => {
  is(directory).instance(File);

  if (`${directory}` === "/") {
    throw new Error("Stopping at filesystem boundary");
  }
};

export type Path = File | string;

export default class File {
  path: string;
  #streamable = s_streamable;

  constructor(path: Path) {
    defined(path);
    this.path = parse((path as File)?.path ?? path);
  }

  toString() {
    return this.path;
  }

  static get separator() {
    return sep;
  }

  webpath() {
    return this.path.replaceAll(File.separator, "/");
  }

  static webpath(path: Path) {
    return new File(path).webpath();
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
    return new File(path).import(name);
  }

  join(...paths: Path[]): File {
    const [first, ...rest] = paths;

    const path = join(this.path, (first as File)?.path ?? first);
    return paths.length === 1 ? new File(path) : new File(path).join(...rest);
  }

  static join(...[first, ...rest]: [Path, ...Path[]]) {
    return rest.length === 0 ? new File(first) : new File(first).join(...rest);
  }

  kind() {
    return native.kind(this.path);
  }

  list(filter: Z.DirectoryFilter, options: {}) {
    return native.list(this.path, filter, options);
  }

  static list(path: Path, filter: Z.DirectoryFilter, options: {}) {
    return new File(path).list(filter, options);
  }

  glob(pattern: string) {
    return native.glob(this.path, pattern);
  }

  static glob(pattern: string) {
    return new File(".").glob(pattern);
  }

  collect(pattern?: Z.CollectPattern, options?: Z.DirectoryOptions) {
    return native.collect(this.path, pattern, options);
  }

  static collect(path: Path, ...args: [Z.CollectPattern, Z.DirectoryOptions]) {
    return new File(path).collect(...args);
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

  static exists(path: File) {
    return new File(path).exists();
  }

  get isFile() {
    return this.exists().then(exists =>
      exists ? this.#stats().then(stats => stats.isFile()) : false);
  }

  get directory() {
    return new File(dirname(this.path));
  }

  static directory(path: Path) {
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
    const name = this.path.split("/").at(-1)!;
    return name.slice(name.indexOf("."));
  }

  up(levels: number): File {
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
    return new File(path).arrayBuffer();
  }

  text() {
    return native.text(this.path);
  }

  static text(path: Path) {
    return new File(path).text();
  }

  json() {
    return native.json(this.path);
  }

  static json(path: Path) {
    return new File(path).json();
  }

  copy(to: File, filter?: Z.DirectoryFilter): Promise<unknown> {
    return native.copy(this.path, to, filter);
  }

  static copy(from: Path, ...args: [File, Z.DirectoryFilter]) {
    return new File(from).copy(...args);
  }

  async create(options?: Z.DirectoryOptions) {
    maybe(options).object();

    return native.create(this.path, options);
  }

  static create(path: Path, options?: Z.DirectoryOptions) {
    return new File(path).create(options);
  }

  async remove(options?: {}) {
    maybe(options).object();

    return native.remove(this.path, options);
  }

  static remove(path: Path, options?: Z.RemoveOptions) {
    return new File(path).remove(options);
  }

  write(input: Z.WritableInput) {
    return native.write(this.path, input);
  }

  static write(path: Path, input: Z.WritableInput) {
    return new File(path).write(input);
  }

  async discover(filename: string): Promise<File> {
    const file = File.join(this.path, filename);
    if (await file.exists()) {
      return this;
    }
    const { directory } = this;
    assert_boundary(directory);
    return directory.discover(filename);
  }

  static discover(path: Path, filename: string) {
    return new File(path).discover(filename);
  }

  debase(base: Path, suffix = "") {
    const { href: pathed } = to_url(this.path);
    const { href: based } = to_url((base as File)?.path ?? base);
    const path = decode(pathed).replace(`${decode(based)}${suffix}`, _ => "");
    return new File(path);
  }

  stream() {
    return native.stream(this.path);
  }

  static stream(path: File) {
    return new File(path).stream();
  }

  static resolve(path?: string) {
    maybe(path).string();

    return new File(path === undefined ? resolve() : resolve(parse(path)));
  }

  static same(left: File, right: File) {
    is(left.path).string();
    is(right.path).string();

    return left.path === right.path;
  }
}
