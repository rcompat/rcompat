import E from "#errors";
import type { FileInfo, Filter, ListOptions } from "#FileRef";
import FileRef from "#FileRef";
import type FileType from "#FileType";
import parse from "#parse";
import type Path from "#Path";
import type Streamable from "#Streamable";
import type WritableInput from "#WritableInput";
import assert from "@rcompat/assert";
import dict from "@rcompat/dict";
import is from "@rcompat/is";
import symbol from "@rcompat/symbol";
import type { JSONValue } from "@rcompat/type";
import { resolve } from "node:path";

const is_streamable = (x: unknown) =>
  is.blob(x) || is.stream(x) || is.branded(x, symbol.stream);

function fs_resolve(path?: string) {
  assert.maybe.string(path);

  return new FileRef(path === undefined ? resolve() : resolve(parse(path)));
}

function ref(path: Path) {
  return new FileRef(path);
}

function isStream(x: unknown): boolean {
  return is_streamable(x);
}

const fs = dict.new({
  ref,
  isRef: FileRef.is,
  isStream,
  isNamedStream: (x: unknown) => is_streamable(x) && is.string((x as any).name),
  cwd: () => fs_resolve(),
  resolve: fs_resolve,
  list: (path: Path, opts?: ListOptions) => ref(path).list(opts),
  files: (path: Path, opts?: ListOptions) => ref(path).files(opts),
  dirs: (path: Path, opts?: ListOptions) => ref(path).dirs(opts),
  exists: (path: Path) => ref(path).exists(),
  arrayBuffer: (path: Path) => ref(path).arrayBuffer(),
  bytes: (path: Path) => ref(path).bytes(),
  text: (path: Path) => ref(path).text(),
  json: (path: Path) => ref(path).json(),
  stream: (target: string | Streamable) => {
    if (is.string(target)) return ref(target).stream();
    if (is.blob(target)) return target.stream();
    if (is.stream(target)) return target;
    if (is.branded(target, symbol.stream)) return target[symbol.stream]();
    throw E.target_not_streamable(target);
  },
  write: (path: Path, val: WritableInput) => ref(path).write(val),
  writeJSON: (path: Path, val: JSONValue) => ref(path).writeJSON(val),
  size: (path: Path) => ref(path).size(),
  webpath: (path: Path) => ref(path).webpath(),
  join: (path: Path, ...paths: Path[]) => ref(path).join(...paths),
  discover: (path: Path, filename: string) => ref(path).discover(filename),
  type: (path: Path) => ref(path).type(),
});

export default fs;

export type {
  FileInfo,
  FileRef,
  FileType,
  Filter,
  ListOptions,
  Path,
  Streamable
};
