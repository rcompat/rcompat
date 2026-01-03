import FileRef, { type ListOptions } from "#FileRef";
import parse from "#parse";
import type Path from "#Path";
import type WritableInput from "#WritableInput";
import assert from "@rcompat/assert";
import type { JSONValue } from "@rcompat/type";
import { resolve } from "node:path";

function fs_resolve(path?: string) {
  assert.maybe.string(path);

  return new FileRef(path === undefined ? resolve() : resolve(parse(path)));

}

function project_root(relative_to?: string) {
  assert.maybe.string(relative_to);

  return fs_resolve(relative_to).discover("package.json");
}

const fs = {
  FileRef,
  ref: (path: Path) => new FileRef(path),
  cwd: () => fs_resolve(),
  resolve: fs_resolve,
  list: (path: Path, opts?: ListOptions) => new FileRef(path).list(opts),
  files: (path: Path, opts?: ListOptions) => new FileRef(path).files(opts),
  exists: (path: Path) => new FileRef(path).exists(),
  arrayBuffer: (path: Path) => new FileRef(path).arrayBuffer(),
  bytes: (path: Path) => new FileRef(path).bytes(),
  text: (path: Path) => new FileRef(path).text(),
  json: (path: Path) => new FileRef(path).json(),
  stream: (path: Path) => new FileRef(path).stream(),
  write: (path: Path, val: WritableInput) => new FileRef(path).write(val),
  writeJSON: (path: Path, val: JSONValue) => new FileRef(path).writeJSON(val),
  size: (path: Path) => new FileRef(path).size(),
  webpath: (path: Path) => new FileRef(path).webpath(),
  join: (path: Path, ...paths: Path[]) => new FileRef(path).join(...paths),
  discover: (path: Path, filename: string) => new FileRef(path).discover(filename),
  kind: (path: Path) => new FileRef(path).kind(),
  project: {
    root: project_root,
    package: async (from?: string) => {
      assert.maybe.string(from);

      return (await project_root(from)).join("package.json");
    },
  },
} as const;

export default fs;
