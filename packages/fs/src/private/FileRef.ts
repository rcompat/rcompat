import type DirectoryOptions from "#DirectoryOptions";
import E from "#errors";
import native from "#native";
import parse from "#parse";
import type Path from "#Path";
import type RemoveOptions from "#RemoveOptions";
import separator from "#separator";
import type WritableInput from "#WritableInput";
import assert from "@rcompat/assert";
import hash from "@rcompat/crypto/hash";
import is from "@rcompat/is";
import symbol from "@rcompat/symbol";
import type {
  JSONValue, MaybePromise, Printable, StringClass, StringReplacer,
} from "@rcompat/type";
import {
  copyFile, lstat, mkdir, readdir, realpath, rm,
} from "node:fs/promises";
import { basename, dirname, extname, join } from "node:path";
import { pathToFileURL as to_url } from "node:url";
import util from "node:util";

export type FileInfo = {
  path: string;
  name: string;
  extension: string;
  fullExtension: string;
  type: "file" | "directory" | "link";
};

export type ListOptions = {
  recursive?: boolean;
  filter?: RegExp | Filter;
};

export type Filter = (info: FileInfo) => MaybePromise<boolean>;

const { decodeURIComponent: decode } = globalThis;

const assert_boundary = (directory: FileRef) => {
  assert.instance(directory, FileRef);

  if (dirname(directory.path) === directory.path) throw E.reached_fs_root();
};

const as_string = (path: Path) => typeof path === "string" ? path : path.path;

const brand = Symbol.for("std:fs/FileRef/v0");

export default class FileRef
  implements StringClass, Printable {
  #path: string;
  [brand] = true;

  constructor(path: Path) {
    assert.defined(path);
    this.#path = parse(as_string(path));
  }

  [symbol.stream]() {
    return this.stream();
  }

  get Name() {
    return "FileRef" as const;
  }

  #stats() {
    return lstat(this.#path);
  }

  static is(x: unknown): x is FileRef {
    return is.branded(x, brand);
  }

  [Symbol.replace](string: string, replacement: string | StringReplacer) {
    return string.replace(this.toString(), replacement/* TS bug*/ as never);
  }

  toString() {
    return this.path;
  }

  [util.inspect.custom]() {
    return `FileRef { path: "${this.path}" }`;
  }

  webpath() {
    return this.path.replaceAll(separator, "/");
  }

  async import(name?: string) {
    assert.maybe.string(name);
    const imported = await import(`${to_url(this.path)}`);
    return name === undefined ? imported : imported[name];
  }

  join(...paths: Path[]): FileRef {
    if (paths.length === 0) return this;
    const [first, ...rest] = paths;

    const path = join(this.path, as_string(first));
    const file = new FileRef(path);
    return paths.length === 1 ? file : file.join(...rest);
  }

  async type() {
    try {
      const stats = await this.#stats();
      if (stats.isFile()) return "file";
      if (stats.isDirectory()) return "directory";
      if (stats.isSymbolicLink()) return "link";
      throw E.unknown_type(this.#path);
    } catch (error) {
      if ((error as any)?.code === "ENOENT") return null;
      throw error;
    }
  }

  async list(options?: ListOptions): Promise<FileRef[]> {
    const k = await this.type();
    if (k !== "directory") return [];

    const { recursive = false, filter } = options ?? {};
    const match: Filter | undefined =
      filter === undefined ? undefined :
        is.regexp(filter) ? info => filter.test(info.path) :
          filter;

    const names = await readdir(this.#path);
    let results: FileRef[] = [];

    for (const name of names) {
      const ref = this.join(name);
      const type = await ref.type();

      if (type === null) continue;

      if (recursive && type === "directory") {
        results = results.concat(await ref.list(options));
      }

      const info: FileInfo = {
        path: ref.path,
        name,
        extension: ref.extension,
        fullExtension: ref.fullExtension,
        type: type,
      };
      if (!match || await match(info)) results.push(ref);
    }

    return results;
  }

  files(options?: ListOptions) {
    const user = options?.filter;
    return this.list({
      ...options,
      filter: e => e.type === "file" &&
        (user === undefined ? true :
          is.regexp(user) ? user.test(e.path) : user(e)),
    });
  }

  dirs(options?: ListOptions) {
    const user = options?.filter;
    return this.list({
      ...options,
      filter: e => e.type === "directory" &&
        (user === undefined ? true :
          is.regexp(user) ? user.test(e.path) : user(e)),
    });
  }

  async modified() {
    return Math.round((await this.#stats()).mtimeMs);
  }

  async exists() {
    try {
      await this.#stats();
      return true;
    } catch (error: any) {
      if (error?.code === "ENOENT") return false;
      throw error;
    }
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
    const n = this.name;
    const i = n.indexOf(".");
    return i === -1 ? "" : n.slice(i);
  }

  up(levels: number): FileRef {
    if (levels === 0) {
      return this;
    }
    const { directory } = this;
    assert_boundary(directory);
    return directory.up(levels - 1);
  }

  sibling(name: string) {
    return this.directory.join(name);
  }

  async or<T>(fallback: () => T) {
    return await this.exists() ? this : fallback();
  }

  arrayBuffer() {
    return native.arrayBuffer(this.path);
  }

  async bytes(): Promise<Uint8Array> {
    return new Uint8Array(await this.arrayBuffer());
  }

  text() {
    return native.text(this.path);
  }

  json<T extends JSONValue>() {
    return native.json(this.path) as Promise<T>;
  }

  size() {
    return native.size(this.path);
  }

  async copy(to: FileRef, filter?: Filter): Promise<void> {
    await to.directory.create();
    assert.maybe.function(filter);

    const path = this.#path;
    const type = await this.type();

    if (type === null) throw E.missing_path_for_copy(this);

    if (type === "link") {
      await new FileRef(await realpath(path)).copy(to, filter);
      return;
    }

    if (type === "directory") {
      // recreate directory if necessary
      await to.remove();
      await to.create();

      // recursively copy children
      const children = await this.list();

      await Promise.all(children.map(async child => {
        const child_type = await child.type();
        if (child_type === null) return;

        // always recurse into directories
        if (child_type === "directory") {
          await child.copy(to.join(child.name), filter);
          return;
        }

        // apply filter to non-directories (files/links)
        if (filter !== undefined) {
          const info: FileInfo = {
            path: child.path,
            name: child.name,
            extension: child.extension,
            fullExtension: child.fullExtension,
            type: child_type,
          };
          if (!await filter(info)) return;
        }

        // Copy the entry (child.copy handles link resolution etc)
        await child.copy(to.join(child.name), filter);
      }));

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
    await this.directory.create();

    const to_write = typeof input === "string" && !input.endsWith("\n")
      ? input + "\n"
      : input;

    await native.write(this.path, to_write);
  }

  writeJSON(input: JSONValue) {
    return this.write(JSON.stringify(input, null, 2));
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

  stream(): ReadableStream<Uint8Array> {
    return native.stream(this.path);
  }

  async hash(algorithm = "SHA-256"): Promise<string> {
    return await hash(await this.arrayBuffer(), algorithm as any);
  }
}
