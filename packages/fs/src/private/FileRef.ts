import type DirectoryOptions from "#DirectoryOptions";
import Kind from "#Kind";
import native from "#native";
import parse from "#parse";
import type Path from "#Path";
import type RemoveOptions from "#RemoveOptions";
import separator from "#separator";
import Streamable from "#Streamable";
import type WritableInput from "#WritableInput";
import assert from "@rcompat/assert";
import hash from "@rcompat/crypto/hash";
import type {
  JSONValue, MaybePromise, Printable, StringClass, StringReplacer,
} from "@rcompat/type";
import {
  copyFile, lstat, mkdir, readdir, realpath, rm,
} from "node:fs/promises";
import { basename, dirname, extname, join, resolve } from "node:path";
import { pathToFileURL as to_url } from "node:url";

type Filter = (file: FileRef) => MaybePromise<boolean>;

const ensure_parents = async (file: FileRef) => {
  const { directory } = file;
  // make sure the directory exists
  if (!await directory.exists()) await directory.create();
};

const { decodeURIComponent: decode } = globalThis;

const assert_boundary = (directory: FileRef) => {
  assert.instance(directory, FileRef);

  if (`${directory}` === "/") throw new Error("stopping at filesystem root");
};

const as_string = (path: Path) => typeof path === "string" ? path : path.path;

