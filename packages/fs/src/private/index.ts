import E from "#errors";
import type { FileInfo, Filter, ListOptions } from "#FileRef";
import FileRef from "#FileRef";
import type FileType from "#FileType";
import type Path from "#Path";
import type Streamable from "#Streamable";
import type WritableInput from "#WritableInput";
import dict from "@rcompat/dict";
import is from "@rcompat/is";
import symbol from "@rcompat/symbol";
import type { JSONValue } from "@rcompat/type";
import { resolve } from "node:path";

type NamedStreamable<T = unknown> = Streamable<T> & { name: string };

function is_streamable(x: unknown) {
  return is.blob(x) || is.stream(x) || is.branded(x, symbol.stream);
}

function fs_resolve(path?: Path) {
  return new FileRef(path === undefined ? resolve() : resolve(ref(path).path));
}

function ref(path: Path) {
  return new FileRef(path);
}

function isStream(x: unknown): x is Streamable {
  return is_streamable(x);
}

function isNamedStream(x: unknown): x is NamedStreamable {
  return is_streamable(x) && is.string((x as any).name);
}

const fs = dict.new({
  ref,
  isRef: FileRef.is,
  isStream,
  isNamedStream,
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
  stream: (target: Path | Streamable) => {
    if (is.string(target) || target instanceof URL || FileRef.is(target)) {
      return ref(target).stream();
    }
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
  NamedStreamable,
  Path,
  Streamable
};
