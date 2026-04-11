import E from "#errors";
import type { FileInfo, Filter, ListOptions } from "#FileRef";
import FileRef from "#FileRef";
import type FileType from "#FileType";
import parse from "#parse";
import type Path from "#Path";
import type Streamable from "#Streamable";
import StreamSource from "#StreamSource";
import type WritableInput from "#WritableInput";
import assert from "@rcompat/assert";
import is from "@rcompat/is";
import type { JSONValue } from "@rcompat/type";
import { resolve } from "node:path";

function fs_resolve(path?: string) {
  assert.maybe.string(path);

  return new FileRef(path === undefined ? resolve() : resolve(parse(path)));
}

function ref(path: Path) {
  return new FileRef(path);
}

const fs = Object.freeze({
  ref,
  isRef: FileRef.is,
  isStream: StreamSource.is,
  isNamedStream: StreamSource.named,
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
    if (StreamSource.is(target)) return StreamSource.stream(target);
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
  FileRef, FileType, Filter, ListOptions,
  Path,
  Streamable
};