export default class FileRef
  extends Streamable
  implements StringClass, Printable {
  #path: string;

  constructor(path: Path) {
    super();
    assert.defined(path);
    this.#path = parse(as_string(path));
  }

  get Name() {
    return "FileRef" as const;
  }

  #stats() {
    return lstat(this.#path);
  }

  [Symbol.replace](string: string, replacement: string | StringReplacer) {
    return string.replace(this.toString(), replacement/* TS bug*/ as never);
  }

  toString() {
    return this.path;
  }

  webpath() {
    return this.path.replaceAll(separator, "/");
  }

  static webpath(path: Path) {
    return new FileRef(path).webpath();
  }

  async import(name?: string) {
    assert.maybe.string(name);
    const imported = await import(`${to_url(this.path)}`);
    return name === undefined ? imported : imported[name];
  }

  join(...paths: Path[]): FileRef {
    const [first, ...rest] = paths;

    const path = join(this.path, as_string(first));
    const file = new FileRef(path);
    return paths.length === 1 ? file : file.join(...rest);
  }

  static join(path: Path, ...paths: Path[]) {
    return new FileRef(path).join(...paths);
  }

  async kind() {
    try {
      const stats = await this.#stats();

      if (stats.isFile()) {
        return Kind.File;
      }

      if (stats.isDirectory()) {
        return Kind.Directory;
      }

      return Kind.Link;
    } catch {
      return Kind.None;
    }
  }

  async list(options?: {
    recursive?: boolean;
    filter?: RegExp | Filter;
  }): Promise<FileRef[]> {
    if (!await this.exists()) return [];

    const { recursive = true, filter } = options ?? {};
    const match = filter === undefined
      ? undefined
      : filter instanceof RegExp
        ? (file: FileRef) => filter.test(file.path)
        : filter;

    const names = await readdir(this.#path);
    let results: FileRef[] = [];

    for (const name of names) {
      const file = this.join(name);
      const kind = await file.kind();

      if (kind === Kind.None) continue;

      if (recursive && kind === Kind.Directory) {
        results = results.concat(await file.list(options));
      }

      if (!match || await match(file)) {
        results.push(file);
      }
    }

    return results;
  }

  static list(path: Path, ...params: Parameters<FileRef["list"]>) {
    return new FileRef(path).list(...params);
  }

  async modified() {
    return Math.round((await this.#stats()).mtimeMs);
  }

  async exists() {
    try {
      await this.#stats();
      return true;
    } catch {
      return false;
    }
  }

  static exists(path: Path) {
    return new FileRef(path).exists();
  }

  isFile(): Promise<boolean> {
    return this.exists().then((exists: any) =>
      exists ? this.#stats().then((stats: any) => stats.isFile()) : false);
  }

  static isFile(file: FileRef) {
    return file.isFile();
  }

  isDirectory(): Promise<boolean> {
    return this.exists().then((exists: any) =>
      exists ? this.#stats().then((stats: any) => stats.isDirectory()) : false);
  }

  static isDirectory(file: FileRef) {
    return file.isDirectory();
  }

  bare(append?: string) {
    const bare = this.directory.join(this.base);

    return append === undefined ? bare : bare.append(append);
  }

  append(suffix: string) {
    return new FileRef(`${this.path}${suffix}`);
  }

  get path() {
    return this.#path;
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

  get core() {
    return basename(this.path, this.fullExtension);
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

  static arrayBuffer(path: Path) {
    return new FileRef(path).arrayBuffer();
  }

  async bytes(): Promise<Uint8Array> {
    return new Uint8Array(await this.arrayBuffer());
  }

  static bytes(path: Path) {
    return new FileRef(path).bytes();
  }

  text() {
    return native.text(this.path);
  }

  static text(path: Path) {
    return new FileRef(path).text();
  }

  json<T extends JSONValue>() {
    return native.json(this.path) as Promise<T>;
  }

  static json<T extends JSONValue>(path: Path) {
    return new FileRef(path).json<T>();
  }

  size() {
    return native.size(this.path);
  }

  static size(path: Path) {
    return new FileRef(path).size();
  }

  async copy(to: FileRef, filter?: Filter): Promise<void> {
    await ensure_parents(to);
    assert.maybe.function(filter);

    const path = this.#path;
    const kind = await this.kind();

    if (kind === Kind.Link) {
      await new FileRef(await realpath(path)).copy(to, filter);
      return;
    }

    if (kind === Kind.Directory) {
      // recreate directory if necessary
      await to.remove();
      await to.create();
      // copy all files
      await Promise.all((await this.list({ filter }))
        .map(({ name }) => FileRef.join(path, name).copy(to.join(name))));
      return;
    }

    await copyFile(path, to.path);
  }

  async create(options?: DirectoryOptions) {
    assert.maybe.dict(options);
    assert.maybe.boolean(options?.recursive);

    await mkdir(this.#path, { recursive: options?.recursive ?? true });
  }

  async remove(options?: RemoveOptions) {
    assert.maybe.dict(options);
    assert.maybe.boolean(options?.fail);
    assert.maybe.boolean(options?.recursive);

    // if not set to fail and exists, do nothing
    if (!options?.fail && !await this.exists()) return;

    await rm(this.#path, { recursive: options?.recursive ?? true });
  }

  async write(input: WritableInput) {
    ensure_parents(this);

    const to_write = typeof input === "string" && !input.endsWith("\n")
      ? input + "\n"
      : input;

    await native.write(this.path, to_write);
  }

  static write(path: Path, input: WritableInput) {
    return new FileRef(path).write(input);
  }

  writeJSON(input: JSONValue) {
    return this.write(JSON.stringify(input, null, 2));
  }

  static writeJSON(path: Path, input: JSONValue) {
    return new FileRef(path).writeJSON(input);
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

  static discover(path: Path, filename: string) {
    return new FileRef(path).discover(filename);
  }

  debase(base: Path, suffix = "") {
    const { href: pathed } = to_url(this.path);
    const { href: based } = to_url(as_string(base));
    const path = decode(pathed).replace(`${decode(based)}${suffix}`, _ => "");
    return new FileRef(path);
  }

  stream(): ReadableStream<Uint8Array> {
    return native.stream(this.path);
  }

  static stream(path: Path) {
    return new FileRef(path).stream();
  }

  static resolve(path?: string) {
    assert.maybe.string(path);

    return new FileRef(path === undefined ? resolve() : resolve(parse(path)));
  }

  async hash(algorithm = "SHA-256"): Promise<string> {
    return await hash(await this.arrayBuffer(), algorithm as any);
  }
}
