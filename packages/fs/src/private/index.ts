import E from "#errors";
import type { FileInfo, Filter, ListOptions } from "#FileRef";
import FileRef from "#FileRef";
import type Kind from "#Kind";
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

const fs = Object.freeze({
  ref: (path: Path) => new FileRef(path),
  isRef: FileRef.is,
  isStream: StreamSource.is,
  isNamedStream: StreamSource.named,
  cwd: () => fs_resolve(),
  resolve: fs_resolve,
  list: (path: Path, opts?: ListOptions) => new FileRef(path).list(opts),
  files: (path: Path, opts?: ListOptions) => new FileRef(path).files(opts),
  dirs: (path: Path, opts?: ListOptions) => new FileRef(path).dirs(opts),
  exists: (path: Path) => new FileRef(path).exists(),
  arrayBuffer: (path: Path) => new FileRef(path).arrayBuffer(),
  bytes: (path: Path) => new FileRef(path).bytes(),
  text: (path: Path) => new FileRef(path).text(),
  json: (path: Path) => new FileRef(path).json(),
  stream: (target: string | Streamable) => {
    if (is.string(target)) return new FileRef(target).stream();
    if (StreamSource.is(target)) return StreamSource.stream(target);
    throw E.target_not_streamable(target);
  },
  write: (path: Path, val: WritableInput) => new FileRef(path).write(val),
  writeJSON: (path: Path, val: JSONValue) => new FileRef(path).writeJSON(val),
  size: (path: Path) => new FileRef(path).size(),
  webpath: (path: Path) => new FileRef(path).webpath(),
  join: (path: Path, ...paths: Path[]) => new FileRef(path).join(...paths),
  discover: (path: Path, filename: string) => new FileRef(path).discover(filename),
  kind: (path: Path) => new FileRef(path).kind(),
});

export default fs;

export type {
  FileInfo,
  FileRef,
  Filter,
  Kind,
  ListOptions,
  Path,
  Streamable
};
