import fs from "node:fs";
import { mkdir, rm, readFile, writeFile, copyFile, realpath }
  from "node:fs/promises";
import { Readable, Writable } from "node:stream";
import { is, maybe } from "rcompat/invariant";
import { EagerEither } from "rcompat/function";
import Path from "./Path.js";
import Blob from "./Blob.js";

export default class File extends Blob {
  #path;

  constructor(...args) {
    super();
    // guarded by new Path
    this.#path = new Path(...args);
  }

  get path() {
    return this.#path.path;
  }

  get modified() {
    return this.#path.modified;
  }

  get exists() {
    return this.#path.exists;
  }

  get directory() {
    return this.#path.directory;
  }

  get name() {
    return this.#path.name;
  }

  get base() {
    return this.#path.base;
  }

  get extension() {
    return this.#path.extension;
  }

  get isFile() {
    return this.#path.isFile;
  }

  get isDirectory() {
    return this.#path.isDirectory;
  }

  get isSymlink() {
    return this.#path.isSymlink;
  }

  static exists(path) {
    return new File(path).exists;
  }

  get readable() {
    return Readable.toWeb(fs.createReadStream(this.path, { flags: "r" }));
  }

  static readable(path) {
    return new File(path).readable;
  }

  get writable() {
    return Writable.toWeb(fs.createWriteStream(this.path));
  }

  static writable(path) {
    return new File(path).writable;
  }

  async remove(options) {
    maybe(options).object();

    await rm(this.path, {
      ...options,
      recursive: options?.recursive ?? true,
    });
    return this;
  }

  static remove(path, options) {
    return new File(path).remove(options);
  }

  async recreate() {
    if (!await this.exists) {
      // create directory
      await this.create();
    }
    return this;
  }

  static recreate(path) {
    return new File(path).recreate();
  }

  async create(options) {
    maybe(options).object();

    await mkdir(this.path, {
      ...options,
      recursive: options?.recursive ?? true,
    });
    return this;
  }

  static create(path, options) {
    return new File(path).create(options);
  }

  async #collect(pattern, options) {
    return EagerEither
      .try(() => this.#path.list(() => true))
      .match({ left: () => [] })
      .map(async list => {
        let files = [];
        for (const path of list) {
          if (path.name.startsWith(".")) {
            continue;
          }
          const { file } = path;
          if (options?.recursive && await file.isDirectory) {
            files = files.concat(await file.#collect(pattern, options));
          } else if (pattern === undefined ||
              path.is(new RegExp(pattern, "u"))) {
            files.push(file);
          }
        }
        return files;
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
    return new File(path).collect(pattern, options);
  }

  async copy(toPath, filter = () => true) {
    is(toPath).anyOf(["string", Path, File]);
    is(filter).function();

    if (await this.isSymlink) {
      return new Path(await realpath(this.path)).file.copy(toPath, filter);
    }

    const to = new Path(toPath);
    if (await this.isDirectory) {
      // recreate directory if necessary
      await File.recreate(toPath);
      // copy all files
      return Promise.all((await this.#path.list(filter))
        .map(({ name }) => new File(this, name).copy(to.join(name))));
    }

    return copyFile(this.path, to.path);
  }

  static copy(from, to, filter) {
    return new File(from).copy(to, filter);
  }

  read(options) {
    maybe(options).object();

    return readFile(this.path, {
      ...options,
      encoding: options?.encoding ?? "utf8",
    });
  }

  static read(path, options) {
    return new File(path).read(options);
  }

  write(data, options) {
    maybe(options).object();

    return writeFile(this.path, data);
  }

  static write(path, data, options) {
    return new File(path).write(data, options);
  }

  text() {
    return this.read();
  }

  json() {
    return this.read().then(contents => JSON.parse(contents));
  }

  static json(path) {
    return new File(path).json();
  }
}
