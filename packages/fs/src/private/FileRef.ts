import type DirectoryOptions from "#DirectoryOptions";
import Kind from "#Kind";
import native from "#native";
import parse from "#parse";
import type Path from "#Path";
import type RemoveOptions from "#RemoveOptions";
import s_streamable from "#s_streamable";
import separator from "#separator";
import type WritableInput from "#WritableInput";
import defined from "@rcompat/assert/defined";
import is from "@rcompat/assert/is";
import maybe from "@rcompat/assert/maybe";
import type Dict from "@rcompat/type/Dict";
import type MaybePromise from "@rcompat/type/MaybePromise";
import type Printable from "@rcompat/type/Printable";
import type StringClass from "@rcompat/type/StringClass";
import type StringReplacer from "@rcompat/type/StringReplacer";
import {
    copyFile, lstat, mkdir, readdir, realpath, rm,
} from "node:fs/promises";
import { basename, dirname, extname, join, resolve } from "node:path";
import { pathToFileURL as to_url } from "node:url";

type FilePredicate = (file: FileRef) => MaybePromise<boolean>;

const ensure_parents = async (file: FileRef) => {
  const { directory } = file;
  // make sure the directory exists
  if (!await directory.exists()) {
    await directory.create();
  }
};

const { decodeURIComponent: decode } = globalThis;

const assert_boundary = (directory: FileRef) => {
  is(directory).instance(FileRef);

  if (`${directory}` === "/") {
    throw new Error("Stopping at filesystem boundary");
  }
};

const as_string = (path: Path) => typeof path === "string" ? path : path.path;

export default class FileRef implements StringClass, Printable {
  #path: string;
  #streamable = s_streamable;

  constructor(path: Path) {
    defined(path);
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

  static join(path: Path, ...paths: Path[]) {
    return new FileRef(path).join(...paths);
  }

  async kind() {
    is(await this.exists()).true(`file does not exist: ${this.path}`);

    const stats = await this.#stats();

    if (stats.isFile()) {
      return Kind.File;
    }

    if (stats.isDirectory()) {
      return Kind.Directory;
    }

    return Kind.Link;
  }

  async list(predicate?: FilePredicate, options?: Dict) {
    maybe(predicate).instance(Function);
    maybe(options).object();

    const path = this.#path;

    const paths = await readdir(path, options);

    return Promise.all(paths
      .map(subpath => FileRef.join(path, subpath))
      .filter(predicate ?? (() => true)))
    ;
  }

  static list(path: Path, ...params: Parameters<FileRef["list"]>) {
    return new FileRef(path).list(...params);
  }

  async glob(pattern: string) {
    let paths = await this.list(file => file.path.startsWith("."));
    for (const file of paths) {
      if (await file.kind() === Kind.Directory) {
        paths = paths.concat(await file.glob(pattern));
      } else if (new RegExp(pattern, "u").test(file.path)) {
        paths.push(file);
      }
    }
    return paths;
  }

  async collect(predicate?: FilePredicate) {
    maybe(predicate).instance(Function);

    let files: FileRef[] = [];
    try {
      files = await this.list();
    } catch {
      files = [];
    }

    let subfiles: FileRef[] = [];
    for (const file of files) {
      if (file.name.startsWith(".")) {
        continue;
      }
      if (await file.kind() === Kind.Directory) {
        subfiles = subfiles.concat(await file.collect(predicate));
      } else if (predicate === undefined || predicate(file)) {
        subfiles.push(file);
      }
    }
    return subfiles;
  }

  static collect(path: Path, ...params: Parameters<FileRef["collect"]>) {
    return new FileRef(path).collect(...params);
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

  isDirectory(): Promise<boolean> {
    return this.exists().then((exists: any) =>
      exists ? this.#stats().then((stats: any) => stats.isDirectory()) : false);
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

  get extension() {
    return extname(this.path);
  }

  get fullExtension() {
    const name = this.path.split("/").at(-1)!;
    return name.slice(name.indexOf("."));
  }

  get streamable() {
    return this.#streamable;
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

  text() {
    return native.text(this.path);
  }

  static text(path: Path) {
    return new FileRef(path).text();
  }

  json() {
    return native.json(this.path);
  }

  static json(path: Path) {
    return new FileRef(path).json();
  }

  async copy(to: FileRef, predicate?: FilePredicate): Promise<unknown> {
    ensure_parents(to);
    maybe(predicate).instance(Function);

    const path = this.#path;
    const kind = await this.kind();

    if (kind === Kind.Link) {
      return new FileRef(await realpath(path)).copy(to, predicate);
    }

    if (kind === Kind.Directory) {
      // recreate directory if necessary
      await to.remove();
      await to.create();
      // copy all files
      return Promise.all((await this.list(predicate))
        .map(({ name }) => FileRef.join(path, name).copy(to.join(name))));
    }

    return copyFile(path, to.path);
  }

  async create(options?: DirectoryOptions) {
    maybe(options).object();

    await mkdir(this.#path, {
      ...options,
      recursive: options?.recursive ?? true,
    });
  }

  async remove(options?: RemoveOptions) {
    maybe(options).object();

    // if not set to fail and exists, do nothing
    if (!options?.fail && !await this.exists()) {
      return;
    }

    await rm(this.#path, {
      ...options,
      recursive: options?.recursive ?? true,
    });
  }

  async write(input: WritableInput) {
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

  static discover(path: Path, filename: string) {
    return new FileRef(path).discover(filename);
  }

  debase(base: Path, suffix = "") {
    const { href: pathed } = to_url(this.path);
    const { href: based } = to_url(as_string(base));
    const path = decode(pathed).replace(`${decode(based)}${suffix}`, _ => "");
    return new FileRef(path);
  }

  stream(): ReadableStream {
    return native.stream(this.path);
  }

  static stream(path: Path) {
    return new FileRef(path).stream();
  }

  static resolve(path?: string) {
    maybe(path).string();

    return new FileRef(path === undefined ? resolve() : resolve(parse(path)));
  }
}
